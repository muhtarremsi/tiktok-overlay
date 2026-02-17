"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Type, Settings, LogOut, Box, Loader2, ShieldCheck, Key, Zap, Menu, X,
  Users, Volume2, Globe, CheckCircle, Calendar, Lock
} from "lucide-react";

// --- TIKTOK LOGO (BLACK) ---
const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="black" className="mr-2">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.06 3.43-.3 6.83-1.62 10.12-1.14 2.81-3.38 5.28-6.23 6.36-3.8 1.54-8.5.7-11.4-2.27C-2.12 20.2-1.45 13.04 4.15 9.9c.96-.5 2.05-.75 3.14-.85v4.11c-.71.07-1.43.23-2.09.52-1.72.88-2.6 3.02-1.89 4.83.6 1.5 2.25 2.47 3.82 2.18 1.48-.18 2.58-1.45 2.81-2.92.08-1.57.06-3.14.07-4.71-.01-4.38-.01-8.75-.01-13.13-.01-.1-.01-.2 0-.3z"/>
  </svg>
);

interface ModuleProps { username: string; baseUrl: string; lang: string; isLive: boolean; }
interface SettingsProps { expiry: string; version: string; isLogged: boolean; username: string; handleLogin: () => void; loading: boolean; }

function DashboardContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [baseUrl, setBaseUrl] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const lang = searchParams.get("lang")?.toUpperCase() || "EN";

  const version = "0.030003";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    if (searchParams.get("logged") === "true") setIsLogged(true);
  }, [searchParams]);

  useEffect(() => {
    if (!username || username.length < 3) { setIsLive(false); return; }
    const check = async () => {
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(!!data.online);
      } catch (e) { setIsLive(false); }
    };
    const interval = setInterval(check, 30000);
    check();
    return () => clearInterval(interval);
  }, [username]);

  const handleTiktokLogin = async () => {
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/tiktok');
      const data = await res.json();
      if (data.url) window.location.href = data.url; 
    } catch (e) { console.error(e); }
    finally { setLoginLoading(false); }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col p-5">
        <div className="flex items-center gap-2 mb-8 text-white uppercase font-bold tracking-tight">
          <Box className="w-4 h-4" /> ARC TOOLS
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-sm">@</div>
            <input 
              type="text" 
              placeholder="TikTok User" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.toLowerCase())} 
              className="w-full bg-[#0c0c0e] border border-zinc-800 text-zinc-200 text-[13px] rounded-lg py-2.5 pl-8 focus:outline-none focus:border-zinc-600 transition-all lowercase" 
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
               <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isLive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-zinc-800'}`}></div>
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500">
            <div className="flex justify-between items-center"><span><ShieldCheck size={14} className="inline mr-2 text-blue-500"/> Version</span><span className="text-zinc-300 font-mono">{version}</span></div>
            <div className="flex justify-between items-center"><span><Key size={14} className="inline mr-2 text-blue-500"/> License</span><span className="text-blue-500">PRO</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5"><span><Calendar size={14} className="inline mr-2"/> Ablaufdatum</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
          <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => setActiveView("fanclub")} />
          <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
        </nav>

        <div className="border-t border-white/5 pt-4">
          <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
        </div>
      </aside>

      <main className="flex-1 bg-[#09090b] flex flex-col">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 font-bold uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-600">App /</span> 
            <span className="text-white">{activeView}</span>
          </div>
          {isLive && <span className="text-green-500 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" /> LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">
          {activeView === "settings" ? <ModuleSettings expiry={expiryDate} version={version} isLogged={isLogged} username={username} handleLogin={handleTiktokLogin} loading={loginLoading} /> : 
           activeView === "ttv" ? <ModuleTTV username={username} baseUrl={baseUrl} lang={lang} isLive={isLive} /> : 
           <div className="p-20 text-center text-zinc-800 font-black uppercase tracking-widest italic">Select Module</div>}
        </div>
      </main>
    </div>
  );
}

function ModuleSettings({ expiry, version, isLogged, username, handleLogin, loading }: SettingsProps) {
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-10 uppercase font-bold font-sans">
      <h2 className="text-2xl text-white font-black tracking-tight italic">System Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-italic">
        <div className="bg-[#0c0c0e] p-8 rounded-2xl border border-zinc-800 space-y-4">
          <h3 className="text-blue-500 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={16} /> LICENSE: PRO
          </h3>
          <div className="space-y-1">
            <p className="text-zinc-200 text-xs font-bold uppercase">EXPIRY: {expiry}</p>
            <p className="text-zinc-700 text-[9px] font-mono">BUILD: {version}</p>
          </div>
        </div>
        <div className="bg-[#0c0c0e] p-8 rounded-2xl border border-zinc-800 flex flex-col justify-between">
          <h3 className="text-white text-[11px] font-black uppercase italic flex items-center gap-2 tracking-widest">
            <Zap size={16} className="text-yellow-500" /> TIKTOK SYNC
          </h3>
          {isLogged ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-[10px] flex items-center justify-center gap-2 font-black mt-6 uppercase tracking-widest">
              <CheckCircle size={14} /> LOGGED AS @{username}
            </div>
          ) : (
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="mt-6 w-full bg-white text-black py-4 rounded-xl text-[11px] font-black uppercase flex items-center justify-center hover:bg-zinc-200 transition-all active:scale-95 tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={14} /> : <TikTokIcon />}
              CONNECT TIKTOK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ModuleTTV({ username, baseUrl, lang, isLive }: ModuleProps) {
  const link = `${baseUrl}/overlay?u=${username || 'username'}&lang=${lang.toLowerCase()}`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 font-bold uppercase italic font-sans">
      <div className="flex items-center justify-between font-black">
        <h2 className="text-2xl text-white tracking-tight">TTV Setup</h2>
        <div className={`px-4 py-1.5 rounded-lg border text-[10px] ${isLive ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-zinc-700 border-zinc-800'}`}>
          CONNECTOR: {isLive ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-8 space-y-4 not-italic">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">OBS Browser Link</label>
        <div className="flex gap-2 font-mono text-[10px]">
          <div className="flex-1 text-zinc-500 truncate bg-black px-4 py-3 rounded border border-white/5">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-8 rounded font-black uppercase hover:bg-zinc-200 transition-all">Copy</button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest font-normal ${active ? "bg-[#0c0c0e] text-white font-bold border border-white/5" : "text-zinc-500 hover:text-white"}`}
    >
      <span>{icon}</span>{label}
    </button>
  );
}

export default function Dashboard() {
  return <Suspense fallback={<div>Loading...</div>}><DashboardContent /></Suspense>;
}
