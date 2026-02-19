import { WebcastPushConnection } from 'tiktok-live-connector';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get('u');

  if (!username) {
    return new Response('Username is required', { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const sendEvent = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {}
      };

      const tiktokLiveConnection = new WebcastPushConnection(username, {
        processInitialData: false,
        enableExtendedGiftInfo: true,
        enableWebsocketUpgrade: true,
      });

      tiktokLiveConnection.connect().then(state => {
        sendEvent({ type: 'connected', roomId: state.roomId });
      }).catch(err => {
        sendEvent({ type: 'error', message: 'Stream offline oder nicht gefunden.' });
        try { controller.close(); } catch(e) {}
      });

      tiktokLiveConnection.on('chat', data => {
        sendEvent({ 
            type: 'chat', 
            nickname: data.nickname || data.uniqueId, 
            uniqueId: data.uniqueId,
            comment: data.comment,
            profilePictureUrl: data.profilePictureUrl
        });
      });

      tiktokLiveConnection.on('member', data => {
        sendEvent({ 
            type: 'member', 
            nickname: data.nickname || data.uniqueId,
            profilePictureUrl: data.profilePictureUrl
        });
      });

      // Keep-Alive Ping, damit Vercel die Verbindung nicht kappt
      const pingInterval = setInterval(() => {
        sendEvent({ type: 'ping' });
      }, 5000);

      req.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        tiktokLiveConnection.disconnect();
        try { controller.close(); } catch(e) {}
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // <-- DAS FIXXT DAS VERCEL PROBLEM!
    },
  });
}
