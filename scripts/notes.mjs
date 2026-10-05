#!/usr/bin/env node
/**
 * Excalidraw notes → SVG pages for the site.
 *
 *   npm run notes:render   content/notes/<day>/<n>.excalidraw → public/notes/<day>/<n>.svg
 *                          (needs Google Chrome; CHROME_PATH overrides where it looks)
 *   npm run notes:check    fails if any page is missing or out of date — runs before every build
 *
 * A source can be a normal Excalidraw file, or a quick draft with `"skeleton": true`
 * whose elements use Excalidraw's element-skeleton format. Drafts are expanded into a
 * full scene on render and written back, so every source ends up openable on
 * excalidraw.com.
 *
 * Each day's rendered pages are listed in content/notes/<day>/rendered.json, with the
 * source hash they were made from — that's how `check` spots stale pages.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "content/notes");
const OUT = path.join(ROOT, "public/notes");
const EXCALIDRAW = "https://esm.sh/@excalidraw/excalidraw@0.18.1";
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const sha1 = (text) => createHash("sha1").update(text).digest("hex");
const byNumber = (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10);

/** Every day folder with its page sources, in order. */
function scan() {
  if (!fs.existsSync(SRC)) return [];
  return fs
    .readdirSync(SRC)
    .filter((day) => /^\d+$/.test(day))
    .sort(byNumber)
    .map((day) => ({
      day,
      pages: fs
        .readdirSync(path.join(SRC, day))
        .filter((file) => /^\d+\.excalidraw$/.test(file))
        .sort(byNumber),
    }));
}

const manifestPath = (day) => path.join(SRC, day, "rendered.json");
const readManifest = (day) =>
  fs.existsSync(manifestPath(day)) ? JSON.parse(fs.readFileSync(manifestPath(day), "utf8")) : { pages: [] };

function check() {
  const problems = [];
  for (const { day, pages } of scan()) {
    const rendered = new Map(readManifest(day).pages.map((p) => [p.source, p]));
    for (const file of pages) {
      const source = fs.readFileSync(path.join(SRC, day, file), "utf8");
      const entry = rendered.get(file);
      if (!entry) problems.push(`day ${day}: ${file} has never been rendered`);
      else if (entry.sha1 !== sha1(source))
        problems.push(`day ${day}: ${file} changed since it was rendered`);
      else if (!fs.existsSync(path.join(OUT, day, entry.file)))
        problems.push(`day ${day}: ${entry.file} is missing`);
    }
    for (const file of rendered.keys()) {
      if (!pages.includes(file)) problems.push(`day ${day}: ${file} was deleted but is still listed`);
    }
  }
  if (problems.length) {
    console.error(`Notes are out of date — run \`npm run notes:render\`:\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log("Notes are up to date.");
}

async function render() {
  const days = scan();
  const { default: puppeteer } = await import("puppeteer-core");
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
  const tab = await browser.newPage();
  // A real origin, so the page can load Excalidraw and its fonts from the CDN.
  await tab.goto("https://esm.sh/", { waitUntil: "domcontentloaded" });

  try {
    for (const { day, pages } of days) {
      const before = new Map(readManifest(day).pages.map((p) => [p.source, p]));
      const after = [];
      fs.mkdirSync(path.join(OUT, day), { recursive: true });

      for (const file of pages) {
        const sourcePath = path.join(SRC, day, file);
        let source = fs.readFileSync(sourcePath, "utf8");
        const svgFile = file.replace(/\.excalidraw$/, ".svg");
        const previous = before.get(file);

        if (previous?.sha1 === sha1(source) && fs.existsSync(path.join(OUT, day, svgFile))) {
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

        fs.writeFileSync(path.join(OUT, day, svgFile), result.svg);
        after.push({
          source: file,
          file: svgFile,
          width: result.width,
          height: result.height,
          sha1: sha1(source),
        });
        console.log(
          `day ${day}: ${file} → public/notes/${day}/${svgFile} (${result.width}×${result.height})`,
        );
      }

      // Drop pages whose source was deleted.
      for (const [file, entry] of before) {
        if (!pages.includes(file)) fs.rmSync(path.join(OUT, day, entry.file), { force: true });
      }
      fs.writeFileSync(manifestPath(day), `${JSON.stringify({ pages: after }, null, 2)}\n`);
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
