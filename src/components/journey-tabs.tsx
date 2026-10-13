"use client";

import { BookOpen, Hammer, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, rem } from "@/lib/utils";

/** `short` is what fits three-across on a phone. */
const tabs = [
  { href: "/", label: "Learning Journey", short: "Learning", Icon: BookOpen },
  { href: "/building", label: "Building Journey", short: "Building", Icon: Hammer },
  { href: "/contributors", label: "Contributors", short: "Contributors", Icon: Users },
] as const;

/** Real routes styled as tabs, so each journey has a link you can share. */
export function JourneyTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Journeys"
      className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-card p-1 sm:inline-grid"
    >
      {tabs.map(({ href, label, short, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium whitespace-nowrap transition-colors sm:px-5",
              active
                ? "bg-canvas text-fg shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--line)]"
                : "text-muted hover:text-fg",
            )}
          >
            <Icon size={rem(16)} aria-hidden className={cn("hidden sm:block", active && "text-link")} />
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
