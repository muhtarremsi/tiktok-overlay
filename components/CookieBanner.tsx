"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X, Check, Settings2 } from "lucide-react";

export type CookiePreferences = {
  essential: boolean; // Immer true
  functional: boolean;
  analytics: boolean;
};

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
  });

  useEffect(() => {
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
    // Reload to apply settings globally
    window.location.reload();
  };

  const acceptAll = () => handleSave({ essential: true, functional: true, analytics: true });
  const rejectAll = () => handleSave({ essential: true, functional: false, analytics: false });

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[999] p-4 flex justify-center items-end pointer-events-none">
      <div className="bg-[#0c0c0e] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-4xl w-full pointer-events-auto flex flex-col gap-6 animate-in slide-in-from-bottom-10">
        
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={18} /> Deine Privatsphäre
            </h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed max-w-2xl">
              Wir verwenden Cookies und lokale Speicher (Local Storage), um Funktionen wie das Speichern deiner Overlay-Trigger zu ermöglichen und die Sicherheit (reCAPTCHA) zu gewährleisten. Du kannst selbst entscheiden, welche Daten du teilen möchtest.
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-3 bg-black/50 p-4 rounded-xl border border-white/5 text-[11px]">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <span className="text-white font-bold block">Essenzielle Cookies (Erforderlich)</span>
                <span className="text-zinc-500">Für Login, Sessions und reCAPTCHA v3 Sicherheit.</span>
              </div>
              <Check className="text-zinc-600" size={16} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <span className="text-white font-bold block">Funktionale Speicherung</span>
                <span className="text-zinc-500">Speichert deine angelegten TTV/Sound-Trigger im Browser. Wenn abgelehnt, werden Trigger nach Neuladen gelöscht.</span>
              </div>
              <input type="checkbox" checked={preferences.functional} onChange={(e) => setPreferences({...preferences, functional: e.target.checked})} className="accent-green-500 w-4 h-4" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-white font-bold block">Analytics (Optional)</span>
                <span className="text-zinc-500">Hilft uns, Abstürze zu finden und die App zu verbessern.</span>
              </div>
              <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})} className="accent-green-500 w-4 h-4" />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={acceptAll} className="flex-1 bg-green-500 text-black py-3 rounded-xl text-xs font-black uppercase hover:bg-green-400 transition-colors">
            Alle Akzeptieren
          </button>
          <button onClick={rejectAll} className="flex-1 bg-zinc-900 border border-zinc-800 text-white py-3 rounded-xl text-xs font-black uppercase hover:bg-zinc-800 transition-colors">
            Nur Essenziell
          </button>
          <button onClick={() => showDetails ? handleSave(preferences) : setShowDetails(true)} className="flex-1 bg-black border border-white/10 text-zinc-300 py-3 rounded-xl text-xs font-black uppercase hover:text-white transition-colors flex items-center justify-center gap-2">
            <Settings2 size={14} /> {showDetails ? "Auswahl Speichern" : "Anpassen"}
          </button>
        </div>

      </div>
    </div>
  );
}
