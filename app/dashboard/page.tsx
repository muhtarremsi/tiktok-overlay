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
  ChevronDown, ChevronRight, Wand2, Gamepad2, Bot, Trophy, Video, Gift, Home
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

  const [chatMessages, setChatMessages] = useState<{id: number, nickname: string, comment: string, profilePictureUrl?: string}[]>([]);
  const [chatStatus, setChatStatus] = useState("Warten auf Verbindung...");

  const version = "0.030171"; 
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
    
    if (searchParams.get("connected") === "tiktok") {
        setIsTikTokConnected(true);
        setActiveView("settings");
    }
    if (searchParams.get("connected") === "spotify") {
        setIsSpotifyConnected(true);
        setActiveView("spotify");
    }
  }, [searchParams]);

  useEffect(() => {
    if (hasFunctionalConsent) {
        localStorage.setItem("seker_ttv", JSON.stringify(ttvTriggers));
        localStorage.setItem("seker_sounds", JSON.stringify(soundTriggers));
        localStorage.setItem("seker_perf", perfQuality.toString());
        localStorage.setItem("seker_spotify", JSON.stringify(spotifyConfig));
    }
  }, [ttvTriggers, soundTriggers, perfQuality, spotifyConfig, hasFunctionalConsent]);

  useEffect(() => {
    let pollTimer: any;
    let wipeTimer: any;

    if (!targetUser) {
        setStatus('idle');
    } else if (targetUser.length > 0 && targetUser.length < 3) {
        setStatus('too_short');
    }

    const checkUser = async (userToCheck: string) => {
      if (!userToCheck || userToCheck.length < 3) return;
      try {
        const res = await fetch(`/api/status?u=${userToCheck}`);
        if (res.ok) {
            setStatus('online');
            if (hasFunctionalConsent) localStorage.setItem("seker_target", userToCheck);
        } else {
            setStatus('offline');
            localStorage.removeItem("seker_target");
            wipeTimer = setTimeout(() => {
                setTargetUser("");
                setStatus('idle');
            }, 5000);
        }
      } catch (e) {
          setStatus('offline');
          localStorage.removeItem("seker_target");
          wipeTimer = setTimeout(() => {
              setTargetUser("");
              setStatus('idle');
          }, 5000);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (!targetUser || targetUser.length < 3) return;
      setStatus('checking');
      checkUser(targetUser).then(() => {
        pollTimer = setInterval(() => checkUser(targetUser), 15000);
      });
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
      if (pollTimer) clearInterval(pollTimer);
      if (wipeTimer) clearTimeout(wipeTimer);
    };
  }, [targetUser, hasFunctionalConsent]);

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
                setChatMessages(prev => [...prev.slice(-29), { id: Date.now(), nickname: data.nickname, comment: data.comment, profilePictureUrl: data.profilePictureUrl }]);
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
                setChatMessages(prev => [...prev.slice(-29), { id: Date.now(), nickname: data.nickname, comment: "ist beigetreten 👋", profilePictureUrl: data.profilePictureUrl }]);
            } else if (data.type === 'error') {
                setChatStatus(`Fehler: ${data.message}`);
                eventSource?.close();
            } else if (data.type === 'offline') {
                setStatus('offline');
                setChatStatus('Stream wurde beendet.');
                localStorage.removeItem("seker_target");
                setTimeout(() => {
                    setTargetUser("");
                    setStatus('idle');
                }, 5000);
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
    <div className="flex h-[100dvh] w-screen max-w-[100vw] overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px] uppercase font-bold italic">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm animate-in fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col h-full shrink-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div className="p-5 shrink-0 space-y-6">
            <div className="flex items-center text-white not-italic font-black tracking-tight cursor-pointer" onClick={() => router.push('/')}>
            <SekerLogo className="w-5 h-5 mr-2 text-green-500 shrink-0" /> SEKERBABA
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

        <div 
            className="flex-1 overflow-y-auto scrollbar-hide px-5" 
            style={{ 
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)', 
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' 
            }}
        >
            <div className="h-4"></div>
            <nav className="space-y-6 pb-10">
                <div>
                    <div className="text-[9px] font-black text-zinc-600 px-3 py-2 uppercase tracking-[0.2em] not-italic">DASHBOARD</div>
                    <div className="space-y-1">
                        <SidebarItem icon={<Home size={16} />} label="Overview" active={activeView === "home"} onClick={() => {setActiveView("home"); setSidebarOpen(false);}} />
                    </div>
                </div>

                <div>
                    <div className="text-[9px] font-black text-zinc-600 px-3 py-2 uppercase tracking-[0.2em] not-italic">TIKTOK</div>
                    <div className="space-y-1">
                        <MenuFolder label="TEXT TO" icon={<MessageSquare size={16}/>} defaultOpen={true}>
                            <SidebarSubItem icon={<Volume2 size={14}/>} label="Voice" active={activeView === "ttc"} onClick={() => {setActiveView("ttc"); setSidebarOpen(false);}} />
                            <SidebarSubItem icon={<Video size={14}/>} label="Video" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
                        </MenuFolder>
                        
                        <MenuFolder label="ALERTS" icon={<Zap size={16}/>} defaultOpen={true}>
                            <SidebarSubItem icon={<Music size={14}/>} label="Sounds" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
                            <SidebarSubItem icon={<Gift size={14}/>} label="Gifts" active={activeView === "gifts"} onClick={() => {setActiveView("gifts"); setSidebarOpen(false);}} />
                            <SidebarSubItem icon={<LogIn size={14}/>} label="Entry" active={activeView === "entry"} onClick={() => {setActiveView("entry"); setSidebarOpen(false);}} />
                        </MenuFolder>

                        <div className="pt-2 space-y-1">
                            <SidebarItem icon={<Camera size={16} />} label="IRL Cam" active={activeView === "camera"} onClick={() => {setActiveView("camera"); setSidebarOpen(false);}} />
                            <SidebarItem icon={<Heart size={16} />} label="Fan Club" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
                            <SidebarItem icon={<SpotifyLogo className="w-4 h-4"/>} label="Spotify" active={activeView === "spotify"} onClick={() => {setActiveView("spotify"); setSidebarOpen(false);}} />
                        </div>
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
        
        <div className="p-5 shrink-0 pt-4 space-y-2 border-t border-white/5 not-italic z-10 bg-black">
           <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} />
           <div className="flex items-center justify-between px-3 py-2 text-zinc-500 uppercase font-bold tracking-widest text-[10px]">
              <div className="flex items-center gap-3"><Globe size={16} /><span>LANGUAGE</span></div><span className="font-mono">EN</span>
           </div>
           <button onClick={async () => { localStorage.clear(); await logout(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold border-2 border-transparent text-red-500 hover:bg-red-500/10 hover:border-red-500/20"><LogOut size={16} /> LOGOUT</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative overflow-x-hidden">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 z-10 relative shrink-0">
          <button className="lg:hidden text-white hover:text-green-500 transition-colors" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <div className="flex items-center gap-2 font-black italic lg:hidden"><SekerLogo className="w-5 h-5 text-green-500" /> SEKERBABA</div>
          <div className="hidden lg:block" />
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 flex flex-col w-full min-w-0">
          {!hasFunctionalConsent && activeView !== 'settings' && activeView !== 'camera' && activeView !== 'home' && (
              <div className="mx-4 sm:mx-6 lg:mx-10 mt-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-[10px] flex items-center gap-3 font-black tracking-widest animate-pulse shrink-0">
                  <Cookie size={16} className="shrink-0" /> ACHTUNG: FUNKTIONALE COOKIES SIND DEAKTIVIERT. TRIGGER WERDEN NICHT GESPEICHERT!
              </div>
          )}
          {activeView === "home" && <ModuleHome targetUser={targetUser} isSpotifyConnected={isSpotifyConnected} ttvCount={ttvTriggers.length} soundCount={soundTriggers.length} setActiveView={setActiveView} />}
          {activeView === "ttv" && <ModuleTTV username={targetUser} baseUrl={baseUrl} triggers={ttvTriggers} setTriggers={setTtvTriggers} />}
          {activeView === "sounds" && <ModuleSounds username={targetUser} baseUrl={baseUrl} triggers={soundTriggers} setTriggers={setSoundTriggers} />}
          {activeView === "ttc" && <ModuleTTC />}
          {activeView === "camera" && <ModuleCamera targetUser={targetUser} chatMessages={chatMessages} chatStatus={chatStatus} spotifyConfig={spotifyConfig} setSpotifyConfig={setSpotifyConfig} isSpotifyConnected={isSpotifyConnected} />}
          {activeView === "fanclub" && <ModuleFanclub isConnected={isTikTokConnected} config={fanclubConfig} setConfig={setFanclubConfig} />}
          {activeView === "spotify" && <ModuleSpotify isConnected={isSpotifyConnected} baseUrl={baseUrl} config={spotifyConfig} setConfig={setSpotifyConfig} />}
          {activeView === "settings" && <ModuleSettings hasConsent={hasFunctionalConsent} isConnected={isTikTokConnected} onConnect={handleTikTokConnect} isSpotifyConnected={isSpotifyConnected} onSpotifyConnect={handleSpotifyConnect} quality={perfQuality} setQuality={setPerfQuality} version={version} expiry={expiryDate} />}
          
          {(activeView === "games" || activeView === "bot" || activeView === "leaderboard" || activeView === "gifts" || activeView === "entry") && <ModuleComingSoon name={activeView} />}
        </div>
      </main>
    </div>
  );
}

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
    const displayName = name === "entry" ? "Entry Alerts" : name === "gifts" ? "Gift Alerts" : name;

    return (
        <div className="h-[70vh] flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-4 italic font-bold uppercase w-full">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center animate-pulse"><Code2 className="text-zinc-600" size={32}/></div>
            <h2 className="text-xl md:text-2xl text-white">IN ENTWICKLUNG</h2>
            <p className="text-[9px] md:text-[10px] text-zinc-500 max-w-sm">Das Modul "{displayName}" wird in einem zukünftigen Update veröffentlicht.</p>
        </div>
    );
}

