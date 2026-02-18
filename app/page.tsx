"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Type, Settings, Box, Plus, Trash2, X, Menu,
  Volume2, Globe, LogIn, CheckCircle2, Loader2, AlertCircle, Radio, Music, Info, Heart,
  Zap, ArrowRight, Monitor, Cpu, Gauge, Share2
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
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-green-500/30 overflow-x-hidden">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between font-black italic tracking-tighter text-lg md:text-xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <Box className="text-green-500 w-5 h-5 md:w-6 md:h-6" /> ARC TOOLS
          </div>
          <button onClick={onLaunch} className="bg-white text-black px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs uppercase font-black tracking-widest hover:bg-zinc-200 transition-all">
            Launch App
          </button>
        </div>
      </nav>

      <div className="relative pt-32 md:pt-48 pb-20 px-4 md:px-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[1000px] h-[300px] md:h-[500px] bg-green-500/10 rounded-full blur-[80px] md:blur-[120px] -z-10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> v0.030063 Stable
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter leading-[1.1] uppercase">Interactive <br className="hidden sm:block" /> Overlays</h1>
          <button onClick={onLaunch} className="w-full sm:w-auto bg-green-500 text-black px-10 py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-xs md:text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD APP ---
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
  const [perfQuality, setPerfQuality] = useState(80); // Default 80% Qualität
  const [baseUrl, setBaseUrl] = useState("");

  const version = "0.030063";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const savedTTV = localStorage.getItem("arc_ttv");
    const savedSounds = localStorage.getItem("arc_sounds");
    const savedTarget = localStorage.getItem("arc_target");
    const savedPerf = localStorage.getItem("arc_perf");
    
    if (savedTTV) setTtvTriggers(JSON.parse(savedTTV));
    if (savedSounds) setSoundTriggers(JSON.parse(savedSounds));
    if (savedTarget) setTargetUser(savedTarget);
    if (savedPerf) setPerfQuality(parseInt(savedPerf));

    const userFromUrl = searchParams.get("u");
    if (userFromUrl) setAuthUser(userFromUrl);
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("arc_ttv", JSON.stringify(ttvTriggers));
    localStorage.setItem("arc_sounds", JSON.stringify(soundTriggers));
    localStorage.setItem("arc_perf", perfQuality.toString());
    if (targetUser) localStorage.setItem("arc_target", targetUser);
  }, [ttvTriggers, soundTriggers, targetUser, perfQuality]);

  useEffect(() => {
    const checkUser = async () => {
      if (!targetUser || targetUser.length < 3) { setStatus(targetUser ? 'too_short' : 'idle'); return; }
      setStatus('checking');
      try {
        const res = await fetch(`/api/status?u=${targetUser}`);
        setStatus(res.ok ? 'online' : 'offline');
      } catch (e) { setStatus('offline'); }
    };
    const timer = setTimeout(checkUser, 800);
    return () => clearTimeout(timer);
  }, [targetUser]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px] uppercase font-bold italic">
      {sidebarOpen && <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col p-5 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center mb-8 text-white not-italic font-black tracking-tight cursor-pointer" onClick={() => window.location.href = "/"}>
          <Box className="w-4 h-4 mr-2 text-green-500" /> ARC TOOLS
        </div>
        
        <div className="mb-8 space-y-2 not-italic">
          <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest ml-1">Live Target</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-[10px]">@</div>
            <input 
              type="text" placeholder="username" value={targetUser} 
              onChange={(e) => setTargetUser(e.target.value.toLowerCase())} 
              className={`w-full bg-[#0c0c0e] text-[11px] rounded-lg py-3 pl-8 pr-10 focus:outline-none border transition-all lowercase ${status === 'online' ? "border-green-500/50 text-green-400" : "border-zinc-800"}`}
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              {status === 'checking' && <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />}
              {status === 'online' && <div className="relative flex items-center justify-center"><div className="w-2 h-2 bg-green-500 rounded-full z-10"></div><div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75"></div></div>}
              {status === 'offline' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
              {status === 'too_short' && <Info className="w-3 h-3 text-blue-500" />}
            </div>
          </div>
          <div className="h-4 flex items-center justify-end px-1">
            {status === 'offline' && <span className="text-[9px] text-red-500 flex items-center gap-1 font-bold uppercase tracking-wider"><AlertCircle size={8} /> Offline</span>}
            {status === 'online' && <span className="text-[9px] text-green-500 flex items-center gap-1 font-bold uppercase tracking-wider"><Radio size={8} /> Online</span>}
            {status === 'too_short' && <span className="text-[9px] text-blue-500 flex items-center gap-1 font-bold uppercase tracking-wider"><Info size={8} /> 3+ Chars</span>}
          </div>
          <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500 mt-2">
            <div className="flex justify-between items-center text-[10px]"><span>VERSION</span><span className="text-zinc-300 font-mono">{version}</span></div>
            <div className="flex justify-between items-center text-[10px]"><span>LICENSE</span><span className="text-blue-500 font-black">PRO</span></div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]"><span>ABLAUF</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - VIDEO" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
          <SidebarItem icon={<Volume2 size={16} />} label="SOUND ALERTS" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
          <SidebarItem icon={<Heart size={16} />} label="FANCLUB" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
        </nav>
        <div className="flex-1"></div>
        <div className="pt-4 space-y-2 border-t border-white/5 not-italic">
           <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} />
           <div className="flex items-center justify-between px-3 py-2.5 text-zinc-500 uppercase font-bold tracking-widest text-[10px]">
              <div className="flex items-center gap-3"><Globe size={16} /><span>LANGUAGE</span></div>
              <span className="font-mono">EN</span>
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
          {activeView === "settings" && <ModuleSettings authUser={authUser} setAuthUser={setAuthUser} quality={perfQuality} setQuality={setPerfQuality} version={version} expiry={expiryDate} />}
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

// --- MODULE KOMPONENTEN ---
function ModuleTTV({ username, baseUrl, triggers, setTriggers }: any) {
  const [newCode, setNewCode] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const configString = btoa(JSON.stringify(triggers));
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}`;
  const add = () => { if (!newCode || !newUrl) return; setTriggers([...triggers, { id: Date.now(), code: newCode, url: newUrl, start: 0, end: 10 }]); setNewCode(""); setNewUrl(""); };
  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-6 md:space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-4">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Plus size={14} /> Add Video Trigger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Code (e.g. 777)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-500" />
          <input placeholder="URL (.mp4)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-500" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Trigger</button>
      </div>
      <div className="space-y-2">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group transition-all hover:border-zinc-700">
            <span className="text-green-500">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate max-w-[120px] md:max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
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
    <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-6 md:space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-4">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Music size={14} /> Add Sound Trigger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Command (e.g. !horn)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-500" />
          <input placeholder="URL (.mp3)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none focus:border-zinc-500" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Sound</button>
      </div>
      <div className="space-y-2">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group transition-all hover:border-zinc-700">
            <span className="text-blue-500">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate max-w-[120px] md:max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
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
      <button onClick={() => window.location.href="/api/auth/login"} className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black hover:scale-105 transition-all">Login with TikTok</button>
    </div>
  );
  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Heart size={14} className="text-pink-500" /> Fanclub Alerts</h3>
        <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
          <span className="text-[10px]">Team Heart Alert</span>
          <input type="checkbox" checked={config.teamHeart} onChange={e => setConfig({...config, teamHeart: e.target.checked})} className="w-4 h-4 accent-pink-500" />
        </div>
      </div>
    </div>
  );
}

function ModuleSettings({ authUser, setAuthUser, quality, setQuality, version, expiry }: any) {
  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-10 uppercase italic font-bold">
      
      {/* 1. AUTH CATEGORY */}
      <section className="space-y-4">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-2">AUTH CHANNELS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AuthCard icon={<Zap className="text-green-500" />} name="TIKTOK" status={authUser ? "CONNECTED" : "DISCONNECTED"} user={authUser} onAction={() => authUser ? setAuthUser("") : window.location.href="/api/auth/login"} />
          <AuthCard icon={<Share2 className="text-blue-400 opacity-30" />} name="DISCORD" status="COMING SOON" disabled />
          <AuthCard icon={<Monitor className="text-purple-500 opacity-30" />} name="TWITCH" status="COMING SOON" disabled />
        </div>
      </section>

      {/* 2. PERFORMANCE & HARDWARE */}
      <section className="space-y-4">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-2">PERFORMANCE & HARDWARE</h3>
        <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-8 not-italic">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-white text-xs font-black flex items-center gap-2"><Gauge size={14} className="text-yellow-500" /> ENGINE QUALITY</h4>
              <p className="text-[10px] text-zinc-500 uppercase font-bold italic">REDUCE IF YOU EXPERIENCE LAG DURING STREAMING</p>
            </div>
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <span className="text-[9px] text-zinc-500">LOW</span>
              <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="flex-1 accent-green-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
              <span className="text-[9px] text-white font-mono">{quality}%</span>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg"><Cpu size={16} className="text-blue-500" /></div>
              <span className="text-[10px] text-zinc-400 uppercase font-black">Hardware Auto-Test</span>
            </div>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg text-[9px] font-black transition-all">RUN TEST</button>
          </div>
        </div>
      </section>

      {/* 3. SUBSCRIPTION INFO */}
      <section className="space-y-4">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-2">SUBSCRIPTION DETAILS</h3>
        <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center not-italic">
          <div className="space-y-1"><p className="text-[9px] text-zinc-500 uppercase font-black">VERSION</p><p className="text-xs text-white font-mono">{version}</p></div>
          <div className="space-y-1"><p className="text-[9px] text-zinc-500 uppercase font-black">PLAN</p><p className="text-xs text-blue-500 font-black">PRO LIFETIME</p></div>
          <div className="space-y-1"><p className="text-[9px] text-zinc-500 uppercase font-black">EXPIRES</p><p className="text-xs text-zinc-300">{expiry}</p></div>
          <div className="space-y-1"><p className="text-[9px] text-zinc-500 uppercase font-black">STATUS</p><p className="text-xs text-green-500 font-black">ACTIVE</p></div>
        </div>
      </section>
    </div>
  );
}

function AuthCard({ icon, name, status, user, onAction, disabled }: any) {
  return (
    <div className={`bg-[#0c0c0e] border border-zinc-800 p-5 rounded-2xl space-y-4 transition-all ${disabled ? 'opacity-50' : 'hover:border-zinc-600'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-xl">{icon}</div>
          <span className="text-[11px] font-black tracking-widest">{name}</span>
        </div>
        {status === "CONNECTED" && <CheckCircle2 size={14} className="text-green-500" />}
      </div>
      <div className="space-y-3">
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-500 uppercase">Status</span>
          <span className={`text-[10px] font-bold ${status === "CONNECTED" ? "text-green-500" : "text-zinc-400"}`}>{status}</span>
        </div>
        {!disabled && (
           <button onClick={onAction} className={`w-full py-2 rounded-lg text-[9px] font-black transition-all ${status === "CONNECTED" ? "bg-zinc-800 hover:bg-red-500/20 hover:text-red-500" : "bg-white text-black hover:bg-zinc-200"}`}>
             {status === "CONNECTED" ? "DISCONNECT" : "CONNECT NOW"}
           </button>
        )}
      </div>
    </div>
  );
}
