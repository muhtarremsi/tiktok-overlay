"use client";

import React, { useState, useEffect } from "react";
import { Music2 } from "lucide-react";

export default function SpotifyOverlay() {
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        // Cache-Buster hinzugefügt (?t=...) damit auch OBS immer neu lädt
        const res = await fetch('/api/spotify/now-playing?t=' + Date.now());
        const data = await res.json();
        if (data.isPlaying) setTrack(data);
        else setTrack(null);
      } catch (err) {}
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 3000); // Alle 3 Sek aktualisieren
    return () => clearInterval(interval);
  }, []);

  if (!track) return null; // Zeigt nichts an, wenn keine Musik läuft (perfekt für OBS)

  return (
    <div className="w-screen h-screen flex items-end justify-start p-8 bg-transparent overflow-hidden selection:bg-transparent">
      {/* Nackter, stylischer Player für OBS */}
      <div className="bg-black/80 border border-white/10 p-6 rounded-2xl flex items-center gap-6 shadow-2xl backdrop-blur-md w-[450px] animate-in fade-in slide-in-from-bottom-5">
          <img src={track.albumImageUrl || "/placeholder-cover.jpg"} alt="Album Cover" className="w-24 h-24 rounded-xl shadow-lg object-cover" />
          
          <div className="flex-1 min-w-0 space-y-2">
              <h4 className="text-xl font-black text-white truncate uppercase italic tracking-tighter">{track.title}</h4>
              <p className="text-sm text-[#1DB954] font-bold truncate tracking-widest uppercase">{track.artist}</p>
              
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden mt-4">
                  <div className="bg-[#1DB954] h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(29,185,84,0.8)]" style={{ width: `${(track.progressMs / track.durationMs) * 100}%` }}></div>
              </div>
          </div>
      </div>
    </div>
  );
}
