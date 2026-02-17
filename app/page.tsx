"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Monitor, Box, Loader2, ShieldCheck, Calendar, Key, Zap, Menu, X,
  Users, Star, Smile, Heart, Play, Music, Wifi, Clock, Lock, CheckCircle
} from "lucide-react";

interface ModuleProps { username: string; baseUrl: string; }
interface FanClubProps { username: string; isLogged: boolean; }
interface SettingsProps { 
  expiry: string; version: string; isLogged: boolean; 
  setIsLogged: (v: boolean) => void; username: string; 
}

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const version = "0.029488";
  const expiryDate = "17.02.2025";

  useEffect(() => { setBaseUrl(window.location.origin); }, []);

  useEffect(() => {
    if (!username || username.length < 2) { setIsLive(false); return; }
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(data.online);
      } catch (e) { console.error("Status check failed"); }
      finally { setIsChecking(false); }
    };
    const interval = setInterval(checkStatus, 10000);
    checkStatus();
    return () => clearInterval(interval);
  }, [username]);

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} baseUrl={baseUrl} />;
      case "fanclub": return <ModuleFanClub username={username} isLogged={isLogged} />;
      case "sounds": return <ModuleSoundAlerts username={username} baseUrl={baseUrl} />;
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} isLogged={isLogged} setIsLogged={setIsLogged} username={username} />;
      default: return <ModuleTTV username={username} baseUrl={baseUrl} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-5 text-white">
              <h1 className="text-base flex items-center gap-2 font-bold uppercase tracking-tight">
                <Box className="w-4 h-4 text-white" /> ARC TOOLS
              </h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-2.5 flex items-center text-zinc-500 text-xs">@</div>
              <input type="text" placeholder="TIKTOK USER" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-500 font-medium uppercase" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600" /> : <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2.5 text-[10px] font-bold uppercase">
              <div className="flex items-center justify-between"><span>VERSION</span><span className="text-zinc-300 font-mono font-normal">{version}</span></div>
              <div className="flex items-center justify-between"><span>LICENSE</span><span className="text-blue-500">PRO</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2"><span>ABLAUF</span><span className="text-zinc-300">{expiryDate}</span></div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            <div>
              <h3 className="px-3 text-[9px] text-zinc-600 mb-2 font-bold uppercase tracking-widest">Module</h3>
              <div className="space-y-1">
                <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
                <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => setActiveView("fanclub")} />
                <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
              </div>
            </div>
            <div>
              <h3 className="px-3 text-[9px] text-zinc-600 mb-2 font-bold uppercase tracking-widest">System</h3>
              <div className="space-y-1">
                <SidebarItem icon={<Monitor size={16} />} label="OBS Setup" active={false} />
                <SidebarItem icon={<Play size={16} />} label="Tutorials" active={false} />
              </div>
            </div>
          </nav>

          <div className="p-3 border-t border-white/5">
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-sans">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="text-zinc-500">App / <span className="text-white">{activeView}</span></div>
          </div>
          {isLive && <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[9px] text-green-500 font-bold">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleSettings({ expiry, version, isLogged, setIsLogged, username }: SettingsProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const performLogin = () => {
    setLoading(true);
    setTimeout(() => { setIsLogged(true); setShowLogin(false); setLoading(false); }, 2000);
  };

  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 uppercase font-bold">
      <h2 className="text-2xl text-white tracking-tight">System Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 space-y-4">
          <h3 className="text-blue-500 text-sm flex items-center gap-2"><ShieldCheck size={18} /> PRO License: Active</h3>
          <div className="space-y-1"><p className="text-zinc-200 text-sm">Ablauf: {expiry}</p><p className="text-zinc-600 text-[10px]">Build: {version}</p></div>
        </div>
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <h3 className="text-white text-sm flex items-center gap-2"><Zap size={18} className="text-yellow-500" /> TikTok Sync</h3>
          {isLogged ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-[10px] flex items-center justify-center gap-2 mt-4">
              <CheckCircle size={14} /> Angemeldet als @{username}
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} disabled={!username} className="mt-4 w-full bg-white text-black py-3 rounded-lg text-[10px] flex items-center justify-center gap-2 disabled:opacity-30 uppercase font-black">
              <Lock size={14} /> Login mit TikTok
            </button>
          )}
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-8 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto text-blue-500"><Lock size={28} /></div>
            <div><h3 className="text-white text-lg">TikTok Verifizierung</h3><p className="text-zinc-500 text-xs normal-case mt-1">Bestätige den Zugriff für @{username}</p></div>
            <div className="bg-black border border-zinc-800 py-4 rounded-xl text-2xl font-black tracking-[8px] text-blue-400">ARC-77</div>
            <button onClick={performLogin} className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : "Jetzt Bestätigen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleFanClub({ username, isLogged }: FanClubProps) {
  // Beispiel-URLs für deine individuellen Sticker
  const teamStickers = [
    { name: "Dino", icon: "🦖" },
    { name: "Zombie", icon: "🧟" },
    { name: "Pack-a-Punch", icon: "🌀" },
    { name: "Juggernog", icon: "🥤" },
    { name: "Raygun", icon: "🔫" },
    { name: "SpeedCola", icon: "🔋" }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 uppercase font-bold">
      <h2 className="text-2xl text-white tracking-tight">Fan Club Manager</h2>
      {!isLogged ? (
        <div className="bg-zinc-900/50 border border-zinc-800 p-16 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600"><Lock size={24} /></div>
          <p className="text-zinc-500 text-sm italic">Synchronisation in den Settings starten.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-20 text-center text-zinc-600 font-black italic">Warten auf Club-Events...</div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
            <h3 className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Deine Team Sticker</h3>
            <div className="grid grid-cols-3 gap-3">
              {teamStickers.map((s, i) => (
                <div key={i} className="aspect-square bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5 hover:border-blue-500 transition-all cursor-pointer shadow-lg group">
                  <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-zinc-600 text-center italic">Aktive Team-Sticker von @{username}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleSoundAlerts({ username, baseUrl }: ModuleProps) {
  const [vol, setVol] = useState("100");
  const [copied, setCopied] = useState(false);
  const link = `${baseUrl}/overlay/sound?u=${username}&vol=${vol}`;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 uppercase font-bold">
      <h2 className="text-2xl text-white tracking-tight">Sound Alerts Manager</h2>
      <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl space-y-6">
        <div className="max-w-xs space-y-3">
          <label className="text-[10px] text-zinc-400 uppercase">Lautstärke: {vol}%</label>
          <input type="range" min="0" max="500" value={vol} onChange={(e) => setVol(e.target.value)} className="w-full accent-white h-1.5" />
        </div>
        <div className="bg-black border border-zinc-800 rounded-xl p-6 space-y-4">
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">OBS Link</label>
          <div className="flex gap-2">
            <div className="flex-1 text-zinc-500 truncate bg-zinc-900 px-4 py-3 rounded border border-white/5 font-mono text-[10px] lowercase">{link}</div>
            <button onClick={() => {navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-8 rounded font-black text-[10px] uppercase">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleTTV({ username, baseUrl }: ModuleProps) {
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [vol, setVol] = useState("100");
  const [copied, setCopied] = useState(false);
  const link = `${baseUrl}/overlay?u=${username}&c=${trigger}&v=${videoUrl}&vol=${vol}&s=0&e=10`;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 uppercase font-bold">
      <h2 className="text-2xl text-white tracking-tight">TTV Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputGroup label="Trigger Code"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field text-blue-500 font-bold uppercase" /></InputGroup>
          <InputGroup label="Audio Boost"><input type="range" min="0" max="500" value={vol} onChange={(e) => setVol(e.target.value)} className="w-full accent-white h-1.5" /></InputGroup>
        </div>
        <InputGroup label="Video URL"><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[150px] font-mono text-[10px] normal-case" /></InputGroup>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-2">
        <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-500 font-mono text-[10px] lowercase truncate">{link}</div>
        <button onClick={() => {navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-8 rounded font-black text-[10px] uppercase">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] transition-all font-medium uppercase tracking-widest ${active ? "bg-zinc-900 text-white shadow-lg border border-white/5" : "text-zinc-500 hover:bg-zinc-900/50"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, children }: any) {
  return <div className="flex flex-col gap-2 font-bold uppercase"><label className="text-[9px] text-zinc-500 tracking-widest">{label}</label>{children}</div>;
}
