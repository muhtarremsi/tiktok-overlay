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

    console.log("Verbinde zu TikTok Stream für:", username);
    
    // Verbindung zur neuen Stream-API aufbauen
    const eventSource = new EventSource(`/api/stream?u=${username}`);

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // Nur auf Chat-Events reagieren
      if (data.event === 'chat') {
        console.log("Chat:", data.comment);
        
        // Prüfen, ob der Kommentar den Trigger enthält
        if (data.comment.trim() === trigger) {
          triggerVideo();
        }
      }
    };

    eventSource.onerror = (err) => {
      console.error("Stream Fehler:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [username, trigger]);

  const triggerVideo = () => {
    // Verhindern, dass es doppelt triggert, während es schon läuft
    if (showVideo) return; 

    setShowVideo(true);
    
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = Math.min(volume / 100, 1);
      
      videoRef.current.play().catch(e => {
        console.error("Autoplay verhindert:", e);
      });

      // Video nach eingestellter Zeit wieder ausblenden
      const duration = (endTime - startTime) * 1000;
      setTimeout(() => {
        setShowVideo(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = startTime; // Reset
        }
      }, duration);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden">
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`max-w-full max-h-full transition-opacity duration-300 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          playsInline
        />
      )}
      {/* Debug Info: Nur sichtbar, wenn man genau hinschaut */}
      <div className="absolute bottom-2 right-2 text-[10px] text-black/20 font-mono">
        Listening: {trigger}
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
