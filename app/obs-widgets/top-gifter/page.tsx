"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Trophy, ShieldAlert, Loader2 } from "lucide-react";

function TopGifterContent() {

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
                let parent: HTMLElement | null = divs[i];
                // Finde den äußeren Container (meistens fixed bottom) und verstecke ihn
                while (parent && parent.tagName !== 'BODY') {
                    const style = window.getComputedStyle(parent);
                    if (style.position === 'fixed' || style.bottom === '0px' || parseInt(style.zIndex || '0', 10) > 20) {
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
  const color = searchParams.get("c") || "#eab308";

  const [topGifter, setTopGifter] = useState<any>(null);
  const [gifters, setGifters] = useState<Record<string, any>>({});
  const [authStatus, setAuthStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

  // RADIKALER COOKIE KILLER FÜR OBS
  useEffect(() => {
    const killCookies = () => { document.querySelectorAll('div').forEach(el => { if(el.textContent && el.textContent.includes('DATENSCHUTZ & COOKIES')) el.style.display = 'none'; }); };
    killCookies(); const interval = setInterval(killCookies, 500); return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (!key || key.length < 10) setAuthStatus('invalid'); else setAuthStatus('valid');
    }, 1500);
    return () => clearTimeout(timer);
  }, [key]);

  useEffect(() => {
    if (authStatus !== 'valid' || !u) return;
    const eventSource = new EventSource(`/api/live-chat?u=${u}`);
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'offline') { setTopGifter(null); setGifters({}); }
        else if (data.type === 'gift') {
            setGifters(prev => {
                const totalDiamonds = data.diamondCount * (data.amount || 1);
                const newTotal = (prev[data.nickname]?.diamonds || 0) + totalDiamonds;
                const updated: Record<string, any> = { ...prev, [data.nickname]: { nickname: data.nickname, profilePictureUrl: data.profilePictureUrl, diamonds: newTotal } };
                let top: any = null;
                Object.values(updated).forEach((gifter: any) => { if (!top || gifter.diamonds > top.diamonds) top = gifter; });
                setTopGifter(top);
                return updated;
            });
        }
    };
    return () => eventSource.close();
  }, [u, authStatus]);

  if (authStatus === 'checking') return <div className="w-fit h-fit bg-transparent flex p-0 overflow-hidden"><div className="bg-black/90 border border-white/10 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /><p className="text-white font-black text-xs tracking-widest uppercase">Verifying Key...</p></div></div>;
  if (authStatus === 'invalid') return <div className="w-fit h-fit p-4 flex items-center justify-center bg-transparent"><div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex flex-col items-center gap-4 shadow-2xl backdrop-blur-md"><ShieldAlert className="text-red-500 w-12 h-12" /><p className="text-red-500 font-black text-sm tracking-widest uppercase">Invalid Key</p></div></div>;

  // PLATZHALTER WENN NOCH KEIN GIFT DA IST (Perfekt zum Justieren in OBS)
  if (!topGifter) return (
    <div className="w-fit h-fit overflow-hidden bg-transparent flex items-start justify-start p-2">
        <div className="border backdrop-blur-md rounded-2xl p-3 flex items-center gap-4 shadow-2xl opacity-70" style={{ borderColor: color, backgroundColor: `rgba(0,0,0,0.6)` }}>
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 bg-zinc-800 flex items-center justify-center" style={{ borderColor: color }}><Trophy size={20} className="text-zinc-600"/></div>
                <div className="absolute -bottom-2 -right-2 rounded-full p-1 shadow-lg" style={{ backgroundColor: color }}><Trophy size={12} className="text-black"/></div>
            </div>
            <div className="pr-4">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: color }}>Top Supporter</p>
                <p className="text-sm text-zinc-500 font-bold leading-none uppercase italic drop-shadow-md">Warte auf Gifts...</p>
                <p className="text-[10px] text-zinc-600 font-bold mt-1">0 Diamonds 💎</p>
            </div>
        </div>
    </div>
  );

  return (
    <div className="w-fit h-fit overflow-hidden bg-transparent flex items-start justify-start p-2">
        <div className="border backdrop-blur-md rounded-2xl p-3 flex items-center gap-4 animate-in fade-in zoom-in shadow-2xl" style={{ borderColor: color, backgroundColor: `rgba(0,0,0,0.6)` }}>
            <div className="relative">
                <img src={topGifter.profilePictureUrl} className="w-12 h-12 rounded-full border-2 object-cover shadow-lg" style={{ borderColor: color }} />
                <div className="absolute -bottom-2 -right-2 rounded-full p-1 shadow-lg" style={{ backgroundColor: color }}><Trophy size={12} className="text-black"/></div>
            </div>
            <div className="pr-4">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: color }}>Top Supporter</p>
                <p className="text-sm text-white font-bold leading-none uppercase italic drop-shadow-md">{topGifter.nickname}</p>
                <p className="text-[10px] text-zinc-300 font-bold mt-1">{topGifter.diamonds} Diamonds 💎</p>
            </div>
        </div>
    </div>
  );
}

export default function TopGifterOverlay() { return <Suspense fallback={null}><TopGifterContent /></Suspense>; }
