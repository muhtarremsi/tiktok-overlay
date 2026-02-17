"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Monitor, Box, Loader2, ShieldCheck, Calendar, Key, Zap, Menu, X,
  Users, Star, Smile, Heart, Play, Music, Wifi
} from "lucide-react";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

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
      case "fanclub": return <ModuleFanClub username={username} baseUrl={baseUrl} />;
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} />;
      default: return <ModuleTTV username={username} baseUrl={baseUrl} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/5 font-sans">
            <div className="flex items-center justify-between mb-5 text-white">
              <h1 className="font-bold text-base tracking-tight flex items-center gap-2">
                <Box className="w-4 h-4" /> ARC<span className="text-zinc-500 font-sans">TOOLS</span>
              </h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-500 text-xs">@</div>
              <input type="text" placeholder="TikTok User" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-600 transition-all font-sans font-bold italic" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600" /> : <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2.5 font-sans">
              <div className="flex items-center justify-between"><span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1.5 font-sans"><ShieldCheck size={12} className="text-blue-500" /> VERSION</span><span className="text-[10px] text-zinc-300 font-mono font-bold tracking-tighter">{version}</span></div>
              <div className="flex items-center justify-between"><span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1.5 font-sans"><Key size={12} className="text-blue-500" /> LICENSE</span><span className="text-[10px] text-blue-500 font-black tracking-tighter uppercase italic">PRO</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 font-sans font-bold">
                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest flex items-center gap-1.5">ABLAUF</span>
                <span className="text-[10px] text-zinc-300 tracking-tighter uppercase italic">17.02.2025</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            <div>
              <h3 className="px-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 font-sans italic">Module</h3>
              <div className="space-y-1">
                <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative font-sans">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-sans">
          <div className="flex items-center gap-4 text-[11px] font-sans font-bold italic uppercase tracking-widest">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div>App / <span className="text-white">{activeView}</span></div>
          </div>
          {isLive && <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] text-green-500 font-bold tracking-widest uppercase italic">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleFanClub({ username, baseUrl }: any) {
  const [copied, setCopied] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState("Dino");
  const [config, setConfig] = useState<any>({
    "Dino": { url: "", icon: "🦖" },
    "Zombie": { url: "", icon: "🧟" },
    "Team": { url: "", icon: "🛡️" }
  });

  const getLink = () => `${baseUrl}/overlay/sticker?u=${username}&s=${selectedSticker}&v=${config[selectedSticker].url}`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      <h2 className="text-xl font-black text-white uppercase italic tracking-tight font-sans">Sticker Sound Config</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3 font-sans font-bold">
          <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest italic font-sans">Wähle Sticker</h3>
          <div className="grid grid-cols-3 gap-2 font-sans">
            {Object.keys(config).map((key) => (
              <button key={key} onClick={() => setSelectedSticker(key)} className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all border ${selectedSticker === key ? "bg-blue-500/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "bg-zinc-900 border-zinc-800"}`}>{config[key].icon}</button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl font-sans">
           <InputGroup label={`Sound Link für ${selectedSticker}`} desc="Link zur MP3/WAV Datei">
              <input type="text" value={config[selectedSticker].url} onChange={(e) => setConfig({...config, [selectedSticker]: {...config[selectedSticker], url: e.target.value}})} className="input-field text-xs font-mono font-sans font-bold" placeholder="https://..." />
           </InputGroup>
           <div className="bg-black border border-zinc-800 rounded-xl p-4 flex gap-2 font-sans font-bold italic">
              <div className="flex-1 text-zinc-500 font-mono text-[9px] truncate font-sans uppercase tracking-tighter italic">{getLink()}</div>
              <button onClick={() => {navigator.clipboard.writeText(getLink()); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-4 rounded font-black text-[9px] uppercase font-sans tracking-widest">{copied ? "Copied" : "Copy"}</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ModuleTTV({ username, baseUrl }: any) {
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const link = `${baseUrl}/overlay?u=${username}&c=${trigger}&v=${videoUrl}&vol=100&s=0&e=10`;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 font-sans">
      <h2 className="text-xl font-black text-white uppercase italic tracking-tight font-sans">TTV Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        <InputGroup label="Trigger" desc="Chatbefehl"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field font-black text-blue-400 font-sans italic" /></InputGroup>
        <InputGroup label="Video URL" desc=".mp4 Link"><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[100px] font-mono text-xs font-sans font-bold" /></InputGroup>
      </div>
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 flex gap-2 font-sans font-bold italic tracking-tighter">
        <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-2.5 text-zinc-400 font-mono text-[10px] truncate">{link}</div>
        <button onClick={() => {navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-4 rounded font-black text-[10px] uppercase tracking-widest">{copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[11px] transition-all font-sans font-bold italic uppercase tracking-widest ${active ? "bg-zinc-900 text-white font-black shadow-sm" : "text-zinc-500 hover:bg-zinc-900/50"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, desc, children }: any) {
  return <div className="flex flex-col gap-2 font-sans font-bold"><label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest font-sans">{label}</label>{children}<p className="text-[9px] text-zinc-600 font-bold italic uppercase tracking-tighter font-sans">{desc}</p></div>;
}
function ModuleSettings({ expiry, version }: any) {
  return <div className="p-8 font-sans font-black italic uppercase"><div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 max-w-lg shadow-2xl font-sans"><p className="text-blue-500 text-sm">Status: Active</p><p className="text-zinc-600 text-[9px] mt-2 font-mono not-italic uppercase font-bold tracking-widest">Build: {version}</p></div></div>;
}
function ModuleSoundAlerts() { return <div className="p-8 text-zinc-600 uppercase text-[10px] tracking-widest font-sans font-bold italic">Loading Sound Library...</div>; }
