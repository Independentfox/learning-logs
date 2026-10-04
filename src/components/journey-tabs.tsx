"use client";

import { BookOpen, Hammer } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Learning Journey", Icon: BookOpen },
  { href: "/building", label: "Building Journey", Icon: Hammer },
] as const;

/** Real routes styled as tabs, so each journey has a link you can share. */
export function JourneyTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Journeys"
      className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-card p-1 sm:inline-grid"
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-5",
              active
                ? "bg-canvas text-fg shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--line)]"
                : "text-muted hover:text-fg",
            )}
          >
            <Icon size={16} aria-hidden className={active ? "text-link" : undefined} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
