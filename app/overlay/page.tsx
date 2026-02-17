"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  const [lastMsg, setLastMsg] = useState("");
  const [interacted, setInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const username = searchParams.get('u') || '';
  const trigger = searchParams.get('c') || '777';
  const videoUrl = searchParams.get('v') || '';
  const volume = parseInt(searchParams.get('vol') || '100');
  const startTime = parseInt(searchParams.get('s') || '0');
  const endTime = parseInt(searchParams.get('e') || '10');

  useEffect(() => {
    if (!username) return;

    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      setStatus(`Connecting to @${username}...`);
      
      // SSE Verbindung aufbauen
      eventSource = new EventSource(`/api/stream?u=${username}`);

      eventSource.onopen = () => {
        setStatus("🟢 Connected & Listening");
      };

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          if (data.event === 'ping') return;

          if (data.event === 'status') {
            setStatus(`ℹ️ ${data.msg}`);
          }

          if (data.event === 'chat') {
            setLastMsg(`${data.user}: ${data.comment}`);
            // Trigger Prüfung (Groß/Kleinschreibung egal)
            if (data.comment.trim().toLowerCase() === trigger.toLowerCase()) {
              triggerVideo();
            }
          }
        } catch (err) {
          console.error("Parse Error", err);
        }
      };

      eventSource.onerror = (err) => {
        setStatus("🔴 Connection Lost. Reconnecting in 2s...");
        eventSource?.close();
        reconnectTimer = setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimer);
    };
  }, [username, trigger]);

  const triggerVideo = () => {
    if (showVideo) return;
    
    setShowVideo(true);
    
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = Math.min(volume / 100, 1);
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          setStatus("⚠️ Autoplay blocked! Click screen.");
        });
      }

      const duration = (endTime - startTime) * 1000;
      setTimeout(() => {
        setShowVideo(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = startTime;
        }
      }, duration);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent overflow-hidden">
      
      {/* Click Overlay für Sound (verschwindet nach Klick) */}
      {!interacted && (
        <div 
          onClick={() => setInteracted(true)}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer text-white font-bold uppercase tracking-widest text-sm"
        >
          Click to Enable Sound
        </div>
      )}

      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`max-w-full max-h-full transition-opacity duration-300 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          playsInline
        />
      )}

      {/* Status Bar (Debug) */}
      <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1 pointer-events-none">
        <div className="text-[10px] text-zinc-400 font-mono bg-black/90 px-2 py-1 rounded border border-white/10">
          {status}
        </div>
        {lastMsg && (
          <div className="text-[10px] text-green-400 font-mono bg-black/90 px-2 py-1 rounded border border-green-500/30">
            Last: {lastMsg}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OverlayPage() {
  return <Suspense fallback={<div>Loading...</div>}><OverlayContent /></Suspense>;
}
