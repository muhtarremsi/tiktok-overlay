"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Prüfen, ob Consent schon da ist
    const consent = localStorage.getItem("seker_cookie_consent");
    if (!consent) {
      // Kleine Verzögerung für schöne Animation
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Speichert "accepted" und das Datum
    const data = { value: "accepted", timestamp: new Date().getTime() };
    localStorage.setItem("seker_cookie_consent", JSON.stringify(data));
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Speichert "declined"
    const data = { value: "declined", timestamp: new Date().getTime() };
    localStorage.setItem("seker_cookie_consent", JSON.stringify(data));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-6 md:bottom-6 md:w-96 z-[100] p-6 md:rounded-2xl bg-black/90 backdrop-blur-xl border-t md:border border-white/10 shadow-2xl transition-all duration-500 animate-in slide-in-from-bottom-10 fade-in-20">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
          <Cookie size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-white">Privacy & Cookies</h4>
          <p className="text-[10px] text-zinc-400 leading-relaxed font-bold">
            We use cookies to ensure you get the best experience across all pages (Dashboard, Licenses, etc.). Valid for 30 days or until cache clear.
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={handleDecline} 
          className="flex-1 py-2.5 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/5 transition-colors"
        >
          Decline
        </button>
        <button 
          onClick={handleAccept} 
          className="flex-1 py-2.5 rounded-lg bg-green-500 text-black text-[9px] font-black uppercase tracking-widest hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
