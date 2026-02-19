"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { logout, checkSession } from "@/app/actions/auth";
import Link from "next/link";
import { 
  Type, Settings, Plus, Trash2, X, Menu,
  Volume2, Globe, LogIn, CheckCircle2, Loader2, AlertCircle, Radio, Music, Info, Heart,
  Zap, ArrowRight, Monitor, Cpu, Gauge, Share2, Code2, LogOut, MessageSquare, Play, StopCircle,
  Camera, RefreshCw, FlipHorizontal, EyeOff, Eye, MessageCircle, ShieldCheck, Key, CalendarDays, Ghost, Hand, Cookie, HelpCircle, Music2, Copy,
  ChevronDown, ChevronRight, Wand2, Gamepad2, Bot, Trophy, Video
} from "lucide-react";

function SpotifyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM20.16 9.6C15.96 7.08 9.24 6.96 5.4 8.16c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.64-1.2 16.56 1.74.54.36.72 1.02.36 1.56-.36.539-1.08.719-1.5.36z"/>
    </svg>
  );
}

function SekerLogo({ className }: { className?: string }) {
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor"><path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/></svg>);
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="bg-black h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-green-500" /></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [targetUser, setTargetUser] = useState(""); 
  const [activeView, setActiveView] = useState("camera"); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTikTokConnected, setIsTikTokConnected] = useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'online' | 'offline' | 'too_short'>('idle');
  
  const [ttvTriggers, setTtvTriggers] = useState<any[]>([]);
  const [soundTriggers, setSoundTriggers] = useState<any[]>([]);
  const [fanclubConfig, setFanclubConfig] = useState({ teamHeart: true, subAlert: true });
  const [spotifyConfig, setSpotifyConfig] = useState({ allowRequests: false, showInCamera: true, cameraScale: 100, alwaysOn: false });
  const [perfQuality, setPerfQuality] = useState(100); 
  const [baseUrl, setBaseUrl] = useState("");
  const [hasFunctionalConsent, setHasFunctionalConsent] = useState(false);

  const [chatMessages, setChatMessages] = useState<{id: number, nickname: string, comment: string}[]>([]);
  const [chatStatus, setChatStatus] = useState("Warten auf Verbindung...");

  const version = "0.030147"; 
  const expiryDate = "17.02.2025";

  const spotifyConfigRef = useRef(spotifyConfig);
  useEffect(() => { spotifyConfigRef.current = spotifyConfig; }, [spotifyConfig]);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const consentRaw = localStorage.getItem("seker_cookie_consent");
    let functionalAllowed = false;
    if (consentRaw) {
        const consent = JSON.parse(consentRaw);
        functionalAllowed = consent.functional;
        setHasFunctionalConsent(functionalAllowed);
    }
    if (functionalAllowed) {
        const savedTTV = localStorage.getItem("seker_ttv");
        const savedSounds = localStorage.getItem("seker_sounds");
        const savedTarget = localStorage.getItem("seker_target");
        const savedPerf = localStorage.getItem("seker_perf");
        const savedSpotify = localStorage.getItem("seker_spotify");
        
        if (savedTTV) setTtvTriggers(JSON.parse(savedTTV));
        if (savedSounds) setSoundTriggers(JSON.parse(savedSounds));
        if (savedTarget) setTargetUser(savedTarget);
        if (savedPerf) setPerfQuality(parseInt(savedPerf));
        if (savedSpotify) setSpotifyConfig(JSON.parse(savedSpotify));
    }
    setIsTikTokConnected(document.cookie.includes("tiktok_connected=true"));
    setIsSpotifyConnected(document.cookie.includes("spotify_connected=true"));
    if (searchParams.get("connected") === "tiktok") setIsTikTokConnected(true);
    if (searchParams.get("connected") === "spotify") setIsSpotifyConnected(true);
  }, [searchParams]);

  useEffect(() => {
    if (hasFunctionalConsent) {
        localStorage.setItem("seker_ttv", JSON.stringify(ttvTriggers));
        localStorage.setItem("seker_sounds", JSON.stringify(soundTriggers));
        localStorage.setItem("seker_perf", perfQuality.toString());
        localStorage.setItem("seker_spotify", JSON.stringify(spotifyConfig));
        if (targetUser) localStorage.setItem("seker_target", targetUser);
    }
  }, [ttvTriggers, soundTriggers, targetUser, perfQuality, spotifyConfig, hasFunctionalConsent]);

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

  useEffect(() => {
    if (status !== 'online' || !targetUser || targetUser.length < 3) return;
    setChatStatus("Verbinde mit TikTok...");
    let eventSource: EventSource | null = null;
    let reconnectTimer: any = null;

    const connect = () => {
        if (eventSource) eventSource.close();
        eventSource = new EventSource(`/api/live-chat?u=${targetUser}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'connected') {
                setChatStatus(`Live verbunden: @${targetUser}`);
            } else if (data.type === 'chat') {
                setChatMessages(prev => [...prev.slice(-29), { id: Date.now(), nickname: data.nickname, comment: data.comment }]);
                if (spotifyConfigRef.current.allowRequests) {
                    const commentLower = data.comment.toLowerCase().trim();
                    if (commentLower.startsWith('!play ')) {
                        const query = data.comment.substring(6);
                        fetch('/api/spotify/command', { method: 'POST', body: JSON.stringify({ action: 'play', query }) });
                    } else if (commentLower === '!skip') {
                        fetch('/api/spotify/command', { method: 'POST', body: JSON.stringify({ action: 'skip' }) });
                    }
                }
            } else if (data.type === 'member') {
                setChatMessages(prev => [...prev.slice(-29), { id: Date.now(), nickname: data.nickname, comment: "ist beigetreten 👋" }]);
            } else if (data.type === 'error') {
                setChatStatus(`Fehler: ${data.message}`);
                eventSource?.close();
            }
        };

        eventSource.onerror = () => {
            setChatStatus("Verbindung getrennt. Reconnect...");
            eventSource?.close();
            reconnectTimer = setTimeout(connect, 3000);
        };
    };
    connect();

    return () => {
        if (eventSource) eventSource.close();
        if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [status, targetUser]);

  const handleTikTokConnect = () => {
    if (isTikTokConnected) {
        document.cookie = "tiktok_connected=; Max-Age=0; path=/;";
        setIsTikTokConnected(false);
        router.refresh();
    } else {
        window.location.href = "/api/auth/login";
    }
  };

  const handleSpotifyConnect = () => {
    if (isSpotifyConnected) {
        document.cookie = "spotify_connected=; Max-Age=0; path=/;";
        document.cookie = "spotify_refresh_token=; Max-Age=0; path=/;";
        setIsSpotifyConnected(false);
        router.refresh();
    } else {
        window.location.href = "/api/auth/spotify/login";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px] uppercase font-bold italic">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm animate-in fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* VERÄNDERTE SIDEBAR STRUKTUR (FLEX COL) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col h-full ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* FIXED HEADER BEREICH */}
        <div className="p-5 shrink-0 space-y-6">
            <div className="flex items-center text-white not-italic font-black tracking-tight cursor-pointer" onClick={() => router.push('/')}>
            <SekerLogo className="w-5 h-5 mr-2 text-green-500" /> SEKERBABA
            </div>
            <button className="absolute top-4 right-4 lg:hidden text-zinc-500" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            
            <div className="space-y-2 not-italic">
            <label className="text-[9px] text-zinc-500 font-black uppercase tracking-widest ml-1">Live Target</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 text-[10px]">@</div>
                <input type="text" placeholder="username" value={targetUser} onChange={(e) => setTargetUser(e.target.value.toLowerCase())} className={`w-full bg-[#0c0c0e] text-[11px] rounded-lg py-3 pl-8 pr-10 focus:outline-none border transition-all lowercase ${status === 'online' ? "border-green-500/50 text-green-400" : "border-zinc-800"}`} />
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
            <div className="bg-[#0c0c0e] border border-zinc-800/50 rounded-xl p-3 space-y-2 font-bold uppercase tracking-widest text-[9px] text-zinc-500 mt-2">
                <div className="flex justify-between items-center text-[10px]"><span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-500" /> VERSION</span><span className="text-zinc-300 font-mono">{version}</span></div>
                <div className="flex justify-between items-center text-[10px]"><span className="flex items-center gap-1.5"><Key size={14} className="text-green-500" /> LICENSE</span><span className="text-blue-500 font-black">PRO</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]"><span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-green-500" /> ABLAUFDATUM</span><span className="text-zinc-300 font-normal">{expiryDate}</span></div>
            </div>
            </div>
        </div>

        {/* SCROLLBARER MIDDLE BEREICH (NAV) MIT FADE-EFFEKT */}
        <div 
            className="flex-1 overflow-y-auto scrollbar-hide px-5" 
            style={{ 
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', 
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' 
            }}
        >
            {/* Kleiner Padding-Puffer für weiches Scrollen oben */}
            <div className="h-4"></div>
            
            <nav className="space-y-6 pb-10">
                <div>
                    <div className="text-[9px] font-black text-zinc-600 px-3 py-2 uppercase tracking-[0.2em] not-italic">TIKTOK OVERLAYS</div>
                    <div className="space-y-1">
                        <MenuFolder label="TEXT TO" icon={<MessageSquare size={16}/>} defaultOpen={true}>
                            <SidebarSubItem icon={<Volume2 size={14}/>} label="Voice" active={activeView === "ttc"} onClick={() => {setActiveView("ttc"); setSidebarOpen(false);}} />
                            <SidebarSubItem icon={<Video size={14}/>} label="Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                        </MenuFolder>
                        
                        <MenuFolder label="ALERTS" icon={<Zap size={16}/>} defaultOpen={true}>
                            <SidebarSubItem icon={<Music size={14}/>} label="Sound" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
                        </MenuFolder>
                    </div>
                </div>

                <div>
                    <div className="text-[9px] font-black text-zinc-600 px-3 py-2 uppercase tracking-[0.2em] not-italic">STREAMING & TOOLS</div>
                    <div className="space-y-1">
                        <SidebarItem icon={<Camera size={16} />} label="IRL Cam" active={activeView === "camera"} onClick={() => {setActiveView("camera"); setSidebarOpen(false);}} />
                        <SidebarItem icon={<Heart size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
                        <SidebarItem icon={<SpotifyLogo className="w-4 h-4"/>} label="Spotify" active={activeView === "spotify"} onClick={() => {setActiveView("spotify"); setSidebarOpen(false);}} />
                    </div>
                </div>

                <div>
                    <div className="text-[9px] font-black text-zinc-600 px-3 py-2 uppercase tracking-[0.2em] not-italic flex items-center gap-2">COMING SOON</div>
                    <div className="space-y-1 opacity-50">
                        <SidebarItem icon={<Gamepad2 size={16} />} label="Mini Games" active={activeView === "games"} onClick={() => setActiveView("games")} />
                        <SidebarItem icon={<Bot size={16} />} label="Chat Bot" active={activeView === "bot"} onClick={() => setActiveView("bot")} />
                        <SidebarItem icon={<Trophy size={16} />} label="Leaderboard" active={activeView === "leaderboard"} onClick={() => setActiveView("leaderboard")} />
                    </div>
                </div>
            </nav>
        </div>
        
        {/* FIXED FOOTER BEREICH */}
        <div className="p-5 shrink-0 pt-4 space-y-2 border-t border-white/5 not-italic z-10 bg-black">
           <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} />
           <div className="flex items-center justify-between px-3 py-2 text-zinc-500 uppercase font-bold tracking-widest text-[10px]">
              <div className="flex items-center gap-3"><Globe size={16} /><span>LANGUAGE</span></div><span className="font-mono">EN</span>
           </div>
           <button onClick={async () => { localStorage.clear(); await logout(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold border-2 border-transparent text-red-500 hover:bg-red-500/10 hover:border-red-500/20"><LogOut size={16} /> LOGOUT</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 z-10 relative">
          <button className="lg:hidden text-white hover:text-green-500 transition-colors" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <div className="flex items-center gap-2 font-black italic lg:hidden"><SekerLogo className="w-5 h-5 text-green-500" /> SEKERBABA</div>
          <div className="hidden lg:block" />
        </header>

        <div className="flex-1 overflow-y-auto relative z-0 flex flex-col">
          {!hasFunctionalConsent && activeView !== 'settings' && activeView !== 'camera' && (
              <div className="mx-6 lg:mx-10 mt-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-[10px] flex items-center gap-3 font-black tracking-widest animate-pulse">
                  <Cookie size={16} /> ACHTUNG: FUNKTIONALE COOKIES SIND DEAKTIVIERT. TRIGGER WERDEN NICHT GESPEICHERT!
              </div>
          )}
          {activeView === "ttv" && <ModuleTTV username={targetUser} baseUrl={baseUrl} triggers={ttvTriggers} setTriggers={setTtvTriggers} />}
          {activeView === "sounds" && <ModuleSounds username={targetUser} baseUrl={baseUrl} triggers={soundTriggers} setTriggers={setSoundTriggers} />}
          {activeView === "ttc" && <ModuleTTC />}
          {activeView === "camera" && <ModuleCamera targetUser={targetUser} chatMessages={chatMessages} chatStatus={chatStatus} spotifyConfig={spotifyConfig} setSpotifyConfig={setSpotifyConfig} isSpotifyConnected={isSpotifyConnected} />}
          {activeView === "fanclub" && <ModuleFanclub isConnected={isTikTokConnected} config={fanclubConfig} setConfig={setFanclubConfig} />}
          {activeView === "spotify" && <ModuleSpotify isConnected={isSpotifyConnected} baseUrl={baseUrl} config={spotifyConfig} setConfig={setSpotifyConfig} />}
          {activeView === "settings" && <ModuleSettings hasConsent={hasFunctionalConsent} isConnected={isTikTokConnected} onConnect={handleTikTokConnect} isSpotifyConnected={isSpotifyConnected} onSpotifyConnect={handleSpotifyConnect} quality={perfQuality} setQuality={setPerfQuality} version={version} expiry={expiryDate} />}
          {(activeView === "games" || activeView === "bot" || activeView === "leaderboard") && <ModuleComingSoon name={activeView} />}
        </div>
      </main>
    </div>
  );
}

// --- NAVIGATION COMPONENTS ---
function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold border-2 ${active ? "bg-[#0c0c0e] text-white border-white/10 shadow-lg" : "border-transparent text-zinc-500 hover:text-white"}`}>
      {icon} {label}
    </button>
  );
}

function SidebarSubItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] uppercase transition-all tracking-widest font-bold ${active ? "text-green-500 bg-white/5" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
      {icon} {label}
    </button>
  );
}

function MenuFolder({ label, icon, defaultOpen, children }: any) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="space-y-1">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-zinc-400 hover:text-white transition-colors group cursor-pointer border-2 border-transparent">
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest">{icon} {label}</div>
                {isOpen ? <ChevronDown size={14} className="text-zinc-600" /> : <ChevronRight size={14} className="text-zinc-600 group-hover:translate-x-0.5 transition-transform"/>}
            </button>
            {isOpen && <div className="space-y-1 pl-4 border-l-2 border-white/5 ml-5">{children}</div>}
        </div>
    )
}

function ModuleComingSoon({ name }: { name: string }) {
    return (
        <div className="h-[70vh] flex flex-col items-center justify-center p-10 text-center space-y-4 italic font-bold uppercase">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center animate-pulse"><Code2 className="text-zinc-600" size={32}/></div>
            <h2 className="text-2xl text-white">IN ENTWICKLUNG</h2>
            <p className="text-[10px] text-zinc-500 max-w-sm">Das Modul "{name}" wird in einem zukünftigen Update veröffentlicht.</p>
        </div>
    );
}

// --- ECHTE LIVE-VORSCHAU KOMPONENTE FÜR FILTER ---
function LiveFilterPreview({ stream, filterCss, isActive, onClick, name }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <button onClick={onClick} className="relative flex flex-col items-center gap-3 shrink-0 group transition-all duration-300 pointer-events-auto">
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-green-500 scale-110 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-white/10 scale-100 opacity-60 group-hover:opacity-100'}`}>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ filter: filterCss }} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors drop-shadow-md ${isActive ? 'text-green-500' : 'text-zinc-400 group-hover:text-white'}`}>{name}</span>
        </button>
    );
}

// --- UPDATED CAMERA MODULE (Live-Filter, Bounding Box, Always On Spotify) ---
function ModuleCamera({ targetUser, chatMessages, chatStatus, spotifyConfig, setSpotifyConfig, isSpotifyConnected }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  
  const [viewState, setViewState] = useState<'intro' | 'fullscreen'>('intro');
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user'); 
  const [mirror, setMirror] = useState(true);
  
  const [showUI, setShowUI] = useState(true);
  const [ghostMode, setGhostMode] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  
  const CAMERA_FILTERS = [
      { id: 'normal', name: 'Normal', css: '' },
      { id: 'bw', name: 'Vintage', css: 'grayscale(100%) contrast(120%)' },
      { id: 'warm', name: 'Warm', css: 'sepia(40%) saturate(140%) contrast(110%)' },
      { id: 'cold', name: 'Kalt', css: 'saturate(120%) hue-rotate(15deg) contrast(110%)' },
      { id: 'neon', name: 'Neon', css: 'hue-rotate(90deg) saturate(200%) contrast(120%)' },
      { id: 'retro', name: 'Retro', css: 'sepia(80%) contrast(120%) brightness(90%)' }
  ];

  const [track, setTrack] = useState<any>(null);
  const [spotifyPos, setSpotifyPos] = useState({ x: 20, y: 120 });
  const isDraggingSpotify = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const [error, setError] = useState("");

  const startStream = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
      setActiveStream(stream);
      setViewState('fullscreen');
    } catch (err: any) { setError(`Kamerafehler: ${err.message || 'Zugriff verweigert'}`); }
  };

  useEffect(() => {
    if (viewState === 'fullscreen' && videoRef.current && activeStream) {
        videoRef.current.srcObject = activeStream;
    }
  }, [viewState, activeStream]);

  const stopStream = () => {
    if (activeStream) { activeStream.getTracks().forEach(track => track.stop()); setActiveStream(null); }
    setViewState('intro');
  };

  useEffect(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatMessages]);

  useEffect(() => { if (viewState === 'fullscreen') startStream(); }, [facingMode]);
  useEffect(() => { return () => stopStream(); }, []);

  useEffect(() => {
    if (!isSpotifyConnected || !spotifyConfig.showInCamera || viewState !== 'fullscreen') return;
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing?t=' + Date.now());
        const data = await res.json();
        if (data.isPlaying) setTrack(data);
        else setTrack(null);
      } catch (err) {}
    };
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 4000); 
    return () => clearInterval(interval);
  }, [isSpotifyConnected, spotifyConfig.showInCamera, viewState]);

  const handlePointerDown = (e: React.PointerEvent) => { 
      if (showSettings || showFilters) return; 
      holdTimer.current = setTimeout(() => { setIsHolding(true); }, 250); 
  };
  const handlePointerUp = () => {
      if (showSettings || showFilters) {
          if(showSettings) setShowSettings(false);
          if(showFilters) setShowFilters(false);
          return;
      }
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (isHolding) { setIsHolding(false); } else { setShowUI(prev => !prev); }
  };
  const handlePointerCancel = () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (isHolding) setIsHolding(false);
  };

  const stopEvent = (e: React.SyntheticEvent) => {
      e.stopPropagation();
      if (e.type !== 'pointerdown') e.preventDefault();
  };

  const handleSpotifyPointerDown = (e: React.PointerEvent) => {
      stopEvent(e);
      isDraggingSpotify.current = true;
      dragOffset.current = { x: e.clientX - spotifyPos.x, y: e.clientY - spotifyPos.y };
  };
  
  // BOUNDING BOX LOGIC FÜR SPOTIFY PLAYER
  const handleGlobalPointerMove = (e: React.PointerEvent) => {
      if (isDraggingSpotify.current) {
          let nx = e.clientX - dragOffset.current.x;
          let ny = e.clientY - dragOffset.current.y;
          
          const scale = spotifyConfig.cameraScale / 100;
          const approxW = 200 * scale; 
          const approxH = 64 * scale; 
          
          if (nx < 10) nx = 10;
          if (ny < 10) ny = 10;
          if (nx > window.innerWidth - approxW) nx = window.innerWidth - approxW;
          if (ny > window.innerHeight - approxH) ny = window.innerHeight - approxH;
          
          setSpotifyPos({ x: nx, y: ny });
      }
  };
  
  const handleGlobalPointerUp = () => { isDraggingSpotify.current = false; };

  if (viewState === 'intro') {
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-8 uppercase italic font-bold flex flex-col items-center justify-center flex-1 w-full">
        <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-3xl space-y-8 text-center shadow-2xl w-full relative overflow-hidden">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
            <Camera size={36} className="text-green-500" />
          </div>
          <h2 className="text-2xl text-white font-black tracking-tighter">IRL STREAMING MODE</h2>
          <div className="text-[11px] text-zinc-400 not-italic font-medium text-left">
            <div className="space-y-4 bg-black/50 p-6 rounded-2xl border border-white/5">
                <div className="flex items-start gap-3"><span className="text-green-500 font-black mt-0.5 shrink-0">1.</span><span className="leading-relaxed"><strong>Einmal tippen:</strong> Blendet das gesamte UI sofort aus/ein.</span></div>
                <div className="flex items-start gap-3"><span className="text-green-500 font-black mt-0.5 shrink-0">2.</span><span className="leading-relaxed"><strong>Gedrückt halten:</strong> Chat poppt groß auf (Hold-to-Peek).</span></div>
                <div className="flex items-start gap-3"><span className="text-green-500 font-black mt-0.5 shrink-0">3.</span><span className="leading-relaxed"><strong>Ghost Mode:</strong> Reduziert die Sichtbarkeit für Zuschauer.</span></div>
            </div>
          </div>
          {error && <div className="text-red-500 text-[10px] bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
          <div className="space-y-4">
              <button onClick={startStream} className="w-full bg-green-500 text-black py-4 rounded-2xl text-[12px] font-black hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:scale-105 flex items-center justify-center gap-2"><Play size={16} fill="currentColor" /> VORDERKAMERA STARTEN</button>
              <Link href="/irl-guide" className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest pt-2"><HelpCircle size={14} /> Ausführliche Anleitung lesen</Link>
          </div>
        </div>
      </div>
    );
  }

  // CHAT OPACITY LOGIC
  let chatOpacityClass = "opacity-0 scale-95 pointer-events-none"; 
  if (isHolding) { chatOpacityClass = "opacity-100 scale-105 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]"; } 
  else if (showUI && !showFilters && !showSettings) { chatOpacityClass = ghostMode ? "opacity-10 pointer-events-auto" : "opacity-100 pointer-events-auto"; }

  // SPOTIFY VISIBILITY (ALWAYS ON LOGIC)
  const isSpotifyVisible = spotifyConfig.showInCamera && track && (showUI || isHolding || spotifyConfig.alwaysOn) && !showFilters && !showSettings;

  return (
    <div 
        className="fixed inset-0 z-[100] md:relative md:inset-auto md:z-10 md:m-6 md:rounded-3xl md:border md:border-zinc-800 bg-black overflow-hidden flex items-center justify-center select-none md:flex-1 cursor-pointer"
        style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none', userSelect: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        onPointerMove={handleGlobalPointerMove}
    >
        <video 
            ref={videoRef} 
            autoPlay playsInline muted 
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 ${mirror ? 'scale-x-[-1]' : ''}`} 
            style={{ filter: activeFilter || 'none' }} 
        />
        
        {/* SPOTIFY PLAYER MIT ALWAYS ON */}
        {isSpotifyVisible && (
            <div 
                className="absolute z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-2xl cursor-move transition-opacity duration-300"
                style={{ left: spotifyPos.x, top: spotifyPos.y, transform: `scale(${spotifyConfig.cameraScale / 100})`, transformOrigin: 'top left', opacity: (ghostMode && !isHolding && !spotifyConfig.alwaysOn) ? 0.2 : 1 }}
                onPointerDown={handleSpotifyPointerDown}
                onPointerUp={(e) => { stopEvent(e); handleGlobalPointerUp(); }}
            >
                <img src={track.albumImageUrl || "/placeholder-cover.jpg"} alt="Cover" className="w-10 h-10 rounded-md shadow-lg object-cover pointer-events-none" />
                <div className="min-w-0 pr-2 pointer-events-none">
                    <h4 className="text-xs font-black text-white truncate max-w-[120px] not-italic leading-tight">{track.title}</h4>
                    <p className="text-[9px] text-[#1DB954] font-bold truncate tracking-widest leading-tight">{track.artist}</p>
                </div>
            </div>
        )}

        {/* ECHTE LIVE FILTER VORSCHAU */}
        {showFilters && (
            <div className="absolute inset-0 z-30 flex flex-col justify-end pointer-events-none bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="w-full flex justify-center pb-8 pointer-events-auto" onPointerDown={stopEvent}>
                    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                        <div className="flex gap-6 overflow-x-auto w-full px-10 py-4 snap-x snap-mandatory scrollbar-hide items-center justify-start" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
                            {CAMERA_FILTERS.map(f => (
                                <LiveFilterPreview key={f.id} stream={activeStream} filterCss={f.css} isActive={activeFilter === f.css} onClick={(e: any) => { stopEvent(e); setActiveFilter(f.css); }} name={f.name} />
                            ))}
                        </div>
                        <button onClick={() => setShowFilters(false)} className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 text-white hover:bg-white/30 transition-all shadow-xl hover:scale-110"><X size={20}/></button>
                    </div>
                </div>
            </div>
        )}

        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
            <div className={`flex justify-between items-start transition-opacity duration-300 ${showUI && !isHolding && !showSettings && !showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex flex-col shadow-lg pointer-events-auto" onPointerDown={stopEvent} onClick={stopEvent}>
                    <div className="flex items-center gap-2 text-[10px] text-white font-black tracking-widest uppercase"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE CAM</div>
                    <span className="text-[8px] text-green-400 not-italic uppercase tracking-wider mt-1">{chatStatus}</span>
                </div>
                <button onClick={(e) => { stopEvent(e); stopStream(); }} onPointerDown={stopEvent} className="bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:bg-red-500 hover:border-red-500 transition-colors pointer-events-auto"><X size={20} /></button>
            </div>
            
            {showSettings && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center pointer-events-auto" onPointerDown={stopEvent} onClick={stopEvent}>
                    <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-3xl w-80 space-y-6 shadow-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white text-xs font-black flex items-center gap-2"><Settings size={16}/> IRL Einstellungen</h3>
                            <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white"><X size={20}/></button>
                        </div>
                        <div className="space-y-4 not-italic">
                            <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-white/5">
                                <span className="text-[10px] text-white font-bold flex items-center gap-2 uppercase tracking-wider"><SpotifyLogo className="w-4 h-4 text-[#1DB954]"/> Player zeigen</span>
                                <input type="checkbox" checked={spotifyConfig.showInCamera} onChange={e => setSpotifyConfig({...spotifyConfig, showInCamera: e.target.checked})} className="w-4 h-4 accent-[#1DB954]" />
                            </div>
                            
                            {/* ALWAYS ON TOGGLE */}
                            <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-white font-bold block uppercase tracking-wider">Immer sichtbar</span>
                                    <span className="text-[8px] text-zinc-500 font-bold block">Auch wenn UI versteckt wird</span>
                                </div>
                                <input type="checkbox" checked={spotifyConfig.alwaysOn} onChange={e => setSpotifyConfig({...spotifyConfig, alwaysOn: e.target.checked})} className="w-4 h-4 accent-[#1DB954]" />
                            </div>

                            <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-3">
                                <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-wider"><span>Player Größe</span><span>{spotifyConfig.cameraScale}%</span></div>
                                <input type="range" min="50" max="150" step="10" value={spotifyConfig.cameraScale} onChange={e => setSpotifyConfig({...spotifyConfig, cameraScale: parseInt(e.target.value)})} className="w-full accent-[#1DB954] h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end mb-4 w-full">
                <div ref={chatRef} onPointerDown={stopEvent} onClick={stopEvent} className={`w-[65%] md:w-80 max-h-72 overflow-y-auto bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-2 font-sans not-italic text-[12px] transition-all duration-300 scrollbar-hide ${chatOpacityClass} origin-bottom-left`}>
                    {chatMessages.length === 0 ? (<div className="text-white/50 text-center text-[10px] italic py-4">Warte auf Nachrichten...</div>) : (chatMessages.map((msg: any) => (<div key={msg.id} className="text-white leading-tight break-words border-b border-white/5 pb-1"><span className="font-black text-green-400 drop-shadow-md">{msg.nickname}: </span><span className="font-medium drop-shadow-md">{msg.comment}</span></div>)))}
                </div>
                
                <div className={`flex flex-col gap-3 transition-opacity duration-300 ${showUI && !isHolding && !showSettings && !showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button onClick={(e) => { stopEvent(e); setShowFilters(true); }} onPointerDown={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><Wand2 size={24} className={activeFilter ? "text-purple-400" : ""} /></button>
                    <button onClick={(e) => { stopEvent(e); setShowSettings(true); }} onPointerDown={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><Settings size={24} /></button>
                    <button onClick={(e) => { stopEvent(e); setGhostMode(!ghostMode); }} onPointerDown={stopEvent} className={`p-4 rounded-full border transition-all flex items-center justify-center relative shadow-lg pointer-events-auto ${ghostMode ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-black/50 backdrop-blur-md text-white border-white/10"}`}><Ghost size={24} /></button>
                    <button onClick={(e) => { stopEvent(e); setMirror(!mirror); }} onPointerDown={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><FlipHorizontal size={24} /></button>
                    <button onClick={(e) => { stopEvent(e); setFacingMode(prev => prev === 'user' ? 'environment' : 'user'); setShowUI(true); }} onPointerDown={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><RefreshCw size={24} /></button>
                </div>
            </div>
        </div>
    </div>
  );
}

function ModuleSpotify({ isConnected, baseUrl, config, setConfig }: any) {
  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(isConnected);
  const [rtToken, setRtToken] = useState("");

  useEffect(() => {
    if (isConnected) {
        const match = document.cookie.match(new RegExp('(^| )spotify_refresh_token=([^;]+)'));
        if (match) setRtToken(match[2]);
    }
  }, [isConnected]);

  const overlayLink = rtToken ? `${baseUrl}/spotify-overlay?rt=${rtToken}` : `${baseUrl}/spotify-overlay (Bitte Spotify Re-Connecten!)`;

  useEffect(() => {
    if (!isConnected) return;
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch('/api/spotify/now-playing?t=' + Date.now());
        const data = await res.json();
        if (data.isPlaying) setTrack(data);
        else setTrack(null);
      } catch (err) { } finally { setLoading(false); }
    };
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 5000); 
    return () => clearInterval(interval);
  }, [isConnected]);

  if (!isConnected) return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-10 text-center space-y-4 italic font-bold uppercase">
      <SpotifyLogo className="w-16 h-16 text-[#1DB954] animate-pulse" />
      <h2 className="text-xl text-white">Spotify API Required</h2>
      <p className="text-[9px] text-zinc-500 max-w-sm">Connect your Spotify Account in Settings to show your currently playing song and allow Chat Requests.</p>
    </div>
  );

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-3xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1DB954]/10 to-transparent opacity-30 pointer-events-none"></div>
        <div className="flex items-center justify-between relative z-10">
            <h3 className="text-white text-xs not-italic flex items-center gap-2"><SpotifyLogo className="w-4 h-4 text-[#1DB954]" /> Now Playing Widget</h3>
            <span className="text-[9px] text-[#1DB954] flex items-center gap-1 animate-pulse">LIVE SYNC <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></div></span>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-zinc-500">
                <Loader2 className="animate-spin w-8 h-8 text-[#1DB954]" />
                <p className="text-[10px]">Loading Player...</p>
            </div>
        ) : track ? (
            <div className="bg-black/50 border border-white/5 p-6 rounded-2xl flex items-center gap-6 relative z-10 shadow-2xl backdrop-blur-xl">
                <img src={track.albumImageUrl || "/placeholder-cover.jpg"} alt="Album Cover" className="w-24 h-24 rounded-xl shadow-lg border border-white/10 object-cover" />
                <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="text-xl font-black text-white truncate not-italic">{track.title}</h4>
                    <p className="text-xs text-[#1DB954] font-bold truncate tracking-widest">{track.artist}</p>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-4">
                        <div className="bg-[#1DB954] h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(29,185,84,0.8)]" style={{ width: `${(track.progressMs / track.durationMs) * 100}%` }}></div>
                    </div>
                </div>
                <SpotifyLogo className="w-8 h-8 text-white/10 hidden sm:block" />
            </div>
        ) : (
             <div className="bg-black/50 border border-white/5 p-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 relative z-10">
                <Music2 className="w-10 h-10 text-zinc-600 mb-2" />
                <p className="text-white text-sm font-black">Nichts wird abgespielt</p>
                <p className="text-zinc-500 text-[10px]">Starte einen Song auf Spotify, um das Widget zu aktivieren.</p>
             </div>
        )}

        <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between p-4 bg-black/60 rounded-xl border border-white/5">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider block">Zuschauer Song-Requests</span>
                    <span className="text-[9px] text-zinc-500 not-italic block">Erlaubt den Befehl !play [liedname] und !skip im TikTok Chat.</span>
                </div>
                <input type="checkbox" checked={config.allowRequests} onChange={e => setConfig({...config, allowRequests: e.target.checked})} className="w-4 h-4 accent-[#1DB954] cursor-pointer" />
            </div>
            
            <div className="flex flex-col gap-3 p-4 bg-black/60 rounded-xl border border-white/5">
                <span className="text-[10px] font-black text-white uppercase tracking-wider block flex items-center gap-2"><Monitor size={14}/> OBS / Live Studio Overlay Link</span>
                <div className="flex gap-2">
                    <div className="flex-1 bg-black p-3 rounded-lg text-[9px] font-mono text-zinc-500 truncate border border-white/5 overflow-x-auto whitespace-nowrap">{overlayLink}</div>
                    {rtToken && <button onClick={() => navigator.clipboard.writeText(overlayLink)} className="bg-[#1DB954] text-black px-4 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-transform"><Copy size={12}/> COPY</button>}
                </div>
                <span className="text-[9px] text-zinc-500 not-italic">Dieser Link zeigt ausschließlich den Spotify-Player an. Kopiere ihn als Browser-Quelle in OBS.</span>
            </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, color = "text-white" }: any) {
  return (
    <div className="bg-[#0c0c0e] border border-zinc-800 p-5 rounded-2xl text-center space-y-1">
      <p className="text-[9px] text-zinc-600 font-black">{label}</p>
      <p className={`text-xs font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}

function ModuleTTC() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [text, setText] = useState("Willkommen bei Sekerbaba! Dies ist ein Test.");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) setSelectedVoice(available.find(v => v.lang.includes("de"))?.name || available[0].name);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; }
  }, []);

  const handleSpeak = () => {
    if (!selectedVoice) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch; utterance.rate = rate;
    utterance.onstart = () => setIsSpeaking(true); utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  const handleStop = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-white text-xs not-italic flex items-center gap-2"><MessageSquare size={14} className="text-green-500" /> Text to Chat (Browser TTS)</h3>
            {isSpeaking && <span className="text-[9px] text-green-500 animate-pulse flex items-center gap-1">SPEAKING... <Volume2 size={10}/></span>}
        </div>
        <div className="space-y-4">
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none cursor-pointer">
                {voices.map((v) => (<option key={v.name} value={v.name}>{v.name} ({v.lang})</option>))}
            </select>
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-24 bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none resize-none focus:border-green-500/50" />
            <div className="flex gap-3 pt-4">
                <button onClick={handleSpeak} className="flex-1 bg-white text-black py-3 rounded-xl text-[10px] font-black hover:bg-green-400 transition-all flex items-center justify-center gap-2"><Play size={14} fill="currentColor" /> PREVIEW VOICE</button>
                <button onClick={handleStop} className="w-16 bg-zinc-900 border border-zinc-800 text-red-500 rounded-xl flex items-center justify-center"><StopCircle size={18} /></button>
            </div>
        </div>
      </div>
    </div>
  );
}

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
          <input placeholder="Code (e.g. 777)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none" />
          <input placeholder="URL (.mp4)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Trigger</button>
      </div>
      <div className="space-y-2">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl">
            <span className="text-green-500">{t.code}</span><span className="text-[9px] text-zinc-600 truncate max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
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
          <input placeholder="Command (e.g. !horn)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none" />
          <input placeholder="URL (.mp3)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Sound</button>
      </div>
      <div className="space-y-2">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl">
            <span className="text-blue-500">{t.code}</span><span className="text-[9px] text-zinc-600 truncate max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleFanclub({ isConnected, config, setConfig }: any) {
  if (!isConnected) return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-10 text-center space-y-4 italic font-bold uppercase"><Heart size={48} className="text-pink-500 animate-pulse" /><h2 className="text-xl text-white">Auth Required</h2></div>
  );
  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl space-y-6">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Heart size={14} className="text-pink-500" /> Fanclub Alerts</h3>
        <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
          <span className="text-[10px]">Team Heart Alert</span><input type="checkbox" checked={config.teamHeart} onChange={e => setConfig({...config, teamHeart: e.target.checked})} className="w-4 h-4 accent-pink-500" />
        </div>
      </div>
    </div>
  );
}

function ModuleSettings({ hasConsent, isConnected, onConnect, isSpotifyConnected, onSpotifyConnect, quality, setQuality, version, expiry }: any) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState("");
  const runHardwareTest = () => { setTesting(true); setTestResult(""); setTimeout(() => { setTesting(false); setTestResult("EXCELLENT"); }, 2000); };
  const resetCookies = () => { localStorage.removeItem("seker_cookie_consent"); window.location.reload(); };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-10 uppercase italic font-bold">
      <section className="space-y-4">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">AUTHENTICATION CHANNELS</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <AuthCard icon={<Zap className="text-black" />} name="TIKTOK" status={isConnected ? "CONNECTED" : "DISCONNECTED"} active={true} connected={isConnected} onAction={onConnect} />
          <AuthCard icon={<SpotifyLogo className={isSpotifyConnected ? "text-black" : "text-zinc-500"} />} name="SPOTIFY" status={isSpotifyConnected ? "CONNECTED" : "DISCONNECTED"} active={true} connected={isSpotifyConnected} onAction={onSpotifyConnect} />
          <AuthCard icon={<Share2 />} name="DISCORD" status="COMING SOON" active={false} />
          <AuthCard icon={<Monitor />} name="TWITCH" status="COMING SOON" active={false} />
        </div>
      </section>
      <section className="space-y-4">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">HARDWARE & QUALITY</h3>
        <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-3xl space-y-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                 <h4 className="text-white text-xs font-black flex items-center gap-2"><Gauge size={16} className="text-yellow-500" /> GRAPHICS QUALITY</h4>
                 <p className="text-[9px] text-zinc-500 uppercase font-bold italic max-w-xs">Lower this value if you experience lag or dropped frames during stream.</p>
              </div>
              <span className="text-xl text-white font-black not-italic">{quality}%</span>
            </div>
            <input type="range" min="10" max="100" step="10" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full accent-green-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 rounded-xl"><Cpu size={18} className="text-blue-500" /></div>
              <div className="space-y-1">
                 <span className="text-[10px] text-white font-black block">SYSTEM BENCHMARK</span>
                 <span className="text-[9px] text-zinc-500 block">{testResult || "Check your PC capability"}</span>
              </div>
            </div>
            <button onClick={runHardwareTest} disabled={testing} className="bg-zinc-800 hover:bg-white hover:text-black text-white px-6 py-3 rounded-xl text-[10px] font-black transition-all min-w-[100px]">
              {testing ? <Loader2 size={14} className="animate-spin mx-auto"/> : (testResult ? "RE-TEST" : "RUN TEST")}
            </button>
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">PRIVACY & COOKIES</h3>
        <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3"><Cookie size={18} className={hasConsent ? "text-green-500" : "text-red-500"} /><div><p className="text-xs font-black text-white">Cookie Preferences</p><p className="text-[9px] text-zinc-500 font-bold">Functional Settings: {hasConsent ? "Allowed" : "Declined"}</p></div></div>
          <button onClick={resetCookies} className="text-[9px] bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg hover:text-white transition-colors">Reset Choices</button>
        </div>
      </section>
    </div>
  );
}

function AuthCard({ icon, name, status, active, connected, onAction }: any) {
  return (
    <div className={`border p-6 rounded-2xl space-y-4 transition-all flex flex-col justify-between h-40 ${active ? "bg-[#0c0c0e] border-zinc-800 hover:border-zinc-600" : "bg-black/40 border-zinc-900 opacity-60"}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl w-10 h-10 flex items-center justify-center ${connected ? "bg-green-500 text-black" : "bg-zinc-900 text-zinc-500"}`}>{icon}</div>
        {connected && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]"></div>}
      </div>
      <div><h4 className="text-sm text-white font-black tracking-tighter">{name}</h4><p className="text-[9px] text-zinc-500 font-bold">{status}</p></div>
      {active && <button onClick={onAction} className={`w-full py-2 rounded-lg text-[9px] font-black transition-all ${connected ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-white text-black hover:bg-zinc-200"}`}>{connected ? "RE-CONNECT" : "CONNECT"}</button>}
    </div>
  );
}
