"use client";
import React, { useEffect } from "react";

export default function ObsLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // 1. Zwinge den Hintergrund sofort transparent zu machen
        document.documentElement.style.setProperty('background', 'transparent', 'important');
        document.documentElement.style.setProperty('background-color', 'transparent', 'important');
        document.body.style.setProperty('background', 'transparent', 'important');
        document.body.style.setProperty('background-color', 'transparent', 'important');

        // 2. Suche nach dem Cookie-Banner und lösche ihn gnadenlos
        const killBanner = () => {
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.textContent && (btn.textContent.includes('ALLE AKZEPTIEREN') || btn.textContent.includes('NUR ESSENZIELLE'))) {
                    // Finde den äußeren Container des Banners (meistens ein div mit fixed oder absolute)
                    let container = btn.closest('div[class*="fixed"]') || btn.parentElement?.parentElement?.parentElement;
                    if (container) {
                        (container as HTMLElement).style.setProperty('display', 'none', 'important');
                        (container as HTMLElement).style.setProperty('opacity', '0', 'important');
                        (container as HTMLElement).style.setProperty('pointer-events', 'none', 'important');
                    }
                }
            });
        };

        const obs = new MutationObserver(killBanner);
        obs.observe(document.body, { childList: true, subtree: true });
        killBanner(); // Direkt einmal ausführen

        return () => obs.disconnect();
    }, []);

    return <div className="bg-transparent m-0 p-0 overflow-hidden w-fit h-fit">{children}</div>;
}
