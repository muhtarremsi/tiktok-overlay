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

  useEffect(() => { setBaseUrl(window.location.origin); }, []);

  useEffect(() => {
    if (!username || username.length < 2) { setIsLive(false); return; }
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
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans font-bold uppercase tracking-widest">
          <div className="p-5 border-b border-white/5 font-sans">
            <div className="flex items-center justify-between mb-5 text-white font-sans">
              <h1 className="text-base flex items-center gap-2 font-sans font-black tracking-tighter italic">
                <Box className="w-4 h-4 text-white" /> ARC TOOLS
              </h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
            </div>
            <div className="relative mb-5 font-sans">
              <div className="absolute inset-y-0 left-2.5 flex items-center text-zinc-500 text-xs font-bold">@</div>
              <input type="text" placeholder="TikTok User" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-500 font-bold font-sans uppercase italic" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600" /> : <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2.5 text-[9px] font-black font-sans italic">
              <div className="flex items-center justify-between"><span><ShieldCheck size={12} className="text-blue-500 inline mr-1" /> VERSION</span><span className="text-zinc-300 font-mono not-italic">{version}</span></div>
              <div className="flex items-center justify-between"><span><Key size={12} className="text-blue-500 inline mr-1" /> LICENSE</span><span className="text-blue-500">PRO</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2 font-sans"><span>ABLAUF</span><span className="text-zinc-300 not-italic font-bold">{expiryDate}</span></div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 font-sans">
            <div className="space-y-1 font-sans">
              <h3 className="px-3 text-[9px] text-zinc-600 mb-2 font-sans font-black uppercase">Module</h3>
              <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
              <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
              <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
            </div>
          </nav>
          <div className="p-3 border-t border-white/5 font-sans"><SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} /></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative font-sans font-bold uppercase italic">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-sans">
          <div className="flex items-center gap-4 text-[10px] font-sans">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="text-zinc-500 uppercase font-sans tracking-widest">App / <span className="text-white font-sans">{activeView}</span></div>
          </div>
          {isLive && <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[9px] text-green-500 font-black">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto font-sans not-italic">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleSoundAlerts({ username, baseUrl }: any) {
  const [selected, setSelected] = useState("Airhorn");
  const [sounds, setSounds] = useState<any>({
    "Airhorn": { trigger: "!horn", url: "https://www.myinstants.com/media/sounds/airhorn.mp3" },
    "Laugh": { trigger: "!haha", url: "https://www.myinstants.com/media/sounds/discord-notification.mp3" },
    "Wow": { trigger: "!wow", url: "https://www.myinstants.com/media/sounds/anime-wow.mp3" }
  });
  const [copied, setCopied] = useState(false);
  const link = `${baseUrl}/overlay/sound?u=${username}&c=${sounds[selected].trigger}&v=${sounds[selected].url}`;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      <h2 className="text-2xl font-black text-white uppercase italic tracking-tight font-sans">Sound Alerts Manager</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans font-bold">
        <div className="space-y-3 font-sans">
          <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans italic">Library</h3>
          {Object.keys(sounds).map((s) => (
            <button key={s} onClick={() => setSelected(s)} className={`w-full p-3 rounded-lg border text-left flex items-center justify-between uppercase text-[11px] font-black italic transition-all ${selected === s ? "bg-blue-500/10 border-blue-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}>
              <span>{s}</span><Music size={14} />
            </button>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-6 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl font-sans uppercase">
          <InputGroup label="Trigger Wort"><input type="text" value={sounds[selected].trigger} onChange={(e) => setSounds({...sounds, [selected]: {...sounds[selected], trigger: e.target.value}})} className="input-field text-blue-400 font-black italic uppercase" /></InputGroup>
          <InputGroup label="Sound Link (MP3)"><input type="text" value={sounds[selected].url} onChange={(e) => setSounds({...sounds, [selected]: {...sounds[selected], url: e.target.value}})} className="input-field font-mono text-[10px] font-bold not-italic" /></InputGroup>
          <div className="bg-black border border-zinc-800 rounded-xl p-4 space-y-3 font-sans">
            <label className="text-[9px] text-zinc-500 font-black italic tracking-widest block uppercase">OBS Browser Link</label>
            <div className="flex gap-2 font-sans font-bold italic">
              <div className="flex-1 text-zinc-500 font-mono text-[9px] truncate not-italic">{link}</div>
              <button onClick={() => {navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-6 rounded font-black text-[10px] uppercase italic tracking-tighter">{copied ? "Copied" : "Copy Link"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleFanClub({ username, isLogged, setIsLogged }: any) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const startLogin = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/tiktok', { method: 'POST', body: JSON.stringify({ username }) });
    const data = await res.json();
    if (data.success) { setTimeout(() => { setStep(2); setLoading(false); }, 1000); }
  };

  const confirmCode = () => {
    setLoading(true);
    setTimeout(() => { setIsLogged(true); setLoading(false); }, 1500);
  };

  if (isLogged) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 font-sans">
        <div className="flex items-center justify-between uppercase italic font-black"><h2 className="text-2xl text-white">Fan Club Manager</h2><div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded text-green-500 text-[10px]"><CheckCircle size={14} /> Synchronisiert</div></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 uppercase font-bold italic">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center text-zinc-500">Warte auf Live-Daten für @{username}...</div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-[10px] text-zinc-500 uppercase mb-4 tracking-widest font-black">Team Sticker</h3>
            <div className="grid grid-cols-3 gap-2">{[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-zinc-800 rounded flex items-center justify-center border border-white/5 hover:border-blue-500 transition-all cursor-pointer"><Star className="text-zinc-600" size={20} /></div>)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto h-[80vh] flex items-center justify-center font-sans font-black uppercase italic">
      <div className="bg-zinc-900/50 border border-zinc-800 p-12 rounded-2xl text-center max-w-md w-full space-y-8 shadow-2xl">
        <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-500">{step === 1 ? <Lock size={24} /> : <Zap size={24} className="animate-pulse" />}</div>
        <div className="space-y-1">
          <h3 className="text-white text-lg">{step === 1 ? "TikTok Auth" : "Verifizierung"}</h3>
          <p className="text-zinc-600 text-[10px] not-italic">Kanal: @{username || "User"}</p>
        </div>
        {step === 1 ? (
          <button onClick={startLogin} disabled={loading || !username} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl text-[11px] transition-all flex items-center justify-center gap-2 disabled:opacity-30 tracking-widest">{loading ? <Loader2 className="animate-spin" /> : <Zap size={16} />} Login mit TikTok</button>
        ) : (
          <div className="space-y-4">
            <div className="bg-black border border-zinc-800 py-3 rounded-xl text-xl tracking-[8px] text-blue-400 font-black not-italic">ARC-77</div>
            <button onClick={confirmCode} disabled={loading} className="w-full bg-white text-black py-4 rounded-xl text-[11px] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 uppercase font-black tracking-widest italic">{loading && <Loader2 className="animate-spin" />} Bestätigen</button>
          </div>
        )}
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
    <div className="p-8 max-w-5xl mx-auto space-y-10 font-black uppercase italic font-sans">
      <h2 className="text-2xl text-white tracking-tight">TTV Setup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <InputGroup label="Trigger Code"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field text-blue-400 font-black italic uppercase" /></InputGroup>
          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Start (S)"><input type="number" value={start} onChange={(e) => setStart(e.target.value)} className="input-field not-italic" /></InputGroup>
            <InputGroup label="Ende (S)"><input type="number" value={end} onChange={(e) => setEnd(e.target.value)} className="input-field not-italic" /></InputGroup>
          </div>
          <InputGroup label="Audio Boost"><input type="range" min="0" max="500" value={vol} onChange={(e) => setVol(e.target.value)} className="w-full accent-white h-1 not-italic" /></InputGroup>
        </div>
        <InputGroup label="Video URL (.mp4)"><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[150px] font-mono text-[10px] not-italic" /></InputGroup>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex gap-2">
        <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-3 text-zinc-400 font-mono text-[10px] truncate not-italic">{link}</div>
        <button onClick={() => {navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-6 rounded text-[10px] tracking-widest">{copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[10px] transition-all font-black italic tracking-widest uppercase ${active ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-900/50"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, children }: any) {
  return <div className="flex flex-col gap-2 font-black uppercase italic"><label className="text-[9px] text-zinc-400 tracking-widest">{label}</label>{children}</div>;
}
function ModuleSettings({ expiry, version }: any) {
  return <div className="p-10 font-black uppercase italic font-sans"><div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 max-w-lg space-y-2 shadow-2xl"><p className="text-blue-500 text-sm">PRO License: Active</p><p className="text-zinc-200 text-sm font-bold">Expiry: {expiry}</p><p className="text-zinc-500 text-[10px] font-mono not-italic mt-4">Build: {version}</p></div></div>;
}
