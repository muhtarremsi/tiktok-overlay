import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rtParam = url.searchParams.get("rt");

  const cookieStore = await cookies();
  const refreshToken = rtParam || cookieStore.get("spotify_refresh_token")?.value;

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
      cache: "no-store",
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) throw new Error("Failed to refresh token");

    // NUTZE DEN ALLGEMEINEN PLAYER ENDPUNKT (Besser für Mobile)
    const npResponse = await fetch("https://api.spotify.com/v1/me/player?additional_types=track", {
      headers: { 
          Authorization: "Bearer " + tokenData.access_token,
          "Cache-Control": "no-cache, no-store, must-revalidate"
      },
      cache: "no-store",
    });

    if (npResponse.status === 204 || npResponse.status > 400) {
      return NextResponse.json({ isPlaying: false }, { headers: { 'Cache-Control': 'no-store, max-age=0' }});
    }

    const npData = await npResponse.json();
    if (!npData?.item) return NextResponse.json({ isPlaying: false }, { headers: { 'Cache-Control': 'no-store, max-age=0' }});

    return NextResponse.json({
      isPlaying: npData.is_playing,
      title: npData.item.name,
      artist: npData.item.artists.map((a: any) => a.name).join(", "),
      albumImageUrl: npData.item.album.images[0]?.url,
      progressMs: npData.progress_ms,
      durationMs: npData.item.duration_ms,
    }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
    });

  } catch (error) {
    console.error("Spotify Now Playing Error:", error);
    return NextResponse.json({ isPlaying: false, error: "API Error" }, { status: 500 });
  }
}
