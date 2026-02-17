import { NextResponse } from 'next/server';
import { WebcastPushConnection } from 'tiktok-live-connector';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) {
    return NextResponse.json({ status: 'error', message: 'No username' }, { status: 400 });
  }

  try {
    // Wir erstellen eine temporäre Verbindung nur zum Testen
    const tiktok = new WebcastPushConnection(username);
    
    // Wir versuchen zu verbinden. 
    // Wenn der User offline ist oder nicht existiert, wirft das einen Fehler.
    const state = await tiktok.connect();
    
    // Wenn wir hier sind, hat es geklappt -> Sofort trennen
    tiktok.disconnect();

    return NextResponse.json({ 
      status: 'success', 
      roomId: state.roomId,
      message: 'User is live/connectable' 
    });

  } catch (err: any) {
    // Fehlerbehandlung: Offline oder existiert nicht
    console.error(`Status Check failed for ${username}:`, err.message || err);
    return NextResponse.json({ 
      status: 'failed', 
      message: 'User not found or offline' 
    }, { status: 404 });
  }
}
