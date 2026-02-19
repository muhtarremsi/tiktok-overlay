"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ChevronDown, Check } from "lucide-react";
import { usePathname } from "next/navigation";

export type CookiePreferences = {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
};

export default function CookieBanner() {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
    // Verstecke das Banner IMMER in OBS / Live Studio Overlays
    if (window.location.pathname.includes('overlay')) return;

    const savedConsent = localStorage.getItem("seker_cookie_consent");
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      setPreferences(JSON.parse(savedConsent));
    }
  }, []);

  const handleSave = (newPrefs: CookiePreferences) => {
    localStorage.setItem("seker_cookie_consent", JSON.stringify(newPrefs));
    setPreferences(newPrefs);
    setShowBanner(false);
    window.location.reload();
  };

  // Zweiter Sicherheits-Check für Overlays
  if (pathname?.includes('overlay')) return null;
  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center p-4 sm:p-6 pointer-events-none">
      
      <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-10">
        
        <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 text-white">
                <ShieldCheck className="text-green-500" size={24} />
                <h3 className="text-lg font-black uppercase tracking-widest italic">Datenschutz & Cookies</h3>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed font-medium">
              Wir nutzen Cookies und lokalen Speicher, um die App sicher zu machen (Login/reCAPTCHA) und deine Overlay-Einstellungen lokal in deinem Browser zu speichern.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={() => handleSave({ essential: true, functional: true, analytics: true })} className="flex-1 bg-green-500 text-black py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-400 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                Alle Akzeptieren
              </button>
              <button onClick={() => handleSave({ essential: true, functional: false, analytics: false })} className="flex-1 bg-white/5 border border-white/10 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                Nur Essenzielle
              </button>
            </div>
        </div>

        <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full bg-black/50 border-t border-white/5 p-4 flex items-center justify-between text-zinc-400 hover:text-white transition-colors group cursor-pointer focus:outline-none"
        >
            <span className="text-[10px] font-bold uppercase tracking-widest">Einstellungen anpassen</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ease-in-out ${showDetails ? 'rotate-180 text-green-500' : 'group-hover:text-white'}`} />
        </button>

        <div className={`grid transition-all duration-300 ease-in-out bg-black/80 ${showDetails ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
                <div className="p-6 space-y-4 border-t border-white/5">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <div>
                            <span className="text-white text-xs font-bold block uppercase tracking-wider">Essenzielle Cookies</span>
                            <span className="text-zinc-500 text-[10px]">Zwingend erforderlich für Sicherheit (reCAPTCHA) und Login.</span>
                        </div>
                        <Check className="text-zinc-600" size={18} />
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <div>
                            <span className="text-white text-xs font-bold block uppercase tracking-wider">Funktionale Speicherung</span>
                            <span className="text-zinc-500 text-[10px]">Speichert Overlay-Trigger. Ohne Zustimmung nach Reload weg.</span>
                        </div>
                        <input type="checkbox" checked={preferences.functional} onChange={(e) => setPreferences({...preferences, functional: e.target.checked})} className="accent-green-500 w-5 h-5 cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <span className="text-white text-xs font-bold block uppercase tracking-wider">Analytics</span>
                            <span className="text-zinc-500 text-[10px]">Anonymisierte Fehlerberichte zur Verbesserung.</span>
                        </div>
                        <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})} className="accent-green-500 w-5 h-5 cursor-pointer" />
                    </div>
                    <button onClick={() => handleSave(preferences)} className="w-full mt-2 bg-zinc-800 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors">
                        Auswahl Speichern
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
