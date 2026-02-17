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
  Box
} from "lucide-react";

export default function Dashboard() {
  // --- STATE ---
  const [username, setUsername] = useState("");
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState("100");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Fake "Live Status" - simuliert Verbindung, wenn User tippt
  const isLive = username.length > 2;

  // Link Generator
  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin + "/overlay";
      const params = new URLSearchParams();
      if (username) params.append("u", username);
      if (trigger) params.append("c", trigger);
      if (videoUrl) params.append("v", videoUrl);
      if (volume !== "100") params.append("vol", volume);
      
      // Standardwerte für Start/Ende
      params.append("s", "0");
      params.append("e", "10");

      setGeneratedLink(`${baseUrl}?${params.toString()}`);
    }
  }, [username, trigger, videoUrl, volume]);

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

          {/* TikTok Input im "Connect Style" */}
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
            {/* LIVE INDICATOR */}
            <div className="absolute inset-y-0 right-3 flex items-center">
              {isLive ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 live-indicator"></span>
                </div>
              ) : (
                <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
              )}
            </div>
          </div>
          
          {/* Status Text */}
          <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-wider font-medium">
            <span className="text-zinc-600">Status</span>
            <span className={isLive ? "text-green-500" : "text-zinc-600"}>
              {isLive ? "Verbunden" : "Offline"}
            </span>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          
          {/* Section: MODULE */}
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

          {/* Section: SYSTEM */}
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

        {/* FOOTER / SETTINGS */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Einstellungen" />
          <SidebarItem icon={<LogOut size={18} />} label="Logout" />
          
          <div className="mt-4 pt-4 px-3">
             <div className="text-[10px] text-zinc-700">
               v2.4.0 • Pro Trial
             </div>
          </div>
        </div>
      </aside>


      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        
        {/* Top Bar */}
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

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Intro Header */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Konfiguration</h2>
              <p className="text-zinc-500 text-sm max-w-xl">
                Bestimme hier, welches Video abgespielt wird, wenn der Trigger im Chat erkannt wird. 
                Die Lautstärke kann über 100% verstärkt werden.
              </p>
            </div>

            {/* Config Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                <InputGroup 
                  label="Trigger Code" 
                  desc="Der Befehl im Chat (z.B. 777)"
                >
                  <input 
                    type="text" 
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    className="input-field" 
                  />
                </InputGroup>

                <InputGroup 
                  label="Audio Boost" 
                  desc={`Lautstärke: ${volume}%`}
                >
                   <input 
                    type="range" 
                    min="0" 
                    max="500" 
                    step="10"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white" 
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-2">
                    <span>Mute</span>
                    <span>100%</span>
                    <span>500%</span>
                  </div>
                </InputGroup>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                 <InputGroup 
                  label="Video URL" 
                  desc="Direkter Link zur .mp4 Datei"
                >
                  <textarea 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="input-field min-h-[120px] resize-none font-mono text-xs leading-relaxed"
                    placeholder="https://..." 
                  />
                </InputGroup>
              </div>
            </div>

            {/* Output Section */}
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
              <p className="text-zinc-600 text-[11px] mt-3">
                Diesen Link in OBS als "Browser Source" einfügen. Haken bei "Audio via OBS" setzen.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

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
