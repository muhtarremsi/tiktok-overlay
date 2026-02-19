"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

// Typdefinition für ein einzelnes Frage-Antwort-Paar
type FAQItemProps = {
  question: string;
  answer: React.ReactNode; // Erlaubt Text oder HTML als Antwort
};

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group cursor-pointer focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className={`text-sm font-bold uppercase tracking-wider transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
          {question}
        </span>
        {/* Der Pfeil, der sich dreht. Transform rotate-90 bei isOpen=true */}
        <ChevronRight
          size={18}
          className={`text-zinc-500 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90 text-green-500' : ''} group-hover:text-white`}
        />
      </button>
      
      {/* Der Antwortbereich mit einer einfachen Fade-In Animation */}
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-[11px] text-zinc-400 leading-relaxed pr-4 font-medium">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

// Die Hauptkomponente, die alle Fragen auflistet
export default function FAQSection() {
  const faqs: FAQItemProps[] = [
    {
      question: "Wie verbinde ich den IRL-Kameramodus mit TikTok?",
      answer: "Ganz einfach: 1. Öffne TikTok auf deinem Handy und starte einen 'Mobile Gaming' Livestream. 2. Wechsle zurück in dieses Dashboard und öffne das Kamera-Modul. 3. Dein Handy streamt nun den gesamten Bildschirm, inklusive unserer Kamera-Ansicht und dem Ghost-Chat Overlay.",
    },
    {
      question: "Was ist der 'Ghost Mode' im Chat?",
      answer: (
        <span>
          Da TikTok im Gaming-Modus alles aufzeichnet, wäre ein normaler Chat für Zuschauer störend sichtbar. Der <strong>Ghost Mode</strong> macht den Chat extrem transparent (fast unsichtbar für Zuschauer durch die Videokompression), aber du kannst ihn auf dem Handy noch lesen, wenn du genau hinsiehst.
        </span>
      ),
    },
    {
      question: "Werden meine Kamera- oder Chatdaten gespeichert?",
      answer: (
        <span>
          <strong>Nein.</strong> Deine Privatsphäre hat Priorität. Der Kamera-Feed wird ausschließlich lokal in deinem Browser verarbeitet und verlässt dein Gerät nicht. Chat-Daten werden nur temporär im Arbeitsspeicher (RAM) angezeigt und nicht auf unseren Servern gespeichert. Mehr dazu in unserer Datenschutzerklärung.
        </span>
      ),
    },
    {
      question: "Funktionieren die Video-Trigger auch im IRL-Modus?",
      answer: "Aktuell sind die Video- (TTV) und Sound-Trigger primär für die Nutzung mit OBS am PC konzipiert. Im reinen mobilen IRL-Modus über das Handy-Display werden sie nicht angezeigt. Wir arbeiten aber an einer Lösung für die Zukunft.",
    },
    {
      question: "Ich habe funktionale Cookies abgelehnt. Was nun?",
      answer: "Wenn du funktionale Cookies ablehnst, dürfen wir laut DSGVO keine Daten in deinem Browser speichern. Das bedeutet, dass deine Einstellungen, eingegebenen Trigger und dein Ziel-Username nach jedem Neuladen der Seite verloren gehen und neu eingegeben werden müssen.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-[#0c0c0e] border border-zinc-800/50 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Ein leichter grüner Schein im Hintergrund für das "Tech"-Feeling */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-30"></div>
        
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-8 text-center">Häufige Fragen (FAQ)</h2>
        <div className="divide-y divide-white/5">
            {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
        </div>
    </div>
  );
}
