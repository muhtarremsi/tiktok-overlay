import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Verhindert Caching auf Server-Seite

export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ isPlaying: false, message: "Not authenticated" }, { status: 401 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const basicAuth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + basicAuth,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      cache: "no-store", // Zwingt frischen Fetch
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error("Failed to refresh token");

    const npResponse = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: "Bearer " + tokenData.access_token },
      cache: "no-store", // Zwingt frischen Fetch
    });

    if (npResponse.status === 204 || npResponse.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const npData = await npResponse.json();
    if (!npData?.item) return NextResponse.json({ isPlaying: false });

    return NextResponse.json({
      isPlaying: npData.is_playing,
      title: npData.item.name,
      artist: npData.item.artists.map((a: any) => a.name).join(", "),
      albumImageUrl: npData.item.album.images[0]?.url,
      progressMs: npData.progress_ms,
      durationMs: npData.item.duration_ms,
    });

  } catch (error) {
    console.error("Spotify Now Playing Error:", error);
    return NextResponse.json({ isPlaying: false, error: "API Error" }, { status: 500 });
  }
}
