"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Type, Settings, LogOut, Box, Loader2, ShieldCheck, Key, Zap, Menu, X,
  Users, Volume2, Globe, CheckCircle, Calendar, Lock
} from "lucide-react";

interface ModuleProps { username: string; baseUrl: string; isLive: boolean; }

function DashboardContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("flasche_auf_kopf");
  const [isLive, setIsLive] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [baseUrl, setBaseUrl] = useState("");

  const version = "0.030006";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (!username || username.length < 3) { setIsLive(false); return; }
    const check = async () => {
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(!!data.online);
      } catch (e) { setIsLive(false); }
    };
    check();
  }, [username]);

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
            <div className="flex justify-between items-center"><span>Version</span><span className="text-zinc-300 font-mono">{version}</span></div>
            <div className="flex justify-between items-center"><span>License</span><span className="text-blue-500 font-black">PRO</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5"><span>Ablauf</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
        </nav>
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
          <ModuleTTV username={username} baseUrl={baseUrl} isLive={isLive} />
        </div>
      </main>
    </div>
  );
}

function ModuleTTV({ username, baseUrl, isLive }: ModuleProps) {
  const [trigger, setTrigger] = useState("777");
  const [start, setStart] = useState("3");
  const [end, setEnd] = useState("6");
  const [url, setUrl] = useState("https://cdn.discordapp.com/attachments/1462540433463709815/1472988001838563361/Meme_Okay_.mp4");
  const [vol, setVol] = useState(248);

  const link = `${baseUrl}/overlay?u=${username || 'flasche_auf_kopf'}&c=${trigger}&v=${encodeURIComponent(url)}&vol=${vol}&s=${start}&e=${end}`;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 font-bold uppercase italic font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-white font-black tracking-tight italic">TTV Setup</h2>
        <div className={`px-4 py-1.5 rounded-lg border text-[10px] font-black ${isLive ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-zinc-700 border-zinc-800'}`}>
          CONNECTOR: {isLive ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="space-y-8">
          <InputGroup label="Trigger Code"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-3 text-white focus:outline-none not-italic" /></InputGroup>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Start (s)"><input type="number" value={start} onChange={(e) => setStart(e.target.value)} className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-3 text-white focus:outline-none not-italic" /></InputGroup>
            <InputGroup label="Ende (s)"><input type="number" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-3 text-white focus:outline-none not-italic" /></InputGroup>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">Audio Boost: {vol}%</label>
            <input type="range" min="0" max="500" value={vol} onChange={(e) => setVol(parseInt(e.target.value))} className="w-full accent-white h-1.5" />
          </div>
        </div>
        <InputGroup label="Video URL (.MP4)"><textarea value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-lg p-4 text-zinc-400 font-mono text-[10px] min-h-[180px] focus:outline-none not-italic" /></InputGroup>
      </div>
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-8 space-y-4 not-italic font-bold">
        <div className="flex gap-2">
          <div className="flex-1 text-zinc-600 truncate bg-black px-4 py-4 rounded-xl border border-white/5 font-mono text-[10px] uppercase">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-12 rounded-xl font-black uppercase text-xs">Copy</button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest font-normal ${active ? "bg-[#0c0c0e] text-white font-bold border border-white/5 shadow-xl" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, children }: any) { return <div className="space-y-3"><label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">{label}</label>{children}</div>; }

export default function Dashboard() { return <Suspense fallback={<div>Loading...</div>}><DashboardContent /></Suspense>; }
