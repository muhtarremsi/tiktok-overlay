import { WebcastPushConnection } from 'tiktok-live-connector';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) return NextResponse.json({ online: false });

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
      title: roomInfo?.title || ""
    });
  } catch (err) {
    return NextResponse.json({ online: false });
  }
}
