'use client';
import { useState } from 'react';
import PlaylistToText from './components/PlaylistToText';
import { submitSpotifyPlaylist } from './server/actions/actions';
import PlaylistOrganizer from './components/PlaylistOrganizer';

export default function Home() {
	const [activeTool, setActiveTool] = useState<'text' | 'organize'>('text');

	return (
		<div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
			<div>
				<h1 className='text-center mb-4 text-4xl'>Spotify Toolbox</h1>
				<header className='flex justify-around p-4 bg-gray-800'>
					<button
						onClick={() => setActiveTool('text')}
						className={`px-4 py-2 ${activeTool === 'text' ? 'bg-[#3be477] text-gray-800' : ''}`}
					>
						Convert Playlist to Text
					</button>
					<button
						onClick={() => setActiveTool('organize')}
						className={`px-4 py-2 ${activeTool === 'organize' ? 'bg-[#3be477] text-gray-800' : ''}`}
					>
						Organize Playlist
					</button>
				</header>
			</div>
			<main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
				{activeTool === 'text' ? (
					<PlaylistToText handleSubmit={submitSpotifyPlaylist} />
				) : (
					<PlaylistOrganizer handleSubmit={submitSpotifyPlaylist} />
				)}
			</main>
		</div>
	);
}
