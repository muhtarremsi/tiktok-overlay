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
  const overlayType = searchParams.get('type') || 'video'; // 'video' oder 'audio'

  // Konfiguration laden
  useEffect(() => {
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam));
        if (Array.isArray(decoded)) setTriggers(decoded);
      } catch (e) {
        console.error("Config Error:", e);
      }
    }
  }, [configParam]);

  // Verbindung zum Stream
  useEffect(() => {
    if (!username) return;
    
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    const connect = () => {
      // Wir nutzen eine Timestamp, um Caching zu verhindern
      eventSource = new EventSource(`/api/stream?u=${username}&t=${Date.now()}`);
      
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          
          // BUGFIX: Wir ignorieren ALLES außer 'chat'
          // Keine Likes, keine Joins, keine Gifts (außer wir bauen das später explizit ein)
          if (data.event === 'chat' && data.comment) {
            const cleanComment = data.comment.trim().toLowerCase();
            
            // Exakte Suche nach dem Code
            const match = triggers.find(t => t.code.toLowerCase() === cleanComment);
            
            if (match) {
              playTrigger(match);
            }
          }
        } catch (err) {
          // Ignorieren von Parsing Fehlern
        }
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
    // Wenn schon was läuft, abbrechen (oder Queue bauen, aber hier simple: blockieren)
    if (activeMedia) return;

    setActiveMedia(trigger);

    // Kleiner Timeout, damit das DOM Element gerendert wird
    setTimeout(() => {
      const el = mediaRef.current;
      if (el) {
        el.currentTime = trigger.start || 0;
        el.volume = 1.0; // Lautstärke voll
        
        el.play().catch(e => console.error("Play Error:", e));

        // Stoppen nach definierter Zeit oder Standard 10s
        const duration = ((trigger.end || 10) - (trigger.start || 0)) * 1000;
        
        // Sicherheits-Timeout falls das Video kürzer ist
        setTimeout(() => {
          setActiveMedia(null);
        }, duration);
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
            // AUDIO PLAYER (Unsichtbar oder Minimal)
            <audio ref={mediaRef as any} src={activeMedia.url} />
          ) : (
            // VIDEO PLAYER
            <video 
              ref={mediaRef as any} 
              src={activeMedia.url} 
              className="w-full h-full object-cover" 
              playsInline 
            />
          )
        )}
      </div>
    </>
  );
}

export default function OverlayPage() {
  return <Suspense fallback={null}><OverlayContent /></Suspense>;
}
