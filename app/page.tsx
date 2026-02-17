"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Type, Settings, LogOut, Box, Loader2, ShieldCheck, Key, Zap, Menu, X,
  Users, Volume2, Globe, CheckCircle, Calendar
} from "lucide-react";

// --- INTERFACES ---
interface ModuleProps { username: string; baseUrl: string; lang: string; isLive: boolean; }

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [baseUrl, setBaseUrl] = useState("");
  const [lang, setLang] = useState(searchParams.get("lang")?.toUpperCase() || "EN");

  const version = "0.030001";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // LIVE CONNECTOR STATUS
  useEffect(() => {
    if (!username || username.length < 3) { setIsLive(false); return; }
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

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} baseUrl={baseUrl} lang={lang} isLive={isLive} />;
      case "fanclub": return <div className="p-10 uppercase font-bold italic text-zinc-600">Fan Club Module Active</div>;
      case "sounds": return <div className="p-10 uppercase font-bold italic text-zinc-600">Sound Alerts Module Active</div>;
      case "settings": return <div className="p-10 uppercase font-bold italic text-zinc-600">Settings Module Active</div>;
      default: return <ModuleTTV username={username} baseUrl={baseUrl} lang={lang} isLive={isLive} />;
    }
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
              className="w-full bg-[#0c0c0e] border border-zinc-800 text-zinc-200 text-[13px] rounded-lg py-2.5 pl-8 pr-8 focus:outline-none focus:border-zinc-600 transition-all lowercase placeholder:capitalize" 
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
               {isChecking ? <Loader2 size={14} className="animate-spin text-zinc-600" /> : <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isLive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-zinc-800'}`}></div>}
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500">
            <div className="flex justify-between items-center"><span><ShieldCheck size={14} className="inline mr-2 text-blue-500"/> Version</span><span className="text-zinc-300">{version}</span></div>
            <div className="flex justify-between items-center"><span><Key size={14} className="inline mr-2 text-blue-500"/> License</span><span className="text-blue-500">PRO</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5"><span><Calendar size={14} className="inline mr-2"/> Ablauf</span><span className="text-zinc-300">{expiryDate}</span></div>
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
            <span className="text-white uppercase">{activeView}</span>
          </div>
          {isLive && <span className="text-green-500 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" /> LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function ModuleTTV({ username, baseUrl, lang, isLive }: ModuleProps) {
  const link = `${baseUrl}/overlay?u=${username || 'username'}&lang=${lang.toLowerCase()}`;
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 font-bold uppercase italic">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white font-black tracking-tight">TTV Setup</h2>
        <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-black ${isLive ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-zinc-700 border-zinc-800'}`}>
          CONNECTOR: {isLive ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-8 space-y-4 not-italic">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">OBS Browser Source Link</label>
        <div className="flex gap-2 font-mono text-[10px]">
          <div className="flex-1 text-zinc-500 truncate bg-black px-4 py-3 rounded border border-white/5">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-8 rounded font-black uppercase hover:bg-zinc-200">Copy</button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest ${active ? "bg-[#0c0c0e] text-white font-bold border border-white/5 shadow-xl" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}

export default function Dashboard() {
  return <Suspense fallback={<div>Loading...</div>}><DashboardContent /></Suspense>;
}
