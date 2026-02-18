"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [activeMedia, setActiveMedia] = useState<any>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const [triggers, setTriggers] = useState<any[]>([]);

  const username = searchParams.get('u');
  const configParam = searchParams.get('config');
  const overlayType = searchParams.get('type') || 'video';

  useEffect(() => {
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam));
        if (Array.isArray(decoded)) setTriggers(decoded);
      } catch (e) {}
    }
  }, [configParam]);

  useEffect(() => {
    if (!username) return;
    
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    const connect = () => {
      // Timestamp verhindert Caching-Probleme
      eventSource = new EventSource(`/api/stream?u=${username}&t=${Date.now()}`);
      
      eventSource.onmessage = (e) => {
        try {
          if (!e.data) return;
          const data = JSON.parse(e.data);
          
          // HARDCORE FILTER: 
          // 1. Es muss ein Chat-Event sein
          // 2. Es muss ein Kommentar dabei sein
          if (data.event !== 'chat' || !data.comment) {
            return; // Sofort abbrechen bei Follows, Likes, Shares etc.
          }

          const cleanComment = data.comment.trim().toLowerCase();
          
          // Exakter Abgleich (kein "enthält", sondern "ist gleich")
          const match = triggers.find(t => t.code.toLowerCase() === cleanComment);
          
          if (match) {
            playTrigger(match);
          }
        } catch (err) {}
      };

      eventSource.onerror = () => {
        eventSource?.close();
        retryTimeout = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, [username, triggers]);

  const playTrigger = (trigger: any) => {
    if (activeMedia) return;

    setActiveMedia(trigger);

    setTimeout(() => {
      const el = mediaRef.current;
      if (el) {
        el.currentTime = trigger.start || 0;
        el.volume = 1.0;
        el.play().catch(() => {});

        const duration = ((trigger.end || 10) - (trigger.start || 0)) * 1000;
        setTimeout(() => setActiveMedia(null), duration);
      }
    }, 50);
  };

  return (
    <>
      <style jsx global>{`
        html, body { background: transparent !important; margin: 0; padding: 0; overflow: hidden; }
      `}</style>
      
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-transparent">
        {activeMedia && (
          overlayType === 'audio' ? (
            <audio ref={mediaRef as any} src={activeMedia.url} />
          ) : (
            <video ref={mediaRef as any} src={activeMedia.url} className="w-full h-full object-cover" playsInline />
          )
        )}
      </div>
    </>
  );
}

export default function OverlayPage() { return <Suspense fallback={null}><OverlayContent /></Suspense>; }
