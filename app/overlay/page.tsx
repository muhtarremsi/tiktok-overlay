"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OverlayContent() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("Warte auf Start...");
  const [isPlaying, setIsPlaying] = useState(false);

  const username = searchParams.get("u");
  const triggerCode = searchParams.get("c") || "777";
  const videoUrl = searchParams.get("v");
  const startTime = Number(searchParams.get("s") || 0);
  const endTime = Number(searchParams.get("e") || 10);

  useEffect(() => {
    if (!username) return;

    // Verbindung zu unserer eigenen API herstellen (SSE)
    setStatus("Verbinde...");
    const eventSource = new EventSource(`/api/tiktok?u=${username}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'status') {
        setStatus(data.msg);
      } else if (data.type === 'chat') {
        // Hier prüfen wir den Code
        if (data.comment && data.comment.includes(triggerCode)) {
           playVideo();
        }
      }
    };

    eventSource.onerror = () => {
      setStatus("Verbindung neu aufbauen...");
      eventSource.close();
      // Einfacher Reconnect nach 3 Sekunden
      setTimeout(() => { /* Reconnect Logik durch React Refresh */ }, 3000);
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
      {/* Status Anzeige (nur zum Testen sichtbar, kann man später ausblenden) */}
      <div className="absolute top-2 left-2 text-xs text-white/50 bg-black/50 p-1 rounded z-50">
        Status: {status} | Trigger: {triggerCode}
      </div>

      <video
        ref={videoRef}
        src={videoUrl}
        className={`transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0"}`}
        style={{ maxHeight: "100vh", maxWidth: "100vw" }}
        onTimeUpdate={handleTimeUpdate}
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
