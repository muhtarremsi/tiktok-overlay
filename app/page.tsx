"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Type, Settings, LogOut, Copy, Box, Loader2, ShieldCheck, Key, Zap, Menu, X,
  Users, Volume2, Globe, CheckCircle, Lock, Monitor, Play
} from "lucide-react";

// Original TikTok Logo
const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.06 3.43-.3 6.83-1.62 10.12-1.14 2.81-3.38 5.28-6.23 6.36-3.8 1.54-8.5.7-11.4-2.27C-2.12 20.2-1.45 13.04 4.15 9.9c.96-.5 2.05-.75 3.14-.85v4.11c-.71.07-1.43.23-2.09.52-1.72.88-2.6 3.02-1.89 4.83.6 1.5 2.25 2.47 3.82 2.18 1.48-.18 2.58-1.45 2.81-2.92.08-1.57.06-3.14.07-4.71-.01-4.38-.01-8.75-.01-13.13-.01-.1-.01-.2 0-.3z"/>
  </svg>
);

interface ModuleProps { username: string; baseUrl: string; lang: string; isLive: boolean; }
interface SettingsProps { expiry: string; version: string; isLogged: boolean; username: string; lang: string; updateLang: (l: string) => void; }

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [username, setUsername] = useState("flasche_auf_kopf");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [lang, setLang] = useState(searchParams.get("lang")?.toUpperCase() || "EN");

  const version = "0.029497";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    if (searchParams.get("logged") === "true") setIsLogged(true);
  }, [searchParams]);

  // Globaler Live Connector - Immer aktiv für den Usernamen
  useEffect(() => {
    if (!username || username.length < 3) return;
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(!!data.online);
      } catch (e) { setIsLive(false); }
      finally { setIsChecking(false); }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [username]);

  const changeLanguage = (l: string) => {
    setLang(l);
    router.push(`?lang=${l.toLowerCase()}`);
  };

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} baseUrl={baseUrl} lang={lang} isLive={isLive} />;
      case "fanclub": return <ModuleFanClub username={username} isLogged={isLogged} />;
      case "sounds": return <ModuleSoundAlerts username={username} baseUrl={baseUrl} />;
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} isLogged={isLogged} username={username} lang={lang} updateLang={changeLanguage} />;
      default: return <ModuleTTV username={username} baseUrl={baseUrl} lang={lang} isLive={isLive} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-5 font-sans">
          <div className="flex items-center justify-between mb-8 text-white uppercase font-bold tracking-tight">
            <h1 className="text-base flex items-center gap-2"><Box className="w-4 h-4" /> ARC TOOLS</h1>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          </div>
          
          <div className="mb-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-2.5 flex items-center text-zinc-500 text-[10px]">@</div>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-500 uppercase font-medium" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600" /> : <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>
            
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2 text-[9px] font-bold uppercase tracking-widest">
              <div className="flex items-center justify-between"><span>VERSION</span><span className="text-zinc-300 font-mono font-normal">{version}</span></div>
              <div className="flex items-center justify-between"><span>LICENSE</span><span className="text-blue-500">PRO</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2"><span>EXPIRY</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
            </div>
          </div>

          <nav className="flex-1 space-y-6">
            <div>
              <h3 className="px-3 text-[9px] text-zinc-600 mb-2 font-bold uppercase tracking-widest italic">Modules</h3>
              <div className="space-y-1">
                <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
                <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => setActiveView("fanclub")} />
                <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
              </div>
            </div>
          </nav>

          <div className="border-t border-white/5 pt-4 space-y-2">
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
            <div className="relative group px-3 py-2 text-zinc-500 flex items-center justify-between hover:text-white cursor-pointer uppercase font-bold tracking-widest transition-all">
              <span className="flex items-center gap-3 font-normal"><Globe size={16} /> Language</span>
              <span className="text-[10px] text-zinc-400">{lang}</span>
              <div className="absolute bottom-full left-0 w-full bg-zinc-900 border border-zinc-800 rounded hidden group-hover:block z-50 shadow-2xl">
                {["EN", "DE", "RU"].map(l => (
                  <button key={l} onClick={() => changeLanguage(l)} className="w-full px-4 py-2 text-left hover:bg-white/5 text-[10px] uppercase font-normal">{l}</button>
                ))}
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-red-500/60 hover:text-red-500 uppercase font-bold tracking-widest transition-all"><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 font-bold uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="text-zinc-500 font-normal italic">App / <span className="text-white not-italic">{activeView}</span></div>
          </div>
          {isLive && <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[9px] text-green-500 font-black animate-pulse">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleTTV({ username, baseUrl, lang, isLive }: ModuleProps) {
  const link = `${baseUrl}/overlay?u=${username}&lang=${lang.toLowerCase()}`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 font-bold uppercase italic">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white font-black tracking-tight">TTV Setup</h2>
        <div className={`px-3 py-1 rounded text-[10px] border ${isLive ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-zinc-600 border-zinc-800'}`}>
          CONNECTOR: {isLive ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 not-italic">
        <div className="space-y-4">
          <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">OBS Browser Source Link</label>
          <div className="flex gap-2 font-mono text-[10px]">
            <div className="flex-1 text-zinc-500 truncate bg-black px-4 py-3 rounded border border-white/5">{link}</div>
            <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-8 rounded font-black text-[10px] uppercase hover:bg-zinc-200 transition-all">Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleSettings({ expiry, version, isLogged, username, lang }: SettingsProps) {
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/tiktok');
      const data = await res.json();
      if (data.url) window.location.href = data.url; 
    } catch (e) { console.error(e); }
  };
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 font-bold uppercase italic">
      <h2 className="text-2xl text-white font-black tracking-tight">System Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-italic font-bold">
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 space-y-2">
          <h3 className="text-blue-500 text-sm font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={16} /> License: PRO</h3>
          <p className="text-zinc-200 uppercase">Expiry: {expiry}</p>
          <p className="text-zinc-600 text-[10px] font-mono">build: {version}</p>
        </div>
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <h3 className="text-white text-sm font-black uppercase italic flex items-center gap-2"><Zap size={16} className="text-yellow-500" /> TikTok Sync</h3>
          {isLogged ? <div className="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-[10px] flex items-center justify-center gap-2 font-black uppercase tracking-widest mt-4"><CheckCircle size={14} /> Logged as @{username}</div> : 
          <button onClick={handleLogin} className="mt-4 bg-white text-black py-4 rounded-lg text-[11px] font-black uppercase flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl active:scale-95 tracking-widest"><TikTokIcon /> Connect TikTok</button>}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all font-normal tracking-widest ${active ? "bg-zinc-900 text-white font-bold shadow-xl border border-white/5" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}
function ModuleFanClub({ username, isLogged }: {username:string, isLogged:boolean}) { return <div className="p-8 text-zinc-500 uppercase font-black italic">{isLogged ? `Fanclub active for @${username}` : 'Login required for stickers'}</div>; }
function ModuleSoundAlerts({ username, baseUrl }: {username:string, baseUrl:string}) { return <div className="p-8 text-zinc-500 uppercase font-black italic">Sound alerts ready for @{username}</div>; }

export default function Dashboard() {
  return <Suspense fallback={<div>Loading...</div>}><DashboardContent /></Suspense>;
}
