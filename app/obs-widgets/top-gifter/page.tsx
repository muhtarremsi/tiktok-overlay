"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Trophy } from "lucide-react";

function TopGifterContent() {
  const searchParams = useSearchParams();
  const u = searchParams.get("u");
  const [topGifter, setTopGifter] = useState<any>(null);
  const [gifters, setGifters] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!u) return;
    const eventSource = new EventSource(`/api/live-chat?u=${u}`);
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'gift') {
            setGifters(prev => {
                const totalDiamonds = data.diamondCount * (data.amount || 1);
                const newTotal = (prev[data.nickname]?.diamonds || 0) + totalDiamonds;
                const updated: Record<string, any> = { ...prev, [data.nickname]: { nickname: data.nickname, profilePictureUrl: data.profilePictureUrl, diamonds: newTotal } };
                let top: any = null;
                Object.values(updated).forEach((gifter: any) => {
                    if (!top || gifter.diamonds > top.diamonds) top = gifter;
                });
                setTopGifter(top);
                return updated;
            });
        }
    };
    return () => eventSource.close();
  }, [u]);

  if (!topGifter) return <div className="hidden"></div>;

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent flex items-start justify-start p-4">
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 backdrop-blur-md rounded-2xl p-3 flex items-center gap-4 shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-in fade-in zoom-in">
            <div className="relative">
                <img src={topGifter.profilePictureUrl} className="w-12 h-12 rounded-full border-2 border-yellow-500 object-cover shadow-lg" />
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-1 shadow-lg"><Trophy size={12} className="text-black"/></div>
            </div>
            <div className="pr-4">
                <p className="text-[9px] text-yellow-500 font-black uppercase tracking-widest leading-none mb-1">Top Supporter</p>
                <p className="text-sm text-white font-bold leading-none uppercase italic">{topGifter.nickname}</p>
                <p className="text-[10px] text-zinc-400 font-bold mt-1">{topGifter.diamonds} Diamonds 💎</p>
            </div>
        </div>
    </div>
  );
}

export default function TopGifterOverlay() {
    return <Suspense fallback={null}><TopGifterContent /></Suspense>;
}
