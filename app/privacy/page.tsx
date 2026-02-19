import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function SekerLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor">
      <path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/>
    </svg>
  );
}

export default function PrivacyPage() {
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
                <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Datenschutzerklärung</h1>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-3">Zuletzt aktualisiert: 19. Februar 2026</p>
            </div>

            <div className="space-y-8 text-sm text-zinc-400 leading-relaxed font-medium">
              <section className="space-y-3">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">1. Datenschutz auf einen Blick</h2>
                <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">2. TikTok API & Live Chat Daten</h2>
                <p>Diese App nutzt eine inoffizielle API (TikTok-Live-Connector), um öffentliche Live-Chat-Daten für Overlay-Zwecke abzugreifen. <strong className="text-white">Wir speichern keine Chat-Nachrichten, Profilbilder oder Nutzernamen auf unseren Servern.</strong> Alle Daten werden ausschließlich in Echtzeit an Ihren Browser gesendet und nach dem Schließen der Sitzung im RAM gelöscht.</p>
                <p>Wenn Sie Ihren TikTok-Account verknüpfen (OAuth), erhalten wir einen Access Token. Wir nutzen diesen ausschließlich, um Basis-Profildaten für das Dashboard abzurufen. Der Token wird sicher in einem Cookie gespeichert.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">3. Kamera & Mikrofon (IRL Modus)</h2>
                <p>Unser IRL-Kamera-Modul erfordert Zugriff auf die Kamera Ihres Geräts (getUserMedia API). <strong className="text-white">Die Bild- und Videodaten verlassen niemals Ihr Gerät.</strong> Die Verarbeitung erfolgt zu 100% lokal in Ihrem Browser. Wir zeichnen weder auf, noch streamen wir die Daten an externe Server.</p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">4. Cookies & Local Storage</h2>
                <p>Wir verwenden "Cookies" und "Local Storage", um die App nutzbar zu machen:</p>
                <ul className="list-disc pl-5 space-y-2 text-zinc-500">
                    <li><strong className="text-white">Essenzielle Daten:</strong> Session-Tokens für den Login und reCAPTCHA-Tokens zur Abwehr von Bots. Diese sind für den Betrieb zwingend erforderlich.</li>
                    <li><strong className="text-white">Funktionale Daten:</strong> Wenn Sie zustimmen, speichern wir Ihre Overlay-Trigger und Settings im <code>localStorage</code> Ihres Browsers, damit diese beim nächsten Besuch noch vorhanden sind.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">5. Google reCAPTCHA v3</h2>
                <p>Wir nutzen "Google reCAPTCHA v3" (Anbieter: Google Ireland Limited) auf unserer Website. reCAPTCHA analysiert das Verhalten des Websitebesuchers anhand verschiedener Merkmale (z.B. IP-Adresse, Verweildauer, Mausbewegungen), sobald dieser die Seite betritt, um Spam und Missbrauch zu verhindern. Weitere Informationen finden Sie in den Datenschutzbestimmungen von Google.</p>
              </section>
            </div>
         </div>
      </div>
    </div>
  );
}
