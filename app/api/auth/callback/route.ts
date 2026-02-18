import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=no_code", request.url));
  }

  try {
    // Hier wird der Login-Status via Cookie gespeichert
    const cookieStore = await cookies();
    cookieStore.set("tiktok_connected", "true", { 
      path: "/", 
      maxAge: 60 * 60 * 24 * 30 // 30 Tage gültig
    });

    return NextResponse.redirect(new URL("/dashboard?connected=true", request.url));
  } catch (err) {
    return NextResponse.redirect(new URL("/dashboard?error=server_error", request.url));
  }
}
