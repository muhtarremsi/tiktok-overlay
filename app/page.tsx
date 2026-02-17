"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Type, Settings, Box, Plus, Trash2, X, Menu,
  Volume2, Globe, LogIn, CheckCircle2
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [baseUrl, setBaseUrl] = useState("");
  const version = "0.030046";
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const userFromUrl = searchParams.get("u");
    if (userFromUrl) setUsername(userFromUrl);
  }, [searchParams]);

  const navigateTo = (view: string) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Jetzt mit Links-Ausrichtung für Mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 
        transform transition-transform duration-300 ease-in-out lg:relative 
        lg:translate-x-0 flex flex-col p-5 font-sans 
        uppercase font-bold italic
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* CLOSE BUTTON (Rechts oben in der Sidebar für Mobile) */}
        <button 
          className="lg:hidden absolute top-5 right-5 text-zinc-500 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={20} />
        </button>

        <div className="flex items-center mb-8 text-white not-italic font-black tracking-tight">
          <h1 className="text-base flex items-center gap-2"><Box className="w-4 h-4" /> ARC TOOLS</h1>
        </div>
        
        <div className="mb-8 space-y-4 not-italic">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-sm">@</div>
            <input 
              type="text" 
              placeholder="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.toLowerCase())} 
              className="w-full bg-[#0c0c0e] border border-zinc-800 text-zinc-200 text-[13px] rounded-lg py-2.5 pl-8 pr-10 focus:outline-none transition-all lowercase" 
            />
          </div>
          <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 font-bold uppercase tracking-widest text-[9px] text-zinc-500">
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

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-[#09090b] flex flex-col min-w-0 font-bold uppercase">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 tracking-widest text-[10px]">
          {/* HAMBURGER BUTTON (Jetzt Links) */}
          <button 
            className="lg:hidden p-2 text-white bg-zinc-900 rounded-lg border border-white/10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center">
            <span className="text-zinc-700">App /</span> <span className="ml-1 text-white">{activeView}</span>
          </div>
          
          <div className="w-8 lg:hidden"></div> {/* Spacer für Zentrierung */}
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeView === "settings" ? (
            <div className="p-6 lg:p-10 max-w-2xl space-y-8 uppercase italic font-bold text-center">
              <h2 className="text-2xl text-white">General Settings</h2>
              <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-8 shadow-xl not-italic">
                {username ? (
                  <div className="text-green-500 font-bold flex flex-col items-center gap-2">
                    <CheckCircle2 size={32} />
                    <span className="uppercase text-xs tracking-widest">Connected: {username}</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => window.location.href = "/api/auth/login"} 
                    className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-black hover:bg-zinc-200 transition-all uppercase text-xs"
                  >
                    <LogIn size={18} /> Connect with TikTok
                  </button>
                )}
              </div>
            </div>
          ) : (
            <ModuleTTV username={username} baseUrl={baseUrl} />
          )}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold ${active ? "bg-[#0c0c0e] text-white border border-white/5 shadow-xl" : "text-zinc-500 hover:text-white"}`}
    >
      <span>{icon}</span>{label}
    </button>
  );
}

function ModuleTTV({ username, baseUrl }: any) {
  const [triggers] = useState([{ id: 1, code: "777", url: "https://cdn.discordapp.com/attachments/1462540433463709815/1472988001838563361/Meme_Okay_.mp4", start: 0, end: 10 }]);
  const configString = typeof window !== 'undefined' ? btoa(JSON.stringify(triggers)) : "";
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}`;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-10 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-4 not-italic font-bold shadow-xl">
        <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-black italic">OBS Master Link</label>
        <div className="flex flex-col gap-2 font-mono text-[10px]">
          <div className="flex-1 text-zinc-600 truncate bg-black px-4 py-4 rounded-xl border border-white/5 uppercase tracking-tighter break-all">
            {link}
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(link)} 
            className="bg-white text-black px-12 py-3 rounded-xl font-black uppercase text-xs hover:bg-zinc-200"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() { return <Suspense fallback={null}><DashboardContent /></Suspense>; }
