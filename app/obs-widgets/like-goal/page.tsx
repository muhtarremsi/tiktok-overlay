"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";

function LikeGoalContent() {
  const searchParams = useSearchParams();
  const u = searchParams.get("u");
  const goal = parseInt(searchParams.get("goal") || "10000");
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (!u) return;
    const eventSource = new EventSource(`/api/live-chat?u=${u}`);
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'like') setLikes(prev => prev + data.likeCount);
    };
    return () => eventSource.close();
  }, [u]);

  const percentage = Math.min((likes / goal) * 100, 100);

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent flex items-start justify-start p-4">
        <div className="bg-black/80 border border-pink-500/30 backdrop-blur-md rounded-2xl p-4 w-80 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                    <Heart size={16} className="text-pink-500 animate-pulse drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" fill="currentColor" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Live Like Goal</span>
                </div>
                <span className="text-[10px] font-black text-pink-400">{likes} / {goal}</span>
            </div>
            <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div className="bg-gradient-to-r from-pink-600 to-pink-400 h-full transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    </div>
  );
}

export default function LikeGoalOverlay() {
    return <Suspense fallback={null}><LikeGoalContent /></Suspense>;
}
