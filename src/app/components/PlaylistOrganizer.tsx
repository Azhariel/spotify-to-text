import { useState } from 'react';
import { getAudioFeatures, Playlist, Track } from '../server/actions/actions';

interface PlaylistOrganizerProps {
	handleSubmit: (formData: FormData) => Promise<Playlist | void>;
}

interface FullTrack extends Track {
	name: string;
	artists: string;
	'danceability * tempo': number;
}

type NumericFields = {
	[K in keyof Track]: Track[K] extends number ? K : never;
}[keyof Track];

export default function PlaylistOrganizer({ handleSubmit }: PlaylistOrganizerProps): React.ReactElement {
	const [playlistUrl, setPlaylistUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [tracks, setTracks] = useState<FullTrack[]>([]);
	const [sortField, setSortField] = useState<keyof FullTrack>('name');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [error, setError] = useState('');

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData();
		formData.append('url', playlistUrl);

		try {
			const response = await handleSubmit(formData);
			if (!response) return;
			getTrackFeatures(response);
		} catch (error) {
			setError('Failed to fetch playlist:' + error);
		} finally {
			setLoading(false);
		}
	};

	async function getTrackFeatures(playlist: Playlist) {
		const features = await getAudioFeatures(playlist);
		if (!features) return;
		const tracks = features.audio_features.map((item, index) => {
			const playlistItem = playlist.items[index];
			return {
				name: playlistItem.track.name,
				artists: playlistItem.track.artists.map((artist) => artist.name).join(', '),
				'danceability * tempo': item.danceability * item.tempo,
				...item,
			};
		});
		setTracks(tracks);
	}

	function sortTracks(field: keyof Track) {
		const sortedTracks = [...tracks].sort((a, b) => {
			const direction = sortDirection === 'asc' ? 1 : -1;
			if (typeof a[field] === 'string' && typeof b[field] === 'string') {
				if (a[field].toLowerCase() < b[field].toLowerCase()) return -1 * direction;
				if (a[field].toLowerCase() > b[field].toLowerCase()) return 1 * direction;
				return 0;
			}
			if (a[field] < b[field]) return -1 * direction;
			if (a[field] > b[field]) return 1 * direction;
			return 0;
		});
		setTracks(sortedTracks);
		setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		setSortField(field);
	}

	function calculateBackgroundColor(value: number, min: number, max: number): string {
		const percent = (value - min) / (max - min);
		if (percent < 0.2) return 'bg-red-900'; // Cor para valores baixos
		if (percent < 0.4) return 'bg-orange-800'; // Cor para valores intermediários baixos
		if (percent < 0.6) return 'bg-yellow-600'; // Cor para valores intermediários
		if (percent < 0.8) return 'bg-green-700'; // Cor para valores intermediários altos
		return 'bg-green-500'; // Cor para valores altos
	}

	function getColumnMinMax(field: NumericFields) {
		const values = tracks.map((track) => track[field]);
		const min = Math.min(...values);
		const max = Math.max(...values);
		return { min, max };
	}

	return (
		<div>
			<form onSubmit={handleFormSubmit} className='flex mb-4'>
				<input
					className='border p-2 flex-1 text-gray-800'
					type='text'
					placeholder='Enter Spotify playlist link'
					value={playlistUrl}
					onChange={(e) => setPlaylistUrl(e.target.value)}
				/>
				<button className='bg-green-500 text-gray-800 p-2' type='submit' disabled={loading}>
					Fetch Playlist
				</button>

				{error && <div className='text-red-500'>{error}</div>}
			</form>
			<table className='min-w-full bg-gray-900 '>
				<thead className='bg-gray-800'>
					<tr>
						{[
							'name',
							'artists',
							'acousticness',
							'danceability * tempo',
							'danceability',
							'energy',
							'instrumentalness',
							'liveness',
							'loudness',
							'speechiness',
							'tempo',
							'valence',
						].map((field) => (
							<th key={field} className='p-4 cursor-pointer' onClick={() => sortTracks(field as keyof Track)}>
								{field.toUpperCase()}
								{sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tracks.map((track, index) => (
						<tr key={index}>
							<td className='border px-4 py-2'>{track.name}</td>
							<td className='border px-4 py-2'>{track.artists}</td>
							{[
								'acousticness',
								'danceability * tempo',
								'danceability',
								'energy',
								'instrumentalness',
								'liveness',
								'loudness',
								'speechiness',
								'tempo',
								'valence',
							].map((field) => {
								const { min, max } = getColumnMinMax(field as NumericFields);
								const colorClass = calculateBackgroundColor(track[field as NumericFields], min, max);
								return (
									<td key={field} className={`border px-4 py-2 ${colorClass}`}>
										{track[field as NumericFields]}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
