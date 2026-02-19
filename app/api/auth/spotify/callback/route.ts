import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  
  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=spotify_auth_failed", req.url));
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

  const basicAuth = Buffer.from(clientId + ":" + clientSecret).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + basicAuth,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error);

    const res = NextResponse.redirect(new URL("/dashboard?connected=spotify", req.url));
    
    // WICHTIG: httpOnly ist jetzt false, damit das Dashboard den Link für OBS generieren kann!
    res.cookies.set("spotify_refresh_token", data.refresh_token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, 
    });
    
    res.cookies.set("spotify_connected", "true", {
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error) {
    console.error("Spotify Auth Error:", error);
    return NextResponse.redirect(new URL("/dashboard?error=spotify_auth_failed", req.url));
  }
}
