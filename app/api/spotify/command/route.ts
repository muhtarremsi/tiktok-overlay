import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const action = body.action;
  const query = body.query;
  
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("spotify_refresh_token")?.value;

  if (!refreshToken) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const basicAuth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: "Basic " + basicAuth },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    });
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (action === "skip") {
      await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: { Authorization: "Bearer " + accessToken }
      });
      return NextResponse.json({ success: true, message: "Skipped" });
    }

    if (action === "play" && query) {
      const searchUrl = "https://api.spotify.com/v1/search?q=" + encodeURIComponent(query) + "&type=track&limit=1";
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: "Bearer " + accessToken }
      });
      const searchData = await searchRes.json();
      const trackUri = searchData.tracks?.items[0]?.uri;
      
      if (trackUri) {
        const queueUrl = "https://api.spotify.com/v1/me/player/queue?uri=" + encodeURIComponent(trackUri);
        await fetch(queueUrl, {
          method: "POST",
          headers: { Authorization: "Bearer " + accessToken }
        });
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: "Track not found" }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Invalid command" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
