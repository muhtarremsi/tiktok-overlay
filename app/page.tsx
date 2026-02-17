"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Monitor, Box, Loader2, ShieldCheck, Calendar, Key, Zap, Menu, X,
  Users, Star, Smile, Heart, Play, Music, Wifi, Clock, Lock, CheckCircle
} from "lucide-react";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const version = "0.029488";
  const licenseType = "PRO";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (!username || username.length < 2) {
      setIsLive(false); return;
    }
    const checkStatus = async () => {
      if (!isLive) setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(data.online);
      } catch (e) { console.error("Status check failed"); }
      finally { setIsChecking(false); }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [username, isLive]);

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} baseUrl={baseUrl} />;
      case "fanclub": return <ModuleFanClub username={username} isLogged={isLogged} setIsLogged={setIsLogged} />;
      case "sounds": return <ModuleSoundAlerts username={username} baseUrl={baseUrl} />;
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} />;
      default: return <ModuleTTV username={username} baseUrl={baseUrl} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[13px]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-5 text-white">
              <h1 className="font-bold text-base tracking-tight flex items-center gap-2">
                <Box className="w-4 h-4 text-white" /> ARC <span className="text-zinc-500">TOOLS</span>
              </h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="relative mb-5 font-sans">
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-500 text-xs font-sans">@</div>
              <input type="text" placeholder="TikTok User" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-500 transition-all font-bold font-sans" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600 font-sans" /> : <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2.5 font-sans">
              <div className="flex items-center justify-between font-sans"><span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5 font-sans"><ShieldCheck size={12} className="text-blue-500" /> VERSION</span><span className="text-[11px] text-zinc-300 font-mono font-sans">{version}</span></div>
              <div className="flex items-center justify-between font-sans"><span className="text-[10px] text-zinc-500 font-bold uppercase flex items-center gap-1.5 font-sans"><Key size={12} className="text-blue-500" /> LICENSE</span><span className="text-[11px] text-blue-500 font-black font-sans uppercase">PRO</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 font-sans font-bold uppercase">
                <span className="text-[10px] text-zinc-500">ABLAUF</span>
                <span className="text-[11px] text-zinc-300 font-sans">{expiryDate}</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 font-sans">
            <div>
              <h3 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 font-sans">Module</h3>
              <div className="space-y-1 font-sans">
                <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
              </div>
            </div>
          </nav>

          <div className="p-3 border-t border-white/5 font-sans">
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative font-sans">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-sans">
          <div className="flex items-center gap-4 text-[11px] font-bold font-sans">
            <button className="lg:hidden text-white font-sans" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="uppercase tracking-widest text-zinc-500 font-sans leading-none">App / <span className="text-white font-sans">{activeView}</span></div>
          </div>
          {isLive && <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] text-green-500 font-bold tracking-widest uppercase font-sans">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto font-sans">{renderContent()}</div>
      </main>
    </div>
  );
}

// --- MODULES ---

function ModuleFanClub({ username, isLogged, setIsLogged }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const startLogin = () => {
    setLoading(true);
    setTimeout(() => { setStep(2); setLoading(false); }, 1500);
  };

  const confirmCode = () => {
    setLoading(true);
    setTimeout(() => { setIsLogged(true); setLoading(false); }, 2000);
  };

  if (isLogged) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fan Club Manager</h2>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded text-green-500 font-bold text-[10px] uppercase">
            <CheckCircle size={14} /> Synchronisiert
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center text-zinc-500 font-bold">Warte auf Live-Daten für @{username}...</div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase mb-4 tracking-widest font-sans">Team Sticker</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-zinc-800/50 rounded flex items-center justify-center border border-white/5 hover:border-blue-500 transition-all cursor-pointer"><Star className="text-zinc-600" size={20} /></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto h-[80vh] flex items-center justify-center font-sans">
      <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-2xl text-center max-w-md w-full space-y-8 shadow-2xl font-sans">
        <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-500">
          {step === 1 ? <Lock size={32} /> : <Zap size={32} className="animate-pulse" />}
        </div>
        
        <div className="space-y-2 font-sans font-bold">
          <h3 className="text-white text-xl uppercase tracking-tight">{step === 1 ? "TikTok Auth" : "Verifizierung"}</h3>
          <p className="text-zinc-500 text-sm font-sans font-medium">
            {step === 1 ? "Verbinde deinen Account, um deine individuellen Team-Sticker zu synchronisieren." : "Bestätige den Zugriff für @"+username}
          </p>
        </div>

        {step === 1 ? (
          <button onClick={startLogin} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-3 uppercase shadow-lg shadow-blue-500/10">
            {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} />} Login mit TikTok
          </button>
        ) : (
          <div className="space-y-4 font-sans font-bold uppercase tracking-widest">
            <div className="bg-black border border-zinc-800 py-4 rounded-xl text-2xl font-black tracking-[10px] text-blue-400">ARC-77</div>
            <button onClick={confirmCode} disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
              {loading && <Loader2 className="animate-spin" />} Jetzt Bestätigen
            </button>
          </div>
        )}
        <p className="text-[10px] text-zinc-600 font-bold uppercase font-sans">Verschlüsselte Verbindung via ARC-CLOUD</p>
      </div>
    </div>
  );
}

