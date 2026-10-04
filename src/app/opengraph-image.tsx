import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Learning Logs — Manav Punjabi. Learning in public, one day at a time.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "src/app/_og", file));

const BG = "#111111";
const FG = "#ededed";
const MUTED = "#a3a3a3";
const SUBTLE = "#8f8f8f";
const ACCENT = "#2a9d8f";

export default async function Image() {
  const [regular, semibold, serif, mono] = await Promise.all([
    font("Figtree-Regular.ttf"),
    font("Figtree-SemiBold.ttf"),
    font("InstrumentSerif-Italic.ttf"),
    font("GeistMono-Medium.ttf"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 88px",
        background: BG,
        backgroundImage: "radial-gradient(circle at 88% 12%, rgba(42,157,143,0.22), transparent 42%)",
        color: FG,
        fontFamily: "Figtree",
      }}
    >
      <div
        style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 3, color: SUBTLE }}
      >
        MANAV PUNJABI · LEARNING LOGS
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>
          Learning in public,
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontFamily: "Instrument Serif",
            fontSize: 104,
            lineHeight: 1,
            color: ACCENT,
          }}
        >
          one day at a time.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 28,
          fontSize: 26,
          color: MUTED,
        }}
      >
        <span>DSA · CS Fundamentals · Software Engineering · AI &amp; LLMs</span>
        <span style={{ color: FG }}>Daily logs</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Figtree", data: regular, weight: 400, style: "normal" },
        { name: "Figtree", data: semibold, weight: 600, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
