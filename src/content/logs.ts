import type { CategorySlug } from "./categories";

export type Log = {
  day: number;
  /** ISO date, e.g. "2026-10-16". */
  date: string;
  title: string;
  categories: CategorySlug[];
  /** Slug from projects.ts, on days you built something. */
  project?: string;
  /** The LinkedIn post for this day, once it's up. */
  linkedin?: string;
};

/**
 * One entry per day. Card counts and the "Day N" header are derived from this.
 * (Full write-ups move to MDX files once the /day/[n] pages land.)
 */
export const logs: Log[] = [];

export const currentDay = logs.reduce((max, log) => Math.max(max, log.day), 0);

export function logsIn(category: CategorySlug) {
  return logs.filter((log) => log.categories.includes(category)).sort((a, b) => b.day - a.day);
}

export function logsFor(project: string) {
  return logs.filter((log) => log.project === project).sort((a, b) => b.day - a.day);
}
