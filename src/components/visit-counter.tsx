"use client";

import { useEffect, useRef, useState } from "react";
import type { VisitStats } from "@/lib/redis";

const REFRESH_MS = 30_000;
const format = new Intl.NumberFormat("en-US").format;

/** Eases the shown number toward `target` instead of jumping. */
function useCountUp(target: number) {
  const [value, setValue] = useState(0);
  const shown = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 900;
    const from = shown.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      const next = Math.round(from + (target - from) * (1 - (1 - t) ** 3));
      shown.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

function Stat({ value, label }: { value: number; label: string }) {
  const shown = useCountUp(value);
  return (
    <span>
      <span className="font-medium text-fg tabular-nums">{format(shown)}</span> {label}
    </span>
  );
}

/**
 * Records this visit once on load, then refreshes the totals every 30s while
 * the tab is visible. Renders nothing until a Redis store is connected.
 */
export function VisitCounter() {
  const [stats, setStats] = useState<VisitStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async (method: "GET" | "POST") => {
      try {
        const res = await fetch("/api/visit", { method, cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as VisitStats;
        if (!cancelled) setStats(data);
      } catch {}
    };

    load("POST");
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") load("GET");
    }, REFRESH_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!stats) return null;

  return (
    <span
      title="Live — updates every 30 seconds"
      className="inline-flex h-8 items-center gap-2.5 rounded-full border border-line px-3 text-[13px] text-muted"
    >
      <span className="relative flex size-2" aria-hidden>
        <span className="live-ping absolute inset-0 rounded-full bg-live" />
        <span className="relative size-2 rounded-full bg-live" />
      </span>
      <Stat value={stats.views} label={stats.views === 1 ? "visit" : "visits"} />
      <span aria-hidden className="text-subtle">
        ·
      </span>
      <Stat value={stats.visitors} label={stats.visitors === 1 ? "reader" : "readers"} />
    </span>
  );
}
