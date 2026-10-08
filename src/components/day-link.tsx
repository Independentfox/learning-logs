import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Log } from "@/content/logs";
import { formatDate, rem } from "@/lib/utils";

/** One logged day as a row in a list: its number, title and date. */
export function DayLink({ log }: { log: Log }) {
  return (
    <li>
      <Link href={`/day/${log.day}`} className="group flex items-baseline gap-4 py-3">
        <span className="w-16 shrink-0 font-mono text-sm text-link">Day {log.day}</span>
        <span className="min-w-0 flex-1 truncate text-fg transition-colors group-hover:text-link">
          {log.title}
        </span>
        <time dateTime={log.date} className="hidden shrink-0 text-xs text-subtle sm:block">
          {formatDate(log.date)}
        </time>
        <ArrowRight
          size={rem(14)}
          aria-hidden
          className="shrink-0 self-center text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-link"
        />
      </Link>
    </li>
  );
}
