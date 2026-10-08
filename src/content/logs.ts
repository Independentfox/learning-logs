import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getCategory, type Category } from "./categories";
import { difficulties, platformFor, type Difficulty, type PlatformId } from "./platforms";

export type Question = {
  /** Stable id from the URL, e.g. "leetcode:/problems/two-sum" — solve counts are keyed on it. */
  id: string;
  title: string;
  url: string;
  platform: PlatformId;
  difficulty: Difficulty;
};

/** One rendered page of Excalidraw notes (see scripts/notes.mjs). */
export type NotesPage = { src: string; width: number; height: number };

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
  /** "Revise in 30 seconds": a few one-line takeaways. */
  summary: string[];
  /** Drawn notes, page by page. */
  pages: NotesPage[];
  /** The notes, in Markdown — explanation, complexity, code. */
  body: string;
  /** Practice questions for the day. */
  questions: Question[];
};

const DIR = path.join(process.cwd(), "content/days");
const NOTES = path.join(process.cwd(), "content/notes");

export function parseSummary(raw: unknown, where: string): string[] {
  if (raw == null) return [];
  return parseStringList(raw, where, "summary");
}

/**
 * A front-matter list where every item must be plain text. YAML reads an unquoted line
 * containing ": " as a key–value pair, which would otherwise reach the page as
 * "[object Object]" — so that fails the build with a hint instead.
 */
export function parseStringList(raw: unknown, where: string, field: string): string[] {
  if (!Array.isArray(raw)) throw new Error(`${where}: "${field}" must be a list`);
  return raw
    .map((item, i) => {
      if (typeof item === "string") return item.trim();
      if (typeof item === "number" || typeof item === "boolean") return String(item);
      throw new Error(
        `${where}: "${field}" item ${i + 1} isn't plain text — if it contains ": ", wrap the whole line in quotes`,
      );
    })
    .filter(Boolean);
}

export function parseQuestions(raw: unknown, where: string): Question[] {
  if (raw == null) return [];
  if (!Array.isArray(raw)) throw new Error(`${where}: "questions" must be a list`);
  return raw.map((item, i) => {
    const at = `${where}: question ${i + 1}`;
    const q = (item ?? {}) as Record<string, unknown>;

    const title = String(q.title ?? "").trim();
    if (!title) throw new Error(`${at}: "title" is missing`);

    let url: URL;
    try {
      url = new URL(String(q.url));
    } catch {
      throw new Error(`${at}: "url" isn't a valid link`);
    }
    const platform = platformFor(url);
    if (!platform) throw new Error(`${at}: ${url.hostname} isn't a known platform — add it in platforms.ts`);

    const difficulty = String(q.difficulty ?? "").toLowerCase() as Difficulty;
    if (!difficulties.includes(difficulty))
      throw new Error(`${at}: "difficulty" must be easy, medium or hard`);

    const slug = url.pathname
      .toLowerCase()
      .replace(/\/+$/, "")
      .replace(/\/description$/, "");
    return { id: `${platform}:${slug}`, title, url: url.href, platform, difficulty };
  });
}

/** Pages rendered by `npm run notes:render`, listed in content/notes/<day>/rendered.json. */
function readPages(day: number): NotesPage[] {
  const manifest = path.join(NOTES, String(day), "rendered.json");
  if (!fs.existsSync(manifest)) return [];
  const { pages } = JSON.parse(fs.readFileSync(manifest, "utf8")) as {
    pages: { file: string; width: number; height: number }[];
  };
  return pages.map(({ file, width, height }) => ({ src: `/notes/${day}/${file}`, width, height }));
}

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
      return {
        day,
        date,
        title,
        category: category.slug,
        topic,
        linkedin,
        project,
        summary: parseSummary(data.summary, where),
        pages: readPages(day),
        body: content.trim(),
        questions: parseQuestions(data.questions, where),
      };
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
