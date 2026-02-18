"use client";
import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

// Logo Component
function SekerLogo({ className }: { className?: string }) { 
  return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor"><path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/></svg>); 
}

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans p-8 md:p-20 selection:bg-green-500/30">
      <div className="max-w-4xl mx-auto space-y-10">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-500 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Dashboard
        </a>
        
        <div className="flex items-center gap-4 border-b border-white/10 pb-8">
          <ShieldCheck className="text-green-500 w-10 h-10" />
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Privacy Policy</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">GDPR Compliant • Updated: February 18, 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-zinc-300 text-sm leading-relaxed font-medium">
          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">01.</span> Overview</h2>
            <p>At SEKERBABA, we prioritize your privacy. This policy explains how we handle your data in compliance with the General Data Protection Regulation (GDPR/DSGVO). By using our Service, you agree to the collection and use of information in accordance with this policy.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">02.</span> Data We Collect</h2>
            <p>We believe in data minimization. We only collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
              <li><strong className="text-white">Authentication Data:</strong> When you log in via TikTok, we receive your public profile information (username, display name, avatar).</li>
              <li><strong className="text-white">Local Preferences:</strong> Settings like trigger configurations and sound alerts are stored locally on your device (LocalStorage).</li>
              <li><strong className="text-white">Usage Data:</strong> Anonymous technical data required for the app to function (e.g., browser type).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">03.</span> How We Use Your Data</h2>
            <p>Your data is used strictly to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
              <li>Provide and maintain the Service (e.g., displaying your username on the overlay).</li>
              <li>Remember your configuration settings between sessions.</li>
              <li>Authenticate your access to the application.</li>
            </ul>
            <p className="mt-2 font-bold text-white">We do NOT sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">04.</span> Your Rights (GDPR)</h2>
            <p>Under the GDPR, you have the following rights:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
              <li><strong className="text-white">Right to Access:</strong> You can request copies of your personal data.</li>
              <li><strong className="text-white">Right to Erasure:</strong> You can request that we delete your personal data (disconnecting your TikTok account removes local access).</li>
              <li><strong className="text-white">Right to Rectification:</strong> You can request that we correct any information you believe is inaccurate.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">05.</span> TikTok Platform Data</h2>
            <p>Our application uses TikTok's API services. We encourage you to review TikTok's Privacy Policy to understand how they handle your data.</p>
            <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" className="text-green-500 underline mt-1 block">TikTok Privacy Policy</a>
          </section>

          <section>
            <h2 className="text-white font-black text-lg mb-3 uppercase flex items-center gap-2"><span className="text-green-500">06.</span> Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact us at:</p>
            <p className="mt-2 text-white font-bold bg-zinc-900 inline-block px-4 py-2 rounded-lg border border-zinc-800">support@sekerbaba.com</p>
          </section>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-zinc-600 text-xs">© 2026 SEKERBABA TOOLS. Compliance is our priority.</p>
        </div>
      </div>
    </div>
  );
}
