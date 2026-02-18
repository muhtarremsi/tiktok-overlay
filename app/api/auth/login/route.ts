import { NextResponse } from "next/server";

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;

  // Debug-Hilfe: Wir geben jetzt spezifischer aus, was fehlt
  if (!clientKey) {
    return NextResponse.json({ error: "TIKTOK_CLIENT_KEY fehlt" }, { status: 500 });
  }
  if (!redirectUri) {
    return NextResponse.json({ error: "NEXT_PUBLIC_TIKTOK_REDIRECT_URI fehlt" }, { status: 500 });
  }

  const state = Math.random().toString(36).substring(7);
  const tiktokAuthUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  
  tiktokAuthUrl.searchParams.append("client_key", clientKey);
  tiktokAuthUrl.searchParams.append("scope", "user.info.basic,user.info.profile,user.info.stats");
  tiktokAuthUrl.searchParams.append("response_type", "code");
  tiktokAuthUrl.searchParams.append("redirect_uri", redirectUri);
  tiktokAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(tiktokAuthUrl.toString());
}
