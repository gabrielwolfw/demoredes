// app/api/demo/large-image/route.ts
export async function GET() {
  // Tamaño objetivo en bytes (~1.5 MB)
  const size = 1_500_000;

  // Generamos un chunk repetido para evitar concatenaciones costosas en bucles
  const chunk = "a".repeat(16_384); // 16 KB
  const chunksCount = Math.ceil(size / chunk.length);

  // Construimos un ArrayBuffer final
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];

  for (let i = 0; i < chunksCount; i++) {
    const remaining = size - parts.reduce((s, p) => s + p.byteLength, 0);
    if (remaining <= 0) break;
    const take = Math.min(chunk.length, remaining);
    parts.push(encoder.encode(chunk.slice(0, take)));
  }

  // Concatenar en un solo Uint8Array
  const totalLen = parts.reduce((s, p) => s + p.byteLength, 0);
  const out = new Uint8Array(totalLen);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.byteLength;
  }

  return new Response(out, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": String(totalLen),
      "Cache-Control": "no-store",
    },
  });
}
