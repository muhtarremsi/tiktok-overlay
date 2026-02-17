"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Play, Monitor, Box, Loader2, Wifi, Music, Palette, Sliders, 
  ShieldCheck, Calendar, Key, Zap
} from "lucide-react";

export default function Dashboard() {
  // --- GLOBAL STATE ---
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [activeView, setActiveView] = useState("ttv");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // PRO DATEN
  const version = "0.029488";
  const licenseType = "PRO";
  const expiryDate = "17.02.2025";

  // --- LIVE CHECK LOGIK ---
  useEffect(() => {
    if (!username || username.length < 2) {
      setIsLive(false);
      setIsFirstLoad(false);
      return;
    }

    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(data.online);
        if (data.online) setViewerCount(data.viewers);
      } catch (e) {
        console.error("Status check failed");
      } finally {
        setIsChecking(false);
        setIsFirstLoad(false);
      }
    };

    setIsFirstLoad(true);
    const timer = setTimeout(checkStatus, 1000); 
    return () => clearTimeout(timer);
  }, [username]);

  // --- VIEWS ---
  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} />;
      case "sounds": return <ModulePlaceholder title="Sound Alerts" icon={<Volume2 size={48} />} />;
      case "widgets": return <ModulePlaceholder title="Widget Editor" icon={<LayoutDashboard size={48} />} />;
      case "settings": return <ModuleSettings expiry={expiryDate} />;
      default: return <ModuleTTV username={username} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/10 bg-black">
        {/* Header & User Input */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-bold text-lg tracking-tight flex items-center gap-2 text-white">
              <Box className="w-5 h-5" />
              ARC<span className="text-zinc-500">TOOLS</span>
            </h1>
            {isLive && !isChecking && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-bold uppercase tracking-wider">Live</span>
            )}
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
          {isFirstLoad && username.length > 1 ? (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3 space-y-3 animate-pulse">
              <div className="h-2 w-20 bg-zinc-800 rounded"></div>
              <div className="h-2 w-full bg-zinc-800 rounded"></div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Module</h3>
            <div className="space-y-1">
              <SidebarItem icon={<Type size={18} />} label="TTV - Text to Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
              <SidebarItem icon={<Volume2 size={18} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
              <SidebarItem icon={<LayoutDashboard size={18} />} label="Widget Editor" active={activeView === "widgets"} onClick={() => setActiveView("widgets")} />
            </div>
          </div>
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">System</h3>
            <div className="space-y-1">
              <SidebarItem icon={<Monitor size={18} />} label="OBS Setup" />
              <SidebarItem icon={<Play size={18} />} label="Tutorials" />
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Einstellungen" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
          <SidebarItem icon={<LogOut size={18} />} label="Logout" />
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {renderContent()}
      </main>
    </div>
  );
}

// --- MODULE: TEXT TO VIDEO ---
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
    <>
      <Header title="Text to Video Trigger" />
      <div className="flex-1 overflow-y-auto p-8 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto space-y-10">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Konfiguration</h2>
            <p className="text-zinc-500 text-sm max-w-xl">Konfiguriere hier deinen Video-Trigger für TikTok Live.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InputGroup label="Trigger Code" desc="Chat-Befehl zum Abspielen">
                <input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field" />
              </InputGroup>
              <InputGroup label="Audio Boost" desc={`${volume}% Verstärkung`}>
                <input type="range" min="0" max="500" step="10" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white" />
              </InputGroup>
            </div>
            <div className="space-y-6">
              <InputGroup label="Video URL (.mp4)" desc="Direkter Link zum Video">
                <textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[100px] resize-none font-mono text-[11px]" placeholder="https://..." />
              </InputGroup>
            </div>
          </div>

          {/* Link Box */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 mt-8">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Browser Source URL</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-400 font-mono text-xs truncate select-all">
                {generatedLink || "Bitte User & Video angeben..."}
              </div>
              <button 
                onClick={() => { navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="bg-white text-black px-4 rounded font-bold text-xs uppercase tracking-tighter hover:bg-zinc-200 transition-all flex items-center gap-2"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Kopiert" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- HELPER COMPONENTS ---
function ModulePlaceholder({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <>
      <Header title={title} />
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
        <div className="opacity-20 mb-4">{icon}</div>
        <h3 className="text-zinc-400 font-medium">{title} Modul</h3>
        <p className="text-xs mt-1">Demnächst in der PRO Version verfügbar.</p>
      </div>
    </>
  );
}

function ModuleSettings({ expiry }: { expiry: string }) {
  return (
    <>
      <Header title="Einstellungen" />
      <div className="p-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 max-w-lg">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Account Status</h3>
          <p className="text-zinc-400 text-sm">Deine PRO Lizenz ist aktiv und läuft am <span className="text-white font-bold">{expiry}</span> ab.</p>
        </div>
      </div>
    </>
  );
}

function Header({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-white/5 flex items-center px-8 bg-black/20 backdrop-blur-md">
      <div className="text-xs font-medium uppercase tracking-widest text-zinc-500">App / <span className="text-white">{title}</span></div>
    </header>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${active ? "bg-zinc-900 text-white font-medium" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"}`}>
      <span>{icon}</span>{label}
    </button>
  );
}

function InputGroup({ label, desc, children }: { label: string, desc: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{label}</label>
      {children}
      <p className="text-[10px] text-zinc-600 font-medium italic">{desc}</p>
    </div>
  );
}
