'use client';
import { useEffect, useState } from 'react';
import { Playlist, PlaylistItems } from '../server/actions/actions';

interface InputProps {
	handleSubmit: (formData: FormData) => Promise<Playlist | void>;
}

export default function Input({ handleSubmit }: InputProps): React.ReactElement {
	const [url, setUrl] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [error, setError] = useState('');
	const [playlistData, setPlaylistData] = useState<string[] | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		function validateForm() {
			if (url === '') {
				setIsValid(false);
				setError('');
			} else if (!url.includes('https://open.spotify.com/playlist/')) {
				setIsValid(false);
				setError('Please enter a valid Spotify playlist link');
			} else {
				setIsValid(true);
				setError('');
			}
		}
		validateForm();
	}, [url]);

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setPlaylistData(null);

		const formData = new FormData();
		formData.append('url', url);

		try {
			const response = await handleSubmit(formData);
			if (!response) return;
			const formattedPlaylist = response.items.map((item: PlaylistItems) => {
				const trackName = item.track.name;
				const artists = item.track.artists.map((artist) => artist.name).join(', ');
				return `${trackName} - ${artists}`;
			});
			setPlaylistData(formattedPlaylist);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<div className='text-red-600 min-h-6'>{error}</div>
			<form className='m-4 flex' onSubmit={handleFormSubmit} id='playlist'>
				<input
					className='rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white'
					placeholder='Enter Spotify playlist link'
					type='text'
					name='url'
					value={url}
					onChange={(e) => setUrl(e.target.value)}
				/>
				<button
					className='px-8 rounded-r-lg bg-green-600  text-gray-800 font-bold p-4 uppercase border-green-500 border-t border-b border-r disabled:bg-gray-600 disabled:text-gray-400 disabled:border-gray-500'
					type='submit'
					disabled={!isValid || loading}
				>
					{loading ? 'Loading...' : 'Convert to Text'}
				</button>
			</form>

			{playlistData && (
				<textarea
					className='w-full h-64 p-4 mt-4 border rounded bg-gray-100 text-gray-800'
					readOnly
					value={playlistData.join('\n')}
				/>
			)}
		</div>
	);
}
