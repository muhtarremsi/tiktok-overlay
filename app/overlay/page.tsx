"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);
  const [status, setStatus] = useState("Init...");
  const [debugMsg, setDebugMsg] = useState("");
  const [interacted, setInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const username = searchParams.get('u') || '';
  const trigger = searchParams.get('c') || '777';
  const videoUrl = searchParams.get('v') || '';
  const volume = parseInt(searchParams.get('vol') || '100');
  const startTime = parseInt(searchParams.get('s') || '0');
  const endTime = parseInt(searchParams.get('e') || '10');

  // Verbindung aufbauen & halten
  useEffect(() => {
    if (!username) return;

    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    const connect = () => {
      setStatus("Connecting...");
      eventSource = new EventSource(`/api/stream?u=${username}`);

      eventSource.onopen = () => setStatus("Connected (Listening)");
      
      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.event === 'ping') return; // Heartbeat ignorieren

        if (data.event === 'chat') {
          setDebugMsg(`Last msg: ${data.comment}`);
          // Trigger Check (Case Insensitive)
          if (data.comment.trim().toLowerCase() === trigger.toLowerCase()) {
            triggerVideo();
          }
        }
      };

      eventSource.onerror = () => {
        setStatus("Reconnecting...");
        eventSource?.close();
        // Vercel kappt Verbindungen oft, daher aggressiver Reconnect (1s)
        retryTimeout = setTimeout(connect, 1000); 
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, [username, trigger]);

  const triggerVideo = () => {
    if (showVideo) return; // Nicht doppelt abspielen
    
    setShowVideo(true);
    
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = Math.min(volume / 100, 1);
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Autoplay prevented:", error);
          setStatus("Autoplay Error (Click Page!)");
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
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden">
      
      {/* Klick-Overlay für Sound-Freigabe (verschwindet nach Klick) */}
      {!interacted && (
        <div 
          onClick={() => setInteracted(true)}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 cursor-pointer text-white font-bold uppercase tracking-widest text-sm hover:bg-black/40 transition-all"
        >
          Click here to Enable Sound & Video
        </div>
      )}

      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`max-w-full max-h-full transition-opacity duration-300 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          playsInline
        />
      )}

      {/* Debug Info unten rechts */}
      <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
        <div className="text-[10px] text-green-500 font-mono bg-black/80 px-2 py-1 rounded">
          {status} | Trigger: "{trigger}"
        </div>
        {debugMsg && (
          <div className="text-[9px] text-zinc-400 font-mono bg-black/80 px-2 py-1 rounded">
            {debugMsg}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OverlayContent />
    </Suspense>
  );
}
