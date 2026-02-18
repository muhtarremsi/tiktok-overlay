"use client";

import { useFormState } from "react-dom";
import { login } from "@/app/actions/auth";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

// --- CUSTOM LOGO COMPONENT ---
function SekerLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor">
      <path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/>
    </svg>
  );
}

export default function LoginPage() {
  // @ts-ignore
  const [state, formAction] = useFormState(login, null);
  const [pending, setPending] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans overflow-hidden relative flex flex-col items-center justify-center">

      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black">
        <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover opacity-40 scale-110 blur-sm">
          <source src="https://cdn.discordapp.com/attachments/1462540433463709815/1473564428401377291/Videoerstellung_Frau_mit_animierten_Emojis.mp4?ex=6996ab51&is=699559d1&hm=e1ba37180af42fd701bab80b293938ed5f917a45fd481d131d8b19dc3c9dca4a&" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/50 to-[#09090b] z-10"></div>
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-20 w-full max-w-md px-6">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-2xl flex flex-col items-center gap-6">

          <div className="flex flex-col items-center gap-4 mb-2">
            <SekerLogo className="w-12 h-12 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            <h1 className="text-2xl font-black italic tracking-tighter text-white">ACCESS CONTROL</h1>
          </div>

          <form action={(formData) => { setPending(true); formAction(formData); }} className="w-full space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Identifier</label>
              <input 
                name="email" 
                type="email" 
                required 
                placeholder="admin@access.com"
                className="w-full bg-[#0c0c0e] border border-zinc-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">Passkey</label>
              <input 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full bg-[#0c0c0e] border border-zinc-800 text-white text-xs p-4 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {state?.message && (
              <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                {state.message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={pending}
              className="w-full bg-green-500 text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] mt-4 flex justify-center items-center gap-2"
            >
              {pending ? <Loader2 className="animate-spin w-4 h-4" /> : <><Lock size={14} /> Authenticate</>}
            </button>
          </form>

          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-2">
            Restricted Area • Auth Required
          </p>
        </div>
      </div>
    </div>
  );
}
