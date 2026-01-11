import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = 'user-read-currently-playing user-read-playback-state user-read-recently-played';

export async function GET() {
  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json(
      { error: 'Missing Spotify configuration' },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
