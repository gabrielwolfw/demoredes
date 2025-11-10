// app/login/page.tsx
"use client";

import { useEffect, useRef } from "react";
import SigninForm from "@/components/signin-form";

export default function LoginPage() {
  const mouseTimer = useRef<number | null>(null);
  const interactionQueue = useRef<any[]>([]);
  const running = useRef(true);

  useEffect(() => {
    running.current = true;

    // === 1) Periodic background "suspicious" calls ===
    const intervalId = setInterval(() => {
      // fire-and-forget, no UI
      void fetch("/api/demo").catch(() => {});
    }, 5000 + Math.floor(Math.random() * 5000)); // every 5-10s

    // === 2) Intermittent heavy downloads (simulate bursts) ===
    const heavyDownload = async () => {
      try {
        // occasionally download large blob
        await fetch("/api/demo/large-image").then((r) => r.blob());
      } catch {}
    };
    const heavyInterval = setInterval(() => {
      // run with lower probability to mimic real behavior
      if (Math.random() < 0.25) void heavyDownload();
    }, 12_000);

    // === 3) Create some client cookies (so Cookie header grows) ===
    for (let i = 0; i < 8; i++) {
      document.cookie = `demo_client_ck_${i}=${Math.random().toString(36).slice(2)}; path=/; max-age=3600`;
    }

    // === 4) Track mouse movements / user interactions (debounced) ===
    const sendInteraction = async () => {
      if (interactionQueue.current.length === 0) return;
      const payload = {
        events: interactionQueue.current.splice(0, interactionQueue.current.length),
        ts: Date.now(),
      };
      try {
        await fetch("/api/demo/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {}
    };

    const onMouseMove = (e: MouseEvent) => {
      // push-ish but debounced to avoid spamming
      interactionQueue.current.push({ type: "mousemove", x: e.clientX, y: e.clientY, t: Date.now() });
      if (mouseTimer.current) window.clearTimeout(mouseTimer.current);
      mouseTimer.current = window.setTimeout(() => {
        void sendInteraction();
      }, 800); // send after 800ms of inactivity
    };

    const onKey = (e: KeyboardEvent) => {
      interactionQueue.current.push({ type: "keydown", key: e.key, t: Date.now() });
      if (mouseTimer.current) window.clearTimeout(mouseTimer.current);
      mouseTimer.current = window.setTimeout(() => {
        void sendInteraction();
      }, 800);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKey);

    // === 5) Occasional client-side cookie bursts ===
    const cookieBurst = setInterval(() => {
      if (Math.random() < 0.2) {
        for (let i = 0; i < 6; i++) {
          document.cookie = `demo_burst_${Date.now()}_${i}=${Math.random().toString(36).slice(2)}; path=/; max-age=3600`;
        }
      }
    }, 10_000);

    // === 6) Light poll to detector (optional, silent) ===
    const detectPoll = setInterval(() => {
      // poll server detector; we intentionally ignore response
      void fetch("/api/demo/detect").catch(() => {});
    }, 7000);

    // Cleanup on unmount
    return () => {
      running.current = false;
      clearInterval(intervalId);
      clearInterval(heavyInterval);
      clearInterval(cookieBurst);
      clearInterval(detectPoll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKey);
      if (mouseTimer.current) window.clearTimeout(mouseTimer.current);
    };
  }, []);

  // Render only the normal login form — no logs or demo controls
  return (
    <main className="min-h-screen bg-linear-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SigninForm onSuccess={() => { /* nothing visible; demo already runs */ }} />
      </div>
    </main>
  );
}
