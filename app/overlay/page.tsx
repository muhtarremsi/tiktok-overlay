"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WebcastPushConnection } from 'tiktok-live-connector';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Parameter aus der URL laden
  const username = searchParams.get('u') || '';
  const trigger = searchParams.get('c') || '777';
  const videoUrl = searchParams.get('v') || '';
  const volume = parseInt(searchParams.get('vol') || '100');
  const startTime = parseInt(searchParams.get('s') || '0');
  const endTime = parseInt(searchParams.get('e') || '10');

  useEffect(() => {
    if (!username) return;

    // Verbindung zum TikTok Live Connector (Client-Side)
    const tiktokConnection = new WebcastPushConnection(username);

    tiktokConnection.connect().then(state => {
      console.log(`Connected to roomId ${state.roomId}`);
    }).catch(err => {
      console.error('Connection Failed', err);
    });

    // Chat-Event Überwachung
    tiktokConnection.on('chat', (data) => {
      // Prüfen ob die Nachricht dem Trigger-Code entspricht
      if (data.comment.trim() === trigger) {
        triggerVideo();
      }
    });

    return () => {
      tiktokConnection.disconnect();
    };
  }, [username, trigger]);

  const triggerVideo = () => {
    setShowVideo(true);
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.volume = Math.min(volume / 100, 1); // Max 100% Systemvolumen, Rest via Gain-Node möglich
      videoRef.current.play();

      // Video nach berechneter Dauer ausblenden (Ende - Start)
      const duration = (endTime - startTime) * 1000;
      setTimeout(() => {
        setShowVideo(false);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }, duration);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-transparent">
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className={`max-w-full max-h-full transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
          playsInline
        />
      )}
      
      {/* Status-Indikator für den Setup-Check (nur im Browser sichtbar) */}
      <div className="absolute bottom-4 right-4 text-[10px] text-zinc-800 font-mono uppercase opacity-20">
        Connector: {username} | Trigger: {trigger}
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
