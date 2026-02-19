import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Spotify credentials missing in .env" }, { status: 500 });
  }

  const scope = "user-read-currently-playing user-read-playback-state";
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("scope", scope);
  authUrl.searchParams.append("redirect_uri", redirectUri);

  return NextResponse.redirect(authUrl.toString());
}
