"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Type, 
  Settings, 
  LogOut, 
  Copy, 
  Check, 
  Volume2, 
  Play,
  Monitor,
  Box,
  Loader2,
  Wifi
} from "lucide-react";

export default function Dashboard() {
  // --- STATE ---
  const [username, setUsername] = useState("");
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState("100");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  // LIVE CHECK STATES
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  // Link Generator
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin + "/overlay";
      const params = new URLSearchParams();
      if (username) params.append("u", username);
      if (trigger) params.append("c", trigger);
      if (videoUrl) params.append("v", videoUrl);
      if (volume !== "100") params.append("vol", volume);
      params.append("s", "0");
      params.append("e", "10");

      setGeneratedLink(`${baseUrl}?${params.toString()}`);
    }
  }, [username, trigger, videoUrl, volume]);

  // ECHTER LIVE CHECK (Mit Verzögerung/Debounce)
  useEffect(() => {
    // Reset bei leerem Namen
    if (!username || username.length < 2) {
      setIsLive(false);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    setIsLive(false);

    // Warte 1000ms nach dem letzten Tippen, bevor wir prüfen
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        
        setIsLive(data.online);
        if (data.online) setViewerCount(data.viewers);
      } catch (e) {
        console.error(e);
      } finally {
        setIsChecking(false);
      }
    }, 1000);

    return () => clearTimeout(timer); // Timer resetten wenn User weitertippt
  }, [username]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/10 bg-black">
        
        {/* HEADER / TIKTOK CONNECT */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
              <Box className="w-5 h-5 text-white" />
              ARC<span className="text-zinc-500">TOOLS</span>
            </h1>
          </div>

          {/* TikTok Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-zinc-500 text-sm">@</span>
            </div>
            <input
              type="text"
              placeholder="TikTok User"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-md py-2.5 pl-7 pr-10 focus:outline-none focus:border-zinc-600 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
            />
            {/* STATUS INDICATOR ICON */}
            <div className="absolute inset-y-0 right-3 flex items-center">
              {isChecking ? (
                <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
              ) : isLive ? (
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
              )}
            </div>
          </div>
          
          {/* Status Text Details */}
          <div className="mt-3 flex items-center justify-between text-[11px] font-medium border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500 uppercase tracking-wider">Status</span>
            </div>
            
            {isChecking ? (
              <span className="text-zinc-500">Prüfe...</span>
            ) : isLive ? (
              <span className="text-green-500 flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                <Wifi size={10} /> ONLINE ({viewerCount})
              </span>
            ) : (
              <span className="text-zinc-600">OFFLINE</span>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          
          {/* MODULE */}
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Module
            </h3>
            <div className="space-y-1">
              <SidebarItem 
                icon={<Type size={18} />} 
                label="TTV - Text to Video" 
                active 
              />
              <SidebarItem icon={<Volume2 size={18} />} label="Sound Alerts" />
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Widget Editor" />
            </div>
          </div>

          {/* SYSTEM */}
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              System
            </h3>
            <div className="space-y-1">
              <SidebarItem icon={<Monitor size={18} />} label="OBS Setup" />
              <SidebarItem icon={<Play size={18} />} label="Tutorials" />
            </div>
          </div>

        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Einstellungen" />
          <SidebarItem icon={<LogOut size={18} />} label="Logout" />
          <div className="mt-4 pt-4 px-3 text-[10px] text-zinc-700">
             v2.4.1 • Pro Trial
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Module</span>
            <span className="text-zinc-700">/</span>
            <span className="text-white font-medium">Text to Video Trigger</span>
          </div>
          <button className="text-xs bg-white text-black font-medium px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
            Dokumentation
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Konfiguration</h2>
              <p className="text-zinc-500 text-sm max-w-xl">
                Bestimme hier, welches Video abgespielt wird, wenn der Trigger im Chat erkannt wird.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InputGroup label="Trigger Code" desc="Der Befehl im Chat (z.B. 777)">
                  <input 
                    type="text" 
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    className="input-field" 
                  />
                </InputGroup>

                <InputGroup label="Audio Boost" desc={`Lautstärke: ${volume}%`}>
                   <input 
                    type="range" 
                    min="0" max="500" step="10"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white" 
                  />
                </InputGroup>
              </div>

              <div className="space-y-6">
                 <InputGroup label="Video URL" desc="Direkter Link zur .mp4 Datei">
                  <textarea 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="input-field min-h-[120px] resize-none font-mono text-xs leading-relaxed"
                    placeholder="https://..." 
                  />
                </InputGroup>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-xl p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  OBS Browser Source Link
                </label>
                {username && videoUrl ? (
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">
                    Ready to copy
                  </span>
                ) : (
                  <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                    Unvollständig
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <div className="flex-1 bg-black border border-zinc-800 rounded-md px-4 py-3 text-zinc-400 font-mono text-xs truncate select-all">
                  {generatedLink || "Bitte Einstellungen vervollständigen..."}
                </div>
                <button 
                  onClick={copyToClipboard}
                  disabled={!generatedLink}
                  className="bg-white hover:bg-zinc-200 text-black px-6 rounded-md font-medium text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Kopiert!" : "Kopieren"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group ${
      active 
        ? "bg-zinc-900 text-white font-medium" 
        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
    }`}>
      <span className={active ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function InputGroup({ label, desc, children }: { label: string, desc: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
      </div>
      {children}
      <p className="text-[11px] text-zinc-600">{desc}</p>
    </div>
  );
}
