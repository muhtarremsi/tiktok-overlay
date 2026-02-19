import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function SekerLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor">
      <path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/>
    </svg>
  );
}

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-green-500/30">
      <div className="fixed top-0 left-0 w-full h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center px-6 md:px-16">
         <Link href="/" className="flex items-center gap-3 text-white hover:text-green-500 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <SekerLogo className="w-6 h-6 text-green-500" />
            <span className="text-lg font-black italic tracking-tighter uppercase">Zurück</span>
         </Link>
      </div>

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
         <div className="bg-[#0c0c0e] border border-zinc-800/50 p-8 md:p-12 rounded-3xl shadow-2xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-30"></div>
            
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Open Source Lizenzen</h1>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-3">Powered by Open Source</p>
            </div>

            <div className="space-y-6 text-sm text-zinc-400 leading-relaxed font-medium">
              
              <div className="bg-black/50 border border-white/5 p-6 rounded-2xl space-y-3">
                <div>
                    <h3 className="text-white font-black text-lg uppercase tracking-wider">TikTok-Live-Connector</h3>
                    <p className="text-zinc-500 text-xs">Copyright (c) 2021 zerodytrash</p>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 bg-[#09090b] p-4 rounded-xl overflow-x-auto border border-white/5">
                    MIT License<br/><br/>
                    Permission is hereby granted, free of charge, to any person obtaining a copy
                    of this software and associated documentation files (the "Software"), to deal
                    in the Software without restriction, including without limitation the rights
                    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                    copies of the Software, and to permit persons to whom the Software is
                    furnished to do so, subject to the following conditions:
                </div>
              </div>

              <div className="bg-black/50 border border-white/5 p-6 rounded-2xl space-y-3">
                <div>
                    <h3 className="text-white font-black text-lg uppercase tracking-wider">Lucide Icons</h3>
                    <p className="text-zinc-500 text-xs">Copyright (c) 2023 Lucide Contributors</p>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 bg-[#09090b] p-4 rounded-xl overflow-x-auto border border-white/5">
                    ISC License
                </div>
              </div>

              <div className="bg-black/50 border border-white/5 p-6 rounded-2xl space-y-3">
                <div>
                    <h3 className="text-white font-black text-lg uppercase tracking-wider">Next.js & React</h3>
                    <p className="text-zinc-500 text-xs">Copyright (c) Vercel, Inc. / Meta Platforms, Inc.</p>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 bg-[#09090b] p-4 rounded-xl overflow-x-auto border border-white/5">
                    MIT License
                </div>
              </div>

            </div>
         </div>
      </div>
    </div>
  );
}
