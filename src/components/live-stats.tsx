"use client";

import { useEffect, useRef, useState } from "react";
import { StatTile } from "@/components/stat-tile";
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

/** Records this visit once on load, then refreshes the totals every 30s while the tab is visible. */
function useVisitStats() {
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

  return stats;
}

/** The Visits and Learners tiles of the stats panel. Shows "—" until the numbers arrive. */
export function LiveStats() {
  const stats = useVisitStats();
  const views = useCountUp(stats?.views ?? 0);
  const learners = useCountUp(stats?.learners ?? 0);

  return (
    <>
      <StatTile label="Visits" value={stats ? format(views) : "—"} note="all time" />
      <StatTile label="Learners" value={stats ? format(learners) : "—"} note="signed up" />
    </>
  );
}
