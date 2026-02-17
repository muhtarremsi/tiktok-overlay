"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Play, Monitor, Box, Loader2, Wifi, Music, Palette, Sliders, 
  ShieldCheck, Calendar, Key, Zap, Menu, X
} from "lucide-react";

export default function Dashboard() {
  // Global State
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile Sidebar State

  // PRO DATEN
  const version = "0.029488";
  const licenseType = "PRO";
  const expiryDate = "17.02.2025";

  // Live Check Logic
  useEffect(() => {
    if (!username || username.length < 2) {
      setIsLive(false); setIsFirstLoad(false); return;
    }
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(data.online);
      } catch (e) { console.error("Status check failed"); }
      finally { setIsChecking(false); setIsFirstLoad(false); }
    };
    setIsFirstLoad(true);
    const timer = setTimeout(checkStatus, 1000); 
    return () => clearTimeout(timer);
  }, [username]);

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} />;
      case "settings": return <ModuleSettings expiry={expiryDate} />;
      default: return <ModulePlaceholder title={activeView} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans">
      
      {/* MOBILE OVERLAY (Dunkelt Hintergrund ab, wenn Sidebar offen) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-bold text-lg tracking-tight flex items-center gap-2 text-white">
                <Box className="w-5 h-5" />
                ARC<span className="text-zinc-500">TOOLS</span>
              </h1>
              <button className="lg:hidden text-zinc-500" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 text-sm">@</div>
              <input
                type="text"
                placeholder="TikTok User"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-md py-2.5 pl-7 pr-10 focus:outline-none focus:border-zinc-600 transition-all"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                 {isChecking ? <Loader2 size={14} className="animate-spin text-zinc-600" /> : <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>
            
            {/* PRO-BOX */}
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={10} className="text-blue-400" /> VERSION</span>
                <span className="text-[10px] text-zinc-300 font-mono">{version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Key size={10} className="text-blue-400" /> LICENSE</span>
                <span className="text-[10px] text-blue-400 font-bold">{licenseType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10} /> ABLAUFDATUM</span>
                <span className="text-[10px] text-zinc-300">{expiryDate}</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
            <div>
              <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Module</h3>
              <div className="space-y-1">
                <SidebarItem icon={<Type size={18} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Volume2 size={18} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-white/5">
            <SidebarItem icon={<Settings size={18} />} label="Settings" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} />
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        {/* MOBILE HEADER BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-black/20 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-500 truncate max-w-[150px] sm:max-w-none">
              App / <span className="text-white">{activeView === 'ttv' ? 'Text to Video' : activeView}</span>
            </div>
          </div>
          {isLive && (
            <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-bold uppercase">Live</span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// --- MODULE: TTV (RESIZED FOR MOBILE) ---
function ModuleTTV({ username }: { username: string }) {
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState("100");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin + "/overlay";
      const params = new URLSearchParams();
      if (username) params.append("u", username);
      if (trigger) params.append("c", trigger);
      if (videoUrl) params.append("v", videoUrl);
      if (volume !== "100") params.append("vol", volume);
      params.append("s", "0"); params.append("e", "10");
      setGeneratedLink(`${baseUrl}?${params.toString()}`);
    }
  }, [username, trigger, videoUrl, volume]);

  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Konfiguration</h2>
          <p className="text-zinc-500 text-sm">Richte deinen Video-Trigger für OBS ein.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <InputGroup label="Trigger Code" desc="Chat-Befehl">
              <input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field" />
            </InputGroup>
            <InputGroup label="Audio Boost" desc={`${volume}% Verstärkung`}>
              <input type="range" min="0" max="500" step="10" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white" />
            </InputGroup>
          </div>
          <div className="space-y-6">
            <InputGroup label="Video URL (.mp4)" desc="Direktlink">
              <textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[100px] sm:min-h-[120px] resize-none font-mono text-[11px]" placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 sm:p-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">OBS Link</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black border border-zinc-800 rounded px-3 py-3 text-zinc-400 font-mono text-[10px] sm:text-xs truncate select-all">
              {generatedLink || "Eingabe erforderlich..."}
            </div>
            <button 
              onClick={() => { navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="bg-white text-black py-2.5 sm:px-4 rounded font-bold text-xs uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Kopiert" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---
function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${active ? "bg-zinc-900 text-white font-medium shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"}`}>
      <span>{icon}</span>{label}
    </button>
  );
}

function InputGroup({ label, desc, children }: { label: string, desc: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{label}</label>
      {children}
      <p className="text-[10px] text-zinc-600 italic">{desc}</p>
    </div>
  );
}

function ModuleSettings({ expiry }: { expiry: string }) {
  return <div className="p-8"><div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 max-w-lg"><h3 className="text-white font-medium mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Account Status</h3><p className="text-zinc-400 text-sm">PRO Lizenz aktiv bis {expiry}.</p></div></div>;
}

function ModulePlaceholder({ title }: { title: string }) {
  return <div className="p-8 text-zinc-500 uppercase tracking-widest text-[10px]">{title} Modul wird geladen...</div>;
}
