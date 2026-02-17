"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Type, Settings, LogOut, Copy, Check, Volume2, 
  Play, Monitor, Box, Loader2, Wifi, Music, Palette, Sliders, 
  ShieldCheck, Calendar, Key
} from "lucide-react";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [activeView, setActiveView] = useState("ttv");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // AKTUALISIERTE PRO DATEN
  const version = "0.029488";
  const licenseType = "PRO";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    if (!username || username.length < 2) {
      setIsLive(false);
      setIsFirstLoad(false);
      return;
    }

    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const res = await fetch(`/api/status?u=${username}`);
        const data = await res.json();
        setIsLive(data.online);
        if (data.online) setViewerCount(data.viewers);
      } catch (e) {
        console.error("Status check failed");
      } finally {
        setIsChecking(false);
        setIsFirstLoad(false);
      }
    };

    setIsFirstLoad(true);
    const timer = setTimeout(checkStatus, 800); 
    return () => clearTimeout(timer);
  }, [username]);

  const renderContent = () => {
    switch (activeView) {
      case "ttv": return <ModuleTTV username={username} />;
      default: return <ModuleTTV username={username} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans">
      <aside className="w-72 flex-shrink-0 flex flex-col border-r border-white/10 bg-black font-sans">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-bold text-lg tracking-tight flex items-center gap-2 text-white">
              <Box className="w-5 h-5" />
              ARC<span className="text-zinc-500">TOOLS</span>
            </h1>
            {isLive && !isChecking && (
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-500 font-bold uppercase tracking-wider">Live</span>
            )}
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-500 text-sm">@</div>
            <input
              type="text"
              placeholder="TikTok User"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 text-zinc-200 text-sm rounded-md py-2.5 pl-7 pr-10 focus:outline-none focus:border-zinc-600 transition-all"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
               {isChecking ? <Loader2 size={14} className="animate-spin text-zinc-600" /> : <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-800'}`}></div>}
            </div>
          </div>
          
          {/* AKTUALISIERTE PRO-BOX MIT NEUEN LABELS */}
          {isFirstLoad && username.length > 1 ? (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3 space-y-3 animate-pulse">
              <div className="h-2 w-20 bg-zinc-800 rounded"></div>
              <div className="h-2 w-full bg-zinc-800 rounded"></div>
            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-3 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck size={10} className="text-blue-400" /> VERSION</span>
                <span className="text-[10px] text-zinc-300 font-mono font-medium">{version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Key size={10} className="text-blue-400" /> LICENSE</span>
                <span className="text-[10px] text-blue-400 font-bold">{licenseType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Calendar size={10} className="text-zinc-500" /> ABLAUFDATUM</span>
                <span className="text-[10px] text-zinc-300 font-medium">{expiryDate}</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
          <div>
            <h3 className="px-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Module</h3>
            <div className="space-y-1">
              <SidebarItem icon={<Type size={18} />} label="TTV - Text to Video" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
              <SidebarItem icon={<Volume2 size={18} />} label="Sound Alerts" active={activeView === "sounds"} onClick={() => setActiveView("sounds")} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <SidebarItem icon={<Settings size={18} />} label="Einstellungen" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
          <SidebarItem icon={<LogOut size={18} />} label="Logout" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {renderContent()}
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function ModuleTTV({ username }: { username: string }) {
  return (
    <>
      <header className="h-16 border-b border-white/5 flex items-center px-8 bg-black/20 backdrop-blur-md">
        <div className="text-xs font-medium uppercase tracking-widest text-zinc-500">App / <span className="text-white">Text to Video Trigger</span></div>
      </header>
      <div className="p-8 text-zinc-500">Konfiguration für {username || 'TikTok User'}...</div>
    </>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${active ? "bg-zinc-900 text-white font-medium" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"}`}>
      <span>{icon}</span>{label}
    </button>
  );
}
