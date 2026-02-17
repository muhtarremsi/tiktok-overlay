"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Type, Settings, LogOut, Copy, Box, Loader2, ShieldCheck, Key, Zap, Menu, X,
  Users, Volume2, Globe, CheckCircle, Lock
} from "lucide-react";

// Original TikTok Logo Komponente
const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.06 3.43-.3 6.83-1.62 10.12-1.14 2.81-3.38 5.28-6.23 6.36-3.8 1.54-8.5.7-11.4-2.27C-2.12 20.2-1.45 13.04 4.15 9.9c.96-.5 2.05-.75 3.14-.85v4.11c-.71.07-1.43.23-2.09.52-1.72.88-2.6 3.02-1.89 4.83.6 1.5 2.25 2.47 3.82 2.18 1.48-.18 2.58-1.45 2.81-2.92.08-1.57.06-3.14.07-4.71-.01-4.38-.01-8.75-.01-13.13-.01-.1-.01-.2 0-.3z"/>
  </svg>
);

// --- INTERFACES ---
interface ModuleProps { username: string; baseUrl: string; lang: string; }
interface FanClubProps { username: string; isLogged: boolean; lang: string; }
interface SettingsProps { 
  expiry: string; 
  version: string; 
  isLogged: boolean; 
  setIsLogged: (v: boolean) => void; 
  username: string; 
  lang: string; 
  updateLang: (l: string) => void; 
}

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

  const version = "0.029496";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    if (searchParams.get("logged") === "true") setIsLogged(true);
  }, [searchParams]);

  useEffect(() => {
    if (!username) return;
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
  }, [username]);

  const changeLanguage = (l: string) => {
    setLang(l);
    router.push(`?lang=${l.toLowerCase()}`);
  };

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} baseUrl={baseUrl} lang={lang} />;
      case "fanclub": return <ModuleFanClub username={username} isLogged={isLogged} lang={lang} />;
      case "sounds": return <ModuleSoundAlerts username={username} baseUrl={baseUrl} lang={lang} />;
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} isLogged={isLogged} setIsLogged={setIsLogged} username={username} lang={lang} updateLang={changeLanguage} />;
      default: return <ModuleTTV username={username} baseUrl={baseUrl} lang={lang} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans">
          <div className="p-5 border-b border-white/5 font-sans">
            <div className="flex items-center justify-between mb-5 text-white uppercase font-bold tracking-tight">
              <h1 className="text-base flex items-center gap-2 font-bold"><Box className="w-4 h-4" /> ARC TOOLS</h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
            </div>
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-2.5 flex items-center text-zinc-500 text-xs">@</div>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-500 uppercase font-medium" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600" /> : <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center justify-between"><span>VERSION</span><span className="text-zinc-300 font-normal">{version}</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2"><span>EXPIRY</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            <div>
              <h3 className="px-3 text-[9px] text-zinc-600 mb-2 font-bold uppercase tracking-widest italic">Modules</h3>
              <div className="space-y-1">
                <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
                <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => setActiveView("fanclub")} />
                <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
              </div>
            </div>
          </nav>

          <div className="p-3 border-t border-white/5 space-y-1">
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
            
            <div className="relative group">
              <button className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-zinc-500 hover:text-white transition-all uppercase font-bold tracking-widest cursor-pointer">
                <span className="flex items-center gap-3 font-normal"><Globe size={16} /> Language</span>
                <span className="text-zinc-400 font-mono text-[10px]">{lang}</span>
              </button>
              <div className="absolute bottom-full left-0 w-full bg-zinc-900 border border-zinc-800 rounded mb-1 hidden group-hover:block z-50 overflow-hidden shadow-2xl transition-all">
                {["EN", "DE", "RU"].map(l => (
                  <button key={l} onClick={() => changeLanguage(l)} className="w-full px-4 py-2 text-left hover:bg-white/5 text-[10px] uppercase font-normal">{l === "RU" ? "Russian" : l === "DE" ? "German" : "English"}</button>
                ))}
              </div>
            </div>
            
            <button onClick={() => setIsLogged(false)} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] text-red-500/60 hover:text-red-500 transition-all uppercase font-normal tracking-widest mt-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-bold uppercase tracking-widest text-[10px]">
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

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all font-normal tracking-widest ${active ? "bg-zinc-900 text-white font-bold shadow-xl border border-white/5" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}

// --- MODULES ---
function ModuleTTV({ username, baseUrl, lang }: ModuleProps) {
  const link = `${baseUrl}/overlay?u=${username}&lang=${lang.toLowerCase()}`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 font-bold uppercase italic">
      <h2 className="text-2xl text-white font-black tracking-tight">TTV Setup</h2>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-2 not-italic">
        <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-500 font-mono text-[10px] truncate">{link}</div>
        <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-8 rounded font-black text-[10px] uppercase">Copy</button>
      </div>
    </div>
  );
}

function ModuleFanClub({ username, isLogged }: FanClubProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 uppercase font-bold italic">
      <h2 className="text-2xl text-white font-black tracking-tight">Fan Club Manager</h2>
      {!isLogged ? (
        <div className="bg-zinc-900/50 border border-zinc-800 p-16 rounded-2xl text-center space-y-4 not-italic">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600"><Lock size={24} /></div>
          <p className="text-zinc-500 text-[11px] font-medium tracking-widest uppercase">Please connect in Settings.</p>
        </div>
      ) : (
        <div className="p-20 text-center text-zinc-600 italic uppercase font-black tracking-widest">Warten auf Club-Events...</div>
      )}
    </div>
  );
}

function ModuleSoundAlerts({ username, baseUrl }: ModuleProps) {
  const link = `${baseUrl}/overlay/sound?u=${username}&vol=100`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 uppercase font-bold italic">
      <h2 className="text-2xl text-white font-black tracking-tight">Sound Alerts</h2>
      <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl not-italic font-bold">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 block">OBS Source Link</label>
        <div className="flex gap-2 font-mono text-[10px]"><div className="flex-1 text-zinc-500 truncate bg-zinc-900 px-4 py-3 rounded border border-white/5">{link}</div><button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-6 rounded font-black text-[10px] uppercase">Copy</button></div>
      </div>
    </div>
  );
}

function ModuleSettings({ expiry, version, isLogged, username, lang }: SettingsProps) {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/tiktok');
      const data = await res.json();
      if (data.url) window.location.href = data.url; 
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 font-bold uppercase italic">
      <h2 className="text-2xl text-white font-black tracking-tight">System Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-italic">
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 space-y-2 font-bold uppercase">
          <h3 className="text-blue-500 text-sm font-black uppercase tracking-widest flex items-center gap-2"><ShieldCheck size={16} /> PRO License</h3>
          <p className="text-zinc-200">EXPIRY: {expiry}</p>
          <p className="text-zinc-600 text-[10px] font-mono">build: {version}</p>
        </div>
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 flex flex-col justify-between font-bold uppercase">
          <h3 className="text-white text-sm font-black uppercase italic flex items-center gap-2"><Zap size={16} className="text-yellow-500" /> TikTok Sync</h3>
          {isLogged ? <div className="p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-[10px] flex items-center justify-center gap-2 font-black uppercase tracking-widest mt-4 uppercase"><CheckCircle size={14} /> Logged as @{username}</div> : 
          <button onClick={handleLogin} disabled={loading} className="mt-4 bg-white text-black py-4 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl active:scale-95 uppercase tracking-widest">
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <TikTokIcon />} Connect TikTok
          </button>}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <Suspense fallback={<div>Loading...</div>}><DashboardContent /></Suspense>;
}
