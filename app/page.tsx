"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Monitor, Box, Loader2, ShieldCheck, Calendar, Key, Zap, Menu, X,
  Users, Star, Smile, Heart, Play, Music, Wifi, Clock, Lock, CheckCircle, Globe
} from "lucide-react";

// --- INTERFACES ---
interface ModuleProps { username: string; baseUrl: string; }
interface FanClubProps { username: string; isLogged: boolean; }
interface SettingsProps { 
  expiry: string; 
  version: string; 
  isLogged: boolean; 
  setIsLogged: (v: boolean) => void; 
  username: string; 
  lang: string; 
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("flasche_auf_kopf");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [lang, setLang] = useState("EN");

  const version = "0.029493";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    if (searchParams.get("logged") === "true") setIsLogged(true);
  }, [searchParams]);

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
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} isLogged={isLogged} setIsLogged={setIsLogged} username={username} lang={lang} />;
      default: return <ModuleTTV username={username} baseUrl={baseUrl} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-5 text-white uppercase font-bold tracking-tight">
              <h1 className="text-base flex items-center gap-2"><Box className="w-4 h-4" /> ARC TOOLS</h1>
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
              <div className="flex items-center justify-between"><span>LICENSE</span><span className="text-blue-500">PRO</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2"><span>EXPIRY</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            <div>
              <h3 className="px-3 text-[9px] text-zinc-600 mb-2 font-bold uppercase">Modules</h3>
              <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
              <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => setActiveView("fanclub")} />
              <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
            </div>
          </nav>

          <div className="p-3 border-t border-white/5 space-y-1">
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
            <div className="relative group">
              <button className="w-full flex items-center justify-between px-3 py-2 text-[11px] text-zinc-500 hover:text-white transition-all uppercase tracking-widest">
                <span className="flex items-center gap-3"><Globe size={16} /> Language</span>
                <span className="text-zinc-400">{lang}</span>
              </button>
              <div className="absolute bottom-full left-0 w-full bg-zinc-900 border border-zinc-800 rounded mb-1 hidden group-hover:block z-50 overflow-hidden">
                {["EN", "DE", "RU"].map(l => (
                  <button key={l} onClick={() => setLang(l)} className="w-full px-4 py-2 text-left hover:bg-white/5 text-[10px] uppercase font-normal">{l}</button>
                ))}
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-[11px] text-red-500/60 hover:text-red-500 transition-all uppercase font-normal tracking-widest"><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-bold uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="text-zinc-500 font-normal">App / <span className="text-white">{activeView}</span></div>
          </div>
          {isLive && <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[9px] text-green-500">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

// --- COMPONENTS WITH PROPS ---
function ModuleTTV({ username, baseUrl }: ModuleProps) {
  const [trigger, setTrigger] = useState("777");
  const link = `${baseUrl}/overlay?u=${username}&c=${trigger}&vol=100&s=0&e=10`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 font-bold uppercase">
      <h2 className="text-2xl text-white italic font-black">TTV Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup label="Trigger Code"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field text-blue-500" /></InputGroup>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-2">
        <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-500 font-mono text-[10px] truncate">{link}</div>
        <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-8 rounded font-black text-[10px] uppercase">Copy</button>
      </div>
    </div>
  );
}

function ModuleFanClub({ username, isLogged }: FanClubProps) {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 uppercase font-bold">
      <h2 className="text-2xl text-white italic font-black">Fan Club Manager</h2>
      {!isLogged ? (
        <div className="bg-zinc-900/50 border border-zinc-800 p-16 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-600"><Lock size={24} /></div>
          <p className="text-zinc-500 text-sm">Please connect your account in Settings.</p>
        </div>
      ) : (
        <div className="p-20 text-center text-zinc-600 italic">Waiting for events from @{username}...</div>
      )}
    </div>
  );
}

function ModuleSoundAlerts({ username, baseUrl }: ModuleProps) {
  const link = `${baseUrl}/overlay/sound?u=${username}&vol=100`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 uppercase font-bold">
      <h2 className="text-2xl text-white italic font-black">Sound Alerts</h2>
      <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl">
        <label className="text-[10px] text-zinc-500 font-black uppercase mb-4 block">OBS Browser Link</label>
        <div className="flex gap-2">
          <div className="flex-1 text-zinc-500 truncate bg-zinc-900 px-4 py-3 rounded border border-white/5 font-mono text-[10px]">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-6 rounded font-black text-[10px] uppercase">Copy</button>
        </div>
      </div>
    </div>
  );
}

function ModuleSettings({ expiry, version, isLogged, username }: SettingsProps) {
  return (
    <div className="p-10 max-w-5xl mx-auto space-y-8 font-bold uppercase">
      <h2 className="text-2xl text-white italic font-black">System Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 space-y-2">
          <h3 className="text-blue-500 text-sm font-black uppercase">PRO License</h3>
          <p className="text-zinc-200">EXPIRY: {expiry}</p>
          <p className="text-zinc-600 text-[10px]">build: {version}</p>
        </div>
        <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <h3 className="text-white text-sm font-black uppercase italic">TikTok Sync</h3>
          {isLogged ? <div className="text-green-500 text-[10px] mt-4 uppercase">Connected as @{username}</div> : 
          <button className="mt-4 bg-white text-black py-3 rounded-lg text-[10px] font-black uppercase">Connect TikTok</button>}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all font-normal ${active ? "bg-zinc-900 text-white font-bold" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, children }: any) {
  return <div className="flex flex-col gap-2 font-bold uppercase"><label className="text-[9px] text-zinc-500 tracking-widest">{label}</label>{children}</div>;
}

export default function Dashboard() {
  return <Suspense fallback={<div>Loading...</div>}><DashboardContent /></Suspense>;
}
