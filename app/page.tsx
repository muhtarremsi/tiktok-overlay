"use client";

import { useState, useEffect } from "react";
import { Copy, Video, Clock, Key, User, ExternalLink, Activity, Box, Shield, Menu } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [triggerCode, setTriggerCode] = useState("777");
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams({
        u: username,
        c: triggerCode,
        v: videoUrl,
        s: startTime.toString(),
        e: endTime.toString(),
      });
      setGeneratedLink(`${window.location.origin}/overlay?${params.toString()}`);
    }
  }, [username, triggerCode, videoUrl, startTime, endTime]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-arc-bg text-arc-text font-sans selection:bg-arc-yellow selection:text-black">
      
      {/* Sidebar (Fake Navigation für den Look) */}
      <aside className="w-64 border-r border-arc-border bg-arc-panel hidden md:flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-6 h-6 bg-arc-yellow rounded-sm rotate-45"></div>
          <span className="font-bold text-lg tracking-wide">ARC<span className="text-arc-muted">TOOLS</span></span>
        </div>
        
        <nav className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 bg-arc-yellow text-black font-bold rounded">
            <Activity size={18} /> Dashboard
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-arc-muted hover:text-white hover:bg-white/5 rounded transition-colors">
            <Shield size={18} /> Quests
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-arc-muted hover:text-white hover:bg-white/5 rounded transition-colors">
            <Box size={18} /> Lager
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Header Alert Box */}
        <div className="bg-[#1C1E24] border border-arc-yellow/30 rounded-lg p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-arc-yellow"></div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                TikTok Live Trigger <span className="bg-arc-yellow text-black text-[10px] px-2 py-0.5 rounded font-bold uppercase">Neu</span>
              </h1>
              <p className="text-arc-muted text-sm max-w-2xl">
                Verbinde deinen Stream. Wenn ein Moderator den Trigger-Code im Chat nutzt, wird dein Clip abgespielt.
              </p>
            </div>
            <button className="bg-arc-yellow text-black font-bold px-4 py-2 rounded text-sm hover:bg-yellow-400 transition-colors">
              Tutorial ansehen
            </button>
          </div>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card: Settings */}
          <div className="space-y-6">
            <div className="bg-arc-panel border border-arc-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-arc-muted uppercase tracking-wider mb-4 border-b border-arc-border pb-2">Konfiguration</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <User size={16} className="text-arc-yellow" /> TikTok Nutzername
                  </label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="DeinName (ohne @)"
                    className="w-full bg-[#0F1012] border border-arc-border text-white p-3 rounded focus:border-arc-yellow focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Key size={16} className="text-arc-yellow" /> Trigger Code
                  </label>
                  <input 
                    type="text" 
                    value={triggerCode}
                    onChange={(e) => setTriggerCode(e.target.value)}
                    placeholder="777"
                    className="w-full bg-[#0F1012] border border-arc-border text-white p-3 rounded focus:border-arc-yellow focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Media */}
          <div className="space-y-6">
            <div className="bg-arc-panel border border-arc-border rounded-lg p-6">
              <h3 className="text-sm font-bold text-arc-muted uppercase tracking-wider mb-4 border-b border-arc-border pb-2">Medien</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Video size={16} className="text-arc-yellow" /> Video URL
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#0F1012] border border-arc-border text-white p-3 rounded focus:border-arc-yellow focus:outline-none transition-colors pr-10"
                    />
                    <ExternalLink className="absolute right-3 top-3.5 text-arc-muted" size={16} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-arc-muted uppercase mb-1">Start (Sek)</label>
                    <input 
                      type="number" 
                      value={startTime}
                      onChange={(e) => setStartTime(Number(e.target.value))}
                      className="w-full bg-[#0F1012] border border-arc-border text-white p-3 rounded focus:border-arc-yellow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-arc-muted uppercase mb-1">Ende (Sek)</label>
                    <input 
                      type="number" 
                      value={endTime}
                      onChange={(e) => setEndTime(Number(e.target.value))}
                      className="w-full bg-[#0F1012] border border-arc-border text-white p-3 rounded focus:border-arc-yellow focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Result */}
        <div className="mt-6 bg-arc-panel border border-arc-border rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full">
               <label className="block text-xs font-bold text-arc-yellow uppercase mb-2">Browser Source Link</label>
               <div className="bg-[#0F1012] p-3 rounded border border-arc-border font-mono text-xs text-arc-muted break-all">
                 {generatedLink}
               </div>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`
                min-w-[140px] h-[46px] px-6 rounded font-bold text-sm uppercase tracking-wide transition-all
                ${copied ? "bg-green-500 text-white" : "bg-white text-black hover:bg-gray-200"}
              `}
            >
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
