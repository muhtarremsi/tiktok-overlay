"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Type, Settings, Box, Loader2, Plus, Trash2, Menu, X,
  Volume2, Globe, Play, LogIn
} from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [activeView, setActiveView] = useState("ttv");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  const version = "0.030035"; 

  useEffect(() => {
    setBaseUrl(window.location.origin);
    // Falls wir vom Login zurückkommen, Usernamen setzen
    const userFromUrl = searchParams.get("u");
    if (userFromUrl) setUsername(userFromUrl);
  }, [searchParams]);

  const handleTikTokLogin = () => {
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-200 font-sans text-[12px]">
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col p-5 italic font-bold uppercase">
        <div className="flex items-center gap-2 mb-8 text-white not-italic font-black">
          <Box className="w-4 h-4" /> ARC TOOLS
        </div>

        {/* LOGIN BUTTON */}
        <button 
          onClick={handleTikTokLogin}
          className="w-full bg-[#121214] border border-zinc-800 rounded-lg py-3 px-4 mb-6 flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all text-white not-italic normal-case"
        >
          <LogIn size={16} className="text-red-500" />
          <span>Connect TikTok</span>
        </button>

        <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-4 space-y-3 text-[9px] text-zinc-500 not-italic">
          <div className="flex justify-between items-center"><span>VERSION</span><span className="text-green-500">{version}</span></div>
          <div className="flex justify-between items-center"><span>LICENSE</span><span className="text-blue-500">PRO</span></div>
        </div>

        <nav className="mt-8 space-y-1 flex-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - VIDEO" active={activeView === "ttv"} onClick={() => setActiveView("ttv")} />
        </nav>

        <div className="pt-4 border-t border-white/5 space-y-2 not-italic">
           <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => setActiveView("settings")} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-white/5 flex items-center px-6 bg-black/20 font-black uppercase tracking-widest text-[10px]">
          App / {activeView}
        </header>
        <div className="flex-1 overflow-y-auto">
          {activeView === "ttv" ? <ModuleTTV username={username} baseUrl={baseUrl} /> : <div className="p-10">Settings</div>}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold ${active ? "bg-[#0c0c0e] text-white border border-white/5" : "text-zinc-500 hover:text-white"}`}><span>{icon}</span>{label}</button>;
}

function ModuleTTV({ username, baseUrl }: any) {
  const [triggers, setTriggers] = useState<any[]>([{ id: 1, code: "777", url: "...", start: 0, end: 10 }]);
  const configString = typeof window !== 'undefined' ? btoa(JSON.stringify(triggers)) : "";
  const link = `${baseUrl}/overlay?u=${username || 'username'}&config=${configString}`;

  return (
    <div className="p-10 space-y-10 uppercase italic font-bold">
      <h2 className="text-2xl text-white italic">Multi-Trigger System</h2>
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-2xl p-8 space-y-4 not-italic shadow-xl">
        <label className="text-[10px] text-zinc-500 uppercase font-black italic">OBS Master Link</label>
        <div className="flex gap-2 font-mono text-[10px]">
          <div className="flex-1 text-zinc-600 truncate bg-black px-4 py-4 rounded-xl border border-white/5">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black px-8 rounded-xl font-black uppercase text-xs hover:bg-zinc-200">Copy</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() { return <Suspense fallback={null}><DashboardContent /></Suspense>; }
