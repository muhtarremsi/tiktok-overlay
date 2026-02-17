import { NextRequest, NextResponse } from 'next/server';
import { WebcastPushConnection } from 'tiktok-live-connector';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('u');

  if (!username) return NextResponse.json({ online: false }, { status: 400 });

  const tiktok = new WebcastPushConnection(username);

  try {
    const state = await tiktok.connect();
    const isOnline = state.isConnected;
    tiktok.disconnect();
    return NextResponse.json({ online: isOnline, roomId: state.roomId });
  } catch (err) {
    return NextResponse.json({ online: false });
  }
}
