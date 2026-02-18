"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";

export default function Licenses() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans selection:bg-green-500/30 overflow-hidden relative flex flex-col">
      
      {/* BACKGROUND VIDEO (Consistent with Landing Page) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 bg-black fixed">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover object-center opacity-30 scale-105 blur-sm"
        >
          <source src="https://cdn.discordapp.com/attachments/1462540433463709815/1473564428401377291/Videoerstellung_Frau_mit_animierten_Emojis.mp4?ex=6996ab51&is=699559d1&hm=e1ba37180af42fd701bab80b293938ed5f917a45fd481d131d8b19dc3c9dca4a&" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 z-10"></div>
      </div>

      {/* HEADER / NAV */}
      <div className="relative z-20 w-full max-w-4xl mx-auto p-6 md:p-10 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <div className="p-2 rounded-full border border-white/10 bg-black/50 group-hover:bg-green-500 group-hover:text-black transition-all">
             <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </Link>
        <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Legal / Licenses</span>
      </div>

      {/* CONTENT CONTAINER (Glass Effect) */}
      <div className="relative z-20 flex-1 w-full max-w-3xl mx-auto px-6 pb-20">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl">
          
          <div className="mb-10 border-b border-white/10 pb-8">
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white mb-4">
              OPEN SOURCE LICENSES
            </h1>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">
              This software is built on the shoulders of giants. We proudly use and support open source software. 
              Below are the licenses for third-party libraries used in the <strong>Sekerbaba Interactive Overlays</strong>.
            </p>
          </div>

          {/* LICENSE ITEM: TikTok-Live-Connector */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-3 text-green-400">
                  <Code2 size={24} />
                  <h3 className="text-xl font-bold tracking-tight text-white">TikTok-Live-Connector</h3>
               </div>
               <a 
                 href="https://github.com/zerodytrash/TikTok-Live-Connector" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-green-500 transition-colors border border-white/5 hover:border-green-500/30 px-3 py-1.5 rounded-full"
               >
                 View Source <ExternalLink size={10} />
               </a>
            </div>

            <div className="bg-black/50 rounded-xl border border-white/5 p-6 font-mono text-[10px] md:text-xs text-zinc-400 leading-relaxed overflow-x-auto">
              <p className="mb-4 text-zinc-300 font-bold">MIT License</p>
              <p className="mb-4">Copyright (c) 2020-2023 zerodytrash</p>
              <p className="mb-4">
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the "Software"), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>
              <p className="mb-4">
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>
              <p>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <div className="mt-10 pt-6 border-t border-white/5 text-center">
             <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                All other code &copy; 2026 Sekerbaba. All rights reserved.
             </p>
          </div>

        </div>
      </div>

    </div>
  );
}
