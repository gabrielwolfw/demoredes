// app/api/demo/route.ts
import { NextResponse } from "next/server";
import { incrementDemoCallCounter } from "./detect/route"; // importa el contador del detector

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function GET() {
  // Simula latencia variable
  await sleep(1500 + Math.floor(Math.random() * 1500)); // 1.5s - 3s

  // Intentamos incrementar el contador de llamadas (no crítico si falla)
  try {
    incrementDemoCallCounter();
  } catch (e) {
    // Silencioso: seguimos con la respuesta aunque la incrementación falle
    // console.error("incrementDemoCallCounter failed", e);
  }

  // Prepara cookies demo
  const cookies = [
    { name: "demo_ck_1", value: String(Date.now()), opts: { path: "/", maxAge: 3600 } },
    { name: "demo_ck_2", value: Math.random().toString(36).slice(2), opts: { path: "/", maxAge: 3600 } },
    { name: "tracking_cookie", value: Math.random().toString(36), opts: { path: "/", maxAge: 3600 } },
    { name: "bigcookie", value: "x".repeat(1024), opts: { path: "/", maxAge: 3600 } }, // cookie grande (demo)
  ];

  // Payload grande (solo medimos longitud para no inflar el JSON)
  const bigPayloadLength = 80 * 1024;

  const res = NextResponse.json(
    { ok: true, warning: "demo suspicious activity", payloadLength: bigPayloadLength },
    { status: 200 }
  );

  // Adjunta cookies al NextResponse
  for (const c of cookies) {
    res.cookies.set(c.name, c.value, c.opts);
  }

  return res;
}
