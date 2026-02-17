import { WebcastPushConnection } from 'tiktok-live-connector';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) {
    return NextResponse.json({ online: false, error: 'Username is required' });
  }

  try {
    const tiktok = new WebcastPushConnection(username);
    const state = await tiktok.connect();
    
    // Wir holen uns die Raum-Details für den Fan-Club
    const roomInfo = state.roomInfo;
    tiktok.disconnect();

    return NextResponse.json({ 
      online: true, 
      viewers: roomInfo?.viewerCount || 0,
      likes: roomInfo?.likeCount || 0,
      title: roomInfo?.title || "",
    });
  } catch (err: unknown) {
    // TypeScript-Fehler beheben: 'err' als Error behandeln
    if (err instanceof Error) {
      console.error('Error connecting to TikTok:', err);
      return NextResponse.json({ 
        online: false, 
        error: err.message || 'An error occurred while fetching the status'
      });
    } else {
      console.error('Unknown error:', err);
      return NextResponse.json({ 
        online: false, 
        error: 'An unknown error occurred'
      });
    }
  }
}
