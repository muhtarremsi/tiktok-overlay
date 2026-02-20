"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function SpotifyOverlay() {
  return (
    <Suspense fallback={<div className="hidden"></div>}>
       <OverlayContent />
    </Suspense>
  );
}

function OverlayContent() {

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
  const rt = searchParams.get("rt");
  const [track, setTrack] = useState<any>(null);
  


  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(`/api/spotify/now-playing?rt=${rt || ''}&t=${Date.now()}`);
        const data = await res.json();
        if (data.isPlaying) setTrack(data);
        else setTrack(null);
      } catch (err) {}
    };
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 3000);
    return () => clearInterval(interval);
  }, [rt]);

  if (!track) return <div className="hidden"></div>;

  return (
    <div className="w-screen h-screen overflow-hidden bg-transparent p-4 flex items-start justify-start">
      <div className="bg-black/80 border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl inline-flex max-w-fit">
        <img src={track.albumImageUrl || "/placeholder-cover.jpg"} alt="Cover" className="w-16 h-16 rounded-xl shadow-lg object-cover shrink-0" />
        <div className="pr-4 shrink-0 min-w-[150px]">
          <h4 className="text-sm font-black text-white font-sans uppercase italic truncate leading-tight">{track.title}</h4>
          <p className="text-[10px] text-[#1DB954] font-bold font-sans uppercase tracking-widest truncate">{track.artist}</p>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#1DB954] h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(29,185,84,0.8)]" style={{ width: `${(track.progressMs / track.durationMs) * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
