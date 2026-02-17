"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Box, Loader2, Plus, Trash2, Menu, X,
  Settings, Globe, Play, CheckCircle
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [lang, setLang] = useState(searchParams.get("lang")?.toUpperCase() || "EN");

  // HIER IST DIE NEUE VERSION
  const version = "0.030032"; 

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  // Status Check Logic
  useEffect(() => {
    if (!username || username.length < 2) { setIsLive(false); return; }
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/status?u=${username}`);
        if (res.ok) {
          const data = await res.json();
          setIsLive(!!data.online);
        }
      } catch (e) { setIsLive(false); } 
    };
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [username]);

  const updateLang = (newLang: string) => {
    setLang(newLang);
    router.push(`?lang=${newLang.toLowerCase()}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full p-5 font-sans uppercase font-bold italic">
          <div className="flex items-center justify-between mb-8 text-white tracking-tight not-italic">
            <h1 className="text-base flex items-center gap-2 font-black"><Box className="w-4 h-4 text-white" /> ARC TOOLS</h1>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
          </div>
          
          <div className="mb-6 space-y-4 not-italic">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-sm">@</div>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="w-full bg-[#0c0c0e] border border-zinc-800 text-zinc-200 text-[13px] rounded-lg py-2.5 pl-8 pr-10 focus:outline-none focus:border-zinc-600 transition-all lowercase" />
              <div className="absolute inset-y-0 right-3 flex items-center justify-center w-5">
                 <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isLive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-zinc-800'}`}></div>
              </div>
            </div>
            <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500">
              <div className="flex justify-between items-center text-[10px]">
                <span>VERSION</span>
                {/* HIER MUSS 0.030032 STEHEN */}
                <span className="text-green-400 font-mono tracking-tighter text-sm">{version}</span>
              </div>
              <div className="flex justify-between items-center text-[10px]"><span>LICENSE</span><span className="text-blue-500 font-black">PRO</span></div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarItem icon={<Play size={16} />} label="Trigger List" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} />
          </nav>
        </div>
      </aside>

      <main className="flex-1 bg-[#09090b] flex flex-col min-w-0 font-bold uppercase">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 font-bold uppercase tracking-widest text-[10px]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="flex items-center gap-1.5"><span className="text-zinc-700">App /</span> <span className="text-white">{activeView}</span></div>
          </div>
          {isLive && <span className="text-green-500 flex items-center gap-2 font-black italic tracking-[2px]">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">
          {activeView === "ttv" ? <ModuleTTV username={username} baseUrl={baseUrl} isLive={isLive} /> : <div className="p-10 text-zinc-500">Settings Area</div>}
        </div>
      </main>
    </div>
  );
}

function ModuleTTV({ username, baseUrl, isLive }: any) {
  // Trigger Liste State
  const [triggers, setTriggers] = useState<any[]>([
    { id: 1, code: "777", url: "https://cdn.discordapp.com/attachments/1462540433463709815/1472988001838563361/Meme_Okay_.mp4", start: 0, end: 10 }
  ]);
  const [newCode, setNewCode] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newStart, setNewStart] = useState("0");
  const [newEnd, setNewEnd] = useState("10");

  const addTrigger = () => {
    if (!newCode || !newUrl) return;
    setTriggers([...triggers, { id: Date.now(), code: newCode, url: newUrl, start: parseInt(newStart), end: parseInt(newEnd) }]);
    setNewCode("");
    setNewUrl("");
  };

  const removeTrigger = (id: number) => {
    setTriggers(triggers.filter(t => t.id !== id));
  };

  const configString = typeof window !== 'undefined' ? btoa(JSON.stringify(triggers)) : "";
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}`;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10 uppercase italic font-sans font-bold">
      <div className="flex justify-between items-center font-black">
        <h2 className="text-xl lg:text-2xl text-white tracking-tight italic">Multi-Trigger System</h2>
        <div className="px-4 py-1.5 rounded-lg border border-green-500/20 bg-green-500/5 text-green-500 text-[10px]">NEW LIST SYSTEM ACTIVE</div>
      </div>
      
      {/* ADD NEW SECTION */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-lg">
        <h3 className="text-white text-xs font-black flex items-center gap-2 not-italic"><Plus size={14} /> ADD NEW TRIGGER</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Code (e.g. 777)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500 font-bold" />
          <input type="text" placeholder="Video URL (.mp4)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500 font-mono" />
        </div>
        <div className="flex gap-4">
           <input type="number" placeholder="Start" value={newStart} onChange={e => setNewStart(e.target.value)} className="w-24 bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none font-bold" />
           <input type="number" placeholder="End" value={newEnd} onChange={e => setNewEnd(e.target.value)} className="w-24 bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none font-bold" />
           <button onClick={addTrigger} className="flex-1 bg-white text-black font-black rounded hover:bg-zinc-200 transition-colors text-xs tracking-widest">ADD TO LIST</button>
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-3">
        {triggers.map((t, i) => (
          <div key={t.id} className="flex items-center gap-4 bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center font-mono text-zinc-500 text-[10px]">{i + 1}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3"><span className="text-green-400 font-black text-sm">{t.code}</span> <span className="text-zinc-600 text-[9px] font-mono not-italic">({t.start}s - {t.end}s)</span></div>
              <div className="text-zinc-500 text-[9px] truncate w-48 md:w-auto font-mono opacity-50">{t.url}</div>
            </div>
            <button onClick={() => removeTrigger(t.id)} className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      {/* LINK SECTION */}
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-4 not-italic font-bold shadow-xl">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">OBS Master Link</label>
        <div className="flex flex-col lg:flex-row gap-2 font-mono text-[10px]"><div className="flex-1 text-zinc-600 truncate bg-black px-4 py-4 rounded-xl border border-white/5 uppercase tracking-tighter">{link}</div><button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-12 py-4 lg:py-0 rounded-xl font-black uppercase text-xs hover:bg-zinc-200">Copy</button></div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest font-normal ${active ? "bg-[#0c0c0e] text-white font-bold border border-white/5 shadow-xl" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}

export default function Dashboard() { return <Suspense fallback={<div>Loading...</div>}><DashboardContent /></Suspense>; }
