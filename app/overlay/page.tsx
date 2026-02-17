"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OverlayContent() {
  const searchParams = useSearchParams();
  
  // 1. DYNAMISCHE DATEN (Kommen wieder aus dem Dashboard Link!)
  // ---------------------------------------------------------
  const username = searchParams.get("u");
  const triggerCode = searchParams.get("c") || "777";
  const videoUrl = searchParams.get("v");
  const startTime = Number(searchParams.get("s") || 0);
  const endTime = Number(searchParams.get("e") || 10);
  // ---------------------------------------------------------

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!username) return;

    const eventSource = new EventSource(`/api/tiktok?u=${username}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          // Prüfen ob der Trigger im Kommentar ist
          if (data.comment && String(data.comment).includes(triggerCode)) {
             playVideo();
          }
        }
      } catch (e) {
        // Fehler ignorieren
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Reconnect Logik
      setTimeout(() => window.location.reload(), 5000);
    };

    return () => eventSource.close();
  }, [username, triggerCode]);

  const playVideo = () => {
    if (videoRef.current && videoUrl) {
      // Zeit setzen & Sound an
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = 1.0; 
      setIsPlaying(true);
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
          playPromise.catch(() => {});
      }
    }
  };

  const stopVideo = () => {
    setIsPlaying(false);
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = startTime;
        }
    }, 300);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
        // Hier greift jetzt deine Endzeit aus dem Dashboard!
        if (videoRef.current.currentTime >= endTime || videoRef.current.ended) {
            stopVideo();
        }
    }
  };

  if (!videoUrl) return null;

  return (
    // Container zentriert alles, ist aber unsichtbar
    <div className="fixed inset-0 flex items-center justify-center bg-transparent pointer-events-none">
      
      {/* Animation Container */}
      <div 
        className={`transition-opacity duration-300 ease-in-out ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        {/* VIDEO ELEMENT
            - max-h-screen: Darf maximal so hoch wie der Screen sein
            - w-auto: Breite passt sich automatisch an (kein 500px Quadrat mehr!)
            - shadow-xl: Ein leichter Schatten für bessere Sichtbarkeit
        */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="max-h-screen w-auto shadow-xl"
          style={{ maxWidth: "100vw" }} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={stopVideo}
          playsInline
        />
      </div>
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
