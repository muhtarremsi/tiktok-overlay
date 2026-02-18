"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Type, Settings, Box, Plus, Trash2, X, Menu,
  Volume2, Globe, LogIn, CheckCircle2, Loader2, AlertCircle, Radio, Music, Info, Heart,
  Zap, ArrowRight, Monitor
} from "lucide-react";

// --- HAUPT-CONTROLLER ---
export default function Home() {
  return (
    <Suspense fallback={<div className="bg-black h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-green-500" /></div>}>
      <MainController />
    </Suspense>
  );
}

function MainController() {
  const searchParams = useSearchParams();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (searchParams.get("u") || searchParams.get("view") || searchParams.get("connected")) {
      setShowApp(true);
    }
  }, [searchParams]);

  if (showApp) return <DashboardContent />;
  return <LandingPage onLaunch={() => setShowApp(true)} />;
}

// --- LANDING PAGE ---
function LandingPage({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-green-500/30">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black italic tracking-tighter text-xl cursor-pointer" onClick={() => window.location.reload()}>
            <Box className="text-green-500" /> ARC TOOLS
          </div>
          <button onClick={onLaunch} className="bg-white text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">Launch App</button>
        </div>
      </nav>
      <div className="relative pt-40 pb-20 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8">ARC TOOLS</h1>
        <button onClick={onLaunch} className="bg-green-500 text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Open Dashboard</button>
      </div>
    </div>
  );
}

// --- DASHBOARD CONTENT ---
function DashboardContent() {
  const searchParams = useSearchParams();
  const [targetUser, setTargetUser] = useState(""); 
  const [authUser, setAuthUser] = useState("");     
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [status, setStatus] = useState<'idle' | 'checking' | 'online' | 'offline' | 'too_short'>('idle');
  const [ttvTriggers, setTtvTriggers] = useState<any[]>([]);
  const [soundTriggers, setSoundTriggers] = useState<any[]>([]);
  const [fanclubConfig, setFanclubConfig] = useState({ teamHeart: true, subAlert: true });
  const [baseUrl, setBaseUrl] = useState("");

  const version = "0.030062";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const savedTTV = localStorage.getItem("arc_ttv");
    const savedSounds = localStorage.getItem("arc_sounds");
    const savedTarget = localStorage.getItem("arc_target");
    if (savedTTV) setTtvTriggers(JSON.parse(savedTTV));
    if (savedSounds) setSoundTriggers(JSON.parse(savedSounds));
    if (savedTarget) setTargetUser(savedTarget);
    const userFromUrl = searchParams.get("u");
    if (userFromUrl) setAuthUser(userFromUrl);
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("arc_ttv", JSON.stringify(ttvTriggers));
    localStorage.setItem("arc_sounds", JSON.stringify(soundTriggers));
    if (targetUser) localStorage.setItem("arc_target", targetUser);
  }, [ttvTriggers, soundTriggers, targetUser]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!targetUser || targetUser.length < 3) { setStatus(targetUser ? 'too_short' : 'idle'); return; }
      setStatus('checking');
      try {
        const res = await fetch(`/api/status?u=${targetUser}`);
        setStatus(res.ok ? 'online' : 'offline');
      } catch { setStatus('offline'); }
    }, 800);
    return () => clearTimeout(timer);
  }, [targetUser]);

  const navigateTo = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px] uppercase font-bold italic">
      {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col p-5 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center mb-8 text-white not-italic font-black tracking-tight">
          <Box className="w-5 h-5 mr-2 text-green-500" /> ARC TOOLS
        </div>
        
        <div className="mb-8 space-y-2 not-italic">
          <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest ml-1">Live Target</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-[10px]">@</div>
            <input 
              type="text" placeholder="username" value={targetUser} 
              onChange={(e) => setTargetUser(e.target.value.toLowerCase())}
              className={`w-full bg-[#0c0c0e] text-[11px] rounded-lg py-3 pl-8 pr-10 focus:outline-none border transition-all ${status === 'online' ? 'border-green-500/50 text-green-400' : 'border-zinc-800'}`}
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {status === 'checking' && <Loader2 className="w-3 h-3 animate-spin text-yellow-500" />}
              {status === 'online' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />}
            </div>
          </div>

          {/* WIEDERHERGESTELLTE INFO-BOX */}
          <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500 mt-4 not-italic">
            <div className="flex justify-between items-center text-[10px]"><span>VERSION</span><span className="text-zinc-300 font-mono">{version}</span></div>
            <div className="flex justify-between items-center text-[10px]"><span>LICENSE</span><span className="text-blue-500 font-black">PRO</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]"><span>ABLAUF</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - VIDEO" active={activeView === "ttv"} onClick={() => navigateTo("ttv")} />
          <SidebarItem icon={<Volume2 size={16} />} label="SOUND ALERTS" active={activeView === "sounds"} onClick={() => navigateTo("sounds")} />
          <SidebarItem icon={<Heart size={16} />} label="FANCLUB" active={activeView === "fanclub"} onClick={() => navigateTo("fanclub")} />
        </nav>

        <div className="flex-1" />
        
        <div className="pt-4 space-y-2 border-t border-white/5 not-italic">
          <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => navigateTo("settings")} />
          <div className="flex items-center justify-between px-3 py-2.5 text-zinc-500 uppercase font-bold tracking-widest text-[10px]">
            <div className="flex items-center gap-3"><Globe size={16} /><span>LANGUAGE</span></div>
            <span className="font-mono text-zinc-400">EN</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20">
          <button className="lg:hidden p-2 text-white bg-zinc-900 rounded-lg border border-white/10" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
          <div className="text-[10px] uppercase font-black tracking-widest"><span className="text-zinc-600">App /</span> {activeView}</div>
          <div className="hidden md:block" />
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeView === "ttv" && <ModuleTTV username={targetUser} baseUrl={baseUrl} triggers={ttvTriggers} setTriggers={setTtvTriggers} />}
          {activeView === "sounds" && <ModuleSounds username={targetUser} baseUrl={baseUrl} triggers={soundTriggers} setTriggers={setSoundTriggers} />}
          {activeView === "fanclub" && <ModuleFanclub authUser={authUser} config={fanclubConfig} setConfig={setFanclubConfig} />}
          {activeView === "settings" && <ModuleSettings authUser={authUser} setAuthUser={setAuthUser} />}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold border-2 ${active ? "bg-[#0c0c0e] text-white border-white/10 shadow-lg" : "border-transparent text-zinc-500 hover:text-white"}`}>
      {icon} {label}
    </button>
  );
}

// --- MODULE (CORE LOGIC) ---
function ModuleTTV({ username, baseUrl, triggers, setTriggers }: any) {
  const [newCode, setNewCode] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const configString = btoa(JSON.stringify(triggers));
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}`;
  const add = () => { if (!newCode || !newUrl) return; setTriggers([...triggers, { id: Date.now(), code: newCode, url: newUrl, start: 0, end: 10 }]); setNewCode(""); setNewUrl(""); };
  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl space-y-4">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Plus size={14} /> Add Video Trigger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Code (e.g. 777)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-600 transition-colors" />
          <input placeholder="URL (.mp4)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-600 transition-colors" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Trigger</button>
      </div>
      <div className="space-y-2">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group transition-all hover:border-zinc-700">
            <span className="text-green-500">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-3 not-italic">
        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">OBS Master Link</label>
        <div className="flex flex-col gap-3">
          <div className="bg-black p-4 rounded text-[9px] font-mono text-zinc-500 break-all border border-white/5">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black py-3 rounded-lg text-[10px] font-black uppercase">Copy Link</button>
        </div>
      </div>
    </div>
  );
}

