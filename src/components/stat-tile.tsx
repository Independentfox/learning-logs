import type { ReactNode } from "react";

/** One big number in the stats panel. Lives inside a <dl>. */
export function StatTile({ label, value, note }: { label: string; value: ReactNode; note: string }) {
  return (
    <div className="min-w-0 border-l border-line pl-4 first:border-l-0 first:pl-0 sm:pl-6">
      <dt className="text-[13px] text-muted">{label}</dt>
      <dd className="mt-2">
        <span className="block text-[2rem] leading-none font-semibold tracking-[-0.03em] text-fg tabular-nums sm:text-[2.6rem]">
          {value}
        </span>
        <span className="mt-2 block truncate text-xs text-subtle">{note}</span>
      </dd>
    </div>
  );
}