function InfoCard({ label, value, color = "text-white" }: any) {
  return (
    <div className="bg-[#0c0c0e] border border-zinc-800 p-5 rounded-2xl text-center space-y-1 flex flex-col justify-center h-full">
      <p className="text-[9px] text-zinc-600 font-black">{label}</p>
      <p className={`text-xs font-mono font-bold truncate ${color}`}>{value}</p>
    </div>
  );
}

function ModuleHome({ targetUser, isSpotifyConnected, ttvCount, soundCount, setActiveView }: any) {
  return (
    <div className="p-4 sm:p-6 md:p-10 w-full min-w-0 max-w-5xl mx-auto space-y-6 md:space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-12 rounded-3xl space-y-4 relative overflow-hidden shadow-2xl w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        <h2 className="text-2xl md:text-5xl text-white font-black tracking-tighter relative z-10 break-words">WILLKOMMEN ZURÜCK</h2>
        <p className="text-[10px] md:text-xs text-zinc-400 not-italic font-medium relative z-10 max-w-lg leading-relaxed">
          Dein zentrales Control Panel für interaktive TikTok Live Streams. Konfiguriere deine Overlays oder starte den Mobile IRL Modus.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
        <InfoCard label="LIVE TARGET" value={targetUser ? `@${targetUser}` : "NICHT GESETZT"} color={targetUser ? "text-green-500" : "text-red-500"} />
        <InfoCard label="SPOTIFY API" value={isSpotifyConnected ? "VERBUNDEN" : "OFFLINE"} color={isSpotifyConnected ? "text-[#1DB954]" : "text-zinc-500"} />
        <InfoCard label="VIDEO TRIGGERS" value={ttvCount.toString()} color="text-blue-500" />
        <InfoCard label="SOUND ALERTS" value={soundCount.toString()} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
        <div className="bg-black/50 border border-white/5 p-6 md:p-8 rounded-3xl space-y-6 w-full">
          <h3 className="text-white text-xs md:text-sm font-black flex items-center gap-2"><Zap size={18} className="text-yellow-500 shrink-0" /> QUICK START GUIDE</h3>
          <div className="space-y-4 text-[10px] md:text-xs text-zinc-400 not-italic font-medium">
            <div className="flex gap-3"><span className="text-green-500 font-black">1.</span><p>Trage dein <strong>Live Target</strong> oben links in die Seitenleiste ein, damit der Chat gelesen wird.</p></div>
            <div className="flex gap-3"><span className="text-green-500 font-black">2.</span><p>Erstelle <button onClick={() => setActiveView('ttv')} className="text-white underline hover:text-green-500">Video-Triggers</button> oder <button onClick={() => setActiveView('sounds')} className="text-white underline hover:text-green-500">Sound-Alerts</button>.</p></div>
            <div className="flex gap-3"><span className="text-green-500 font-black">3.</span><p>Kopiere den generierten <strong>OBS Link</strong> aus den Modulen als Browser-Quelle in dein Stream-Programm.</p></div>
          </div>
        </div>

        <div className="bg-black/50 border border-white/5 p-6 md:p-8 rounded-3xl space-y-6 w-full">
          <h3 className="text-white text-xs md:text-sm font-black flex items-center gap-2"><Radio size={18} className="text-blue-500 shrink-0" /> SYSTEM STATUS</h3>
          <div className="space-y-3">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#0c0c0e] p-4 rounded-xl border border-white/5 gap-2">
                <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">WebSockets (Chat)</span>
                <span className="text-[10px] md:text-xs text-green-500 font-black flex items-center gap-2">ONLINE <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div></span>
             </div>
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#0c0c0e] p-4 rounded-xl border border-white/5 gap-2">
                <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">TTS Engine</span>
                <span className="text-[10px] md:text-xs text-green-500 font-black">BEREIT</span>
             </div>
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#0c0c0e] p-4 rounded-xl border border-white/5 gap-2">
                <span className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">TikTok API</span>
                <span className="text-[10px] md:text-xs text-green-500 font-black">VERBUNDEN</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveFilterPreview({ stream, filterCss, isActive, onClick, name }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [startX, setStartX] = useState(0);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div 
            onPointerDown={(e) => { e.stopPropagation(); setStartX(e.clientX); }} 
            onPointerUp={(e) => { 
                e.stopPropagation(); 
                if(Math.abs(e.clientX - startX) < 15) onClick(); 
            }}
            className="relative flex flex-col items-center gap-3 shrink-0 group transition-all duration-300 pointer-events-auto cursor-pointer"
        >
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-green-500 scale-110 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-white/10 scale-100 opacity-60 group-hover:opacity-100'}`}>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ filter: filterCss }} />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors drop-shadow-md ${isActive ? 'text-green-500' : 'text-zinc-400 group-hover:text-white'}`}>{name}</span>
        </div>
    );
}

function ModuleCamera({ targetUser, chatMessages, chatStatus, spotifyConfig, setSpotifyConfig, isSpotifyConnected }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const filtersScrollRef = useRef<HTMLDivElement>(null);
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
  const [isClosingFilters, setIsClosingFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("");
  
  const [cameraZoom, setCameraZoom] = useState(1);

  const CAMERA_FILTERS = [
      { id: 'normal', name: 'Normal', css: '' },
      { id: 'soft', name: 'Weich', css: 'blur(1px) brightness(110%) contrast(105%) saturate(110%)' },
      { id: 'bw', name: 'Vintage', css: 'grayscale(100%) contrast(120%)' },
      { id: 'warm', name: 'Warm', css: 'sepia(40%) saturate(140%) contrast(110%)' },
      { id: 'cold', name: 'Kalt', css: 'saturate(120%) hue-rotate(15deg) contrast(110%)' },
      { id: 'neon', name: 'Neon', css: 'hue-rotate(90deg) saturate(200%) contrast(120%)' },
      { id: 'retro', name: 'Retro', css: 'sepia(80%) contrast(120%) brightness(90%)' }
  ];

  const [track, setTrack] = useState<any>(null);
  const [spotifyState, setSpotifyState] = useState({ x: 20, y: 120, w: 200, h: 64, scale: spotifyConfig.cameraScale / 100 || 1 });
  const [chatState, setChatState] = useState({ x: 20, y: 400, w: 320, h: 280, scale: 1 });

  const [error, setError] = useState("");

  useEffect(() => {
      setChatState(prev => ({ ...prev, y: window.innerHeight - 350 }));
  }, []);

  const startStream = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
      setActiveStream(stream);
      setViewState('fullscreen');
      setMirror(facingMode === 'user');
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
    setCameraZoom(1);
  };

  useEffect(() => {
      if (chatScrollRef.current) chatScrollRef.current.scrollIntoView({ behavior: "smooth" });
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

  const closeFiltersMenu = () => {
      setIsClosingFilters(true);
      setTimeout(() => {
          setShowFilters(false);
          setIsClosingFilters(false);
      }, 300); 
  };

  const activePointers = useRef(new Map());
  const dragInfo = useRef<any>(null);
  const hasDragged = useRef(false);
  const initialPinchDist = useRef<number | null>(null);
  const targetType = useRef<string | null>(null);
  const initialScale = useRef<number | null>(null);

  const handleElementPointerDown = (e: React.PointerEvent, type: string, action: string) => {
      e.stopPropagation(); 
      hasDragged.current = false;
      
      if (action === 'drag' || action === 'resize') {
          dragInfo.current = {
              id: e.pointerId, type, action,
              startX: e.clientX, startY: e.clientY,
              initial: type === 'spotify' ? spotifyState : chatState
          };
      }
      
      activePointers.current.set(e.pointerId, e);
      
      if (activePointers.current.size === 2) {
           dragInfo.current = null; 
           const pts = Array.from(activePointers.current.values());
           const dist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
           initialPinchDist.current = dist;
           targetType.current = type;
           initialScale.current = type === 'spotify' ? spotifyState.scale : chatState.scale;
      }
  };

  const handleRootPointerDown = (e: React.PointerEvent) => { 
      if (showSettings || showFilters) return; 
      hasDragged.current = false;
      
      activePointers.current.set(e.pointerId, e);
      
      if (activePointers.current.size === 2) {
          if (holdTimer.current) clearTimeout(holdTimer.current);
          const pts = Array.from(activePointers.current.values());
          const dist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
          initialPinchDist.current = dist;
          targetType.current = 'camera';
          initialScale.current = cameraZoom;
          return; 
      }

      holdTimer.current = setTimeout(() => { setIsHolding(true); }, 250); 
  };

  const handleGlobalPointerMove = (e: React.PointerEvent) => {
      if (activePointers.current.has(e.pointerId)) {
          activePointers.current.set(e.pointerId, e);
      }

      if (activePointers.current.size === 2 && initialPinchDist.current) {
          hasDragged.current = true;
          const pts = Array.from(activePointers.current.values());
          const dist = Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
          const scaleChange = dist / initialPinchDist.current;
          
          if (targetType.current === 'spotify') setSpotifyState(prev => ({...prev, scale: Math.min(Math.max(0.4, (initialScale.current || 1) * scaleChange), 3)}));
          else if (targetType.current === 'chat') setChatState(prev => ({...prev, scale: Math.min(Math.max(0.4, (initialScale.current || 1) * scaleChange), 3)}));
          else if (targetType.current === 'camera') setCameraZoom(Math.min(Math.max(1, (initialScale.current || 1) * scaleChange), 5)); 
          return;
      }

      if (dragInfo.current && dragInfo.current.id === e.pointerId) {
          const { type, action, startX, startY, initial } = dragInfo.current;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          
          if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged.current = true;
          
          if (action === 'drag') {
              let cw = window.innerWidth;
              let ch = window.innerHeight;
              if (cameraContainerRef.current) {
                  const rect = cameraContainerRef.current.getBoundingClientRect();
                  cw = rect.width;
                  ch = rect.height;
              }
              
              const scale = type === 'spotify' ? spotifyState.scale : chatState.scale;
              const approxW = (type === 'spotify' ? 200 : chatState.w) * scale;
              const approxH = (type === 'spotify' ? 64 : chatState.h) * scale;
              
              let nx = initial.x + dx;
              let ny = initial.y + dy;
              
              if (nx < 0) nx = 0;
              if (ny < 0) ny = 0;
              if (nx > cw - approxW) nx = cw - approxW;
              if (ny > ch - approxH) ny = ch - approxH;

              if(type === 'spotify') setSpotifyState(prev => ({...prev, x: nx, y: ny}));
              if(type === 'chat') setChatState(prev => ({...prev, x: nx, y: ny}));
          } else if (action === 'resize') {
              let cw = window.innerWidth;
              let ch = window.innerHeight;
              if (cameraContainerRef.current) {
                  const rect = cameraContainerRef.current.getBoundingClientRect();
                  cw = rect.width;
                  ch = rect.height;
              }

              let nw = Math.max(200, initial.w + dx);
              let nh = Math.max(150, initial.h + dy);

              if (chatState.x + nw * chatState.scale > cw) nw = (cw - chatState.x) / chatState.scale;
              if (chatState.y + nh * chatState.scale > ch) nh = (ch - chatState.y) / chatState.scale;

              if(type === 'chat') setChatState(prev => ({...prev, w: nw, h: nh}));
          }
      }
  };

  const handleGlobalPointerUp = (e: React.PointerEvent) => {
      activePointers.current.delete(e.pointerId);
      if (dragInfo.current && dragInfo.current.id === e.pointerId) {
          dragInfo.current = null;
      }
      if (activePointers.current.size < 2) {
          initialPinchDist.current = null;
      }
  };

  const handleRootPointerUp = (e: React.PointerEvent) => {
      handleGlobalPointerUp(e); 
      if (hasDragged.current) {
          hasDragged.current = false;
          return; 
      }
      if (showSettings || showFilters) {
          if(showSettings) setShowSettings(false);
          if(showFilters && !isClosingFilters) closeFiltersMenu();
          return;
      }
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (isHolding) { setIsHolding(false); } else if (activePointers.current.size === 0) { setShowUI(prev => !prev); }
  };
  
  const handleRootPointerCancel = (e: React.PointerEvent) => {
      handleGlobalPointerUp(e);
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (isHolding) setIsHolding(false);
  };

  const stopEvent = (e: React.SyntheticEvent) => {
      e.stopPropagation();
  };

  const filterDrag = useRef({ isDown: false, startX: 0, scrollLeft: 0 });
  const handleFilterPointerDown = (e: React.PointerEvent) => {
      e.stopPropagation();
      filterDrag.current = { isDown: true, startX: e.pageX - (filtersScrollRef.current?.offsetLeft || 0), scrollLeft: filtersScrollRef.current?.scrollLeft || 0 };
  };
  const handleFilterPointerMove = (e: React.PointerEvent) => {
      if (!filterDrag.current.isDown || !filtersScrollRef.current) return;
      e.preventDefault();
      const x = e.pageX - filtersScrollRef.current.offsetLeft;
      const walk = (x - filterDrag.current.startX) * 2; 
      filtersScrollRef.current.scrollLeft = filterDrag.current.scrollLeft - walk;
  };
  const handleFilterPointerUp = (e: React.PointerEvent) => {
      e.stopPropagation();
      filterDrag.current.isDown = false;
  };

  if (viewState === 'intro') {
    return (
      <div className="p-4 sm:p-6 md:p-10 w-full min-w-0 max-w-2xl mx-auto space-y-8 uppercase italic font-bold flex flex-col items-center justify-center flex-1">
        <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-3xl space-y-8 text-center shadow-2xl w-full relative overflow-hidden">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
            <Camera size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl md:text-2xl text-white font-black tracking-tighter">IRL STREAMING MODE</h2>
          <div className="text-[10px] md:text-[11px] text-zinc-400 not-italic font-medium text-left">
            <div className="space-y-4 bg-black/50 p-5 md:p-6 rounded-2xl border border-white/5">
                <div className="flex items-start gap-3"><span className="text-green-500 font-black mt-0.5 shrink-0">1.</span><span className="leading-relaxed"><strong>Einmal tippen:</strong> Blendet das gesamte UI sofort aus/ein.</span></div>
                <div className="flex items-start gap-3"><span className="text-green-500 font-black mt-0.5 shrink-0">2.</span><span className="leading-relaxed"><strong>Gedrückt halten:</strong> Chat poppt groß auf (Hold-to-Peek).</span></div>
                <div className="flex items-start gap-3"><span className="text-green-500 font-black mt-0.5 shrink-0">3.</span><span className="leading-relaxed"><strong>Gestik (Neu):</strong> 2-Finger Zoom und frei verschieben von Elementen!</span></div>
            </div>
          </div>
          {error && <div className="text-red-500 text-[10px] bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
          <div className="space-y-4">
              <button onClick={startStream} className="w-full bg-green-500 text-black py-4 rounded-2xl text-[11px] md:text-[12px] font-black hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:scale-105 flex items-center justify-center gap-2"><Play size={16} fill="currentColor" /> KAMERA STARTEN</button>
              <Link href="/irl-guide" className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors text-[9px] md:text-[10px] font-bold uppercase tracking-widest pt-2"><HelpCircle size={14} /> Ausführliche Anleitung lesen</Link>
          </div>
        </div>
      </div>
    );
  }

  const isSpotifyVisible = spotifyConfig.showInCamera && track && (showUI || isHolding || spotifyConfig.alwaysOn) && !showFilters && !showSettings;
  const isChatVisible = (showUI || isHolding) && !showFilters && !showSettings;

  return (
    <div 
        ref={cameraContainerRef}
        // HIER IST DER FIX: md:h-[calc(100vh-6rem)] erzwingt eine feste Höhe auf dem Desktop!
        className="fixed inset-0 z-[100] md:relative md:inset-auto md:z-10 md:m-6 md:h-[calc(100dvh-6rem)] md:min-h-[500px] md:rounded-3xl md:border md:border-zinc-800 md:shadow-2xl bg-black overflow-hidden flex items-center justify-center select-none cursor-pointer w-full"
        style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none', touchAction: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={handleRootPointerDown}
        onPointerUp={handleRootPointerUp}
        onPointerLeave={handleRootPointerCancel}
        onPointerCancel={handleRootPointerCancel}
        onPointerMove={handleGlobalPointerMove}
    >
        <video 
            ref={videoRef} 
            autoPlay playsInline muted 
            className="absolute top-0 left-0 w-full h-full object-cover outline-none border-none" 
            style={{ 
                filter: activeFilter || 'none',
                transform: `scaleX(${mirror ? '-1' : '1'}) scale(${cameraZoom})`
            }} 
        />
        
        {isSpotifyVisible && (
            <div 
                className="absolute z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-2xl transition-opacity duration-300 origin-top-left"
                style={{ left: spotifyState.x, top: spotifyState.y, transform: `scale(${spotifyState.scale})`, opacity: (ghostMode && !isHolding && !spotifyConfig.alwaysOn) ? 0.2 : 1 }}
                onPointerDown={(e) => handleElementPointerDown(e, 'spotify', 'drag')}
            >
                <img src={track.albumImageUrl || "/placeholder-cover.jpg"} alt="Cover" className="w-10 h-10 rounded-md shadow-lg object-cover pointer-events-none shrink-0" />
                <div className="min-w-0 pr-2 pointer-events-none">
                    <h4 className="text-xs font-black text-white truncate max-w-[120px] not-italic leading-tight">{track.title}</h4>
                    <p className="text-[9px] text-[#1DB954] font-bold truncate tracking-widest leading-tight">{track.artist}</p>
                </div>
            </div>
        )}

        {isChatVisible && (
            <div 
                className="absolute z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col shadow-2xl transition-opacity duration-300 origin-top-left"
                style={{ 
                    left: chatState.x, top: chatState.y, 
                    width: chatState.w, height: chatState.h, 
                    transform: `scale(${chatState.scale})`,
                    opacity: (ghostMode && !isHolding) ? 0.2 : 1
                }}
                onPointerDown={(e) => handleElementPointerDown(e, 'chat', 'drag')}
            >
                <div className="bg-white/5 border-b border-white/5 p-2 px-3 flex items-center justify-between pointer-events-none rounded-t-2xl shrink-0">
                    <span className="text-[9px] font-black text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> CHAT</span>
                    <span className="text-[8px] text-green-400 font-bold uppercase tracking-wider truncate max-w-[150px]">{chatStatus}</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 scrollbar-hide flex flex-col gap-2 font-sans not-italic text-[12px] break-words whitespace-normal" onPointerDown={stopEvent} onWheel={stopEvent}>
                    {chatMessages.length === 0 ? (
                        <div className="text-white/50 text-center text-[10px] italic py-4">Warte auf Nachrichten...</div>
                    ) : (
                        chatMessages.map((msg: any) => (
                            <div key={msg.id} className="text-white leading-tight break-words border-b border-white/5 pb-2 flex gap-2 items-start">
                                {msg.profilePictureUrl && (
                                    <img src={msg.profilePictureUrl} alt="" className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5 shadow-md border border-white/10" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <span className="font-black text-green-400 drop-shadow-md">{msg.nickname}: </span>
                                    <span className="font-medium drop-shadow-md">{msg.comment}</span>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatScrollRef} />
                </div>

                <div 
                    className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize flex items-end justify-end p-2 opacity-30 hover:opacity-100 z-30"
                    onPointerDown={(e) => handleElementPointerDown(e, 'chat', 'resize')}
                >
                    <div className="w-3 h-3 border-r-2 border-b-2 border-white/50 rounded-br-sm pointer-events-none" />
                </div>
            </div>
        )}

        {showFilters && (
            <div className={`absolute inset-0 z-30 flex flex-col justify-end pointer-events-none bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-300 ease-out ${isClosingFilters ? 'opacity-0 translate-y-10' : 'opacity-100 animate-in fade-in slide-in-from-bottom-10'}`}>
                <div className="w-full flex justify-center pb-8 pointer-events-auto" onPointerDown={stopEvent}>
                    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                        <div 
                            ref={filtersScrollRef}
                            onPointerDown={handleFilterPointerDown}
                            onPointerMove={handleFilterPointerMove}
                            onPointerUp={handleFilterPointerUp}
                            onPointerLeave={handleFilterPointerUp}
                            className="flex gap-6 overflow-x-auto w-full px-10 py-4 snap-x snap-mandatory scrollbar-hide items-center justify-start cursor-grab active:cursor-grabbing" 
                            style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
                        >
                            {CAMERA_FILTERS.map(f => (
                                <LiveFilterPreview 
                                    key={f.id} 
                                    stream={activeStream} 
                                    filterCss={f.css} 
                                    isActive={activeFilter === f.css} 
                                    onClick={() => { setActiveFilter(f.css); }} 
                                    name={f.name} 
                                />
                            ))}
                        </div>
                        <button onClick={(e) => { stopEvent(e); closeFiltersMenu(); }} onPointerDown={stopEvent} onPointerUp={stopEvent} className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 text-white hover:bg-white/30 transition-all shadow-xl hover:scale-110"><X size={20}/></button>
                    </div>
                </div>
            </div>
        )}

        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-10">
            <div className={`flex justify-end items-start transition-opacity duration-300 ${showUI && !isHolding && !showSettings && !showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center gap-3 pointer-events-auto">
                    <div className="bg-black/50 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg flex items-center justify-center" onPointerDown={stopEvent} onClick={stopEvent} onPointerUp={stopEvent}>
                        <SekerLogo className="w-6 h-6 text-green-500" />
                    </div>
                    <button onClick={(e) => { stopEvent(e); stopStream(); }} onPointerDown={stopEvent} onPointerUp={stopEvent} className="bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:bg-red-500 hover:border-red-500 transition-colors shadow-lg">
                        <X size={20} />
                    </button>
                </div>
            </div>
            
            {showSettings && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center pointer-events-auto" onPointerDown={stopEvent} onPointerUp={stopEvent} onClick={stopEvent}>
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
                            <div className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-white/5">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-white font-bold block uppercase tracking-wider">Immer sichtbar</span>
                                    <span className="text-[8px] text-zinc-500 font-bold block">Auch wenn UI versteckt</span>
                                </div>
                                <input type="checkbox" checked={spotifyConfig.alwaysOn} onChange={e => setSpotifyConfig({...spotifyConfig, alwaysOn: e.target.checked})} className="w-4 h-4 accent-[#1DB954]" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end w-full">
                <div className="w-10"></div> 
                <div className={`flex flex-col gap-3 transition-opacity duration-300 ${showUI && !isHolding && !showSettings && !showFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button onClick={(e) => { stopEvent(e); setShowFilters(true); }} onPointerDown={stopEvent} onPointerUp={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><Wand2 size={24} className={activeFilter !== "" ? "text-purple-400" : ""} /></button>
                    <button onClick={(e) => { stopEvent(e); setShowSettings(true); }} onPointerDown={stopEvent} onPointerUp={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><Settings size={24} /></button>
                    <button onClick={(e) => { stopEvent(e); setGhostMode(!ghostMode); }} onPointerDown={stopEvent} onPointerUp={stopEvent} className={`p-4 rounded-full border transition-all flex items-center justify-center relative shadow-lg pointer-events-auto ${ghostMode ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-black/50 backdrop-blur-md text-white border-white/10"}`}><Ghost size={24} /></button>
                    <button onClick={(e) => { stopEvent(e); setMirror(!mirror); }} onPointerDown={stopEvent} onPointerUp={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><FlipHorizontal size={24} /></button>
                    <button onClick={(e) => { stopEvent(e); setFacingMode(prev => { const nm = prev === 'user' ? 'environment' : 'user'; setMirror(nm === 'user'); return nm;}); setShowUI(true); }} onPointerDown={stopEvent} onPointerUp={stopEvent} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all shadow-lg pointer-events-auto"><RefreshCw size={24} /></button>
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
    <div className="h-[70vh] flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-4 italic font-bold uppercase w-full min-w-0">
      <SpotifyLogo className="w-16 h-16 text-[#1DB954] animate-pulse shrink-0" />
      <h2 className="text-xl text-white">Spotify API Required</h2>
      <p className="text-[9px] text-zinc-500 max-w-sm px-4">Connect your Spotify Account in Settings to show your currently playing song and allow Chat Requests.</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-10 w-full max-w-3xl mx-auto space-y-6 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-4 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden w-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1DB954]/10 to-transparent opacity-30 pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative z-10 w-full">
            <h3 className="text-white text-[10px] sm:text-xs not-italic flex items-center gap-2"><SpotifyLogo className="w-4 h-4 text-[#1DB954] shrink-0" /> Now Playing Widget</h3>
            <span className="text-[9px] text-[#1DB954] flex items-center gap-1 animate-pulse shrink-0">LIVE SYNC <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></div></span>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-zinc-500 w-full">
                <Loader2 className="animate-spin w-8 h-8 text-[#1DB954]" />
                <p className="text-[10px]">Loading Player...</p>
            </div>
        ) : track ? (
            <div className="bg-black/50 border border-white/5 p-4 sm:p-6 rounded-2xl flex flex-row items-center gap-3 sm:gap-6 relative z-10 shadow-2xl backdrop-blur-xl w-full overflow-hidden">
                <img src={track.albumImageUrl || "/placeholder-cover.jpg"} alt="Album Cover" className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl shadow-lg border border-white/10 object-cover shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-sm sm:text-xl font-black text-white truncate not-italic w-full">{track.title}</h4>
                    <p className="text-[9px] sm:text-xs text-[#1DB954] font-bold truncate tracking-widest mt-0.5 w-full">{track.artist}</p>
                    <div className="w-full bg-zinc-900 h-1 sm:h-1.5 rounded-full overflow-hidden mt-3 sm:mt-4">
                        <div className="bg-[#1DB954] h-full transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(29,185,84,0.8)]" style={{ width: `${(track.progressMs / track.durationMs) * 100}%` }}></div>
                    </div>
                </div>
                <SpotifyLogo className="w-6 h-6 sm:w-8 sm:h-8 text-white/10 hidden sm:block shrink-0 absolute right-4 top-4 sm:right-6 sm:top-6" />
            </div>
        ) : (
             <div className="bg-black/50 border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 relative z-10 w-full">
                <Music2 className="w-8 h-8 text-zinc-600 mb-1 shrink-0" />
                <p className="text-white text-xs md:text-sm font-black">Nichts wird abgespielt</p>
                <p className="text-zinc-500 text-[9px] md:text-[10px] max-w-[200px] mx-auto">Starte einen Song auf Spotify, um das Widget zu aktivieren.</p>
             </div>
        )}

        <div className="flex flex-col gap-4 relative z-10 w-full">
            <div className="flex flex-row items-center justify-between p-4 bg-black/60 rounded-xl border border-white/5 gap-3 w-full">
                <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider block">Zuschauer Song-Requests</span>
                    <span className="text-[8px] sm:text-[9px] text-zinc-500 not-italic block mt-1 break-words whitespace-normal leading-snug">
                        Erlaubt den Befehl !play [liedname] und !skip im TikTok Chat.
                    </span>
                </div>
                <input type="checkbox" checked={config.allowRequests} onChange={e => setConfig({...config, allowRequests: e.target.checked})} className="w-5 h-5 accent-[#1DB954] cursor-pointer shrink-0" />
            </div>
            
            <div className="flex flex-col gap-3 p-4 bg-black/60 rounded-xl border border-white/5 w-full">
                <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-2 shrink-0"><Monitor size={14}/> OBS / Live Studio Link</span>
                
                {/* NEUER SCROLLBARER OBS LINK */}
                <div className="flex flex-col gap-2 w-full">
                    <div className="w-full bg-black p-3 rounded-lg border border-white/5 overflow-x-auto scrollbar-hide">
                        <div className="text-[9px] font-mono text-zinc-500 whitespace-nowrap inline-block pr-4">
                            {overlayLink}
                        </div>
                    </div>
                    {rtToken && <button onClick={() => navigator.clipboard.writeText(overlayLink)} className="w-full bg-[#1DB954] text-black px-4 py-3 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 hover:scale-105 transition-transform"><Copy size={12}/> COPY</button>}
                </div>
                
                <span className="text-[8px] sm:text-[9px] text-zinc-500 not-italic whitespace-normal break-words leading-snug">Dieser Link zeigt ausschließlich den Spotify-Player an. Füge ihn als Browser-Quelle in OBS ein.</span>
            </div>
        </div>
      </div>
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
    <div className="p-4 sm:p-6 md:p-10 w-full min-w-0 max-w-4xl mx-auto space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6 w-full min-w-0">
        <div className="flex items-center justify-between">
            <h3 className="text-white text-xs not-italic flex items-center gap-2"><MessageSquare size={14} className="text-green-500" /> Text to Chat (Browser TTS)</h3>
            {isSpeaking && <span className="text-[9px] text-green-500 animate-pulse flex items-center gap-1">SPEAKING... <Volume2 size={10}/></span>}
        </div>
        <div className="space-y-4 w-full min-w-0">
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none cursor-pointer">
                {voices.map((v) => (<option key={v.name} value={v.name}>{v.name} ({v.lang})</option>))}
            </select>
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-24 bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none resize-none focus:border-green-500/50" />
            <div className="flex gap-3 pt-4">
                <button onClick={handleSpeak} className="flex-1 bg-white text-black py-3 rounded-xl text-[10px] font-black hover:bg-green-400 transition-all flex items-center justify-center gap-2"><Play size={14} fill="currentColor" /> PREVIEW VOICE</button>
                <button onClick={handleStop} className="w-16 shrink-0 bg-zinc-900 border border-zinc-800 text-red-500 rounded-xl flex items-center justify-center"><StopCircle size={18} /></button>
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
    <div className="p-4 sm:p-6 md:p-10 w-full min-w-0 max-w-4xl mx-auto space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-4 w-full min-w-0">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Plus size={14} /> Add Video Trigger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
          <input placeholder="Code (e.g. 777)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none w-full min-w-0" />
          <input placeholder="URL (.mp4)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none w-full min-w-0" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Trigger</button>
      </div>
      <div className="space-y-2 w-full min-w-0">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl w-full min-w-0 gap-3">
            <span className="text-green-500 shrink-0">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate italic flex-1 min-w-0">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
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
    <div className="p-4 sm:p-6 md:p-10 w-full min-w-0 max-w-4xl mx-auto space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-4 w-full min-w-0">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Music size={14} /> Add Sound Trigger</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
          <input placeholder="Command (e.g. !horn)" value={newCode} onChange={e => setNewCode(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none w-full min-w-0" />
          <input placeholder="URL (.mp3)" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="bg-black border border-zinc-800 p-3 rounded text-xs text-white outline-none w-full min-w-0" />
        </div>
        <button onClick={add} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black hover:bg-zinc-200 transition-all">Add Sound</button>
      </div>
      <div className="space-y-2 w-full min-w-0">
        {triggers.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl w-full min-w-0 gap-3">
            <span className="text-blue-500 shrink-0">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate italic flex-1 min-w-0">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500 shrink-0"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleFanclub({ isConnected, config, setConfig }: any) {
  if (!isConnected) return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-6 md:p-10 text-center space-y-4 italic font-bold uppercase w-full min-w-0"><Heart size={48} className="text-pink-500 animate-pulse shrink-0" /><h2 className="text-xl text-white">Auth Required</h2></div>
  );
  return (
    <div className="p-4 sm:p-6 md:p-10 w-full min-w-0 max-w-2xl mx-auto space-y-6 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-2xl space-y-6 w-full min-w-0">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Heart size={14} className="text-pink-500" /> Fanclub Alerts</h3>
        <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5 w-full min-w-0">
          <span className="text-[10px]">Team Heart Alert</span><input type="checkbox" checked={config.teamHeart} onChange={e => setConfig({...config, teamHeart: e.target.checked})} className="w-4 h-4 accent-pink-500 shrink-0" />
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
    <div className="p-4 sm:p-6 md:p-12 w-full min-w-0 max-w-5xl mx-auto space-y-8 md:space-y-10 uppercase italic font-bold">
      <section className="space-y-4 w-full min-w-0">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">AUTHENTICATION CHANNELS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 w-full min-w-0">
          <AuthCard icon={<Zap className="text-black" />} name="TIKTOK" status={isConnected ? "CONNECTED" : "DISCONNECTED"} active={true} connected={isConnected} onAction={onConnect} />
          <AuthCard icon={<SpotifyLogo className={isSpotifyConnected ? "text-black" : "text-zinc-500"} />} name="SPOTIFY" status={isSpotifyConnected ? "CONNECTED" : "DISCONNECTED"} active={true} connected={isSpotifyConnected} onAction={onSpotifyConnect} />
          <AuthCard icon={<Share2 />} name="DISCORD" status="COMING SOON" active={false} />
          <AuthCard icon={<Monitor />} name="TWITCH" status="COMING SOON" active={false} />
        </div>
      </section>
      <section className="space-y-4 w-full min-w-0">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">HARDWARE & QUALITY</h3>
        <div className="bg-[#0c0c0e] border border-zinc-800 p-6 md:p-8 rounded-3xl space-y-8 w-full min-w-0">
          <div className="flex flex-col gap-4 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 w-full min-w-0">
              <div className="space-y-1 w-full min-w-0">
                 <h4 className="text-white text-xs font-black flex items-center gap-2"><Gauge size={16} className="text-yellow-500 shrink-0" /> GRAPHICS QUALITY</h4>
                 <p className="text-[9px] text-zinc-500 uppercase font-bold italic max-w-xs break-words whitespace-normal">Lower this value if you experience lag or dropped frames during stream.</p>
              </div>
              <span className="text-xl text-white font-black not-italic">{quality}%</span>
            </div>
            <input type="range" min="10" max="100" step="10" value={quality} onChange={(e) => setQuality(parseInt(e.target.value))} className="w-full accent-green-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full min-w-0">
            <div className="flex items-center gap-4 w-full min-w-0">
              <div className="p-3 bg-zinc-900 rounded-xl shrink-0"><Cpu size={18} className="text-blue-500" /></div>
              <div className="space-y-1 w-full min-w-0">
                 <span className="text-[10px] text-white font-black block">SYSTEM BENCHMARK</span>
                 <span className="text-[9px] text-zinc-500 block truncate">{testResult || "Check your PC capability"}</span>
              </div>
            </div>
            <button onClick={runHardwareTest} disabled={testing} className="w-full sm:w-auto bg-zinc-800 hover:bg-white hover:text-black text-white px-6 py-3 rounded-xl text-[10px] font-black transition-all shrink-0">
              {testing ? <Loader2 size={14} className="animate-spin mx-auto"/> : (testResult ? "RE-TEST" : "RUN TEST")}
            </button>
          </div>
        </div>
      </section>
      <section className="space-y-4 w-full min-w-0">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">PRIVACY & COOKIES</h3>
        <div className="bg-[#0c0c0e] border border-zinc-800 p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full min-w-0">
          <div className="flex items-center gap-3 w-full min-w-0">
              <Cookie size={18} className={`shrink-0 ${hasConsent ? "text-green-500" : "text-red-500"}`} />
              <div className="w-full min-w-0">
                  <p className="text-xs font-black text-white truncate">Cookie Preferences</p>
                  <p className="text-[9px] text-zinc-500 font-bold truncate">Functional Settings: {hasConsent ? "Allowed" : "Declined"}</p>
              </div>
          </div>
          <button onClick={resetCookies} className="w-full sm:w-auto text-[9px] bg-zinc-900 border border-zinc-800 px-4 py-3 sm:py-2 rounded-lg hover:text-white transition-colors shrink-0">Reset Choices</button>
        </div>
      </section>
    </div>
  );
}

function AuthCard({ icon, name, status, active, connected, onAction }: any) {
  return (
    <div className={`border p-5 md:p-6 rounded-2xl space-y-4 transition-all flex flex-col justify-between h-36 md:h-40 w-full min-w-0 ${active ? "bg-[#0c0c0e] border-zinc-800 hover:border-zinc-600" : "bg-black/40 border-zinc-900 opacity-60"}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl w-10 h-10 flex items-center justify-center shrink-0 ${connected ? "bg-green-500 text-black" : "bg-zinc-900 text-zinc-500"}`}>{icon}</div>
        {connected && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)] shrink-0"></div>}
      </div>
      <div className="w-full min-w-0">
          <h4 className="text-sm text-white font-black tracking-tighter truncate">{name}</h4>
          <p className="text-[9px] text-zinc-500 font-bold truncate">{status}</p>
      </div>
      {active && <button onClick={onAction} className={`w-full py-2 rounded-lg text-[9px] font-black transition-all shrink-0 ${connected ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-white text-black hover:bg-zinc-200"}`}>{connected ? "RE-CONNECT" : "CONNECT"}</button>}
    </div>
  );
}
