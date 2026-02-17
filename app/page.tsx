"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Monitor, Box, Loader2, ShieldCheck, Calendar, Key, Zap, Menu, X
} from "lucide-react";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const version = "0.029488";
  const licenseType = "PRO";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    if (!username || username.length < 2) {
      setIsLive(false); return;
    }
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(data.online);
      } catch (e) { console.error("Status check failed"); }
      finally { setIsChecking(false); }
    };
    const timer = setTimeout(checkStatus, 500); 
    return () => clearTimeout(timer);
  }, [username]);

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} />;
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} />;
      default: return <ModuleTTV username={username} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR - Desktop fest, Mobile Slide-in */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6 text-white">
              <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <Box className="w-5 h-5 text-white" /> ARC<span className="text-zinc-500">TOOLS</span>
              </h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 text-sm">@</div>
              <input type="text" placeholder="TikTok User" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-md py-2.5 pl-7 pr-10 focus:outline-none focus:border-zinc-600 transition-all" />
              <div className="absolute inset-y-0 right-3 flex items-center">
                 {isChecking ? <Loader2 size={14} className="animate-spin text-zinc-600" /> : <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3.5 space-y-3">
              <div className="flex items-center justify-between font-mono tracking-tighter">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5"><ShieldCheck size={11} className="text-blue-400" /> VERSION</span>
                <span className="text-[10px] text-zinc-300">{version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5"><Key size={11} className="text-blue-400" /> LICENSE</span>
                <span className="text-[10px] text-blue-400 font-bold">{licenseType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5"><Calendar size={11} /> ABLAUFDATUM</span>
                <span className="text-[10px] text-zinc-300">{expiryDate}</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            <div>
              <h3 className="px-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Module</h3>
              <div className="space-y-1.5">
                <SidebarItem icon={<Type size={18} />} label="TTV - Text to Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Volume2 size={18} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
                <SidebarItem icon={<LayoutDashboard size={18} />} label="Widget Editor" active={activeView === "widgets"} onClick={() => {setActiveView("widgets"); setSidebarOpen(false);}} />
              </div>
            </div>
          </nav>
          
          <div className="p-4 border-t border-white/5"><SidebarItem icon={<Settings size={18} />} label="Settings" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} /></div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-500">App / <span className="text-white">{activeView}</span></div>
          </div>
          {isLive && <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-bold tracking-widest">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleTTV({ username }: { username: string }) {
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState("100");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const baseUrl = window.location.origin + "/overlay";
    const params = new URLSearchParams({ u: username, c: trigger, v: videoUrl, vol: volume, s: "0", e: "10" });
    setGeneratedLink(`${baseUrl}?${params.toString()}`);
  }, [username, trigger, videoUrl, volume]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">Konfiguration</h2>
        <p className="text-zinc-500 text-sm">Verwalte deine automatischen Video-Reaktionen.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <InputGroup label="Trigger" desc="Der Chat-Code zum Auslösen"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field" /></InputGroup>
          <InputGroup label="Audio" desc={`${volume}% Verstärkung`}><input type="range" min="0" max="500" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white" /></InputGroup>
        </div>
        <InputGroup label="Video URL" desc="Direkter Link (.mp4)"><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[120px] font-mono text-xs leading-relaxed" placeholder="https://..." /></InputGroup>
      </div>
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8">
        <label className="text-[10px] font-bold text-zinc-500 mb-4 block uppercase tracking-widest">OBS Browser Source Link</label>
        <div className="flex gap-3">
          <div className="flex-1 bg-black border border-zinc-800 rounded px-5 py-3 text-zinc-400 font-mono text-xs truncate select-all">{generatedLink}</div>
          <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-6 rounded font-bold text-xs uppercase hover:bg-zinc-200 transition-all flex items-center gap-2">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Kopiert" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all ${active ? "bg-zinc-900 text-white font-medium" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, desc, children }: any) {
  return <div className="flex flex-col gap-2.5"><label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</label>{children}<p className="text-[11px] text-zinc-600 font-medium italic">{desc}</p></div>;
}
function ModuleSettings({ expiry, version }: any) {
  return <div className="p-10"><div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800 max-w-lg"><h3 className="text-white font-medium mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> Account Status</h3><p className="text-zinc-400 text-sm">PRO Lizenz aktiv bis: {expiry}</p><p className="text-zinc-600 text-[10px] mt-2 font-mono tracking-tighter uppercase">Build: {version}</p></div></div>;
}
