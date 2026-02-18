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

      // WICHTIG: Wir hören NUR auf 'chat'
      tiktok.on('chat', (data) => {
        send({ 
          event: 'chat', 
          comment: data.comment, 
          nickname: data.nickname 
        });
      });

      // ALLES ANDERE IST AUSKOMMENTIERT / GELÖSCHT
      // tiktok.on('like', ...) -> WEG DAMIT!
      // tiktok.on('gift', ...) -> WEG DAMIT!

      tiktok.on('disconnected', () => {
         // Optional: Reconnect Logik oder Client schließen lassen
      });

      try {
        await tiktok.connect();
      } catch (err: any) {
        console.error("Stream Connection Error:", err);
        send({ event: 'error', message: 'Stream offline or not found' });
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
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
