"use client";

import { useEffect, useRef, useState, Suspense } from "react";

function OverlayContent() {
  // ---------------------------------------------------------
  // HIER SIND JETZT DEINE FESTEN DATEN
  // ---------------------------------------------------------
  const username = "flasche_auf_kopf";
  const triggerCode = "777"; 
  const videoUrl = "https://cdn.discordapp.com/attachments/1462540433463709815/1472988001838563361/Meme_Okay_.mp4?ex=6994927a&is=699340fa&hm=9852f88fc2304645fcc63d8bee17cc410ad93f65d33162768821b7233935cb08&";
  
  const startTime = 0;
  const endTime = 10; // Maximale Laufzeit
  // ---------------------------------------------------------

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // API Verbindung aufbauen
    console.log("Verbinde zu:", username);
    const eventSource = new EventSource(`/api/tiktok?u=${username}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          // Prüfen ob der Trigger im Kommentar ist
          if (data.comment && String(data.comment).includes(triggerCode)) {
             console.log("Trigger erkannt!");
             playVideo();
          }
        }
      } catch (e) {
        console.error("Fehler beim Lesen:", e);
      }
    };

    eventSource.onerror = (err) => {
      console.log("Verbindung verloren, versuche neu...", err);
      eventSource.close();
      setTimeout(() => window.location.reload(), 5000);
    };

    return () => eventSource.close();
  }, []);

  const playVideo = () => {
    if (videoRef.current) {
      // Reset
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = 1.0; // Volle Lautstärke
      setIsPlaying(true);
      
      // Versuchen abzuspielen
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
          playPromise
            .then(() => console.log("Video läuft"))
            .catch((error) => console.error("Autoplay blockiert:", error));
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
        if (videoRef.current.currentTime >= endTime || videoRef.current.ended) {
            stopVideo();
        }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden pointer-events-none">
      <div 
        className={`transition-opacity duration-300 ease-in-out ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="max-h-screen w-auto object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={stopVideo}
          playsInline
          // WICHTIG: In OBS muss "Audio über OBS steuern" an sein, sonst hört man nix
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
