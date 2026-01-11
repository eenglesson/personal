import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=1';

interface SpotifyArtist {
  name: string;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyTrack {
  name: string;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: {
    name: string;
    images: SpotifyImage[];
  };
  external_urls: {
    spotify: string;
  };
}

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return null;
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  return data.access_token;
}

async function getRecentlyPlayed(accessToken: string) {
  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const item = data.items?.[0]?.track;
  if (!item) return null;

  return {
    isPlaying: false,
    title: item.name,
    artist: item.artists.map((a: SpotifyArtist) => a.name).join(', '),
    album: item.album.name,
    albumImageUrl: item.album.images[0]?.url,
    songUrl: item.external_urls.spotify,
  };
}

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  // Nothing playing - get last played track
  if (response.status === 204) {
    const lastPlayed = await getRecentlyPlayed(accessToken);
    return NextResponse.json(lastPlayed || { isPlaying: false });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch now playing' },
      { status: response.status }
    );
  }

  const data = await response.json();

  // Handle non-track content (podcasts, ads) - show last played instead
  if (data.currently_playing_type !== 'track' || !data.item) {
    const lastPlayed = await getRecentlyPlayed(accessToken);
    return NextResponse.json(lastPlayed || { isPlaying: false });
  }

  const track: SpotifyTrack = data.item;

  return NextResponse.json({
    isPlaying: data.is_playing,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
    albumImageUrl: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
    progressMs: data.progress_ms,
    durationMs: track.duration_ms,
  });
}
