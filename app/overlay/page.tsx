"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);
  // Status für interne Logik behalten, aber nicht mehr anzeigen
  const [, setStatus] = useState("Wait..."); 
  const videoRef = useRef<HTMLVideoElement>(null);

  const username = searchParams.get('u') || '';
  const trigger = searchParams.get('c') || '777';
  const videoUrl = searchParams.get('v') || '';
  const volume = parseInt(searchParams.get('vol') || '100');
  const startTime = parseInt(searchParams.get('s') || '0');
  const endTime = parseInt(searchParams.get('e') || '10');

  useEffect(() => {
    if (!username) return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      setStatus("Connecting...");
      eventSource = new EventSource(`/api/stream?u=${username}`);

      eventSource.onopen = () => setStatus("Listening");

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'ping') return;

          if (data.event === 'chat') {
            // Trigger-Check (Groß-/Kleinschreibung egal)
            if (data.comment.trim().toLowerCase() === trigger.toLowerCase()) {
              triggerVideo();
            }
          }
        } catch (err) {
          console.error("Parse Error", err);
        }
      };

      eventSource.onerror = () => {
        setStatus("Reconnecting...");
        eventSource?.close();
        // Schneller Reconnect Versuch
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [username, trigger]);

  const triggerVideo = () => {
    if (showVideo) return;

    setShowVideo(true);

    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = Math.min(volume / 100, 1);
      
      // Versuche sofort abzuspielen. In OBS klappt das immer.
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Browser blockiert es vielleicht, aber OBS nicht.
          console.log("Autoplay blocked by browser policy (OBS is fine):", error);
        });
      }

      const duration = (endTime - startTime) * 1000;
      setTimeout(() => {
        setShowVideo(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = startTime;
        }
      }, duration);
    }
  };

  return (
    // w-full h-full sorgt dafür, dass der Container den ganzen Platz nimmt
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          // WICHTIG: 'w-full h-full object-cover' entfernt die schwarzen Ränder
          // indem es das Video über den gesamten Bereich streckt.
          className={`w-full h-full object-cover transition-opacity duration-300 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          playsInline
          // 'muted' hilft manchmal bei Autoplay-Problemen, aber wir wollen Sound.
          // Falls es in OBS Probleme gibt, entferne das Kommentarzeichen vor 'muted'.
          // muted={false} 
        />
      )}
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={null}>
      <OverlayContent />
    </Suspense>
  );
}
