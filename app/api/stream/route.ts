import { WebcastPushConnection } from 'tiktok-live-connector';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) {
    return new Response('Username missing', { status: 400 });
  }

  // Wir öffnen einen Stream zum Browser
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const tiktok = new WebcastPushConnection(username);

      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        await tiktok.connect();
        
        // Wenn ein Chat-Kommentar reinkommt, senden wir ihn ans Overlay
        tiktok.on('chat', (data) => {
          send({ event: 'chat', comment: data.comment, user: data.uniqueId });
        });

        tiktok.on('disconnected', () => {
          controller.close();
        });

        // Keep-Alive Ping, damit Vercel die Verbindung nicht kappt
        const pingInterval = setInterval(() => {
          send({ event: 'ping' });
        }, 5000);

        // Aufräumen, wenn der Browser das Fenster schließt
        request.signal.addEventListener('abort', () => {
          clearInterval(pingInterval);
          tiktok.disconnect();
        });

      } catch (err: any) {
        send({ event: 'error', msg: err.message });
        controller.close();
      }
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
