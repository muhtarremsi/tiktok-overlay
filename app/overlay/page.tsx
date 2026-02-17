"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [showVideo, setShowVideo] = useState(false);
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
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(`/api/stream?u=${username}`);

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'chat') {
            if (data.comment.trim().toLowerCase() === trigger.toLowerCase()) {
              triggerVideo();
            }
          }
        } catch (err) {
          console.error("Parse Error", err);
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        reconnectTimeout = setTimeout(connect, 1000);
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimeout);
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
        playPromise.catch(() => {});
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
    <>
      {/* WICHTIG: Dieser Style-Block überschreibt das globale Schwarz der App */}
      <style jsx global>{`
        html, body {
          background-color: transparent !important;
          background: transparent !important;
        }
      `}</style>

      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            className={`w-full h-full object-cover transition-opacity duration-300 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
            playsInline
          />
        )}
      </div>
    </>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={null}>
      <OverlayContent />
    </Suspense>
  );
}
