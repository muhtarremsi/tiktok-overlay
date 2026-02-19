"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import AuthModal from "@/components/AuthModal";
import { checkSession } from "@/app/actions/auth";

function SekerLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor">
      <path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/>
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleOpenDashboard = async () => {
    const isLoggedIn = await checkSession();
    if (isLoggedIn) {
        router.push("/dashboard");
    } else {
        setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-green-500/30 overflow-hidden relative flex flex-col">
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover object-center md:object-[80%_45%] opacity-60 scale-100 md:scale-[1.5] transition-transform duration-[2000ms]">
          <source src="https://cdn.discordapp.com/attachments/1462540433463709815/1473564428401377291/Videoerstellung_Frau_mit_animierten_Emojis.mp4?ex=6996ab51&is=699559d1&hm=e1ba37180af42fd701bab80b293938ed5f917a45fd481d131d8b19dc3c9dca4a&" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-[#09090b]/30 to-[#09090b] z-10"></div>
      </div>

      <div className="absolute top-6 left-6 md:left-16 z-30">
        <div className="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" onClick={() => window.location.reload()}>
          <SekerLogo className="text-green-500 w-6 h-6" />
          <span className="text-lg font-black italic tracking-tighter text-white">SEKERBABA</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col justify-center items-center px-4 text-center z-20">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> v0.030168 Layout Fixes
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] uppercase drop-shadow-2xl break-words w-full">
            INTERACTIVE <br /> OVERLAYS
          </h1>
          
          <p className="text-zinc-400 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed" style={{ marginLeft: '4em', marginRight: '4em' }}>
            Boost your TikTok Live with custom video triggers and real-time interactions. Powered by Sekerbaba Tools.
          </p>

          <div className="pt-6 md:pt-8 w-full flex flex-col items-center gap-6">
            <button 
              onClick={handleOpenDashboard} 
              className="relative bg-green-500 text-black px-8 py-4 md:px-12 md:py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] text-xs md:text-sm hover:scale-105 hover:bg-green-400"
            >
              Open Dashboard
            </button>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest w-full px-4">
               <Link href="/privacy" className="hover:text-green-500 transition-colors whitespace-nowrap">Privacy Policy</Link>
               <span className="text-zinc-800 hidden md:inline">•</span>
               <Link href="/terms" className="hover:text-green-500 transition-colors whitespace-nowrap">Terms of Service</Link>
               <span className="text-zinc-800 hidden md:inline">•</span>
               <Link href="/license" className="hover:text-green-500 transition-colors whitespace-nowrap">Licenses</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center z-20 px-4">
        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest opacity-60">
          © 2026 SEKERBABA. ALL RIGHTS RESERVED.
        </p>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
