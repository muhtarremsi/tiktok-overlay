"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function OverlayContent() {
  const searchParams = useSearchParams();
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [triggers, setTriggers] = useState<any[]>([]);

  const username = searchParams.get('u');
  const configParam = searchParams.get('config');

  useEffect(() => {
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam));
        if (Array.isArray(decoded)) setTriggers(decoded);
      } catch (e) {}
    }
  }, [configParam]);

  useEffect(() => {
    if (!username) return;
    let eventSource: EventSource | null = null;

    const connect = () => {
      eventSource = new EventSource(`/api/stream?u=${username}`);
      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'chat') {
            const match = triggers.find(t => t.code.toLowerCase() === data.comment.trim().toLowerCase());
            if (match) playTrigger(match);
          }
        } catch (err) {}
      };
      eventSource.onerror = () => {
        eventSource?.close();
        setTimeout(connect, 3000);
      };
    };

    connect();
    return () => eventSource?.close();
  }, [username, triggers]);

  const playTrigger = (trigger: any) => {
    if (activeVideo) return;
    setActiveVideo(trigger);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = trigger.start || 0;
        videoRef.current.play().catch(() => {});
        const duration = ((trigger.end || 10) - (trigger.start || 0)) * 1000;
        setTimeout(() => setActiveVideo(null), duration);
      }
    }, 50);
  };

  return (
    <>
      <style jsx global>{`
        html, body { background: transparent !important; margin: 0; padding: 0; overflow: hidden; }
      `}</style>
      <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-transparent">
        {activeVideo && (
          <video ref={videoRef} src={activeVideo.url} className="w-full h-full object-cover" playsInline />
        )}
      </div>
    </>
  );
}

export default function OverlayPage() { return <Suspense fallback={null}><OverlayContent /></Suspense>; }
