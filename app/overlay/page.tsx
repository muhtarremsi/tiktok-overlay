"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { WebcastPushConnection } from "tiktok-live-connector";

function OverlayContent() {
  const searchParams = useSearchParams();
  
  // HIER WAR DER FEHLER: Wir fügen <HTMLVideoElement> hinzu
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState("Warte auf Verbindung...");

  const username = searchParams.get("u");
  const triggerCode = searchParams.get("c") || "777";
  const videoUrl = searchParams.get("v");
  const startTime = Number(searchParams.get("s") || 0);
  const endTime = Number(searchParams.get("e") || 10);

  useEffect(() => {
    if (!username) return;

    // TikTok Verbindung (try/catch für Sicherheit)
    let tiktokConnection: any;
    try {
      tiktokConnection = new WebcastPushConnection(username);
      
      tiktokConnection.connect()
        .then((state: any) => setStatus(`Verbunden: ${state.roomId}`))
        .catch((err: any) => setStatus(`Fehler: ${err.message}`));

      tiktokConnection.on("chat", (data: any) => {
        const msg = data.comment;
        // Trigger Logik
        if (msg.includes(triggerCode)) {
          playVideo();
        }
      });
    } catch (e) {
      console.error("Connection setup failed", e);
    }

    return () => {
      if(tiktokConnection) tiktokConnection.disconnect();
    };
  }, [username, triggerCode]);

  const playVideo = () => {
    if (videoRef.current && videoUrl) {
      setIsPlaying(true);
      videoRef.current.currentTime = startTime;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Autoplay prevented:", error);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= endTime) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = startTime;
    }
  };

  if (!videoUrl) return <div className="text-red-500">Keine URL</div>;

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 text-xs text-gray-500 opacity-0 hover:opacity-100 p-2 transition-opacity">
        {status} | Code: {triggerCode}
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
