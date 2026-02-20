"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Loader2, ShieldAlert } from "lucide-react";

function LikeGoalContent() {
  const searchParams = useSearchParams();
  const u = searchParams.get("u");
  const key = searchParams.get("k");
  const goal = parseInt(searchParams.get("goal") || "10000");
  const color = searchParams.get("c") || "#ec4899";
  
  const [likes, setLikes] = useState(0);
  const [authStatus, setAuthStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  useEffect(() => { const killCookies = () => { document.querySelectorAll('div').forEach(el => { if(el.textContent && el.textContent.includes('DATENSCHUTZ & COOKIES')) el.style.display = 'none'; }); }; killCookies(); const interval = setInterval(killCookies, 500); return () => clearInterval(interval); }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
        if (!key || key.length < 10) setAuthStatus('invalid');
        else setAuthStatus('valid');
    }, 1500);
    return () => clearTimeout(timer);
  }, [key]);

  useEffect(() => {
    if (authStatus !== 'valid' || !u) return;
    const eventSource = new EventSource(`/api/live-chat?u=${u}`);
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'like') setLikes(prev => prev + data.likeCount);
        else if (data.type === 'offline') setLikes(0);
    };
    return () => eventSource.close();
  }, [u, authStatus]);

  if (authStatus === 'checking') return (
      <div className="w-screen h-screen flex items-center justify-center bg-transparent"><div className="bg-black/90 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /><p className="text-white font-black text-xs tracking-widest uppercase">Verifying License Key...</p></div></div>
  );

  if (authStatus === 'invalid') return (
      <div className="w-screen h-screen flex items-center justify-center bg-transparent"><div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl backdrop-blur-md"><ShieldAlert className="text-red-500 w-12 h-12" /><p className="text-red-500 font-black text-sm tracking-widest uppercase">Access Denied: Invalid Key</p></div></div>
  );

  const percentage = Math.min((likes / goal) * 100, 100);

  return (
    <div className="w-fit h-fit overflow-hidden bg-transparent flex items-start justify-start p-2">
        <div className="bg-black/60 border backdrop-blur-md rounded-2xl p-4 w-80 shadow-2xl animate-in fade-in zoom-in" style={{ borderColor: `${color}50` }}>
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                    <Heart size={16} className="animate-pulse" style={{ color: color, filter: `drop-shadow(0 0 8px ${color})` }} fill="currentColor" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic drop-shadow-md">Live Like Goal</span>
                </div>
                <span className="text-[10px] font-black" style={{ color: color }}>{likes} / {goal}</span>
            </div>
            <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div className="h-full transition-all duration-500 ease-out" style={{ width: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
            </div>
        </div>
    </div>
  );
}

export default function LikeGoalOverlay() { return <Suspense fallback={null}><LikeGoalContent /></Suspense>; }
