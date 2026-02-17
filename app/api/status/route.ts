import { NextRequest, NextResponse } from 'next/server';
import { WebcastPushConnection } from 'tiktok-live-connector';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('u');

  if (!username) {
    return NextResponse.json({ online: false, error: "Missing username" }, { status: 400 });
  }

  // Erstelle eine Instanz des Connectors
  const tiktokLiveConnection = new WebcastPushConnection(username);

  try {
    // Versuche eine Verbindung aufzubauen
    const state = await tiktokLiveConnection.connect();
    
    // Wenn wir hier ankommen, war die Verbindung erfolgreich -> Streamer ist ONLINE
    const isOnline = state.isConnected;
    const roomId = state.roomId;

    // Sofort wieder trennen, wir wollten nur den Status wissen
    tiktokLiveConnection.disconnect();

    return NextResponse.json({ 
      online: isOnline, 
      roomId: roomId 
    });

  } catch (err) {
    // Wenn connect() fehlschlägt, ist der Streamer meistens OFFLINE
    // oder der Username existiert nicht.
    return NextResponse.json({ 
      online: false 
    });
  }
}
