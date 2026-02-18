"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

function SekerLogo({ className }: { className?: string }) { 
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor"><path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/></svg>); 
}

export default function Terms() {
  const [showScroll, setShowScroll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 200) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Wenn kein interaktives Element geklickt wurde, sofort zurück
    if (target.closest('section') || target.closest('button') || target.closest('a')) return;
    router.push('/');
  };

  return (
    <div 
      onClick={handlePageClick}
      className="min-h-screen bg-[#09090b] text-white font-sans p-8 md:p-20 selection:bg-green-500/30 uppercase italic font-bold cursor-pointer"
    >
      <div className="fixed top-0 left-0 w-full z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl h-32 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full px-8 md:px-20 space-y-4">
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-500 transition-colors text-xs tracking-widest not-italic bg-transparent border-none cursor-pointer outline-none">
            <ArrowLeft size={16} /> BACK TO DASHBOARD
          </button>
          <div className="flex items-center gap-4 not-italic">
            <SekerLogo className="text-green-500 w-8 h-8" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">Terms of Service</h1>
              <p className="text-zinc-500 text-[10px] tracking-widest mt-1 uppercase leading-none">EFFECTIVE DATE: FEBRUARY 18, 2026</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-transparent to-[#09090b]/20 pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-20 pt-44 pb-20 space-y-12 text-zinc-300 text-[11px] leading-relaxed tracking-wider not-italic font-medium">
        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">01.</span> Scope of Service</h2>
          <p>SEKERBABA provides interactive web-based overlays for TikTok Live. By using our services, you agree to comply with TikTok’s official Community Guidelines and Terms of Service. SEKERBABA is not responsible for any account suspensions resulting from improper use of overlays.</p>
        </section>

        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">02.</span> User Conduct</h2>
          <p>You agree not to use SEKERBABA to display prohibited content, including but not limited to: illegal activities, harassment, or explicit material. You are solely responsible for the content triggered via our API on your stream.</p>
        </section>

        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">03.</span> Intellectual Property</h2>
          <p>All software, designs, and the name "SEKERBABA" are the exclusive property of Sekerbaba Software & Design. You are granted a limited license to use the overlays for your personal or commercial broadcasts.</p>
        </section>

        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">04.</span> Limitation of Liability</h2>
          <p>The service is provided "as is". We do not guarantee 100% uptime. SEKERBABA shall not be held liable for any loss of revenue or data resulting from technical issues or platform changes by TikTok.</p>
        </section>

        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">05.</span> Termination</h2>
          <p>We reserve the right to terminate your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        </section>

        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">06.</span> Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </section>
        
        <div className="pt-10 border-t border-zinc-800 text-center text-zinc-600">
          © 2026 SEKERBABA. ALL RIGHTS RESERVED.
        </div>
      </div>

      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 right-8 bg-green-500 text-black p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 ${showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <ArrowUp size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
