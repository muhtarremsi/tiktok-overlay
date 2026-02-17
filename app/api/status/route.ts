import { TikTokLiveConnection } from 'tiktok-live-connector';
import { NextResponse } from 'next/server';
import { normalizeTiktokUsername } from '@/lib/username';

export const dynamic = 'force-dynamic';

function tryConnect(
  username: string,
  options: { fetchRoomInfoOnConnect: boolean; connectWithUniqueId: boolean; signApiKey?: string | null }
): Promise<{ ok: true; roomInfo: any } | { ok: false; error: string }> {
  return new Promise((resolve) => {
    const conn = new TikTokLiveConnection(username, {
      fetchRoomInfoOnConnect: options.fetchRoomInfoOnConnect,
      connectWithUniqueId: options.connectWithUniqueId,
      ...(options.signApiKey ? { signApiKey: options.signApiKey } : {}),
    });
    conn
      .connect()
      .then((state) => {
        const roomInfo = state?.roomInfo;
        conn.disconnect();
        resolve({ ok: true, roomInfo });
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        resolve({ ok: false, error: msg });
      });
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('u');
  const username = normalizeTiktokUsername(raw);

  if (!username) {
    return NextResponse.json({ online: false, error: 'Username is required' });
  }

  const signApiKey = process.env.TIKTOK_SIGN_API_KEY || null;

  // 1. Versuch: connectWithUniqueId (Room-ID über API – oft zuverlässiger)
  let result = await tryConnect(username, {
    fetchRoomInfoOnConnect: true,
    connectWithUniqueId: true,
    signApiKey,
  });

  // 2. Versuch: ohne connectWithUniqueId (Scraping), falls der erste fehlschlägt
  if (!result.ok) {
    result = await tryConnect(username, {
      fetchRoomInfoOnConnect: true,
      connectWithUniqueId: false,
      signApiKey,
    });
  }

  if (result.ok) {
    const roomInfo = result.roomInfo;
    return NextResponse.json({
      online: true,
      viewers: roomInfo?.viewerCount ?? 0,
      likes: roomInfo?.likeCount ?? 0,
      title: roomInfo?.title ?? '',
    });
  }

  return NextResponse.json({
    online: false,
    error: result.error || 'Verbindung fehlgeschlagen',
  });
}
