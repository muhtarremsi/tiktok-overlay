"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Loader2, ShieldAlert } from "lucide-react";

function LikeGoalContent() {

  // --- OBS ULTIMATE FIX ---
  useEffect(() => {
    // 1. Hintergrund der gesamten Webseite in OBS erzwingen
    document.documentElement.style.setProperty('background', 'transparent', 'important');
    document.documentElement.style.setProperty('background-color', 'transparent', 'important');
    document.body.style.setProperty('background', 'transparent', 'important');
    document.body.style.setProperty('background-color', 'transparent', 'important');

    // 2. Cookie Banner zerstören (Aggressiv)
    const nukeCookies = () => {
        const divs = document.getElementsByTagName('div');
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].innerText && (divs[i].innerText.includes('DATENSCHUTZ & COOKIES') || divs[i].innerText.includes('ALLE AKZEPTIEREN'))) {
                let parent = divs[i];
                // Finde den äußeren Container (meistens fixed bottom) und verstecke ihn
                while (parent && parent.tagName !== 'BODY') {
                    const style = window.getComputedStyle(parent);
                    if (style.position === 'fixed' || style.bottom === '0px' || style.zIndex > 20) {
                        parent.style.setProperty('display', 'none', 'important');
                        parent.style.setProperty('opacity', '0', 'important');
                    }
                    parent = parent.parentElement;
                }
                divs[i].style.setProperty('display', 'none', 'important');
            }
        }
    };
    nukeCookies();
    // Ein Wächter, der den Banner sofort löscht, falls er verzögert geladen wird
    const obs = new MutationObserver(nukeCookies);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);
  // --- END OBS FIX ---

  const searchParams = useSearchParams();
  const u = searchParams.get("u");
  const key = searchParams.get("k");
  const goal = parseInt(searchParams.get("goal") || "10000");
  const color = searchParams.get("c") || "#ec4899";
  
  const [likes, setLikes] = useState(0);
  const [authStatus, setAuthStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  


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
