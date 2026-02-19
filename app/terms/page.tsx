export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans p-8 md:p-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Nutzungsbedingungen (ToS)</h1>
        <p className="text-sm text-zinc-500">Zuletzt aktualisiert: 19. Februar 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Akzeptanz der Bedingungen</h2>
            <p>Mit dem Zugriff auf und der Nutzung von Sekerbaba Interactive Overlays ("Dienst") stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie nicht zustimmen, dürfen Sie unseren Dienst nicht nutzen.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. TikTok Richtlinien</h2>
            <p>Da unser Dienst in Verbindung mit TikTok Live genutzt wird, sind Sie verpflichtet, die offiziellen <a href="https://www.tiktok.com/legal/terms-of-service" className="text-green-500 underline" target="_blank">Terms of Service von TikTok</a> jederzeit einzuhalten. Wir übernehmen keine Haftung für Kontosperrungen, die durch die Nutzung von Drittanbieter-Tools oder anstößigen Overlay-Inhalten entstehen.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Zulässige Nutzung</h2>
            <p>Sie erklären sich bereit, keine Video-Trigger, Audio-Dateien oder Text-to-Speech Befehle zu verwenden, die illegale, hasserfüllte, rassistische oder pornografische Inhalte enthalten. Sie tragen die volle Verantwortung für Medien, die Sie über unsere OBS-Links in Ihren Stream einbinden.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Haftungsausschluss (Beta)</h2>
            <p>Dieser Dienst wird im aktuellen Entwicklungsstatus "wie besehen" (As-Is) zur Verfügung gestellt. Wir garantieren keine 100%ige Uptime (Verfügbarkeit) der WebSocket-Server oder die dauerhafte Funktionalität der TikTok-Live Anbindung, da diese von externen API-Änderungen abhängig ist.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
