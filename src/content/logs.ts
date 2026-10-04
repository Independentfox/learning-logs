import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCategory, type Category } from "./categories";

export type Log = {
  day: number;
  /** ISO date, e.g. "2026-10-16". */
  date: string;
  title: string;
  /** A category slug from categories.ts. */
  category: string;
  /** The syllabus topic it belongs to — or, for open-ended categories, what it covered. */
  topic: string;
  /** The LinkedIn post for this day, once it's up. */
  linkedin?: string;
  /** Slug from projects.ts, on days you built something. */
  project?: string;
  /** The notes, in Markdown. */
  body: string;
};

const DIR = path.join(process.cwd(), "content/days");

/**
 * Reads every content/days/*.md. A malformed file fails the build with a
 * message saying what to fix, rather than going live broken.
 */
function load(): Log[] {
  if (!fs.existsSync(DIR)) return [];

  const logs = fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file): Log => {
      const where = `content/days/${file}`;
      const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));

      const day = Number(data.day);
      if (!Number.isInteger(day) || day < 1) throw new Error(`${where}: "day" must be a whole number from 1`);

      // YAML reads an unquoted 2026-10-16 as a Date.
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`${where}: "date" must look like 2026-10-16`);

      const title = String(data.title ?? "").trim();
      if (!title) throw new Error(`${where}: "title" is missing`);

      const category = getCategory(String(data.category));
      if (!category)
        throw new Error(`${where}: unknown category "${data.category}" — use a slug from categories.ts`);

      const topic = String(data.topic ?? "").trim();
      if (!topic) throw new Error(`${where}: "topic" is missing`);
      if (!category.freeform && !category.topics.includes(topic)) {
        throw new Error(
          `${where}: "${topic}" isn't in the ${category.name} syllabus — add it in categories.ts`,
        );
      }

      const linkedin = data.linkedin ? String(data.linkedin) : undefined;
      const project = data.project ? String(data.project) : undefined;
      return { day, date, title, category: category.slug, topic, linkedin, project, body: content.trim() };
    })
    .sort((a, b) => a.day - b.day);

  logs.forEach((log, i) => {
    if (i > 0 && logs[i - 1].day === log.day) throw new Error(`content/days: Day ${log.day} is logged twice`);
  });
  return logs;
}

/** Every logged day, Day 1 first. */
export const logs = load();

export const currentDay = logs.at(-1)?.day ?? 0;

export function getLog(day: number) {
  return logs.find((log) => log.day === day);
}

/** The logged days either side of `day`, skipping gaps. */
export function neighbours(day: number) {
  return {
    prev: logs.filter((log) => log.day < day).at(-1),
    next: logs.find((log) => log.day > day),
  };
}

/** A project's build days, earliest first. */
export function logsFor(project: string) {
  return logs.filter((log) => log.project === project);
}

/** A category's days, earliest first. */
export function logsIn(category: string) {
  return logs.filter((log) => log.category === category);
}

/**
 * A category's topics with the days logged under each — in syllabus order,
 * then any open-ended topics in the order they were first logged.
 */
export function topicsWithDays(category: Category) {
  const days = logsIn(category.slug);
  const extra = days.map((log) => log.topic).filter((topic) => !category.topics.includes(topic));
  const names = [...category.topics, ...new Set(extra)];
  return names.map((name) => ({ name, days: days.filter((log) => log.topic === name) }));
}
