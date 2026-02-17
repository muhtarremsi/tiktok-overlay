import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans p-8 md:p-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-white/10 pb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Terms of Service</h1>
          <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">Last Updated: February 2025</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>By accessing and using this TikTok Overlay tool ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">2. Use of Service</h2>
          <p>This service provides overlay tools for streamers. You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">3. User Data & Privacy</h2>
          <p>We respect your privacy. We do not store personal chat logs. The Service only processes public chat data in real-time to trigger overlay events. Please refer to our Privacy Policy for more details.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">4. Disclaimer</h2>
          <p>This tools is provided "as is" without any warranties. We are not affiliated with TikTok or ByteDance.</p>
        </section>

        <footer className="pt-10 border-t border-white/10 text-zinc-600 text-xs text-center">
          &copy; 2025 Arc Tools. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
