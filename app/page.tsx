"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Monitor, Box, Loader2, ShieldCheck, Calendar, Key, Zap, Menu, X,
  Users, Star, Smile, Heart, Play, Music, Wifi, Clock, Lock, CheckCircle, Globe
} from "lucide-react";

interface ModuleProps { username: string; baseUrl: string; }
interface FanClubProps { username: string; isLogged: boolean; }
interface SettingsProps { 
  expiry: string; version: string; isLogged: boolean; 
  setIsLogged: (v: boolean) => void; username: string; 
}

export default function Dashboard() {
  const [username, setUsername] = useState("flasche_auf_kopf");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [lang, setLang] = useState("EN");

  const version = "0.029490";
  const expiryDate = "17.02.2025";

  useEffect(() => { setBaseUrl(window.location.origin); }, []);

  useEffect(() => {
    if (!username || username.length < 2) { setIsLive(false); return; }
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(!!data.online);
      } catch (e) { setIsLive(false); }
      finally { setIsChecking(false); }
    };
    const interval = setInterval(checkStatus, 15000);
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
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans">
          <div className="p-5 border-b border-white/5 font-sans">
            <div className="flex items-center justify-between mb-5 text-white">
              <h1 className="text-base flex items-center gap-2 font-bold uppercase tracking-tight"><Box className="w-4 h-4 text-white" /> ARC TOOLS</h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-2.5 flex items-center text-zinc-500 text-xs font-bold">@</div>
              <input type="text" placeholder="TIKTOK USER" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-500 font-medium uppercase tracking-widest" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600" /> : <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isLive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2.5 text-[10px] font-bold uppercase">
              <div className="flex items-center justify-between"><span>VERSION</span><span className="text-zinc-300 font-mono font-normal">{version}</span></div>
              <div className="flex items-center justify-between"><span>LICENSE</span><span className="text-blue-500 font-black">PRO</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2"><span>ABLAUF</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            <div>
              <h3 className="px-3 text-[9px] text-zinc-600 mb-2 font-bold uppercase tracking-widest">Modules</h3>
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

          <div className="p-3 border-t border-white/5 space-y-1">
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
            <div className="relative group">
              <button className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-zinc-500 hover:text-white transition-all uppercase font-bold tracking-widest">
                <span className="flex items-center gap-3"><Globe size={16} /> Language</span>
                <span className="text-zinc-400 font-mono">{lang}</span>
              </button>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[11px] text-red-500/60 hover:text-red-500 transition-all uppercase font-bold tracking-widest mt-2"><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-sans font-bold uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="text-zinc-500">App / <span className="text-white">{activeView}</span></div>
          </div>
          {isLive && <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-500 font-black">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleSettings({ expiry, version, isLogged, setIsLogged, username }: SettingsProps) {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/tiktok');
      const data = await res.json();
      if (data.url) window.location.href = data.url; 
    } catch (e) { console.error("Login failed"); }
    finally { setLoading(false); }
  };
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 font-bold uppercase">
      <h2 className="text-2xl text-white tracking-tight italic font-black">System Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 space-y-4 shadow-2xl">
          <h3 className="text-blue-500 text-sm flex items-center gap-2 uppercase font-black"><ShieldCheck size={18} /> PRO License: Active</h3>
          <p className="text-zinc-200 text-sm font-bold uppercase">Ablauf: {expiry}</p>
          <p className="text-zinc-600 text-[10px] font-mono lowercase">build: {version}</p>
        </div>
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 flex flex-col justify-between shadow-2xl">
          <h3 className="text-white text-sm flex items-center gap-2 uppercase font-black"><Zap size={18} className="text-yellow-500" /> TikTok Sync</h3>
          {isLogged ? <div className="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-[10px] flex items-center justify-center gap-2 font-black uppercase"><CheckCircle size={14} /> Logged in as @{username}</div> : 
          <button onClick={handleLogin} className="mt-4 w-full bg-white text-black py-3 rounded-lg text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-200 uppercase font-black">{loading ? <Loader2 className="animate-spin" /> : <Lock size={14} />} Connect TikTok</button>}
        </div>
      </div>
    </div>
  );
}

function ModuleFanClub({ isLogged }: FanClubProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 font-bold uppercase font-sans">
      <h2 className="text-2xl text-white tracking-tight italic font-black">Fan Club Manager</h2>
      {!isLogged ? (
        <div className="bg-zinc-900/50 border border-zinc-800 p-16 rounded-2xl text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600 shadow-inner"><Lock size={24} /></div>
          <p className="text-zinc-500 text-sm italic font-bold">Please connect your account in Settings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-20 text-center text-zinc-600 font-black italic">Waiting for club events...</div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Team Stickers</h3>
            <div className="grid grid-cols-2 gap-3">
              {["🦖", "��", "🌀", "🔫"].map((icon, i) => (
                <div key={i} className="aspect-square bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5 hover:border-blue-500 transition-all cursor-pointer shadow-lg group">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] transition-all uppercase tracking-widest ${active ? "bg-zinc-900 text-white font-bold shadow-xl border border-white/5" : "text-zinc-500 hover:bg-zinc-900/50"}`}><span>{icon}</span>{label}</button>;
}

function ModuleTTV({ username, baseUrl }: ModuleProps) {
  const [trigger, setTrigger] = useState("777");
  const link = `${baseUrl}/overlay?u=${username}&c=${trigger}&vol=100&s=0&e=10`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 uppercase font-bold font-sans">
      <h2 className="text-2xl text-white italic font-black">TTV Setup</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-2 uppercase italic font-bold">
        <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-500 font-mono text-[10px] lowercase truncate tracking-tighter">{link}</div>
        <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-8 rounded font-black text-[10px] uppercase">Copy</button>
      </div>
    </div>
  );
}
function ModuleSoundAlerts() { return null; }
