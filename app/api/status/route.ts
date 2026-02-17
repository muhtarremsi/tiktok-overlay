import { WebcastPushConnection } from 'tiktok-live-connector';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) {
    return NextResponse.json({ online: false, msg: "Kein Name" });
  }

  try {
    // Wir versuchen eine Verbindung aufzubauen
    const tiktok = new WebcastPushConnection(username);
    
    // Connect versucht die Room-Info zu holen
    const state = await tiktok.connect();

    // Wenn wir hier sind, ist er live! Wir trennen sofort wieder.
    tiktok.disconnect();

    return NextResponse.json({ 
      online: true, 
      roomId: state.roomId,
      viewers: state.roomInfo?.viewerCount || 0
    });

  } catch (err) {
    // Wenn connect() fehlschlägt, ist der User meistens offline
    return NextResponse.json({ online: false });
  }
}
