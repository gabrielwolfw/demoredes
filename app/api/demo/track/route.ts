// app/api/demo/track/route.ts
import { NextResponse } from "next/server";

let totalEvents = 0;
let lastWindowStart = Date.now();
let eventsThisWindow = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const count = Array.isArray(body.events) ? body.events.length : 1;
    totalEvents += count;

    // ventana rolling simple de 60s para detector
    const now = Date.now();
    if (now - lastWindowStart > 60_000) {
      lastWindowStart = now;
      eventsThisWindow = count;
    } else {
      eventsThisWindow += count;
    }

    // respuesta mínima
    return NextResponse.json({ ok: true, totalEvents, eventsThisWindow }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
}
