import { TikTokLiveConnection } from 'tiktok-live-connector';
import { normalizeTiktokUsername } from '@/lib/username';

export const dynamic = 'force-dynamic'; // Wichtig für Vercel

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('u');
  const username = normalizeTiktokUsername(raw);

  if (!username) {
    return new Response('Username is required', { status: 400 });
  }

  // Wir öffnen einen Stream zum Frontend (Server-Sent Events)
  const stream = new ReadableStream({
    async start(controller) {
      const tiktok = new TikTokLiveConnection(username, {
        fetchRoomInfoOnConnect: true,
        connectWithUniqueId: true,
      });

      const send = (data: any) => {
        const msg = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(msg));
      };

      try {
        await tiktok.connect();
        send({ type: 'status', msg: 'Verbunden!' });

        tiktok.on('chat', (data) => {
          send({ type: 'chat', comment: data.comment, user: data.uniqueId });
        });

        tiktok.on('disconnected', () => {
          send({ type: 'status', msg: 'Verbindung verloren' });
          controller.close();  // Verbindung schließen, wenn die Verbindung unterbrochen wird
        });

        tiktok.on('error', (err) => {
          send({ type: 'status', msg: `Fehler: ${err.message || 'Unbekannter Fehler'}` });
        });

      } catch (err: any) {
        send({ type: 'status', msg: `Fehler: ${err.message}` });
        controller.close();
      }

      // Wenn der Browser schließt, Verbindung kappen
      request.signal.addEventListener('abort', () => {
        tiktok.disconnect();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}