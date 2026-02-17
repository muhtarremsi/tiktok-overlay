import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans p-8 md:p-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">Effective Date: February 2025</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Information Collection</h2>
          <p>We engage in minimal data collection. When you use our Overlay, we process:</p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>Public TikTok Username (to connect to the chat).</li>
            <li>Chat messages (processed in real-time for triggers, never stored persistently).</li>
            <li>Browser cookies or local storage for saving your overlay settings (e.g., volume, trigger words).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Third-Party Services</h2>
          <p>Our service interacts with the TikTok Public API via a connector. We do not control TikTok's data processing. Please review TikTok's Privacy Policy.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. Data Security</h2>
          <p>We implement standard security measures to protect the transmission of data. Since the tool runs client-side in your browser/OBS, your settings remain local to your device.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Contact</h2>
          <p>If you have questions regarding this privacy policy, please contact the developer.</p>
        </section>

        <footer className="pt-10 border-t border-white/10 text-zinc-600 text-xs text-center">
          &copy; 2025 Arc Tools. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
