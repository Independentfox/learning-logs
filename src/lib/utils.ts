import type { CSSProperties } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Staggers an `.enter` element by `ms`. */
export function delay(ms: number): CSSProperties {
  return { "--d": `${ms}ms` } as CSSProperties;
}

/**
 * The page's content column: nearly full width, with a slim gutter. On laptops and
 * monitors 1rem scales with the screen (see globals.css), so this fills ~95% of any screen.
 */
export const shell = "mx-auto w-full max-w-[104rem] px-6 md:px-8 lg:px-10";

/**
 * Converts a design size in px to rem. Everything is sized in rem so the whole
 * page scales with the root font size (see `html` in globals.css).
 */
export const rem = (px: number) => `${px / 16}rem`;

/** How long a sign-in lasts, and how long one visit counts for: one day. */
export const DAY_SECONDS = 60 * 60 * 24;

/** "2026-10-16" → "16 Oct 2026". */
export function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
