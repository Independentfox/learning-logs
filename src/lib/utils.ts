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

/** The page's content column: fills the screen up to 1360px, with roomier gutters as it grows. */
export const shell = "mx-auto w-full max-w-[1360px] px-6 md:px-10 xl:px-16";
