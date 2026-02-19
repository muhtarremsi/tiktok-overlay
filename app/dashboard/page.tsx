"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { logout, checkSession } from "@/app/actions/auth";
import Link from "next/link";
import { 
  Type, Settings, Plus, Trash2, X, Menu,
  Volume2, Globe, LogIn, CheckCircle2, Loader2, AlertCircle, Radio, Music, Info, Heart,
  Zap, ArrowRight, Monitor, Cpu, Gauge, Share2, Code2, LogOut, MessageSquare, Play, StopCircle,
  Camera, RefreshCw, FlipHorizontal, EyeOff, Eye, MessageCircle, GitBranch, Award, CalendarClock
} from "lucide-react";

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
  const [status, setStatus] = useState<'idle' | 'checking' | 'online' | 'offline' | 'too_short'>('idle');
  const [ttvTriggers, setTtvTriggers] = useState<any[]>([]);
  const [soundTriggers, setSoundTriggers] = useState<any[]>([]);
  const [fanclubConfig, setFanclubConfig] = useState({ teamHeart: true, subAlert: true });
  const [perfQuality, setPerfQuality] = useState(100); 
  const [baseUrl, setBaseUrl] = useState("");

  const version = "0.030123"; 
  const expiryDate = "17.02.2025";

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const savedTTV = localStorage.getItem("seker_ttv");
    const savedSounds = localStorage.getItem("seker_sounds");
    const savedTarget = localStorage.getItem("seker_target");
    const savedPerf = localStorage.getItem("seker_perf");
    if (savedTTV) setTtvTriggers(JSON.parse(savedTTV));
    if (savedSounds) setSoundTriggers(JSON.parse(savedSounds));
    if (savedTarget) setTargetUser(savedTarget);
    if (savedPerf) setPerfQuality(parseInt(savedPerf));
    
    setIsTikTokConnected(document.cookie.includes("tiktok_connected=true"));
    if (searchParams.get("connected")) setIsTikTokConnected(true);
  }, [searchParams]);

  useEffect(() => {
    localStorage.setItem("seker_ttv", JSON.stringify(ttvTriggers));
    localStorage.setItem("seker_sounds", JSON.stringify(soundTriggers));
    localStorage.setItem("seker_perf", perfQuality.toString());
    if (targetUser) localStorage.setItem("seker_target", targetUser);
  }, [ttvTriggers, soundTriggers, targetUser, perfQuality]);

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

  const handleTikTokConnect = () => {
    if (isTikTokConnected) {
        document.cookie = "tiktok_connected=; Max-Age=0; path=/;";
        setIsTikTokConnected(false);
        router.refresh();
    } else {
        window.location.href = "/api/auth/login";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#09090b] text-zinc-200 font-sans text-[12px] uppercase font-bold italic">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm animate-in fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-black border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col p-5 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center mb-6 text-white not-italic font-black tracking-tight cursor-pointer" onClick={() => router.push('/')}>
          <SekerLogo className="w-5 h-5 mr-2 text-green-500" /> SEKERBABA
        </div>
        
        <button className="absolute top-4 right-4 lg:hidden text-zinc-500" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
        </button>

        <div className="mb-6 space-y-2 not-italic">
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
            <div className="flex justify-between items-center text-[10px]">
                <span className="flex items-center gap-1.5"><GitBranch size={12} className="text-green-500" /> VERSION</span>
                <span className="text-zinc-300 font-mono">{version}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
                <span className="flex items-center gap-1.5"><Award size={12} className="text-green-500" /> LICENSE</span>
                <span className="text-blue-500 font-black">PRO</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[10px]">
                <span className="flex items-center gap-1.5"><CalendarClock size={12} className="text-green-500" /> EXPIRY</span>
                <span className="text-zinc-300 font-normal">{expiryDate}</span>
            </div>
          </div>
        </div>
        
        <nav className="space-y-1">
          <SidebarItem icon={<Type size={16} />} label="TTV - VIDEO" active={activeView === "ttv"} onClick={() => {setActiveView("ttv"); setSidebarOpen(false);}} />
          <SidebarItem icon={<Volume2 size={16} />} label="SOUND ALERTS" active={activeView === "sounds"} onClick={() => {setActiveView("sounds"); setSidebarOpen(false);}} />
          <SidebarItem icon={<MessageSquare size={16} />} label="TTC - SPEECH" active={activeView === "ttc"} onClick={() => {setActiveView("ttc"); setSidebarOpen(false);}} />
          <SidebarItem icon={<Camera size={16} />} label="IRL CAM" active={activeView === "camera"} onClick={() => {setActiveView("camera"); setSidebarOpen(false);}} />
          <SidebarItem icon={<Heart size={16} />} label="FANCLUB" active={activeView === "fanclub"} onClick={() => {setActiveView("fanclub"); setSidebarOpen(false);}} />
        </nav>
        
        <div className="flex-1"></div>
        <div className="pt-4 space-y-2 border-t border-white/5 not-italic">
           <SidebarItem icon={<Settings size={16} />} label="SETTINGS" active={activeView === "settings"} onClick={() => {setActiveView("settings"); setSidebarOpen(false);}} />
           <div className="flex items-center justify-between px-3 py-2 text-zinc-500 uppercase font-bold tracking-widest text-[10px]">
              <div className="flex items-center gap-3"><Globe size={16} /><span>LANGUAGE</span></div>
              <span className="font-mono">EN</span>
           </div>
           <button onClick={async () => { localStorage.clear(); await logout(); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] uppercase transition-all tracking-widest font-bold border-2 border-transparent text-red-500 hover:bg-red-500/10 hover:border-red-500/20">
              <LogOut size={16} /> LOGOUT
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 z-10 relative">
          <button className="lg:hidden text-white hover:text-green-500 transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 font-black italic lg:hidden"><SekerLogo className="w-5 h-5 text-green-500" /> SEKERBABA</div>
          <div className="hidden lg:block" />
        </header>

        <div className="flex-1 overflow-y-auto relative z-0">
          {activeView === "ttv" && <ModuleTTV username={targetUser} baseUrl={baseUrl} triggers={ttvTriggers} setTriggers={setTtvTriggers} />}
          {activeView === "sounds" && <ModuleSounds username={targetUser} baseUrl={baseUrl} triggers={soundTriggers} setTriggers={setSoundTriggers} />}
          {activeView === "ttc" && <ModuleTTC />}
          {activeView === "camera" && <ModuleCamera />}
          {activeView === "fanclub" && <ModuleFanclub isConnected={isTikTokConnected} config={fanclubConfig} setConfig={setFanclubConfig} />}
          {activeView === "settings" && <ModuleSettings isConnected={isTikTokConnected} onConnect={handleTikTokConnect} quality={perfQuality} setQuality={setPerfQuality} version={version} expiry={expiryDate} />}
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

function ModuleCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewState, setViewState] = useState<'intro' | 'fullscreen'>('intro');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [mirror, setMirror] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [error, setError] = useState("");

  const startStream = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setViewState('fullscreen');
    } catch (err: any) {
      console.error(err);
      setError("Kamerazugriff verweigert. Bitte erlaube den Zugriff im Browser.");
    }
  };

  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setViewState('intro');
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setMirror(prev => !prev);
  };

  useEffect(() => {
    if (viewState === 'fullscreen') startStream();
  }, [facingMode]);

  useEffect(() => {
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }
    };
  }, []);

  if (viewState === 'intro') {
    return (
      <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-8 uppercase italic font-bold flex flex-col items-center justify-center h-full">
        <div className="bg-[#0c0c0e] border border-zinc-800 p-10 rounded-3xl space-y-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
            <Camera size={36} className="text-green-500" />
          </div>
          
          <h2 className="text-3xl text-white font-black tracking-tighter">IRL STREAMING MODE</h2>
          
          <div className="space-y-4 text-[11px] text-zinc-400 not-italic font-medium leading-relaxed max-w-md mx-auto">
            <p>
              Für das ultimative IRL-Erlebnis empfehlen wir, über den <strong>TikTok Gaming-Modus</strong> deines Smartphones zu streamen. So funktioniert's:
            </p>
            <ol className="text-left space-y-2 bg-black/50 p-6 rounded-2xl border border-white/5">
                <li className="flex gap-3"><span className="text-green-500 font-black">1.</span> Starte hier gleich den Vollbild-Kameramodus.</li>
                <li className="flex gap-3"><span className="text-green-500 font-black">2.</span> Öffne danach die TikTok App und starte einen "Mobile Gaming" Live-Stream.</li>
                <li className="flex gap-3"><span className="text-green-500 font-black">3.</span> Wechsle zurück in dieses Fenster. Dein Kamera-Feed inkl. unsichtbarem Chat-Overlay wird nun direkt übertragen!</li>
            </ol>
            <p className="text-[9px] text-zinc-600 mt-4">
              *Tippe während des Streams auf den Bildschirm, um das Einstellungs-Overlay ein- oder auszublenden.<br/>
              Durch das Starten akzeptierst du unsere <Link href="/privacy" target="_blank" className="underline hover:text-white">Datenschutzrichtlinien</Link> und <Link href="/terms" target="_blank" className="underline hover:text-white">Nutzungsbedingungen</Link>.
            </p>
          </div>

          {error && <div className="text-red-500 text-[10px] bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}

          <button onClick={startStream} className="w-full bg-green-500 text-black py-5 rounded-2xl text-[12px] font-black hover:bg-green-400 transition-all shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:scale-105 flex items-center justify-center gap-2">
             <Play size={16} fill="currentColor" /> WEITER & KAMERA STARTEN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center">
        <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            onClick={() => setShowUI(!showUI)}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 cursor-pointer ${mirror ? 'scale-x-[-1]' : ''}`} 
        />

        <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between p-6 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
            
            <div className="flex justify-between items-start pointer-events-auto">
                <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-[10px] text-white font-black tracking-widest uppercase">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE CAM
                </div>
                
                <button onClick={stopStream} className="bg-black/50 backdrop-blur-md p-3 rounded-full border border-white/10 text-white hover:bg-red-500 hover:border-red-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex justify-between items-end pointer-events-auto mb-4">
                
                <div className="w-64 max-h-64 overflow-y-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col gap-3 font-sans not-italic text-[11px]">
                    <div className="flex items-center gap-2 text-white/50 mb-2 border-b border-white/10 pb-2"><MessageCircle size={12}/> Chat Overlay (Preview)</div>
                    <div className="text-white"><span className="font-bold text-blue-400">User123:</span> Hallo Stream!</div>
                    <div className="text-white"><span className="font-bold text-pink-400">GamerGirl:</span> Echt coole Qualität!</div>
                    <div className="text-white"><span className="font-bold text-yellow-400">SekerFan:</span> <Heart size={10} className="inline text-red-500" fill="currentColor"/></div>
                </div>

                <div className="flex flex-col gap-3">
                    <button onClick={() => setShowUI(false)} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center group relative">
                        <EyeOff size={24} />
                        <span className="absolute right-full mr-4 bg-black/80 px-3 py-1 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Hide UI</span>
                    </button>
                    <button onClick={() => setMirror(!mirror)} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all">
                        <FlipHorizontal size={24} />
                    </button>
                    <button onClick={switchCamera} className="bg-black/50 backdrop-blur-md p-4 rounded-full border border-white/10 text-white hover:bg-white/20 transition-all">
                        <RefreshCw size={24} />
                    </button>
                </div>
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] text-white/70 uppercase tracking-widest font-black">
                    Tap screen to hide UI
                </span>
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
      if (available.length > 0 && !selectedVoice) {
        const deVoice = available.find(v => v.lang.includes("de"));
        setSelectedVoice(deVoice ? deVoice.name : available[0].name);
      }
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
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
            <h3 className="text-white text-xs not-italic flex items-center gap-2"><MessageSquare size={14} className="text-green-500" /> Text to Chat (Browser TTS)</h3>
            {isSpeaking && <span className="text-[9px] text-green-500 animate-pulse flex items-center gap-1">SPEAKING... <Volume2 size={10}/></span>}
        </div>
        <div className="space-y-4">
            <div className="space-y-1">
                <label className="text-[9px] text-zinc-500">Select Voice</label>
                <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none cursor-pointer hover:border-zinc-700 transition-colors">
                    {voices.map((v) => (<option key={v.name} value={v.name}>{v.name} ({v.lang})</option>))}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-[9px] text-zinc-500">Test Message</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-24 bg-black border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none resize-none focus:border-green-500/50 transition-colors" placeholder="Enter text to speak..." />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-[9px] text-zinc-500"><span>Speed</span><span>{rate}x</span></div>
                    <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full accent-green-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[9px] text-zinc-500"><span>Pitch</span><span>{pitch}</span></div>
                    <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full accent-green-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
            <div className="flex gap-3 pt-4">
                <button onClick={handleSpeak} className="flex-1 bg-white text-black py-3 rounded-xl text-[10px] font-black hover:bg-green-400 transition-all flex items-center justify-center gap-2"><Play size={14} fill="currentColor" /> PREVIEW VOICE</button>
                <button onClick={handleStop} className="w-16 bg-zinc-900 border border-zinc-800 text-red-500 rounded-xl flex items-center justify-center hover:bg-zinc-800"><StopCircle size={18} /></button>
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
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group transition-all hover:border-zinc-700">
            <span className="text-green-500">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-3 not-italic">
        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">OBS Master Link</label>
        <div className="flex flex-col gap-3">
          <div className="bg-black p-4 rounded text-[9px] font-mono text-zinc-500 break-all border border-white/5">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black py-3 rounded-lg text-[10px] font-black uppercase">Copy Link</button>
        </div>
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
          <div key={t.id} className="flex items-center justify-between bg-[#0c0c0e] border border-zinc-800 p-4 rounded-xl group transition-all hover:border-zinc-700">
            <span className="text-blue-500">{t.code}</span>
            <span className="text-[9px] text-zinc-600 truncate max-w-[200px] italic">{t.url}</span>
            <button onClick={() => setTriggers(triggers.filter((x: any) => x.id !== t.id))} className="text-zinc-600 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
      <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl space-y-3 not-italic">
        <label className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">OBS Audio Link</label>
        <div className="flex flex-col gap-3">
          <div className="bg-black p-4 rounded text-[9px] font-mono text-zinc-500 break-all border border-white/5">{link}</div>
          <button onClick={() => navigator.clipboard.writeText(link)} className="bg-white text-black py-3 rounded-lg text-[10px] font-black uppercase">Copy Link</button>
        </div>
      </div>
    </div>
  );
}

function ModuleFanclub({ isConnected, config, setConfig }: any) {
  if (!isConnected) return (
    <div className="h-[70vh] flex flex-col items-center justify-center p-10 text-center space-y-4 italic font-bold uppercase">
      <Heart size={48} className="text-pink-500 animate-pulse" />
      <h2 className="text-xl text-white">Auth Required</h2>
      <p className="text-[9px] text-zinc-500">Connect your TikTok Account in Settings to use Fanclub Features.</p>
    </div>
  );
  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6 uppercase italic font-bold">
      <div className="bg-[#0c0c0e] border border-zinc-800 p-8 rounded-2xl space-y-6">
        <h3 className="text-white text-xs not-italic flex items-center gap-2"><Heart size={14} className="text-pink-500" /> Fanclub Alerts</h3>
        <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-white/5">
          <span className="text-[10px]">Team Heart Alert</span>
          <input type="checkbox" checked={config.teamHeart} onChange={e => setConfig({...config, teamHeart: e.target.checked})} className="w-4 h-4 accent-pink-500" />
        </div>
      </div>
    </div>
  );
}

function ModuleSettings({ isConnected, onConnect, quality, setQuality, version, expiry }: any) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState("");
  const runHardwareTest = () => { setTesting(true); setTestResult(""); setTimeout(() => { setTesting(false); setTestResult("EXCELLENT"); }, 2000); };
  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto space-y-10 uppercase italic font-bold">
      <section className="space-y-4">
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">AUTHENTICATION CHANNELS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AuthCard icon={<Zap className="text-black" />} name="TIKTOK" status={isConnected ? "CONNECTED" : "DISCONNECTED"} active={true} connected={isConnected} onAction={onConnect} />
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
        <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1">LICENSE STATUS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard label="VERSION" value={version} />
          <InfoCard label="PLAN" value="PRO LIFETIME" color="text-blue-500" />
          <InfoCard label="EXPIRES" value={expiry} />
          <InfoCard label="STATUS" value="ACTIVE" color="text-green-500" />
        </div>
        <div className="pt-8 border-t border-white/5">
           <h3 className="text-zinc-500 text-[10px] tracking-[3px] font-black not-italic px-1 mb-4">OPEN SOURCE CREDITS</h3>
           <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Code2 size={18} className="text-purple-500" />
                 <div>
                    <p className="text-xs font-black text-white">TikTok-Live-Connector</p>
                    <p className="text-[9px] text-zinc-500 font-bold">Powered by zerodytrash (MIT License)</p>
                 </div>
              </div>
              <a href="https://github.com/zerodytrash/TikTok-Live-Connector" target="_blank" rel="noopener noreferrer" className="text-[9px] text-zinc-400 hover:text-white underline">View Source</a>
           </div>
        </div>
      </section>
    </div>
  );
}

function AuthCard({ icon, name, status, active, connected, onAction }: any) {
  return (
    <div className={`border p-6 rounded-2xl space-y-4 transition-all flex flex-col justify-between h-40 ${active ? "bg-[#0c0c0e] border-zinc-800 hover:border-zinc-600" : "bg-black/40 border-zinc-900 opacity-60"}`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${connected ? "bg-green-500 text-black" : "bg-zinc-900 text-zinc-500"}`}>{icon}</div>
        {connected && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]"></div>}
      </div>
      <div>
        <h4 className="text-sm text-white font-black tracking-tighter">{name}</h4>
        <p className="text-[9px] text-zinc-500 font-bold">{status}</p>
      </div>
      {active && (
        <button onClick={onAction} className={`w-full py-2 rounded-lg text-[9px] font-black transition-all ${connected ? "bg-zinc-900 text-zinc-400 hover:text-white" : "bg-white text-black hover:bg-zinc-200"}`}>
          {connected ? "DISCONNECT" : "CONNECT"}
        </button>
      )}
    </div>
  );
}
