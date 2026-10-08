#!/usr/bin/env node
/**
 * Excalidraw drawings → SVGs for the site.
 *
 *   npm run notes:render   renders every drawing that's new or changed (needs Google Chrome;
 *                          CHROME_PATH overrides where it looks)
 *   npm run notes:check    fails if any drawing is missing or out of date — runs before every build
 *
 * Two kinds of folders hold drawings:
 *   content/notes/<day>/<n>.excalidraw          → public/notes/<day>/<n>.svg      (a day's pages)
 *   content/subtopics/<…>/<name>.excalidraw     → public/diagrams/<…>/<name>.svg  (diagrams in a
 *                                                                                  subtopic page)
 *
 * A source can be a normal Excalidraw file, or a quick draft with `"skeleton": true` whose
 * elements use Excalidraw's element-skeleton format. Drafts are expanded into a full scene on
 * render and written back, so every source ends up openable on excalidraw.com.
 *
 * Each folder's rendered drawings are listed in its rendered.json, with the source hash they
 * were made from — that's how `check` spots stale ones.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const EXCALIDRAW = "https://esm.sh/@excalidraw/excalidraw@0.18.1";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const sha1 = (text) => createHash("sha1").update(text).digest("hex");
const byNumber = (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10);
const rel = (p) => path.relative(ROOT, p);

/** Every folder of drawings: where its sources are, where its SVGs go, and its files in order. */
function scan() {
  const groups = [];

  const notes = path.join(ROOT, "content/notes");
  if (fs.existsSync(notes)) {
    for (const day of fs
      .readdirSync(notes)
      .filter((d) => /^\d+$/.test(d))
      .sort(byNumber)) {
      const src = path.join(notes, day);
      groups.push({
        src,
        out: path.join(ROOT, "public/notes", day),
        files: fs
          .readdirSync(src)
          .filter((f) => /^\d+\.excalidraw$/.test(f))
          .sort(byNumber),
      });
    }
  }

  const subtopics = path.join(ROOT, "content/subtopics");
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && e.name.endsWith(".excalidraw"))
      .map((e) => e.name)
      .sort();
    const manifest = fs.existsSync(path.join(dir, "rendered.json"));
    if (files.length || manifest) {
      groups.push({
        src: dir,
        out: path.join(ROOT, "public/diagrams", path.relative(subtopics, dir)),
        files,
      });
    }
    for (const e of entries) if (e.isDirectory()) walk(path.join(dir, e.name));
  };
  if (fs.existsSync(subtopics)) walk(subtopics);

  return groups;
}

const manifestPath = (group) => path.join(group.src, "rendered.json");
const readManifest = (group) =>
  fs.existsSync(manifestPath(group))
    ? JSON.parse(fs.readFileSync(manifestPath(group), "utf8"))
    : { pages: [] };

function check() {
  const problems = [];
  for (const group of scan()) {
    const where = rel(group.src);
    const rendered = new Map(readManifest(group).pages.map((p) => [p.source, p]));
    for (const file of group.files) {
      const source = fs.readFileSync(path.join(group.src, file), "utf8");
      const entry = rendered.get(file);
      if (!entry) problems.push(`${where}: ${file} has never been rendered`);
      else if (entry.sha1 !== sha1(source)) problems.push(`${where}: ${file} changed since it was rendered`);
      else if (!fs.existsSync(path.join(group.out, entry.file)))
        problems.push(`${where}: ${entry.file} is missing`);
    }
    for (const file of rendered.keys()) {
      if (!group.files.includes(file)) problems.push(`${where}: ${file} was deleted but is still listed`);
    }
  }
  if (problems.length) {
    console.error(`Drawings are out of date — run \`npm run notes:render\`:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log("Notes are up to date.");
}

async function render() {
  const groups = scan();
  const { default: puppeteer } = await import("puppeteer-core");
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const tab = await browser.newPage();
  // A real origin, so the page can load Excalidraw and its fonts from the CDN.
  await tab.goto("https://esm.sh/", { waitUntil: "domcontentloaded" });

  try {
    for (const group of groups) {
      const before = new Map(readManifest(group).pages.map((p) => [p.source, p]));
      const after = [];
      fs.mkdirSync(group.out, { recursive: true });

      for (const file of group.files) {
        const sourcePath = path.join(group.src, file);
        let source = fs.readFileSync(sourcePath, "utf8");
        const svgFile = file.replace(/\.excalidraw$/, ".svg");
        const previous = before.get(file);

        if (previous?.sha1 === sha1(source) && fs.existsSync(path.join(group.out, svgFile))) {
          after.push(previous);
          continue;
        }

        const scene = JSON.parse(source);
        const result = await tab.evaluate(
          async (scene, url) => {
            const { exportToSvg, convertToExcalidrawElements } = await import(url);
            const elements = scene.skeleton
              ? convertToExcalidrawElements(scene.elements, { regenerateIds: true })
              : scene.elements;
            const svg = await exportToSvg({
              elements,
              files: scene.files ?? null,
              appState: {
                ...scene.appState,
                exportBackground: true,
                viewBackgroundColor: "#ffffff",
                exportWithDarkMode: false,
              },
              exportPadding: 32,
            });
            return {
              svg: svg.outerHTML,
              width: Math.round(Number.parseFloat(svg.getAttribute("width"))),
              height: Math.round(Number.parseFloat(svg.getAttribute("height"))),
              elements: scene.skeleton ? elements : null,
            };
          },
          scene,
          EXCALIDRAW,
        );

        // Drafts become full Excalidraw files, so they can be opened and edited later.
        if (result.elements) {
          source = `${JSON.stringify(
            {
              type: "excalidraw",
              version: 2,
              source: "learning-logs",
              elements: result.elements,
              appState: { viewBackgroundColor: "#ffffff", ...(scene.appState ?? {}) },
              files: scene.files ?? {},
            },
            null,
            2,
          )}\n`;
          fs.writeFileSync(sourcePath, source);
        }

        fs.writeFileSync(path.join(group.out, svgFile), result.svg);
        after.push({
          source: file,
          file: svgFile,
          width: result.width,
          height: result.height,
          sha1: sha1(source),
        });
        console.log(
          `${rel(sourcePath)} → ${rel(path.join(group.out, svgFile))} (${result.width}×${result.height})`,
        );
      }

      // Drop drawings whose source was deleted.
      for (const [file, entry] of before) {
        if (!group.files.includes(file)) fs.rmSync(path.join(group.out, entry.file), { force: true });
      }
      if (after.length)
        fs.writeFileSync(manifestPath(group), `${JSON.stringify({ pages: after }, null, 2)}\n`);
      else fs.rmSync(manifestPath(group), { force: true });
    }
  } finally {
    await browser.close();
  }
}

const command = process.argv[2];
if (command === "check") check();
else if (command === "render") await render();
else {
  console.error("Usage: node scripts/notes.mjs <render|check>");
  process.exit(1);
}
