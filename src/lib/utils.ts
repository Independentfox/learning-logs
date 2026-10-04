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

/** The page's content column: up to 85rem wide (1360px at a 16px root), with roomier gutters as it grows. */
export const shell = "mx-auto w-full max-w-[85rem] px-6 md:px-10 xl:px-16";

/**
 * Converts a design size in px to rem. Everything is sized in rem so the whole
 * page scales with the root font size (see `html` in globals.css).
 */
export const rem = (px: number) => `${px / 16}rem`;

/** How long a sign-in lasts, and how long one visit counts for: one day. */
export const DAY_SECONDS = 60 * 60 * 24;