function ModuleTTV({ username, baseUrl }: any) {
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [vol, setVol] = useState("100");
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("10");
  const [copied, setCopied] = useState(false);

  const link = `${baseUrl}/overlay?u=${username}&c=${trigger}&v=${videoUrl}&vol=${vol}&s=${start}&e=${end}`;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300 font-sans font-bold">
      <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">TTV Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans font-bold uppercase">
        <div className="space-y-6 font-sans">
          <InputGroup label="Trigger Code" desc="Chat-Befehl"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field text-blue-400 font-black font-sans" /></InputGroup>
          <div className="grid grid-cols-2 gap-4 font-sans font-bold">
            <InputGroup label="Start (Sek)" desc="Sekunde"><input type="number" value={start} onChange={(e) => setStart(e.target.value)} className="input-field font-sans" /></InputGroup>
            <InputGroup label="Dauer (Sek)" desc="Länge"><input type="number" value={end} onChange={(e) => setEnd(e.target.value)} className="input-field font-sans" /></InputGroup>
          </div>
          <InputGroup label="Lautstärke" desc={`${vol}%`}><input type="range" min="0" max="500" value={vol} onChange={(e) => setVol(e.target.value)} className="w-full accent-white h-1.5 font-sans" /></InputGroup>
        </div>
        <InputGroup label="Video URL (.mp4)" desc="Direktlink"><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[150px] font-mono text-xs font-sans font-bold" /></InputGroup>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 font-sans font-bold uppercase">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-bold">Link für OBS Browser Source</label>
        <div className="flex gap-2 font-sans font-bold">
          <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-400 font-mono text-[10px] truncate font-sans font-bold">{link}</div>
          <button onClick={() => {navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-6 rounded font-black text-xs uppercase font-sans font-bold">
            {copied ? "Kopiert" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[11px] transition-all font-bold uppercase tracking-wider font-sans ${active ? "bg-zinc-900 text-white shadow-sm font-sans" : "text-zinc-500 hover:bg-zinc-900/50 font-sans"}`}><span>{icon}</span>{label}</button>;
}

function InputGroup({ label, desc, children }: any) {
  return <div className="flex flex-col gap-2 font-sans font-bold uppercase"><label className="text-[9px] text-zinc-400 uppercase tracking-widest font-sans font-bold">{label}</label>{children}<p className="text-[10px] text-zinc-600 italic font-sans font-bold lowercase">{desc}</p></div>;
}

function ModuleSettings({ expiry, version }: any) {
  return <div className="p-10 font-sans font-bold uppercase italic"><div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 max-w-lg space-y-2 shadow-2xl font-sans"><p className="text-blue-500 font-sans">Status: PRO License</p><p className="text-zinc-200 font-sans">Ablauf: {expiry}</p><p className="text-zinc-500 text-[10px] font-mono not-italic mt-4 font-sans font-bold">Build Version: {version}</p></div></div>;
}
function ModuleSoundAlerts() { return <div className="p-8 text-zinc-600 font-bold uppercase tracking-widest font-sans font-bold italic">Lade Library...</div>; }
