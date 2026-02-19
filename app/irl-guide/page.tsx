import Link from "next/link";
import { ArrowLeft, Camera, Ghost, Hand, Smartphone } from "lucide-react";

function SekerLogo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.44 36.04" className={className} fill="currentColor">
      <path d="M27.26,2.42c2.04,2.03,2.91,4.78,2.41,7.64-.21,1.23-.77,2.43-1.45,3.47.77.44,1.52.93,2.2,1.51,8.1,6.96,3.1,20.52-7.35,20.99h-12.16c-5.82-.32-10.53-5.18-10.92-10.95v-4.43s.03-.04.03-.04h7.25c.46-.05.8-.04,1.2-.3.95-.65,1.02-2.07.11-2.78-.47-.37-.9-.32-1.45-.43-3.42-.69-6.24-3.35-6.94-6.79C-.86,5.12,2.71.47,7.91,0h13.89c2.07.12,4,.97,5.46,2.42ZM16.65,17.21v-5.5l.1-.05c1.54-.06,3.15.09,4.68,0,1.43-.08,2.63-1.12,2.92-2.52.37-1.81-.95-3.62-2.79-3.77h-13.28c-3.6.42-3.89,5.47-.26,6.25,1.29.28,2.19.45,3.35,1.14,5.77,3.44,3.86,12.13-2.71,13.23-.96.16-1.86,0-2.76.1-.05,0-.08,0-.11.05.82,2.36,3,4.1,5.51,4.27h11.67c4.61-.34,7.24-5.47,5.17-9.55-1.06-2.1-3.2-3.4-5.54-3.58l-5.91-.02s-.06-.05-.06-.06Z"/>
    </svg>
  );
}

export default function IrlGuidePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-green-500/30">
      
      <Link href="/dashboard" className="fixed top-0 left-0 w-full h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center px-6 md:px-16 hover:bg-white/5 transition-colors cursor-pointer group">
         <div className="flex items-center gap-3 text-white">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <SekerLogo className="w-6 h-6 text-green-500" />
            <span className="text-lg font-black italic tracking-tighter uppercase">Zurück zum Dashboard</span>
         </div>
      </Link>

      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
         <div className="bg-[#0c0c0e] border border-zinc-800/50 p-8 md:p-12 rounded-3xl shadow-2xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-30"></div>
            
            <div>
                <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">IRL STREAMING GUIDE</h1>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-3">Alles, was du über das Live-Cam Modul wissen musst</p>
            </div>

            <div className="space-y-8 text-sm text-zinc-400 leading-relaxed font-medium">
              
              <section className="bg-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/10 rounded-xl"><Smartphone className="text-green-500" size={24}/></div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Wie funktioniert es?</h2>
                </div>
                <p>Das IRL-Modul ist dafür gedacht, draußen oder unterwegs mit dem Handy zu streamen. Da mobile Browser keine direkten Overlays auf die TikTok-App legen können, nutzen wir einen Trick:</p>
                <ul className="list-decimal pl-5 space-y-2 text-zinc-300">
                    <li>Du startest auf TikTok einen <strong>"Mobile Gaming"</strong> Stream. Dabei filmt TikTok deinen kompletten Handy-Bildschirm ab.</li>
                    <li>Du öffnest unser Dashboard im mobilen Browser und startest das Kamera-Modul im Vollbild.</li>
                    <li>Dein Stream zeigt nun dein Kamerabild an, und wir können darüber unsere eigenen Chat-Fenster und Animationen legen!</li>
                </ul>
              </section>

              <section className="bg-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/10 rounded-xl"><Ghost className="text-blue-500" size={24}/></div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Der Ghost-Mode</h2>
                </div>
                <p>Ein normales Chat-Fenster auf dem Bildschirm wäre für deine Zuschauer extrem störend, da sie es doppelt sehen würden (einmal von TikTok selbst, einmal abgefilmt vom Bildschirm).</p>
                <p>Aktivierst du den <strong className="text-blue-400">Ghost Mode</strong>, wird das Chat-Overlay auf 10% Deckkraft reduziert. Für das menschliche Auge direkt vor dem Handy ist er noch leicht lesbar. Durch die Videokompression von TikTok verschwindet der Chat für den Zuschauer jedoch komplett im Hintergrund!</p>
              </section>

              <section className="bg-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500/10 rounded-xl"><Hand className="text-purple-500" size={24}/></div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Hold-to-Peek (Gedrückt halten)</h2>
                </div>
                <p>Eine weitere smarte Funktion im Ghost-Mode: Wenn du deinen Finger irgendwo auf den Bildschirm drückst und hältst, blendet sich der Chat für diese Zeit vollständig ein.</p>
                <p>So kannst du kurz nachlesen, was geschrieben wurde, ohne dass das Overlay dauerhaft den Stream deiner Zuschauer blockiert. Lass einfach wieder los, und der Chat verschwindet.</p>
              </section>

              <section className="bg-black/50 border border-white/5 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 rounded-xl"><Camera className="text-red-500" size={24}/></div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">Tipps für den perfekten Stream</h2>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-zinc-300">
                    <li><strong>Querformat vs. Hochformat:</strong> Nutze dein Handy im Hochformat (Portrait), da TikTok dieses Format erwartet.</li>
                    <li><strong>Nicht stören Modus:</strong> Schalte Push-Benachrichtigungen (WhatsApp etc.) auf dem Handy aus, da diese sonst im Stream sichtbar sind!</li>
                    <li><strong>Desktop Nutzung:</strong> Auf dem PC wird die Kamera nicht im Vollbild, sondern passend im Dashboard geöffnet. Perfekt zum Testen deiner Webcam.</li>
                </ul>
              </section>

            </div>
         </div>
      </div>
    </div>
  );
}
