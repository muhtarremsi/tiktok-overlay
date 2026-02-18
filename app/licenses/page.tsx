"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowUp, Scale } from "lucide-react";
import { useRouter } from "next/navigation";

function SekerLogo({ className }: { className?: string }) { 
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor"><path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/></svg>); 
}

export default function Licenses() {
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
    // Wenn kein interaktives Element geklickt wurde, zurück zum Dashboard
    if (target.closest('section') || target.closest('button') || target.closest('a') || target.closest('pre')) return;
    router.push('/');
  };

  return (
    <div 
      onClick={handlePageClick}
      className="min-h-screen bg-[#09090b] text-white font-sans p-8 md:p-20 selection:bg-green-500/30 uppercase italic font-bold cursor-pointer"
    >
      
      {/* FIXED HEADER */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl h-32 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full px-8 md:px-20 space-y-4">
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-500 transition-colors text-xs tracking-widest not-italic bg-transparent border-none cursor-pointer outline-none">
            <ArrowLeft size={16} /> BACK TO DASHBOARD
          </button>
          <div className="flex items-center gap-4 not-italic">
            <Scale className="text-green-500 w-8 h-8" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none">Open Source Licenses</h1>
              <p className="text-zinc-500 text-[10px] tracking-widest mt-1 uppercase leading-none">ATTRIBUTION & CREDITS • UPDATED: FEBRUARY 18, 2026</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-transparent to-[#09090b]/20 pointer-events-none"></div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-8 md:px-20 pt-44 pb-20 space-y-12 text-zinc-300 text-[11px] leading-relaxed tracking-wider not-italic font-medium">
        
        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">01.</span> TikTok-Live-Connector</h2>
          <p className="mb-4">
            SEKERBABA Interactive Overlays utilizes the "TikTok-Live-Connector" library created by zerodytrash. We are grateful for this contribution to the open-source community.
          </p>
          <div className="flex gap-4 mb-4">
             <a href="https://github.com/zerodytrash/TikTok-Live-Connector" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-white underline">GITHUB REPOSITORY</a>
             <a href="https://github.com/zerodytrash/TikTok-Live-Connector/blob/ts-rewrite/LICENSE" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-white underline">ORIGINAL LICENSE</a>
          </div>
        </section>

        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">02.</span> License Text (MIT)</h2>
          <div className="bg-[#0c0c0e] border border-zinc-800 p-6 rounded-xl font-mono text-[10px] text-zinc-400 normal-case overflow-x-auto whitespace-pre-wrap">
{`MIT License

Copyright (c) 2020-2023 zerodytrash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </div>
        </section>

        <section>
          <h2 className="text-white font-black text-xs mb-3 uppercase flex items-center gap-3"><span className="text-green-500">03.</span> Other Dependencies</h2>
          <p>
            This project is built using Next.js, React, TailwindCSS, and Lucide Icons. All other third-party libraries used are distributed under their respective open-source licenses (MIT, Apache 2.0, or similar permissive licenses).
          </p>
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
