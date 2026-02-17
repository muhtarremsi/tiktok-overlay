"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OverlayContent() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Warte auf Start...");
  const [isPlaying, setIsPlaying] = useState(false);

  // Parameter auslesen
  const username = searchParams.get("u");
  const triggerCode = searchParams.get("c") || "777";
  const videoUrl = searchParams.get("v");
  const startTime = Number(searchParams.get("s") || 0);
  const endTime = Number(searchParams.get("e") || 10);

  useEffect(() => {
    if (!username) return;

    setStatus("Verbinde...");
    
    // Wir verbinden uns NUR mit unserer eigenen API, nicht direkt mit TikTok
    const eventSource = new EventSource(`/api/tiktok?u=${username}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'status') {
          setStatus(data.msg);
        } else if (data.type === 'chat') {
          // Prüfen ob der Code im Kommentar steckt
          if (data.comment && String(data.comment).includes(triggerCode)) {
             playVideo();
          }
        }
      } catch (e) {
        console.error("Parse Error", e);
      }
    };

    eventSource.onerror = () => {
      // Wenn Vercel die Verbindung trennt (passiert oft im Free Tier), einfach neu versuchen
      setStatus("Verbindung neu aufbauen...");
      eventSource.close();
      setTimeout(() => {
         // Durch Änderung des State triggern wir einen Reconnect, wenn nötig
         // Hier lassen wir den useEffect einfach beim nächsten Mount neu laufen
         window.location.reload(); 
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [username, triggerCode]);

  const playVideo = () => {
    if (videoRef.current && videoUrl) {
      setIsPlaying(true);
      videoRef.current.currentTime = startTime;
      videoRef.current.play().catch(e => console.log("Play error", e));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= endTime) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = startTime;
    }
  };

  if (!videoUrl) return <div className="text-white p-4">Keine Video URL angegeben</div>;

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent flex items-center justify-center">
      <div className="absolute top-2 left-2 text-xs text-white/50 bg-black/50 p-1 rounded z-50">
        Status: {status}
      </div>

      <video
        ref={videoRef}
        src={videoUrl}
        className={`transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0"}`}
        style={{ maxHeight: "100vh", maxWidth: "100vw" }}
        onTimeUpdate={handleTimeUpdate}
        muted={false} 
      />
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div>Laden...</div>}>
      <OverlayContent />
    </Suspense>
  );
}
