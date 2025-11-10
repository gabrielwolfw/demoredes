// app/api/demo/track/route.ts
import { NextResponse } from "next/server";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

let totalEvents = 0;
let lastWindowStart = Date.now();
let eventsThisWindow = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const events = Array.isArray(body.events) ? body.events : [];
    const count = events.length;
    totalEvents += count;

    // Guardar eventos en archivo
    const logPath = join(process.cwd(), "events.log.json");
    let logArr: any[] = [];
    if (existsSync(logPath)) {
      try {
        logArr = JSON.parse(readFileSync(logPath, "utf8"));
        if (!Array.isArray(logArr)) logArr = [];
      } catch {
        logArr = [];
      }
    }
    if (count > 0) {
      logArr.push(...events);
      writeFileSync(logPath, JSON.stringify(logArr, null, 2));
    }

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