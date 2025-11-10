// app/api/demo/detect/route.ts
import { NextResponse } from "next/server";

/**
 * Detector simple:
 * - revisa counters en memoria (este ejemplo lee el endpoint track que actualiza eventsThisWindow)
 * - aquí volvemos a usar una "forma simple": mantendremos un contador local que incrementaremos
 *   cada vez que /api/demo se llame (ver abajo el route.ts base) y lo compararemos con un umbral.
 *
 * Nota: en ambientes serverless esto no es persistente entre invocaciones. Para demo local funciona.
 */

let demoCallCountWindow = 0;
let windowStart = Date.now();

export async function GET() {
  const now = Date.now();
  // resetear ventana cada 30s
  if (now - windowStart > 30_000) {
    demoCallCountWindow = 0;
    windowStart = now;
  }

  // umbral para "sospechoso"
  const THRESHOLD = 6; // e.g., más de 6 llamadas en la ventana -> alarma

  const alert = demoCallCountWindow > THRESHOLD ? "firewall" : undefined;

  return NextResponse.json({ ok: true, demoCallCountWindow, alert });
}

// Para que demo calls incrementen el contador, /api/demo route.ts debe incrementar demoCallCountWindow.
// Si prefieres que demo/route.ts se encargue, lo hacemos allí.
export function incrementDemoCallCounter() {
  const now = Date.now();
  if (now - windowStart > 30_000) {
    demoCallCountWindow = 1;
    windowStart = now;
  } else {
    demoCallCountWindow++;
  }
}
