"use client";

import Link from "next/link";
import { AlertCircle, Home, MoveLeft } from "lucide-react";

// --- CUSTOM LOGO COMPONENT (Reused for consistency) ---
function SekerLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor">
      <path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-green-500/30 overflow-hidden relative flex flex-col items-center justify-center">
      
      {/* BACKGROUND VIDEO (Same aesthetic but slightly darker/red-shifted for error vibe? kept consistent for now) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-40 scale-110 grayscale transition-all duration-[2000ms]"
        >
          <source src="https://cdn.discordapp.com/attachments/1462540433463709815/1473564428401377291/Videoerstellung_Frau_mit_animierten_Emojis.mp4?ex=6996ab51&is=699559d1&hm=e1ba37180af42fd701bab80b293938ed5f917a45fd481d131d8b19dc3c9dca4a&" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 z-10"></div>
      </div>

      {/* ERROR CONTENT */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl w-full">
        
        {/* LOGO */}
        <div className="mb-8 opacity-80">
           <SekerLogo className="w-12 h-12 text-zinc-500" />
        </div>

        {/* GLASS CARD */}
        <div className="bg-black/60 backdrop-blur-2xl border border-white/5 p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-6 w-full">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-500 text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm">
                <AlertCircle size={10} /> <span>System Error 404</span>
            </div>

            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none text-white drop-shadow-2xl">
                LOST<br/><span className="text-zinc-700">SIGNAL</span>
            </h1>

            <p className="text-zinc-400 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed max-w-md">
                The overlay trigger you are looking for has been disconnected or does not exist in this timeline.
            </p>

            <div className="pt-6 w-full flex justify-center">
                <Link href="/" className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:scale-105 transition-all shadow-lg">
                    <MoveLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Return to Base
                </Link>
            </div>
        </div>

        <div className="mt-8 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            ErrorCode: PAGE_NOT_FOUND_EXCEPTION
        </div>

      </div>
    </div>
  );
}
