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

  useEffect(() => {
    if (!username) return;

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
        // Fehler ignorieren
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Reconnect Logik
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
      // Erst Zeit setzen, dann abspielen
      videoRef.current.currentTime = startTime;
      setIsPlaying(true);
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
          playPromise.catch(() => {});
      }
    }
  };

  const stopVideo = () => {
    // 1. Erst ausblenden (damit es weich verschwindet)
    setIsPlaying(false);

    // 2. Kurz warten (bis die Animation fertig ist), dann resetten
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = startTime;
        }
    }, 300); // 300ms entspricht der duration-300 im CSS
  };

  const handleTimeUpdate = () => {
    // Wenn Endzeit erreicht ODER Video zu Ende ist
    if (videoRef.current) {
        if (videoRef.current.currentTime >= endTime || videoRef.current.ended) {
            stopVideo();
        }
    }
  };

  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden pointer-events-none">
      <div 
        className={`transition-opacity duration-300 ease-in-out ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          // Hier ist das 9:16 Geheimnis: max-h-screen sorgt dafür, dass es vertikal den Platz füllt
          className="max-h-screen w-auto object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={stopVideo} // Sicherheitsnetz, falls TimeUpdate versagt
          muted={false} 
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
