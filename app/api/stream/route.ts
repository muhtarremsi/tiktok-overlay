import { WebcastPushConnection } from 'tiktok-live-connector';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) {
    return new Response('Username required', { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const tiktok = new WebcastPushConnection(username);
      
      const send = (data: any) => {
        try {
          const msg = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(msg));
        } catch (e) {
          tiktok.disconnect();
        }
      };

      // WICHTIG: Sicherheits-Reset
      tiktok.removeAllListeners();

      // NUR Chat erlauben. Keine Likes, keine Follows, keine Gifts.
      tiktok.on('chat', (data) => {
        send({ 
          event: 'chat', 
          comment: data.comment,
          // Wir senden bewusst keine anderen Daten mit, um Verwirrung zu vermeiden
        });
      });

      // Fehlerbehandlung
      tiktok.on('error', () => {}); // Fehler stillschweigend ignorieren
      tiktok.on('disconnected', () => {}); 

      try {
        await tiktok.connect();
      } catch (err) {
        send({ event: 'error', message: 'Offline' });
        controller.close();
      }

      request.signal.addEventListener('abort', () => {
        tiktok.disconnect();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
