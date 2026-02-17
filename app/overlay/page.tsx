"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function OverlayContent() {
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Parameter
  const username = searchParams.get("u");
  const triggerCode = searchParams.get("c") || "777";
  const videoUrl = searchParams.get("v");
  const startTime = Number(searchParams.get("s") || 0);
  const endTime = Number(searchParams.get("e") || 10);

  // Styles für den Rahmen (ARC Yellow)
  const borderStyle = "border-4 border-[#FFD000] rounded-lg shadow-2xl bg-black";

  useEffect(() => {
    if (!username) return;

    // Verbindung aufbauen (ohne visuelles Feedback für den Zuschauer)
    const eventSource = new EventSource(`/api/tiktok?u=${username}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          if (data.comment && String(data.comment).includes(triggerCode)) {
             playVideo();
          }
        }
      } catch (e) {
        // Fehler stillschweigend ignorieren
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setTimeout(() => {
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

  if (!videoUrl) return null;

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent flex items-center justify-center">
      {/* KEIN Status-Text mehr hier! 
      */}

      <div className={`transition-all duration-300 ${isPlaying ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
        <video
          ref={videoRef}
          src={videoUrl}
          className={borderStyle}
          style={{ maxHeight: "80vh", maxWidth: "80vw" }}
          onTimeUpdate={handleTimeUpdate}
          muted={false} 
        />
      </div>
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div></div>}>
      <OverlayContent />
    </Suspense>
  );
}
