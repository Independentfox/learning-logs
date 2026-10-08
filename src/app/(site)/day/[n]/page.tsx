import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { LinkedInIcon } from "@/components/icons";
import { Practice } from "@/components/practice";
import { getCategory } from "@/content/categories";
import { currentDay, getLog, neighbours, type Log, type NotesPage } from "@/content/logs";
import { delay, formatDate, rem } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

/** "/day/12" → 12; anything that isn't a sensible day number is a 404. */
function parseDay(n: string) {
  const day = Number(n);
  return Number.isInteger(day) && day >= 1 && day <= 100_000 ? day : null;
}

export async function generateMetadata({ params }: PageProps<"/day/[n]">): Promise<Metadata> {
  const day = parseDay((await params).n);
  const log = day ? getLog(day) : undefined;
  if (!day || !log) return { title: day ? `Day ${day}` : "Day not found", robots: { index: false } };
  const category = getCategory(log.category);
  return {
    title: `Day ${day}: ${log.title}`,
    description: `${category?.name} · ${log.topic}`,
    alternates: { canonical: `/day/${day}` },
  };
}

function Breadcrumb({ children }: { children?: ReactNode }) {
  return (
    <header className="enter flex min-w-0 items-center gap-2.5 text-sm">
      <Link
        href="/"
        className="inline-flex shrink-0 items-center gap-1.5 text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={rem(15)} aria-hidden />
        Learning Journey
      </Link>
      {children}
    </header>
  );
}

function NotLogged({ day }: { day: number }) {
  const skipped = day < currentDay;
  return (
    <>
      <Breadcrumb />
      <div className="enter mt-6 rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center sm:py-20">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-tint-line bg-tint text-link">
          <CalendarDays size={rem(21)} aria-hidden />
        </span>
        <h1 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-fg">
          {skipped ? `There's no log for Day ${day}` : `Day ${day} isn't logged yet`}
        </h1>
        <p className="mx-auto mt-2 max-w-[28.75rem] text-[0.9375rem] leading-relaxed text-muted">
          {currentDay > 0
            ? `The journey is on Day ${currentDay} so far.`
            : "Day 1 starts soon — check back then."}
        </p>
        {currentDay > 0 && (
          <Link
            href={`/day/${currentDay}`}
            className="group mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-accent-fg transition-[filter] hover:brightness-110"
          >
            Go to Day {currentDay}
            <ArrowRight
              size={rem(15)}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        )}
      </div>
    </>
  );
}

function DayNav({ log, direction }: { log?: Log; direction: "prev" | "next" }) {
  if (!log) return null;
  const next = direction === "next";
  return (
    <Link
      href={`/day/${log.day}`}
      className="group block rounded-xl px-3 py-2.5 transition-colors hover:bg-canvas"
    >
      <span className="inline-flex items-center gap-1.5 text-xs text-subtle">
        {!next && <ArrowLeft size={rem(13)} aria-hidden />}
        {next ? `Next · Day ${log.day}` : `Previous · Day ${log.day}`}
        {next && <ArrowRight size={rem(13)} aria-hidden />}
      </span>
      <span className="mt-0.5 block truncate text-sm text-fg transition-colors group-hover:text-link">
        {log.title}
      </span>
    </Link>
  );
}

