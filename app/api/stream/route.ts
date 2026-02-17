import { WebcastPushConnection } from 'tiktok-live-connector';

// Vercel Config: Wichtig, damit der Stream nicht sofort gekillt wird
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('u');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username missing' }), { status: 400 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Verbindung aufbauen
      const tiktok = new WebcastPushConnection(username, {
        processInitialData: false,
        enableExtendedGiftInfo: false,
        requestOptions: { timeout: 10000 } // Timeout erhöhen
      });

      const send = (data: any) => {
        try {
          const msg = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(msg));
        } catch (e) {
          tiktok.disconnect();
        }
      };

      try {
        await tiktok.connect();
        send({ event: 'status', msg: 'Connected to TikTok!' });

        tiktok.on('chat', (data) => {
          send({ event: 'chat', comment: data.comment, user: data.uniqueId });
        });

        tiktok.on('disconnected', () => {
          send({ event: 'status', msg: 'Stream disconnected' });
          controller.close();
        });

        tiktok.on('error', (err) => {
          console.error("TikTok Error:", err);
          // Nicht sofort schließen, vielleicht fängt es sich
        });

        // WICHTIG: Ping senden, damit Vercel die Leitung offen hält
        const pingInterval = setInterval(() => {
          send({ event: 'ping' });
        }, 3000);

        request.signal.addEventListener('abort', () => {
          clearInterval(pingInterval);
          tiktok.disconnect();
        });

      } catch (err: any) {
        send({ event: 'error', msg: err.message || 'Connection failed' });
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
