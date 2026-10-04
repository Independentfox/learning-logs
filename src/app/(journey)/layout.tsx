import { ArrowUpRight, CalendarDays, Flame } from "lucide-react";
import type { ReactNode } from "react";
import { JourneyTabs } from "@/components/journey-tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisitCounter } from "@/components/visit-counter";
import { currentDay } from "@/content/logs";
import { site } from "@/content/site";
import { delay } from "@/lib/utils";

function DayBadge() {
  const started = currentDay > 0;
  const Icon = started ? Flame : CalendarDays;
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-full border border-tint-line bg-tint px-3 text-[13px] font-medium text-link">
      <Icon size={14} aria-hidden />
      {started ? `Day ${currentDay}` : "Day 1 starts soon"}
    </span>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 transition-colors hover:text-fg"
    >
      {children}
      <ArrowUpRight size={13} aria-hidden />
    </a>
  );
}

/** Shared by both tabs: intro, live stats and the tab switcher. */
export default function JourneyLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="mx-auto w-full max-w-[760px] px-6 pt-12 pb-10 sm:pt-20">
      <header>
        <div className="enter flex items-center justify-between gap-4">
          <p className="eyebrow">Manav Punjabi · Learning Logs</p>
          <ThemeToggle />
        </div>

        <h1 className="enter-rise mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-fg sm:text-[3.5rem]">
          Learning in public,
          <br />
          <span className="font-serif font-normal text-link italic">one day at a time.</span>
        </h1>

        <p className="enter mt-5 max-w-[580px] text-[16px] leading-[1.75] text-muted" style={delay(80)}>
          Every day I study something new — DSA, CS fundamentals, software engineering, AI &amp; LLMs — and
          log what I learned here. Everything I build goes up in the open, too.
        </p>

        <div className="enter mt-6 flex min-h-8 flex-wrap items-center gap-2.5" style={delay(140)}>
          <DayBadge />
          <VisitCounter />
        </div>
      </header>

      <div className="enter mt-12" style={delay(200)}>
        <JourneyTabs />
      </div>

      <div className="enter mt-8" style={delay(260)}>
        {children}
      </div>

      <footer className="mt-20 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          Written by{" "}
          <a href={site.links.portfolio} target="_blank" rel="noopener noreferrer" className="inline-link">
            {site.author}
          </a>
          , one log at a time.
        </p>
        <nav aria-label="Elsewhere" className="flex gap-5">
          <FooterLink href={site.links.portfolio}>Portfolio</FooterLink>
          <FooterLink href={site.links.linkedin}>LinkedIn</FooterLink>
          <FooterLink href={site.links.github}>GitHub</FooterLink>
        </nav>
      </footer>
    </main>
  );
}
