# Spotify Playlist to Text Converter

This project is a **Spotify Playlist to Text Converter** built with **Next.js** and **React**. It allows users to input a Spotify playlist link and converts the playlist data (song names and artist names) into formatted text. The text can then be easily copied to the clipboard for use elsewhere.

## Features

- Validates Spotify playlist URLs.
- Fetches playlist data using Spotify's API.
- Converts playlist items into formatted text: `Song Name - Artist 1, Artist 2, ...`.
- TODO: Copy formatted text to the clipboard with a single click.
- TODO: Displays a toast notification on successful or failed clipboard copy.

## Table of Contents

- [Spotify Playlist to Text Converter](#spotify-playlist-to-text-converter)
  - [Features](#features)
  - [Table of Contents](#table-of-contents)
  - [Technologies Used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Clone the Repository](#clone-the-repository)
    - [Install Dependencies](#install-dependencies)
    - [Environment Variables](#environment-variables)
    - [Run Locally](#run-locally)
  - [How to Use](#how-to-use)

## Technologies Used

- **Next.js** for server-side rendering and routing.
- **React** for building UI components.
- **Spotify Web API** for fetching playlist data.
- **Tailwind CSS** for styling.
- **TypeScript** for type safety.

## Prerequisites

To run this project locally, ensure you have the following installed:

- **Node.js** (v22 or above)
- **npm**
- A **Spotify Developer Account** to obtain **Client ID** and **Client Secret**.

## Getting Started

### Clone the Repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/your-username/spotify-playlist-to-text.git
cd spotify-playlist-to-text
```

### Install Dependencies

Once inside the project directory, install the necessary dependencies:

```bash
npm install
```

### Environment Variables

To connect to the Spotify API, create a `.env` file in the root of your project and add your Spotify API credentials:

```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

You can obtain these credentials by creating an application in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

### Run Locally

To run the project in development mode:

```bash
npm run dev
```

Once started, the app will be available at [http://localhost:3000](http://localhost:3000).

## How to Use

1. Enter a Spotify Playlist URL: Paste the URL of a Spotify playlist into the input field. Only valid Spotify playlist links are accepted.
2. Convert to Text: Click the Convert to Text button. The application will fetch the playlist data from Spotify and format it.
3. (IN DEVELOPMENT) Copy the Playlist: After the playlist data is displayed in the textarea, click the Copy to Clipboard button to copy the formatted playlist (songs and artists) to your clipboard.
4. (IN DEVELOPMENT) Success Notification: A toast notification will appear to confirm the success or failure of the copy action.
