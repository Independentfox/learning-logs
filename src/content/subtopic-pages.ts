import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parseQuestions, parseStringList, parseSummary, type Question } from "./logs";
import { guides, subtopicId, type TopicGuide } from "./subtopics";

/** A rendered Excalidraw diagram (see scripts/notes.mjs). */
export type Diagram = { src: string; width: number; height: number };

/** A subtopic that has its own page — one published page is one log. */
export type SubtopicPage = {
  guide: TopicGuide;
  /** The URL segment, and the content folder's name. */
  slug: string;
  /** The subtopic's name, exactly as in subtopics.ts. */
  name: string;
  /** Read-progress id, the same one the topic page's checkbox uses. */
  id: string;
  /** Its position in the guide, from 1. */
  number: number;
  /** ISO date it went live, e.g. "2026-10-09". */
  published: string;
  summary: string[];
  /** The write-up, in Markdown. */
  body: string;
  questions: Question[];
  /** Diagrams in this folder, by name: `![caption](diagram:name)` in the body. */
  diagrams: Record<string, Diagram>;
};

const ROOT = path.join(process.cwd(), "content/subtopics");
const DIAGRAM_REF = /!\[[^\]]*\]\(diagram:([a-z0-9-]+)\)/g;

/**
 * Reads content/subtopics/<category>/<guide>/<subtopic>/index.md. Anything malformed — a
 * subtopic that isn't in the guide, a missing date or sources, a diagram that was never
 * rendered — fails the build with a message saying what to fix.
 */
function load(): SubtopicPage[] {
  const pages: SubtopicPage[] = [];

  for (const guide of guides) {
    const dir = path.join(ROOT, guide.category, guide.slug);
    if (!fs.existsSync(dir)) continue;

    for (const slug of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, slug, "index.md");
      if (!fs.existsSync(file)) continue;
      const where = `content/subtopics/${guide.category}/${guide.slug}/${slug}/index.md`;

      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`${where}: the folder name must be lowercase-with-hyphens`);
      }

      const { data, content } = matter(fs.readFileSync(file, "utf8"));

      const name = String(data.subtopic ?? "").trim();
      const number = guide.subtopics.indexOf(name) + 1;
      if (!number)
        throw new Error(`${where}: "${name}" isn't a subtopic of "${guide.topic}" in subtopics.ts`);

      // YAML reads an unquoted 2026-10-09 as a Date.
      const published =
        data.published instanceof Date
          ? data.published.toISOString().slice(0, 10)
          : String(data.published ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(published))
        throw new Error(`${where}: "published" must look like 2026-10-09`);

      // Where the material was cross-checked against. Never shown on the site.
      if (data.sources == null || parseStringList(data.sources, where, "sources").length === 0) {
        throw new Error(`${where}: list the lessons this page covers under "sources"`);
      }

      const manifest = path.join(dir, slug, "rendered.json");
      const rendered: { file: string; source: string; width: number; height: number }[] = fs.existsSync(
        manifest,
      )
        ? JSON.parse(fs.readFileSync(manifest, "utf8")).pages
        : [];
      const diagrams = Object.fromEntries(
        rendered.map((d) => [
          d.source.replace(/\.excalidraw$/, ""),
          {
            src: `/diagrams/${guide.category}/${guide.slug}/${slug}/${d.file}`,
            width: d.width,
            height: d.height,
          },
        ]),
      );
      for (const [, diagram] of content.matchAll(DIAGRAM_REF)) {
        if (!diagrams[diagram]) {
          throw new Error(
            `${where}: diagram "${diagram}" isn't rendered — add ${diagram}.excalidraw and run notes:render`,
          );
        }
      }

      pages.push({
        guide,
        slug,
        name,
        id: subtopicId(guide, name),
        number,
        published,
        summary: parseSummary(data.summary, where),
        body: content.trim(),
        questions: parseQuestions(data.questions, where),
        diagrams,
      });
    }
  }

  const seen = new Map<string, string>();
  for (const page of pages) {
    const other = seen.get(page.id);
    if (other) throw new Error(`content/subtopics: "${page.name}" has two pages (${other} and ${page.slug})`);
    seen.set(page.id, page.slug);
  }

  // Oldest first; same-day pages in syllabus order.
  return pages.sort((a, b) => a.published.localeCompare(b.published) || a.number - b.number);
}

/** Every published subtopic page, oldest first. */
export const subtopicPages = load();

export function getSubtopicPage(category: string, guideSlug: string, slug: string) {
  return subtopicPages.find(
    (page) => page.guide.category === category && page.guide.slug === guideSlug && page.slug === slug,
  );
}

/** A category's published pages, oldest first. */
export function pagesIn(category: string) {
  return subtopicPages.filter((page) => page.guide.category === category);
}

/** A guide's published pages, by subtopic name. */
export function pagesByName(guide: TopicGuide) {
  return new Map(
    subtopicPages.filter((page) => page.guide === guide).map((page) => [page.name, page] as const),
  );
}

export const pageHref = (page: SubtopicPage) =>
  `/learning/${page.guide.category}/${page.guide.slug}/${page.slug}`;
