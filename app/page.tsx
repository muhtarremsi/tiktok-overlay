"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Monitor, Box, Loader2, ShieldCheck, Calendar, Key, Zap, Menu, X,
  Users, Star, Smile, Heart
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
      case "settings": return <ModuleSettings expiry={expiryDate} version={version} />;
      default: return <ModuleTTV username={username} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[14px]">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-black border-r border-white/10 z-50 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6 text-white text-nowrap">
              <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
                <Box className="w-5 h-5 text-white" /> ARC<span className="text-zinc-500">TOOLS</span>
              </h1>
              <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 text-sm">@</div>
              <input type="text" placeholder="TikTok User" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-md py-2.5 pl-7 pr-10 focus:outline-none focus:border-zinc-600 transition-all" />
              <div className="absolute inset-y-0 right-3 flex items-center">
                 {isChecking ? <Loader2 size={14} className="animate-spin text-zinc-600" /> : <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={14} className="text-blue-500" /> VERSION</span>
                <span className="text-sm text-zinc-200 font-mono font-bold">{version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2"><Key size={14} className="text-blue-500" /> LICENSE</span>
                <span className="text-sm text-blue-500 font-black">{licenseType}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-2"><Calendar size={14} /> ABLAUFDATUM</span>
                <span className="text-sm text-zinc-200 font-bold">{expiryDate}</span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            <div>
              <h3 className="px-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Module</h3>
              <div className="space-y-1.5">
                <SidebarItem icon={<Type size={18} />} label="TTV - Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                <SidebarItem icon={<Users size={18} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
              </div>
            </div>
          </nav>
          
          <div className="p-4 border-t border-white/5"><SidebarItem icon={<Settings size={18} />} label="Settings" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} /></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
            <div className="text-xs font-medium uppercase tracking-widest text-zinc-500">App / <span className="text-white">{activeView}</span></div>
            {isLive && (
              <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-zinc-400">
                <span className="flex items-center gap-1"><Users size={12} className="text-blue-400"/> {liveData.viewers}</span>
                <span className="flex items-center gap-1"><Heart size={12} className="text-red-400"/> {liveData.likes}</span>
              </div>
            )}
          </div>
          {isLive && <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-bold tracking-widest">LIVE</span>}
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function ModuleFanClub({ username, isLive }: { username: string, isLive: boolean }) {
  const [members, setMembers] = useState<any[]>([]);

  // Simulation der echten Datenankunft
  useEffect(() => {
    if (isLive && username) {
      const interval = setInterval(() => {
        // Hier würde normalerweise der Event-Stream von TikTok hängen
        const mockNewMember = {
          name: "User_" + Math.floor(Math.random() * 1000),
          level: Math.floor(Math.random() * 50) + 1,
          time: "Gerade eben"
        };
        setMembers(prev => [mockNewMember, ...prev].slice(0, 10));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive, username]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <h2 className="text-2xl font-semibold text-white tracking-tight">Fan Club Manager</h2>
      
      {!isLive ? (
        <div className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-2xl text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi size={24} className="text-zinc-600" />
          </div>
          <h3 className="text-white font-medium mb-1">Stream ist Offline</h3>
          <p className="text-zinc-500 text-sm">Die Live-Mitgliederliste wird automatisch geladen, sobald du online gehst.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[13px]">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Star size={14} className="text-yellow-500" /> Echtzeit-Mitglieder</h3>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
              {members.length > 0 ? members.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-all animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-400 border border-blue-500/20">{m.name[0]}</div>
                    <span className="font-bold text-zinc-200 uppercase">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-black border border-white/5">LVL {m.level}</span>
                    <span className="text-zinc-600 text-[11px] italic">{m.time}</span>
                  </div>
                </div>
              )) : <div className="p-10 text-center text-zinc-600">Suche nach Club-Events in deinem Stream...</div>}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Smile size={14} className="text-purple-500" /> Verfügbare Sticker</h3>
            <div className="grid grid-cols-3 gap-2">
              {["💎", "👑", "��", "⚡", "🌈", "🏆"].map((s, i) => (
                <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-2xl hover:border-purple-500 transition-colors shadow-inner">{s}</div>
              ))}
            </div>
            <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-tighter">Pro Info</p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Diese Sticker werden automatisch in deinem OBS Overlay angezeigt, wenn ein Club-Mitglied sie postet.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleTTV({ username }: { username: string }) {
  const [trigger, setTrigger] = useState("777");
  const [videoUrl, setVideoUrl] = useState("");
  const [volume, setVolume] = useState("100");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const baseUrl = window.location.origin + "/overlay";
    const params = new URLSearchParams({ u: username, c: trigger, v: videoUrl, vol: volume, s: "0", e: "10" });
    setGeneratedLink(`${baseUrl}?${params.toString()}`);
  }, [username, trigger, videoUrl, volume]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-300">
      <h2 className="text-2xl font-semibold text-white tracking-tight">Konfiguration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup label="Trigger" desc="Chatbefehl"><input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} className="input-field font-bold" /></InputGroup>
        <InputGroup label="Video URL" desc=".mp4 Link"><textarea value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input-field min-h-[120px] font-mono text-xs" /></InputGroup>
      </div>
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-8">
        <div className="flex gap-3">
          <div className="flex-1 bg-black border border-zinc-800 rounded px-5 py-3 text-zinc-400 font-mono text-xs truncate select-all">{generatedLink}</div>
          <button onClick={() => {navigator.clipboard.writeText(generatedLink); setCopied(true); setTimeout(() => setCopied(false), 2000);}} className="bg-white text-black px-6 rounded font-bold text-xs uppercase hover:bg-zinc-200 transition-all">
            {copied ? "Kopiert" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all ${active ? "bg-zinc-900 text-white font-medium shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"}`}><span>{icon}</span>{label}</button>;
}
function InputGroup({ label, desc, children }: any) {
  return <div className="flex flex-col gap-2.5"><label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</label>{children}<p className="text-[11px] text-zinc-600 font-medium italic">{desc}</p></div>;
}
function ModuleSettings({ expiry, version }: any) {
  return <div className="p-10"><div className="bg-zinc-900/50 p-8 rounded-lg border border-zinc-800 max-w-lg font-bold"><p>Gültig bis: {expiry}</p><p className="text-zinc-500 text-[10px] mt-2 font-mono uppercase">Build: {version}</p></div></div>;
}
