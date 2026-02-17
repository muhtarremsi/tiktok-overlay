"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { normalizeTiktokUsername } from "@/lib/username";

function OverlayContent() {
  const searchParams = useSearchParams();
  
  // DATEN AUS DEM DASHBOARD LINK (Username normalisiert für API)
  const rawUser = searchParams.get("u");
  const username = rawUser ? normalizeTiktokUsername(rawUser) : null;
  const triggerCode = searchParams.get("c") || "777";
  const videoUrl = searchParams.get("v");
  const startTime = Number(searchParams.get("s") || 0);
  const endTime = Number(searchParams.get("e") || 10);
  
  // NEU: Lautstärke-Booster (Standard 100 = Normal, 200 = Doppelt so laut)
  const volumePercent = Number(searchParams.get("vol") || 100);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio Booster Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // Funktion zum Aktivieren des Boosters
  const initAudioBooster = () => {
    if (!videoRef.current || sourceRef.current) return; // Schon aktiv

    try {
      // 1. Audio Context erstellen
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      
      // 2. Quelle vom Video abgreifen
      const source = ctx.createMediaElementSource(videoRef.current);
      
      // 3. Verstärker (Gain) erstellen
      const gainNode = ctx.createGain();
      
      // Berechnung: 100% = 1.0, 200% = 2.0, etc.
      const boostValue = volumePercent / 100; 
      gainNode.gain.value = boostValue;

      // 4. Verkabeln: Video -> Verstärker -> Lautsprecher
      source.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Refs speichern
      audioCtxRef.current = ctx;
      gainNodeRef.current = gainNode;
      sourceRef.current = source;
      
      console.log(`Audio Boost aktiv: ${volumePercent}%`);
    } catch (e) {
      console.error("Audio Context Fehler:", e);
    }
  };

  useEffect(() => {
    if (!username) return;

    const eventSource = new EventSource(`/api/tiktok?u=${encodeURIComponent(username)}`);

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
      setTimeout(() => window.location.reload(), 5000);
    };

    return () => eventSource.close();
  }, [username, triggerCode]);

  const playVideo = () => {
    if (videoRef.current && videoUrl) {
      // Booster initialisieren (darf erst bei Interaktion/Play passieren)
      if (!audioCtxRef.current) {
          initAudioBooster();
      }
      // Falls der Context "suspended" ist (Browser-Schutz), aufwecken
      if (audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume();
      }

      videoRef.current.currentTime = startTime;
      videoRef.current.volume = 1.0; // Basis-Lautstärke auf Max
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
        if (videoRef.current.currentTime >= endTime || videoRef.current.ended) {
            stopVideo();
        }
    }
  };

  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent pointer-events-none">
      <div 
        className={`transition-opacity duration-300 ease-in-out ${isPlaying ? "opacity-100" : "opacity-0"}`}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="max-h-screen w-auto shadow-xl"
          style={{ maxWidth: "100vw" }} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={stopVideo}
          crossOrigin="anonymous" // Wichtig für Audio-Booster
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
