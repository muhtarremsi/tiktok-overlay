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
  const [liveData, setLiveData] = useState({ viewers: 0, likes: 0 });

  const version = "0.029488";
  const licenseType = "PRO";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    if (!username || username.length < 2) {
      setIsLive(false); return;
    }
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(data.online);
        if (data.online) setLiveData({ viewers: data.viewers, likes: data.likes });
      } catch (e) { console.error("Status check failed"); }
      finally { setIsChecking(false); }
    };
    const timer = setTimeout(checkStatus, 500); 
    return () => clearTimeout(timer);
  }, [username]);

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} />;
      case "fanclub": return <ModuleFanClub username={username} isLive={isLive} />;
      case "sounds": return <ModuleSoundAlerts username={username} />;
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} />;
      default: return <ModuleTTV username={username} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[13px]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full font-sans">
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-5 text-white">
              <h1 className="font-bold text-base tracking-tight flex items-center gap-2">
                <Box className="w-4 h-4 text-white" /> ARC<span className="text-zinc-500 font-sans">TOOLS</span>
              </h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="relative mb-5">
              <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-zinc-500 text-xs">@</div>
              <input type="text" placeholder="TikTok User" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-xs rounded py-2 pl-6 pr-8 focus:outline-none focus:border-zinc-600 transition-all font-sans" />
              <div className="absolute inset-y-0 right-2.5 flex items-center">
                 {isChecking ? <Loader2 size={12} className="animate-spin text-zinc-600" /> : <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between"><span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={12} className="text-blue-500" /> VERSION</span><span className="text-[10px] text-zinc-300 font-mono">{version}</span></div>
              <div className="flex items-center justify-between"><span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Key size={12} className="text-blue-500" /> LICENSE</span><span className="text-[10px] text-blue-500 font-black">{licenseType}</span></div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> ABLAUF</span>
                <span className="text-[10px] text-zinc-300 font-bold">{expiryDate}</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
            <div>
              <h3 className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">Module</h3>
              <div className="space-y-1">
                <SidebarItem icon={<Type size={16} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Users size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Volume2 size={16} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
              </div>
            </div>
          </nav>
          
          <div className="p-3 border-t border-white/5"><SidebarItem icon={<Settings size={16} />} label="Settings" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} /></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md sticky top-0 z-30 font-sans">
          <div className="flex items-center gap-4 text-[11px]">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <div className="font-medium uppercase tracking-widest text-zinc-500 leading-none">App / <span className="text-white uppercase italic">{activeView}</span></div>
          </div>
          {isLive && (
            <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-1 rounded border border-white/5"><Users size={12} className="text-blue-400"/> {liveData.viewers}</span>
              <span className="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-1 rounded border border-white/5"><Heart size={12} className="text-red-400"/> {liveData.likes}</span>
            </div>
          )}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleFanClub({ username, isLive }: { username: string, isLive: boolean }) {
  const stickers = [
    { id: 1, name: "Custom 1", url: "✨" },
    { id: 2, name: "Custom 2", url: "💫" },
    { id: 3, name: "Custom 3", url: "⭐" }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Fan Club Manager</h2>
        <p className="text-zinc-500 text-xs">Individuelle Team-Sticker für {username || "deinen Kanal"}.</p>
      </div>

      {!isLive ? (
        <div className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-2xl text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
            <Wifi size={24} />
          </div>
          <h3 className="text-white font-medium mb-1 italic uppercase">Warten auf Stream</h3>
          <p className="text-zinc-500 text-[11px]">Deine individuellen Team-Sticker laden automatisch, sobald du live bist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[13px]">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic font-sans"><Users size={14} /> Team Mitglieder</h3>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-10 text-center text-zinc-600 italic">
              Suche nach Club-Events...
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 italic font-sans"><Smile size={14} className="text-purple-500" /> Deine Sticker</h3>
            <div className="grid grid-cols-3 gap-2">
              {stickers.map((s) => (
                <div key={s.id} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-2xl hover:border-purple-500 transition-colors shadow-inner">{s.url}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleSoundAlerts({ username }: { username: string }) {
  const [selectedSound, setSelectedSound] = useState<string>("Meme 1");
  const [soundConfigs, setSoundConfigs] = useState<any>({
    "Meme 1": { trigger: "haha", url: "https://www.myinstants.com/media/sounds/discord-notification.mp3" },
    "Airhorn": { trigger: "horn", url: "https://www.myinstants.com/media/sounds/airhorn.mp3" }
  });
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const getOverlayLink = () => {
    if (!baseUrl) return "";
    const current = soundConfigs[selectedSound];
    return `${baseUrl}/overlay/sound?u=${username}&c=${current.trigger}&v=${current.url}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h2 className="text-xl font-black text-white uppercase italic tracking-tight font-sans">Sound Alerts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        <div className="space-y-3 font-sans">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 font-sans"><Music size={14} className="text-blue-500" /> Library</h3>
          {Object.keys(soundConfigs).map((s) => (
            <button key={s} onClick={() => setSelectedSound(s)} className={`w-full p-3 rounded-lg border text-left flex items-center justify-between ${selectedSound === s ? "bg-blue-500/10 border-blue-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400 font-sans"}`}>
              <span className="font-bold text-xs uppercase">{s}</span>
              <Play size={12} />
            </button>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-5 bg-zinc-900/30 border border-zinc-800 p-5 rounded-xl font-sans">
          <InputGroup label="Trigger" desc="Wort im Chat"><input type="text" value={soundConfigs[selectedSound].trigger} onChange={(e) => setSoundConfigs({...soundConfigs, [selectedSound]: {...soundConfigs[selectedSound], trigger: e.target.value}})} className="input-field text-xs font-sans font-bold" /></InputGroup>
          <div className="bg-black border border-zinc-800 rounded-xl p-4 flex gap-2 font-sans">
            <div className="flex-1 text-zinc-500 font-mono text-[9px] truncate italic font-sans">{getOverlayLink() || "Generiere Link..."}</div>
            <button onClick={() => {navigator.clipboard.writeText(getOverlayLink()); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-4 rounded font-black text-[9px] uppercase font-sans">{copied ? "Kopiert" : "Copy"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleTTV({ username }: { username: string }) {
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState("100");
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    setLink(`${window.location.origin}/overlay?u=${username}&c=${trigger}&v=${videoUrl}&vol=${volume}&s=0&e=10`);
  }, [username, trigger, videoUrl, volume]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <h2 className="text-xl font-black text-white uppercase italic tracking-tight font-sans">TTV Konfiguration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        <InputGroup label="Trigger" desc="Chat-Code"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field font-black text-blue-400 font-sans" /></InputGroup>
        <InputGroup label="Video URL" desc=".mp4 Link"><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[100px] font-mono text-xs font-sans" /></InputGroup>
      </div>
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 flex gap-2 font-sans">
        <div className="flex-1 bg-black border border-zinc-800 rounded px-4 py-2.5 text-zinc-400 font-mono text-[10px] truncate font-sans">{link || "Lade..."}</div>
        <button onClick={() => {navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-4 rounded font-bold text-[10px] uppercase font-sans">{copied ? "Kopiert" : "Copy Link"}</button>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[12px] transition-all font-sans ${active ? "bg-zinc-900 text-white font-black" : "text-zinc-500 hover:bg-zinc-900/50 font-sans"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, desc, children }: any) {
  return <div className="flex flex-col gap-2 font-sans"><label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest font-sans">{label}</label>{children}<p className="text-[9px] text-zinc-600 font-bold italic uppercase tracking-tighter font-sans">{desc}</p></div>;
}
function ModuleSettings({ expiry, version }: any) {
  return <div className="p-8 font-sans"><div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 max-w-lg font-black uppercase italic font-sans shadow-2xl"><p className="text-blue-500 text-sm font-sans">Ablauf: {expiry}</p><p className="text-zinc-600 text-[9px] mt-2 font-mono not-italic font-sans">Build: {version}</p></div></div>;
}
