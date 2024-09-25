'use server';

export interface Playlist {
	items: PlaylistItems[];
}

export interface PlaylistItems {
	track: {
		name: string;
		artists: {
			name: string;
		}[];
	};
}

export async function submitSpotifyPlaylist(formData: FormData): Promise<Playlist | void> {
	const url = formData.get('url');

	if (!url) return;
	else if (typeof url !== 'string') return;

	const id = cleanUrl(url);
	if (!id) return;

	const playlist = await getPlaylist(id);
	if (!playlist) return;

	return playlist;
}

function cleanUrl(url: string): string {
	const regex = /https:\/\/open.spotify.com\/playlist\/([a-zA-Z0-9]+)/;
	const match = url.match(regex);
	return match ? match[1] : '';
}

async function getPlaylist(id: string): Promise<Playlist | void> {
	const token = await getToken();
	if (!token) {
		console.error('Failed to retrieve token');
		return;
	}

	let allTracks: PlaylistItems[] = [];
	let offset = 0;
	const limit = 100; // Spotify API limits to 100 items per request
	let total = 0;

	do {
		const url = `https://api.spotify.com/v1/playlists/${id}/tracks?offset=${offset}&limit=${limit}&fields=total,items(track(name,artists(name)))`;

		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		try {
			const response = await fetch(url, options);
			const data = await response.json();
			if (!total) total = data.total;

			allTracks = [...allTracks, ...data.items];
			offset += limit;
		} catch (err) {
			console.error('Error fetching playlist', err);
			return;
		}
	} while (offset < total);

	return { items: allTracks };
}

async function getToken(): Promise<string | undefined> {
	const url = 'https://accounts.spotify.com/api/token';
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

	if (!clientId || !clientSecret) throw new Error('Spotify client ID or secret is not defined');

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret,
		}),
	};

	try {
		const response = await fetch(url, options);
		const data = await response.json();

		return data.access_token;
	} catch (err) {
		console.error('Error fetching token', err);
		return undefined;
	}
}
