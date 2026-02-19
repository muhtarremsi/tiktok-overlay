export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans p-8 md:p-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Datenschutzerklärung</h1>
        <p className="text-sm text-zinc-500">Zuletzt aktualisiert: 19. Februar 2026</p>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Datenschutz auf einen Blick</h2>
            <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. TikTok API & Live Chat Daten</h2>
            <p>Diese App nutzt eine inoffizielle API (TikTok-Live-Connector), um öffentliche Live-Chat-Daten für Overlay-Zwecke abzugreifen. <strong>Wir speichern keine Chat-Nachrichten, Profilbilder oder Nutzernamen auf unseren Servern.</strong> Alle Daten werden ausschließlich in Echtzeit an Ihren Browser gesendet und nach dem Schließen der Sitzung im RAM gelöscht.</p>
            <p>Wenn Sie Ihren TikTok-Account verknüpfen (OAuth), erhalten wir einen Access Token. Wir nutzen diesen ausschließlich, um Basis-Profildaten für das Dashboard abzurufen. Der Token wird sicher in einem Cookie gespeichert.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Kamera & Mikrofon (IRL Modus)</h2>
            <p>Unser IRL-Kamera-Modul erfordert Zugriff auf die Kamera Ihres Geräts (getUserMedia API). <strong>Die Bild- und Videodaten verlassen niemals Ihr Gerät.</strong> Die Verarbeitung erfolgt zu 100% lokal in Ihrem Browser. Wir zeichnen weder auf, noch streamen wir die Daten an externe Server.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Cookies & Local Storage</h2>
            <p>Wir verwenden "Cookies" und "Local Storage", um die App nutzbar zu machen:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li><strong>Essenzielle Daten:</strong> Session-Tokens für den Login und reCAPTCHA-Tokens zur Abwehr von Bots. Diese sind für den Betrieb zwingend erforderlich.</li>
                <li><strong>Funktionale Daten:</strong> Wenn Sie zustimmen, speichern wir Ihre Overlay-Trigger und Settings im <code>localStorage</code> Ihres Browsers, damit diese beim nächsten Besuch noch vorhanden sind.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Google reCAPTCHA v3</h2>
            <p>Wir nutzen "Google reCAPTCHA v3" (Anbieter: Google Ireland Limited) auf unserer Website. reCAPTCHA analysiert das Verhalten des Websitebesuchers anhand verschiedener Merkmale (z.B. IP-Adresse, Verweildauer, Mausbewegungen), sobald dieser die Seite betritt, um Spam und Missbrauch zu verhindern. Weitere Informationen finden Sie in den Datenschutzbestimmungen von Google.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Ihre Rechte</h2>
            <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Kontaktieren Sie uns hierfür über die im Impressum angegebene E-Mail-Adresse.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
