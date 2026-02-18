"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";

// Logo Component
function SekerLogo({ className }: { className?: string }) { 
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor"><path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/></svg>); 
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans p-8 md:p-20 selection:bg-green-500/30">
      <div className="max-w-4xl mx-auto space-y-10">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-500 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Dashboard
        </a>
        
        <div className="flex items-center gap-4 border-b border-white/10 pb-8">
          <SekerLogo className="text-green-500 w-10 h-10" />
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Terms of Service</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Effective Date: February 18, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-zinc-300 text-sm leading-relaxed font-medium">
          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">01.</span> Acceptance of Terms</h2>
            <p>By accessing and using SEKERBABA ("Service"), you agree to comply with these Terms of Service. If you do not agree, you may not use the Service. This Service is designed to enhance TikTok Live streams with interactive overlays.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">02.</span> TikTok Compliance</h2>
            <p>Our Service integrates with the TikTok platform. By using SEKERBABA, you strictly agree to adhere to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
              <li><a href="https://www.tiktok.com/community-guidelines" target="_blank" className="underline hover:text-white">TikTok Community Guidelines</a></li>
              <li><a href="https://www.tiktok.com/legal/terms-of-service" target="_blank" className="underline hover:text-white">TikTok Terms of Service</a></li>
            </ul>
            <p className="mt-2">You acknowledge that SEKERBABA is a third-party tool and is not directly affiliated with, endorsed, or certified by TikTok Inc.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">03.</span> User Responsibilities</h2>
            <p>You are responsible for all activity that occurs under your account. You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
              <li>Display content that violates TikTok's safety policies (e.g., hate speech, harassment).</li>
              <li>Attempt to reverse engineer the Service or its API connections.</li>
              <li>Use the Service for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">04.</span> Intellectual Property</h2>
            <p>The "SEKERBABA" name, logo, and original code are the intellectual property of the Service owner. You maintain ownership of your streaming content.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">05.</span> Limitation of Liability</h2>
            <p>SEKERBABA is provided "AS IS". We are not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our Service, including but not limited to loss of data or stream interruptions.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">06.</span> Contact</h2>
            <p>For any questions regarding these Terms, please contact us at: <span className="text-white font-bold">support@sekerbaba.com</span></p>
          </section>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-zinc-600 text-xs">© 2026 SEKERBABA TOOLS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
