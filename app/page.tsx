"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Type, Settings, Box, Loader2, Plus, Trash2, X,
  Volume2, Globe, LogIn, CheckCircle2
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [activeView, setActiveView] = useState("ttv");
  const [baseUrl, setBaseUrl] = useState("");
  const version = "0.030041";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const userFromUrl = searchParams.get("u");
    if (userFromUrl) setUsername(userFromUrl);
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col p-5 font-sans uppercase font-bold italic">
        <div className="flex items-center mb-8 text-white not-italic font-black tracking-tight">
          <h1 className="text-base flex items-center gap-2"><Box className="w-4 h-4" /> ARC TOOLS</h1>
        </div>
        
        <div className="mb-8 space-y-4 not-italic">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-sm">@</div>
            <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="w-full bg-[#0c0c0e] border border-zinc-800 text-zinc-200 text-[13px] rounded-lg py-2.5 pl-8 pr-10 focus:outline-none transition-all lowercase" />
          </div>
          <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500">
            <div className="flex justify-between items-center text-[10px]"><span>VERSION</span><span className="text-zinc-300 font-mono">{version}</span></div>
            <div className="flex justify-between items-center text-[10px]"><span>LICENSE</span><span className="text-blue-500 font-black">PRO</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]"><span>ABLAUF</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - VIDEO" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
          <SidebarItem icon={<Volume2 size={16} />} label="SOUND ALERTS" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
        </nav>

        <div className="flex-1"></div>

        <div className="pt-4 space-y-2 border-t border-white/5 not-italic">
           <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
           <div className="flex items-center justify-between px-3 py-2.5 text-zinc-500 group cursor-pointer uppercase font-bold tracking-widest">
              <div className="flex items-center gap-3"><Globe size={16} /><span>LANGUAGE</span></div>
              <span className="text-[10px] font-mono">EN</span>
           </div>
        </div>
      </aside>

      <main className="flex-1 bg-[#09090b] flex flex-col min-w-0 font-bold uppercase">
        <header className="h-14 border-b border-white/5 flex items-center px-6 bg-black/20 tracking-widest text-[10px]">
          <span className="text-zinc-700">App /</span> <span className="ml-1 text-white">{activeView}</span>
        </header>
        <div className="flex-1 overflow-y-auto">
          {activeView === "ttv" ? <ModuleTTV username={username} baseUrl={baseUrl} /> : <ModuleSettings username={username} />}
        </div>
      </main>
    </div>
  );
}

function ModuleSettings({ username }: any) {
  const handleLogin = () => window.location.href = "/api/auth/login";
  return (
    <div className="p-10 max-w-2xl space-y-8 uppercase italic font-bold">
      <h2 className="text-2xl text-white">General Settings</h2>
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl not-italic text-center">
        {username ? (
          <div className="text-green-500 font-bold flex flex-col items-center gap-2">
            <CheckCircle2 size={32} />
            <span className="uppercase text-xs tracking-widest">TikTok Account Connected: {username}</span>
          </div>
        ) : (
          <button onClick={handleLogin} className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-black hover:bg-zinc-200 transition-all uppercase text-xs">
            <LogIn size={18} /> Connect with TikTok
          </button>
        )}
      </div>
    </div>
  );
}

function ModuleTTV({ username, baseUrl }: any) {
  const [triggers, setTriggers] = useState<any[]>([{ id: 1, code: "777", url: "https://cdn.discordapp.com/attachments/1462540433463709815/1472988001838563361/Meme_Okay_.mp4", start: 0, end: 10 }]);
  const [newCode, setNewCode] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const configString = typeof window !== 'undefined' ? btoa(JSON.stringify(triggers)) : "";
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}`;

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-10 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-lg">
        <h3 className="text-white text-xs font-black flex items-center gap-2 not-italic"><Plus size={14} /> NEW TRIGGER</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Trigger Code (e.g. 777)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none" />
          <input type="text" placeholder="Video URL (.mp4)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none font-mono" />
        </div>
        <button onClick={() => {if(newCode && newUrl) setTriggers([...triggers, {id: Date.now(), code: newCode, url: newUrl, start: 0, end: 10}])}} className="w-full bg-white text-black font-black py-3 rounded-lg text-xs tracking-widest">ADD TO LIST</button>
      </div>

      <div className="space-y-3">
        {triggers.map((t) => (
          <div key={t.id} className="flex items-center gap-4 bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl">
            <span className="text-green-400 font-black">{t.code}</span>
            <span className="flex-1 text-zinc-500 text-[9px] truncate opacity-50 font-mono italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter(x => x.id !== t.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-8 space-y-4 not-italic font-bold shadow-xl">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">OBS Master Link</label>
        <div className="flex gap-2 font-mono text-[10px]">
          <div className="flex-1 text-zinc-600 truncate bg-black px-4 py-4 rounded-xl border border-white/5 uppercase tracking-tighter">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-12 rounded-xl font-black uppercase text-xs hover:bg-zinc-200">Copy</button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold ${active ? "bg-[#0c0c0e] text-white border border-white/5" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}

export default function Dashboard() { return <Suspense fallback={null}><DashboardContent /></Suspense>; }
