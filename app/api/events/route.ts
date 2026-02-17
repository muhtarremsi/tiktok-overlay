import { NextRequest, NextResponse } from 'next/server';
import { WebcastPushConnection } from 'tiktok-live-connector';

// Simpler In-Memory Cache für Demo-Zwecke (In Produktion: Redis)
let lastTriggered: Record<string, boolean> = {};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const u = searchParams.get('u');
  const c = searchParams.get('c');

  if (!u || !c) return NextResponse.json({ error: "Missing params" });

  // Hier würde in einer echten Umgebung der Connector permanent laufen.
  // Da Vercel Serverless ist, nutzen wir hier einen Check-Status.
  
  const triggered = lastTriggered[u] || false;
  if (triggered) lastTriggered[u] = false; // Reset nach Abruf

  return NextResponse.json({ triggered });
}
