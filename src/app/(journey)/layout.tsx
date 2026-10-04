import { ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { authEnabled } from "@/auth";
import { Glow } from "@/components/glow";
import { LinkedInIcon } from "@/components/icons";
import { JourneyTabs } from "@/components/journey-tabs";
import { LiveStats } from "@/components/live-stats";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatTile } from "@/components/stat-tile";
import { StreakGrid } from "@/components/streak-grid";
import { currentDay } from "@/content/logs";
import { site } from "@/content/site";
import { cn, delay, shell } from "@/lib/utils";
import { getViewer, type Viewer } from "@/lib/viewer";

/** Join for visitors, your learner number once you have one, and always a way to follow along. */
function HeroActions({ viewer }: { viewer: Viewer }) {
  return (
    <div className="enter mt-9 flex flex-wrap items-center gap-3" style={delay(140)}>
      {authEnabled && !viewer && (
        <Link
          href="/login"
          className="group inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-[15px] font-medium text-accent-fg shadow-[0_8px_24px_-10px_rgb(15_118_110/0.7)] transition-[filter] hover:brightness-110"
        >
          Join the learners
          <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
      {viewer?.learner && (
        <Link
          href="/account"
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-tint-line bg-tint px-4 text-[15px] font-medium text-link transition-colors hover:bg-card"
        >
          <GraduationCap size={17} aria-hidden />
          You&apos;re learner #{viewer.learner.number}
        </Link>
      )}
      <a
        href={site.links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-[15px] font-medium text-fg transition-colors hover:bg-card"
      >
        <LinkedInIcon size={15} />
        Follow on LinkedIn
      </a>
    </div>
  );
}

function StatsPanel() {
  return (
    <aside
      aria-label="Stats"
      className="enter rounded-3xl border border-line bg-card/60 p-6 backdrop-blur-sm sm:p-8"
      style={delay(180)}
    >
      <div className="flex items-center justify-between">
        <p className="eyebrow">At a glance</p>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">
          <span className="relative flex size-2" aria-hidden>
            <span className="live-ping absolute inset-0 rounded-full bg-live" />
            <span className="relative size-2 rounded-full bg-live" />
          </span>
          Live
        </span>
      </div>
      <dl className="mt-8 grid grid-cols-3">
        <StatTile label="Day" value={currentDay} note={currentDay ? "and counting" : "Day 1 starts soon"} />
        <LiveStats />
      </dl>
      <div className="mt-8 border-t border-line pt-6">
        <StreakGrid />
      </div>
    </aside>
  );
}

/** Shared by both tabs: intro, live stats and the tab switcher. */
export default async function JourneyLayout({ children }: { children: ReactNode }) {
  const viewer = await getViewer();

  return (
    <div className="relative isolate">
      <Glow />
      <SiteHeader viewer={viewer} />

      <main id="main" className={cn(shell, "pb-4")}>
        <section className="grid items-end gap-10 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14 lg:pt-20 xl:gap-20">
          <div>
            <p className="enter eyebrow">A learn-in-public journal</p>
            <h1 className="enter-rise mt-5 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.04em] text-fg sm:text-[4rem] xl:text-[5.25rem]">
              Learning in public,
              <br />
              <span className="font-serif font-normal text-link italic">one day at a time.</span>
            </h1>
            <p className="enter mt-6 max-w-[600px] text-[17px] leading-[1.75] text-muted" style={delay(80)}>
              Every day I study something new — DSA, CS fundamentals, software engineering, AI &amp; LLMs —
              and log what I learned here. Everything I build goes up in the open, too.
            </p>
            <HeroActions viewer={viewer} />
          </div>
          <StatsPanel />
        </section>

        <div className="enter mt-16 lg:mt-24" style={delay(220)}>
          <JourneyTabs />
        </div>

        <div className="enter mt-8" style={delay(260)}>
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