function ModuleSounds({ username, baseUrl, triggers, setTriggers }: any) {
  const [newCode, setNewCode] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const configString = btoa(JSON.stringify(triggers));
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}&type=audio`;
  const add = () => { if (!newCode || !newUrl) return; setTriggers([...triggers, { id: Date.now(), code: newCode, url: newUrl, type: 'audio' }]); setNewCode(""); setNewUrl(""); };
  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl space-y-4">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Music size={14} /> Add Sound Trigger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Command (e.g. !horn)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-600 transition-colors" />
          <input placeholder="URL (.mp3)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-600 transition-colors" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Sound</button>
      </div>
      <div className="space-y-2">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group transition-all hover:border-zinc-700">
            <span className="text-blue-500">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-3 not-italic">
        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">OBS Audio Link</label>
        <div className="flex flex-col gap-3">
          <div className="bg-black p-4 rounded text-[9px] font-mono text-zinc-500 break-all border border-white/5">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black py-3 rounded-lg text-[10px] font-black uppercase">Copy Link</button>
        </div>
      </div>
    </div>
  );
}

function ModuleFanclub({ authUser, config, setConfig }: any) {
  if (!authUser) return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-10 text-center space-y-4 italic font-bold uppercase">
      <Heart size={48} className="text-pink-500 animate-pulse" />
      <h2 className="text-xl text-white">Auth Required</h2>
      <button onClick={() => window.location.href="/api/auth/login"} className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black">Login with TikTok</button>
    </div>
  );
  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl space-y-6">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Heart size={14} className="text-pink-500" /> Fanclub Alerts</h3>
        <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
          <span className="text-[10px]">Team Heart Alert</span>
          <input type="checkbox" checked={config.teamHeart} onChange={e => setConfig({...config, teamHeart: e.target.checked})} className="w-4 h-4 accent-pink-500" />
        </div>
      </div>
    </div>
  );
}

function ModuleSettings({ authUser, setAuthUser }: any) {
  return (
    <div className="p-10 max-w-xl mx-auto text-center space-y-8 uppercase italic font-bold">
      <h2 className="text-xl text-white">Account</h2>
      <div className="bg-[#0c0c0e] border border-zinc-800 p-10 rounded-3xl space-y-6">
        {authUser ? (
          <div className="space-y-4">
            <CheckCircle2 size={40} className="mx-auto text-green-500" />
            <p className="text-xs">Authenticated: <span className="text-green-500">{authUser}</span></p>
            <button onClick={() => setAuthUser("")} className="text-[9px] text-zinc-500 underline uppercase">Disconnect</button>
          </div>
        ) : (
          <button onClick={() => window.location.href="/api/auth/login"} className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2">
            <LogIn size={16} /> Login with TikTok
          </button>
        )}
      </div>
    </div>
  );
}
