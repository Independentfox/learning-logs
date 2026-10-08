import hljs from "highlight.js";
import {
  CircleAlert,
  Info,
  Lightbulb,
  MessageSquareWarning,
  OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import Markdown, { defaultUrlTransform, type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock, OutputBlock, type RunnerState } from "@/components/code-block";
import type { SubtopicPage } from "@/content/subtopic-pages";
import type { LanguageId } from "@/lib/languages";
import { rem } from "@/lib/utils";

// ---------------------------------------------------------------------------------------------
// hast helpers (just enough of the tree for what this renderer needs)
// ---------------------------------------------------------------------------------------------

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  data?: { meta?: string | null };
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === "text" ? (node.value ?? "") : (node.children ?? []).map(textOf).join("");

// ---------------------------------------------------------------------------------------------
// GitHub alerts: `> [!NOTE]` … become callouts
// ---------------------------------------------------------------------------------------------

const ALERTS = {
  NOTE: { label: "Note", Icon: Info },
  TIP: { label: "Tip", Icon: Lightbulb },
  IMPORTANT: { label: "Important", Icon: MessageSquareWarning },
  WARNING: { label: "Warning", Icon: CircleAlert },
  CAUTION: { label: "Caution", Icon: OctagonAlert },
} satisfies Record<string, { label: string; Icon: LucideIcon }>;
type AlertType = keyof typeof ALERTS;

/** Marks `> [!TYPE]` blockquotes with data-alert and strips the marker. */
function rehypeAlerts() {
  const visit = (node: HastNode) => {
    if (node.type === "element" && node.tagName === "blockquote") {
      const p = node.children?.find((c) => c.type === "element");
      const first = p?.tagName === "p" ? p.children?.[0] : undefined;
      const match =
        first?.type === "text"
          ? first.value?.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/)
          : null;
      if (p && first && match) {
        first.value = first.value!.slice(match[0].length);
        if (
          !first.value &&
          p.children!.length > 1 &&
          p.children![1].type === "element" &&
          p.children![1].tagName === "br"
        )
          p.children!.splice(1, 1);
        if (!textOf(p).trim() && p.children!.every((c) => c.type === "text"))
          node.children = node.children!.filter((c) => c !== p);
        node.properties = { ...node.properties, dataAlert: match[1] };
      }
    }
    node.children?.forEach(visit);
  };
  return (tree: HastNode) => visit(tree);
}

// ---------------------------------------------------------------------------------------------
// Code
// ---------------------------------------------------------------------------------------------

const RUNNABLE: Record<string, LanguageId> = {
  cpp: "cpp",
  "c++": "cpp",
  cc: "cpp",
  cxx: "cpp",
  java: "java",
  python: "python",
  py: "python",
};
const FILE_NAMES: Partial<Record<LanguageId, string>> = {
  cpp: "main.cpp",
  java: "Main.java",
  python: "main.py",
};

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function highlight(code: string, lang: string) {
  const known = lang && hljs.getLanguage(lang) ? lang : null;
  return known ? hljs.highlight(code, { language: known, ignoreIllegals: true }).value : escapeHtml(code);
}

/** A whole program has an entry point; fragments don't, so they get no Run button. */
const isProgram = (language: LanguageId, code: string) => language === "python" || /\bmain\s*\(/.test(code);

// ---------------------------------------------------------------------------------------------
// The renderer
// ---------------------------------------------------------------------------------------------

function Alert({ type, children }: { type: AlertType; children: ReactNode }) {
  const { label, Icon } = ALERTS[type];
  return (
    <aside data-alert={type} className="alert not-prose my-6 rounded-xl border-l-4 px-5 py-4">
      <p className="alert-title flex items-center gap-2 text-base font-semibold">
        <Icon size={rem(17)} aria-hidden />
        {label}
      </p>
      <div className="alert-body prose-log prose mt-1.5 max-w-none text-[1.0625rem] xl:text-lg [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

/** A subtopic's write-up: Markdown with diagrams, runnable code, output panels and callouts. */
export function SubtopicArticle({ page, runner }: { page: SubtopicPage; runner: RunnerState }) {
  const components: Components = {
    a: ({ href, children }) =>
      href?.startsWith("http") ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      ),

    // A diagram on its own line is a paragraph holding just an image. Its <figure> can't sit
    // inside a <p> — the browser would split them apart and React would then fail to hydrate.
    p: ({ node, children }) => {
      const kids = ((node as HastNode | undefined)?.children ?? []).filter(
        (c) => !(c.type === "text" && !c.value?.trim()),
      );
      return kids.length > 0 && kids.every((c) => c.tagName === "img") ? <>{children}</> : <p>{children}</p>;
    },

    img: ({ src, alt }) => {
      const name =
        typeof src === "string" && src.startsWith("diagram:") ? src.slice("diagram:".length) : null;
      const diagram = name ? page.diagrams[name] : undefined;
      if (!diagram) return null;
      return (
        <figure className="not-prose my-8">
          <a
            href={diagram.src}
            target="_blank"
            rel="noopener noreferrer"
            title="Open full size"
            className="note-page block overflow-hidden rounded-2xl border border-line"
          >
            {/* SVGs are already vector, so next/image has nothing to optimise. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={diagram.src}
              width={diagram.width}
              height={diagram.height}
              alt={alt ?? ""}
              loading="lazy"
              className="block h-auto w-full"
            />
          </a>
          {alt && <figcaption className="mt-2.5 text-center text-[0.9375rem] text-subtle">{alt}</figcaption>}
        </figure>
      );
    },

    // Wide tables scroll inside their own box instead of widening the page on phones.
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto">
        <table className="my-0">{children}</table>
      </div>
    ),

    blockquote: ({ node, children }) => {
      const type = (node as HastNode | undefined)?.properties?.dataAlert as AlertType | undefined;
      return type && ALERTS[type] ? (
        <Alert type={type}>{children}</Alert>
      ) : (
        <blockquote>{children}</blockquote>
      );
    },

    pre: ({ node, children }) => {
      const code = (node as HastNode | undefined)?.children?.find((c) => c.tagName === "code");
      if (!code) return <pre>{children}</pre>;
      const className = (code.properties?.className as string[] | undefined) ?? [];
      const lang = (className.find((c) => c.startsWith("language-")) ?? "")
        .slice("language-".length)
        .toLowerCase();
      const meta = code.data?.meta ?? "";
      const title = meta.match(/title="([^"]+)"/)?.[1];
      const text = textOf(code).replace(/\n$/, "");

      if (lang === "output" || ((lang === "text" || lang === "") && title?.toLowerCase() === "output")) {
        return <OutputBlock text={text} title={title ?? "Output"} />;
      }

      const runnable = RUNNABLE[lang];
      return (
        <CodeBlock
          code={text}
          html={highlight(text, runnable === "cpp" ? "cpp" : lang)}
          title={title ?? (runnable ? FILE_NAMES[runnable]! : lang || "text")}
          language={runnable && isProgram(runnable, text) ? runnable : undefined}
          runner={runner}
        />
      );
    },
  };

  return (
    <div className="prose-log prose max-w-none lg:prose-lg xl:prose-xl">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeAlerts]}
        urlTransform={(url) => (url.startsWith("diagram:") ? url : defaultUrlTransform(url))}
        components={components}
      >
        {page.body}
      </Markdown>
    </div>
  );
}
