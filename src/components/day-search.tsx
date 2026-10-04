"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { cn, rem } from "@/lib/utils";

export type DayEntry = { day: number; title: string; category: string };

const MAX_OPTIONS = 6;

/** "day 10", "Day10", "10" → 10. */
function parseDay(query: string) {
  const n = Number(query.match(/\d+/)?.[0]);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

/** Jump straight to a day: type "day 10" (or just "10") and press Enter. */
export function DaySearch({ days, currentDay }: { days: DayEntry[]; currentDay: number }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [invalid, setInvalid] = useState(false);

  const day = parseDay(query);

  // The day typed first (logged or not), then logged days that start with the same digits.
  const options = useMemo(() => {
    if (!day) return [];
    const exact = days.find((entry) => entry.day === day);
    const more = days.filter((entry) => entry.day !== day && String(entry.day).startsWith(String(day)));
    return [exact ?? { day, title: "", category: "" }, ...more].slice(0, MAX_OPTIONS);
  }, [day, days]);

  // "/" anywhere on the page focuses the search.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (e.key !== "/" || target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
        return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (target: number) => {
    setOpen(false);
    inputRef.current?.blur();
    router.push(`/day/${target}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!day) return setInvalid(true);
    go(options[active]?.day ?? day);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") return setOpen(false);
    if (!options.length || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    setOpen(true);
    setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
  };

  const describe = (entry: DayEntry) => {
    if (entry.title) return entry.title;
    return entry.day < currentDay ? "No log for this day" : "Not logged yet";
  };

  const showList = open && options.length > 0;

  return (
    <form role="search" onSubmit={onSubmit} className="relative w-full sm:w-[22rem]">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search for a day
      </label>
      <Search
        size={rem(16)}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle"
      />
      <input
        ref={inputRef}
        id={`${listId}-input`}
        type="search"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search day 100, day 10…"
        value={query}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList ? `${listId}-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
          setInvalid(false);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="h-12 w-full rounded-xl border border-line bg-card pr-12 pl-11 text-[0.9375rem] text-fg transition-colors outline-none placeholder:text-subtle focus:border-tint-line focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {!query && (
        <kbd className="pointer-events-none absolute top-1/2 right-3 grid h-6 min-w-6 -translate-y-1/2 place-items-center rounded-md border border-line px-1.5 font-mono text-xs text-subtle">
          /
        </kbd>
      )}

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Days"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-line bg-canvas p-1 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.35)]"
        >
          {options.map((entry, i) => (
            <li
              key={entry.day}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown, not click: it fires before the input's blur closes the list.
              onMouseDown={(e) => {
                e.preventDefault();
                go(entry.day);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex cursor-pointer items-baseline gap-3 rounded-lg px-3 py-2.5 text-sm",
                i === active && "bg-card",
              )}
            >
              <span className="w-16 shrink-0 font-mono text-link">Day {entry.day}</span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate", entry.title ? "text-fg" : "text-subtle")}>
                  {describe(entry)}
                </span>
                {entry.category && (
                  <span className="mt-0.5 block truncate text-xs text-subtle">{entry.category}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      {invalid && (
        <p role="alert" className="absolute top-full left-1 mt-1.5 text-xs text-subtle">
          Type a day number, like 10.
        </p>
      )}
    </form>
  );
}
