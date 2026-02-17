"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [activeVideo, setActiveVideo] = useState<any>(null); // Welches Video läuft gerade?
  const videoRef = useRef<HTMLVideoElement>(null);

  const username = searchParams.get('u') || '';
  const configParam = searchParams.get('config');

  // Trigger-Liste aus der URL laden
  const [triggers, setTriggers] = useState<any[]>([]);

  useEffect(() => {
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam));
        if (Array.isArray(decoded)) {
          setTriggers(decoded);
          console.log("Triggers loaded:", decoded);
        }
      } catch (e) {
        console.error("Config Error", e);
      }
    }
  }, [configParam]);

  useEffect(() => {
    if (!username) return;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(`/api/stream?u=${username}`);

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'chat') {
            const comment = data.comment.trim().toLowerCase();
            
            // Suche in der Liste nach einem Match
            const match = triggers.find(t => t.code.toLowerCase() === comment);
            
            if (match) {
              playTrigger(match);
            }
          }
        } catch (err) {}
      };

      eventSource.onerror = () => {
        eventSource?.close();
        reconnectTimeout = setTimeout(connect, 3000);
      };
    };

    connect();
    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [username, triggers]);

  const playTrigger = (trigger: any) => {
    // Wenn schon was läuft, abbrechen oder ignorieren (hier: ignorieren)
    if (activeVideo) return;

    setActiveVideo(trigger);

    // Kurze Verzögerung damit React das Video-Element rendert
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = trigger.start || 0;
        videoRef.current.volume = 1.0; 
        videoRef.current.play().catch(() => {});

        const duration = ((trigger.end || 10) - (trigger.start || 0)) * 1000;
        
        setTimeout(() => {
          // Video stoppen und ausblenden
          if (videoRef.current) videoRef.current.pause();
          setActiveVideo(null);
        }, duration);
      }
    }, 50);
  };

  return (
    <>
      <style jsx global>{`html, body { background: transparent !important; }`}</style>
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
        {activeVideo && (
          <video
            ref={videoRef}
            src={activeVideo.url}
            className="w-full h-full object-cover"
            playsInline
          />
        )}
      </div>
    </>
  );
}

export default function OverlayPage() {
  return <Suspense fallback={null}><OverlayContent /></Suspense>;
}
