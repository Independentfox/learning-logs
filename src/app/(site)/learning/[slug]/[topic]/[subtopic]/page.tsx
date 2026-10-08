import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authEnabled } from "@/auth";
import { MarkRead } from "@/components/mark-read";
import { Practice } from "@/components/practice";
import { ProgressBar } from "@/components/progress-bar";
import { SubtopicArticle } from "@/components/subtopic-article";
import { getCategory } from "@/content/categories";
import {
  getSubtopicPage,
  pageHref,
  pagesByName,
  subtopicPages,
  type SubtopicPage,
} from "@/content/subtopic-pages";
import { subtopicsOf } from "@/content/subtopics";
import { guideProgress, readSubtopics } from "@/lib/reading";
import { runnerEnabled } from "@/lib/runner";
import { cn, delay, formatDate, rem } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

export const dynamicParams = false;

export function generateStaticParams() {
  return subtopicPages.map((page) => ({
    slug: page.guide.category,
    topic: page.guide.slug,
    subtopic: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/learning/[slug]/[topic]/[subtopic]">): Promise<Metadata> {
  const { slug, topic, subtopic } = await params;
  const page = getSubtopicPage(slug, topic, subtopic);
  const category = getCategory(slug);
  if (!page || !category) return {};
  return {
    title: `${page.name} · ${page.guide.topic}`,
    description: page.summary[0] ?? page.guide.blurb,
    alternates: { canonical: pageHref(page) },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** A summary line, with `backticks` shown as code. */
function SummaryLine({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      <code
        key={i}
        className="rounded-md border border-tint-line bg-canvas/60 px-1.5 py-0.5 font-mono text-[0.85em]"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

function Neighbour({ page, direction }: { page?: SubtopicPage; direction: "prev" | "next" }) {
  if (!page) return <span />;
  const next = direction === "next";
  return (
    <Link
      href={pageHref(page)}
      className={cn(
        "group flex flex-col gap-1.5 rounded-2xl border border-line p-5 transition-colors hover:border-tint-line hover:bg-card",
        next && "sm:items-end sm:text-right",
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-subtle">
        {!next && (
          <ArrowLeft
            size={rem(14)}
            aria-hidden
            className="transition-transform group-hover:-translate-x-0.5"
          />
        )}
        {next ? "Next" : "Previous"} · {pad(page.number)}
        {next && (
          <ArrowRight
            size={rem(14)}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        )}
      </span>
      <span className="text-lg font-medium text-fg">{page.name}</span>
    </Link>
  );
}

export default async function SubtopicPageRoute({
  params,
}: PageProps<"/learning/[slug]/[topic]/[subtopic]">) {
  const { slug, topic, subtopic } = await params;
  const page = getSubtopicPage(slug, topic, subtopic);
  const category = getCategory(slug);
  if (!page || !category) notFound();

  const { guide } = page;
  const { Icon } = category;
  const topicNumber = pad(category.topics.indexOf(guide.topic) + 1);
  const topicHref = `/learning/${category.slug}/${guide.slug}`;
  const here = pageHref(page);

  const viewer = await getViewer();
  const read = viewer ? await readSubtopics(viewer.id) : null;
  const published = pagesByName(guide);
  const ordered = [...published.values()].sort((a, b) => a.number - b.number);
  const prev = ordered.filter((p) => p.number < page.number).at(-1);
  const next = ordered.find((p) => p.number > page.number);
  const loginHref = `/login?next=${encodeURIComponent(here)}`;

  return (
    <>
      <header className="enter flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2.5 text-sm">
          <Link
            href={`/learning/${category.slug}`}
            className="inline-flex shrink-0 items-center gap-2 text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={rem(15)} aria-hidden />
            <span className="grid size-7 place-items-center rounded-lg border border-tint-line bg-tint text-link">
              <Icon size={rem(15)} aria-hidden />
            </span>
            {category.name}
          </Link>
          <span aria-hidden className="text-subtle">
            /
          </span>
          <Link href={topicHref} className="min-w-0 truncate text-muted transition-colors hover:text-fg">
            Topic {topicNumber} · {guide.topic}
          </Link>
        </nav>
        <span className="eyebrow">
          Subtopic {pad(page.number)} of {guide.subtopics.length}
        </span>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <article className="min-w-0">
          <h1 className="enter-rise text-[2.5rem] leading-[1.08] font-semibold tracking-[-0.035em] text-fg sm:text-[3.25rem]">
            {page.name}
          </h1>
          <div className="enter mt-5 flex flex-wrap items-center gap-x-5 gap-y-3" style={delay(40)}>
            <span className="text-[0.9375rem] text-subtle">
              Published <time dateTime={page.published}>{formatDate(page.published)}</time>
            </span>
            {authEnabled && (
              <MarkRead
                id={page.id}
                initial={read?.has(page.id) ?? false}
                signedIn={Boolean(viewer)}
                loginHref={loginHref}
              />
            )}
          </div>

          {page.summary.length > 0 && (
            <section
              aria-labelledby="summary-title"
              className="enter mt-8 max-w-[60rem] rounded-2xl border border-tint-line bg-tint px-6 py-5"
              style={delay(60)}
            >
              <h2 id="summary-title" className="font-mono text-xs tracking-[0.12em] text-link uppercase">
                Revise in 30 seconds
              </h2>
              <ul className="mt-3 space-y-2">
                {page.summary.map((line) => (
                  <li key={line} className="flex gap-3 text-[1.0625rem] leading-relaxed text-fg lg:text-lg">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-link" />
                    <span>
                      <SummaryLine text={line} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="enter mt-10 max-w-[60rem]" style={delay(80)}>
            <SubtopicArticle
              page={page}
              runner={{ enabled: runnerEnabled && authEnabled, signedIn: Boolean(viewer), loginHref }}
            />
          </div>

          {page.questions.length > 0 && (
            <div className="enter mt-12" style={delay(120)}>
              <Practice questions={page.questions} viewer={viewer} />
            </div>
          )}

          {(prev || next) && (
            <nav aria-label="More subtopics" className="mt-14 grid gap-4 sm:grid-cols-2">
              <Neighbour page={prev} direction="prev" />
              <Neighbour page={next} direction="next" />
            </nav>
          )}
        </article>

        <aside className="enter lg:sticky lg:top-8 lg:self-start" style={delay(140)}>
          <div className="rounded-2xl border border-line bg-card/70 p-5">
            <p className="eyebrow">In this topic</p>
            {read && (
              <ProgressBar
                progress={guideProgress(guide, read)}
                label={`${guide.topic}: subtopics read`}
                className="mt-3"
              />
            )}
            <ol className="mt-4 max-h-[65vh] space-y-0.5 overflow-y-auto pr-1 text-base">
              {subtopicsOf(guide).map(({ id, name }, i) => {
                const target = published.get(name);
                const current = target === page;
                const done = read?.has(id);
                const content = (
                  <>
                    <span className="w-6 shrink-0 pt-px font-mono text-sm text-subtle">{pad(i + 1)}</span>
                    <span className="min-w-0 flex-1">{name}</span>
                    {done && <Check size={rem(15)} aria-label="Read" className="mt-1 shrink-0 text-link" />}
                  </>
                );
                return (
                  <li key={id}>
                    {target && !current ? (
                      <Link
                        href={pageHref(target)}
                        className="flex gap-2.5 rounded-lg px-2.5 py-2 text-fg transition-colors hover:bg-canvas"
                      >
                        {content}
                      </Link>
                    ) : (
                      <span
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "flex gap-2.5 rounded-lg px-2.5 py-2",
                          current ? "bg-tint font-medium text-link" : "text-subtle",
                        )}
                      >
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}
