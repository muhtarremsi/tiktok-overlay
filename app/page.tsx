"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Type, Settings, Box, Plus, Trash2, X, Menu,
  Volume2, Globe, LogIn, CheckCircle2, Wifi, Loader2, AlertCircle, Radio, Music, Info
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  
  const [targetUser, setTargetUser] = useState(""); 
  const [authUser, setAuthUser] = useState("");     
  
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  
  // Neuer Status 'too_short' hinzugefügt
  const [status, setStatus] = useState<'idle' | 'checking' | 'online' | 'offline' | 'too_short'>('idle');
  
  const [baseUrl, setBaseUrl] = useState("");
  const version = "0.030058";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const userFromUrl = searchParams.get("u");
    const viewFromUrl = searchParams.get("view");
    
    if (userFromUrl) {
      setAuthUser(userFromUrl);
      if (!targetUser) {
         setTargetUser(userFromUrl);
         checkUserStatus(userFromUrl);
      }
    }
    
    if (viewFromUrl) setActiveView(viewFromUrl);
  }, [searchParams]);

  const checkUserStatus = async (userToCheck: string) => {
    setStatus('checking'); 
    try {
      const res = await fetch(`/api/status?u=${userToCheck}`);
      if (res.ok) {
        setStatus('online'); 
      } else {
        setStatus('offline'); 
      }
    } catch (e) {
      setStatus('offline');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!targetUser) {
        setStatus('idle');
      } else if (targetUser.length < 3) {
        // FIX: Wenn Text da ist, aber zu kurz -> Status 'too_short'
        setStatus('too_short');
      } else {
        checkUserStatus(targetUser);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [targetUser]);

  const handleTargetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setTargetUser(val);
    
    // Logik für sofortiges Feedback während des Tippens
    if (val.length === 0) {
      setStatus('idle');
    } else if (val.length < 3) {
      // Wenn zu kurz, noch nicht 'checking' zeigen, sondern warten (idle) oder direkt info
      // Wir lassen es kurz auf idle, der Debounce setzt es dann auf 'too_short'
      setStatus('idle'); 
    } else {
      setStatus('checking'); 
    }
  };

  const navigateTo = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col p-5 font-sans uppercase font-bold italic ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="lg:hidden absolute top-5 right-5 text-zinc-500 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={20} /></button>

        <div className="flex items-center mb-8 text-white not-italic font-black tracking-tight">
          <h1 className="text-base flex items-center gap-2"><Box className="w-4 h-4" /> ARC TOOLS</h1>
        </div>
        
        <div className="mb-8 space-y-2 not-italic">
          <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest ml-1">Live Target (Streamer)</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-[10px]">@</div>
            
            <input 
              type="text" 
              placeholder="username" 
              value={targetUser} 
              onChange={handleTargetInput} 
              className={`
                w-full bg-[#0c0c0e] text-[11px] rounded-lg py-3 pl-8 pr-10 focus:outline-none transition-all lowercase border
                ${status === 'online' ? "border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : ""}
                ${status === 'offline' ? "border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : ""}
                ${status === 'checking' ? "border-yellow-500/50 text-yellow-100" : ""}
                ${status === 'too_short' ? "border-blue-500/30 text-zinc-300" : ""}
                ${status === 'idle' ? "border-zinc-800 text-zinc-200" : ""}
              `} 
            />
            
            <div className="absolute inset-y-0 right-3 flex items-center justify-center pointer-events-none">
              {status === 'checking' && <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />}
              {status === 'online' && (
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full z-10"></div>
                  <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
              )}
              {status === 'offline' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
              {/* Info Icon für zu kurzen Text */}
              {status === 'too_short' && <Info className="w-3 h-3 text-blue-500" />}
              {status === 'idle' && <div className="w-2 h-2 bg-zinc-800 rounded-full border border-zinc-700"></div>}
            </div>
          </div>
          
          <div className="h-4 flex items-center justify-end px-1">
            {status === 'offline' && <span className="text-[9px] text-red-500 flex items-center gap-1 font-bold uppercase tracking-wider"><AlertCircle size={8} /> Offline / Not Found</span>}
            {status === 'online' && <span className="text-[9px] text-green-500 flex items-center gap-1 font-bold uppercase tracking-wider"><Radio size={8} /> Live Connection Ready</span>}
            {/* Info Text */}
            {status === 'too_short' && <span className="text-[9px] text-blue-500 flex items-center gap-1 font-bold uppercase tracking-wider"><Info size={8} /> Enter at least 3 chars</span>}
          </div>

          <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500 mt-2">
            <div className="flex justify-between items-center text-[10px]"><span>VERSION</span><span className="text-zinc-300 font-mono">{version}</span></div>
            <div className="flex justify-between items-center text-[10px]"><span>LICENSE</span><span className="text-blue-500 font-black">PRO</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]"><span>ABLAUF</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - VIDEO" active={activeView === "ttv"} onClick={() => navigateTo("ttv")} />
          <SidebarItem icon={<Volume2 size={16} />} label="SOUND ALERTS" active={activeView === "sounds"} onClick={() => navigateTo("sounds")} />
        </nav>

        <div className="flex-1"></div>

        <div className="pt-4 space-y-2 border-t border-white/5 not-italic">
           <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => navigateTo("settings")} />
           <div className="flex items-center justify-between px-3 py-2.5 text-zinc-500 group cursor-pointer uppercase font-bold tracking-widest">
              <div className="flex items-center gap-3"><Globe size={16} /><span>LANGUAGE</span></div>
              <span className="text-[10px] font-mono">EN</span>
           </div>
        </div>
      </aside>

      <main className="flex-1 bg-[#09090b] flex flex-col min-w-0 font-bold uppercase">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 tracking-widest text-[10px]">
          <button className="lg:hidden p-2 text-white bg-zinc-900 rounded-lg border border-white/10" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
          <div className="flex items-center"><span className="text-zinc-700">App /</span> <span className="ml-1 text-white">{activeView}</span></div>
          <div className="w-8 lg:hidden"></div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeView === "settings" ? (
            <div className="p-6 lg:p-10 max-w-2xl space-y-8 uppercase italic font-bold text-center">
              <h2 className="text-2xl text-white mb-8">Account Settings</h2>
              <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-8 shadow-xl not-italic">
                <h3 className="text-zinc-500 text-[10px] font-black tracking-widest mb-4 uppercase">TikTok Authentication</h3>
                {authUser ? (
                  <div className="text-green-500 font-bold flex flex-col items-center gap-2">
                    <CheckCircle2 size={32} />
                    <span className="uppercase text-xs tracking-widest">Authenticated as: {authUser}</span>
                    <button onClick={() => setAuthUser("")} className="mt-4 text-[9px] text-zinc-500 underline hover:text-white uppercase">Disconnect</button>
                  </div>
                ) : (
                  <button onClick={() => window.location.href = "/api/auth/login"} className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-black hover:bg-zinc-200 transition-all uppercase text-xs">
                    <LogIn size={18} /> Login with TikTok
                  </button>
                )}
              </div>
            </div>
          ) : activeView === "sounds" ? (
            <ModuleSounds username={targetUser} baseUrl={baseUrl} />
          ) : (
            <ModuleTTV username={targetUser} baseUrl={baseUrl} />
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold ${active ? "bg-[#0c0c0e] text-white border border-white/5 shadow-xl" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}

function ModuleTTV({ username, baseUrl }: any) {
  const [triggers, setTriggers] = useState<any[]>([{ id: 1, code: "777", url: "https://cdn.discordapp.com/attachments/1462540433463709815/1472988001838563361/Meme_Okay_.mp4", start: 0, end: 10 }]);
  const [newCode, setNewCode] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newStart, setNewStart] = useState("0");
  const [newEnd, setNewEnd] = useState("10");

  const addTrigger = () => {
    if (!newCode || !newUrl) return;
    setTriggers([...triggers, { id: Date.now(), code: newCode, url: newUrl, start: parseInt(newStart), end: parseInt(newEnd) }]);
    setNewCode(""); setNewUrl("");
  };

  const configString = typeof window !== 'undefined' ? btoa(JSON.stringify(triggers)) : "";
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}`;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-lg">
        <h3 className="text-white text-xs font-black flex items-center gap-2 not-italic"><Plus size={14} /> NEW VIDEO TRIGGER</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Trigger Code (e.g. 777)" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500" />
          <input type="text" placeholder="Video URL (.mp4)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500 font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><label className="text-[9px] text-zinc-500 ml-1">START (S)</label><input type="number" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500" /></div>
          <div className="space-y-2"><label className="text-[9px] text-zinc-500 ml-1">END (S)</label><input type="number" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="w-full bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500" /></div>
        </div>
        <button onClick={addTrigger} className="w-full bg-white text-black font-black py-4 rounded-xl text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all">Add to List</button>
      </div>

      <div className="space-y-3">
        {triggers.map((t) => (
          <div key={t.id} className="flex items-center gap-4 bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group hover:border-zinc-600 transition-all">
            <span className="text-green-400 font-black text-sm">{t.code}</span>
            <div className="flex-1 min-w-0"><p className="text-zinc-500 text-[9px] truncate opacity-50 font-mono italic">{t.url}</p><p className="text-[8px] text-zinc-600 font-mono">Video: {t.start}s - {t.end}s</p></div>
            <button onClick={() => setTriggers(triggers.filter(x => x.id !== t.id))} className="text-zinc-600 hover:text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
        {triggers.length === 0 && <div className="text-center text-zinc-600 text-[10px] italic py-4">No video triggers added yet.</div>}
      </div>

      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-4 not-italic font-bold shadow-xl">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">OBS Master Link (Video)</label>
        <div className="flex flex-col gap-2 font-mono text-[10px]">
          <div className="flex-1 text-zinc-600 truncate bg-black px-4 py-4 rounded-xl border border-white/5 uppercase tracking-tighter break-all">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-12 py-3 rounded-xl font-black uppercase text-xs hover:bg-zinc-200">Copy</button>
        </div>
      </div>
    </div>
  );
}

function ModuleSounds({ username, baseUrl }: any) {
  const [sounds, setSounds] = useState<any[]>([{ id: 1, code: "!horn", url: "https://www.myinstants.com/media/sounds/air-horn-club-sample_1.mp3" }]);
  const [newCode, setNewCode] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addSound = () => {
    if (!newCode || !newUrl) return;
    setSounds([...sounds, { id: Date.now(), code: newCode, url: newUrl, type: 'audio' }]);
    setNewCode(""); setNewUrl("");
  };

  const configString = typeof window !== 'undefined' ? btoa(JSON.stringify(sounds)) : "";
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}&type=audio`;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-lg">
        <h3 className="text-white text-xs font-black flex items-center gap-2 not-italic"><Music size={14} /> NEW SOUND TRIGGER</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Sound Command (e.g. !horn)" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500" />
          <input type="text" placeholder="Audio URL (.mp3)" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 rounded px-3 py-3 text-white text-xs outline-none focus:border-zinc-500 font-mono" />
        </div>
        <button onClick={addSound} className="w-full bg-white text-black font-black py-4 rounded-xl text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all">Add Sound</button>
      </div>

      <div className="space-y-3">
        {sounds.map((s) => (
          <div key={s.id} className="flex items-center gap-4 bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group hover:border-zinc-600 transition-all">
            <span className="text-blue-400 font-black text-sm">{s.code}</span>
            <div className="flex-1 min-w-0"><p className="text-zinc-500 text-[9px] truncate opacity-50 font-mono italic">{s.url}</p></div>
            <button onClick={() => setSounds(sounds.filter(x => x.id !== s.id))} className="text-zinc-600 hover:text-red-500 p-2"><Trash2 size={16} /></button>
          </div>
        ))}
         {sounds.length === 0 && <div className="text-center text-zinc-600 text-[10px] italic py-4">No sound alerts added yet.</div>}
      </div>

      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-4 not-italic font-bold shadow-xl">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">OBS Master Link (Sound)</label>
        <div className="flex flex-col gap-2 font-mono text-[10px]">
          <div className="flex-1 text-zinc-600 truncate bg-black px-4 py-4 rounded-xl border border-white/5 uppercase tracking-tighter break-all">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-12 py-3 rounded-xl font-black uppercase text-xs hover:bg-zinc-200">Copy</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() { return <Suspense fallback={null}><DashboardContent /></Suspense>; }
