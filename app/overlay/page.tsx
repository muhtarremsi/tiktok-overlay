"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const username = searchParams.get('u') || '';
  const trigger = searchParams.get('c') || '777';
  const videoUrl = searchParams.get('v') || '';
  const volume = parseInt(searchParams.get('vol') || '100');
  const startTime = parseInt(searchParams.get('s') || '0');
  const endTime = parseInt(searchParams.get('e') || '10');

  useEffect(() => {
    if (!username) return;

    // Polling-Mechanismus als Übergangslösung, da der direkte Node-Import im Browser scheitert
    const checkEvents = async () => {
      try {
        const res = await fetch(`/api/events?u=${username}&c=${trigger}`);
        const data = await res.json();
        if (data.triggered) {
          triggerVideo();
        }
      } catch (e) { console.error("Event check failed"); }
    };

    const interval = setInterval(checkEvents, 2000); // Prüft alle 2 Sek auf neue Trigger
    return () => clearInterval(interval);
  }, [username, trigger]);

  const triggerVideo = () => {
    if (showVideo) return; // Verhindert mehrfaches Triggern
    setShowVideo(true);
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = Math.min(volume / 100, 1);
      videoRef.current.play().catch(e => console.error("Autoplay blocked or failed", e));

      const duration = (endTime - startTime) * 1000;
      setTimeout(() => {
        setShowVideo(false);
        if (videoRef.current) videoRef.current.pause();
      }, duration);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-transparent">
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`max-w-full max-h-full transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          playsInline
        />
      )}
      <div className="absolute bottom-4 right-4 text-[10px] text-zinc-800 font-mono uppercase opacity-10">
        Ready: {username} | Mode: API-Polling
      </div>
    </div>
  );
}

export default function OverlayPage() {
  return <Suspense fallback={null}><OverlayContent /></Suspense>;
}