function Summary({ lines }: { lines: string[] }) {
  return (
    <section
      aria-labelledby="summary-title"
      className="enter mt-8 rounded-2xl border border-tint-line bg-tint px-5 py-4"
      style={delay(60)}
    >
      <h2 id="summary-title" className="font-mono text-xs tracking-[0.12em] text-link uppercase">
        Revise in 30 seconds
      </h2>
      <ul className="mt-3 space-y-2">
        {lines.map((line) => (
          <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg">
            <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-link" />
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The Excalidraw pages, one under another. In dark mode they're inverted, as Excalidraw does. */
function NotesPages({ day, pages }: { day: number; pages: NotesPage[] }) {
  return (
    <section aria-labelledby="notes-title" className="enter mt-10" style={delay(100)}>
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="notes-title" className="eyebrow">
          Notes
        </h2>
        <span className="text-xs text-subtle">
          {pages.length} {pages.length === 1 ? "page" : "pages"}
        </span>
      </div>
      <div className="space-y-6">
        {pages.map((page, i) => (
          <figure key={page.src}>
            <a
              href={page.src}
              target="_blank"
              rel="noopener noreferrer"
              title="Open full size"
              className="note-page block overflow-hidden rounded-2xl border border-line"
            >
              {/* SVGs are already vector, so next/image has nothing to optimise. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={page.src}
                width={page.width}
                height={page.height}
                alt={`Day ${day} notes, page ${i + 1} of ${pages.length}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="block h-auto w-full"
              />
            </a>
            <figcaption className="mt-2 text-center text-xs text-subtle">
              Page {i + 1} of {pages.length}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default async function DayPage({ params }: PageProps<"/day/[n]">) {
  const day = parseDay((await params).n);
  if (!day) notFound();

  const log = getLog(day);
  if (!log) return <NotLogged day={day} />;

  const category = getCategory(log.category)!;
  const { Icon } = category;
  const { prev, next } = neighbours(day);
  const viewer = await getViewer();

  return (
    <>
      <Breadcrumb>
        <span aria-hidden className="text-subtle">
          /
        </span>
        <Link
          href={`/learning/${category.slug}`}
          className="inline-flex min-w-0 items-center gap-2 text-muted transition-colors hover:text-fg"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-tint-line bg-tint text-link">
            <Icon size={rem(15)} aria-hidden />
          </span>
          <span className="truncate">{category.name}</span>
        </Link>
      </Breadcrumb>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <article className="min-w-0">
          <p className="enter eyebrow">
            Day {day} · {log.topic}
          </p>
          <h1 className="enter-rise mt-4 text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.035em] text-fg sm:text-[3rem]">
            {log.title}
          </h1>
          {log.summary.length > 0 && <Summary lines={log.summary} />}
          {log.pages.length > 0 && <NotesPages day={day} pages={log.pages} />}
          {log.body && (
            <div className="prose-log enter prose mt-10 max-w-[52rem]" style={delay(120)}>
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: ({ href, children }) =>
                    href?.startsWith("http") ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ) : (
                      <a href={href}>{children}</a>
                    ),
                }}
              >
                {log.body}
              </Markdown>
            </div>
          )}
          {log.questions.length > 0 && (
            <div className="enter mt-12" style={delay(160)}>
              <Practice questions={log.questions} viewer={viewer} />
            </div>
          )}
        </article>

        <aside className="enter lg:sticky lg:top-8 lg:self-start" style={delay(140)}>
          <dl className="space-y-4 rounded-2xl border border-line bg-card/70 p-5 text-sm backdrop-blur-sm">
            <div>
              <dt className="text-xs text-subtle">Date</dt>
              <dd className="mt-0.5 text-fg">
                <time dateTime={log.date}>{formatDate(log.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-subtle">Topic</dt>
              <dd className="mt-0.5">
                <Link
                  href={`/learning/${category.slug}`}
                  className="text-fg transition-colors hover:text-link"
                >
                  {category.name}
                </Link>
                <span className="text-muted"> · {log.topic}</span>
              </dd>
            </div>
            {(log.pages.length > 0 || log.questions.length > 0) && (
              <div>
                <dt className="text-xs text-subtle">On this day</dt>
                <dd className="mt-0.5 text-fg">
                  {[
                    log.pages.length > 0 &&
                      `${log.pages.length} ${log.pages.length === 1 ? "page" : "pages"} of notes`,
                    log.questions.length > 0 &&
                      `${log.questions.length} ${log.questions.length === 1 ? "question" : "questions"}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </dd>
              </div>
            )}
            {log.linkedin && (
              <div>
                <dt className="text-xs text-subtle">Discussion</dt>
                <dd className="mt-1">
                  <a
                    href={log.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fg transition-colors hover:text-link"
                  >
                    <LinkedInIcon size={rem(14)} />
                    Read the LinkedIn post
                  </a>
                </dd>
              </div>
            )}
          </dl>
          {(prev || next) && (
            <nav aria-label="Other days" className="mt-3 rounded-2xl border border-line bg-card/70 p-2">
              <DayNav log={prev} direction="prev" />
              <DayNav log={next} direction="next" />
            </nav>
          )}
        </aside>
      </div>
    </>
  );
}
