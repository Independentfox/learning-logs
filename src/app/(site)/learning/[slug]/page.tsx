import { ArrowLeft, ArrowRight, NotebookPen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authEnabled } from "@/auth";
import { StatTile } from "@/components/stat-tile";
import { categories, getCategory } from "@/content/categories";
import { logsIn, type Log } from "@/content/logs";
import { delay, rem } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/learning/[slug]">): Promise<Metadata> {
  const category = getCategory((await params).slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.blurb,
    alternates: { canonical: `/learning/${category.slug}` },
  };
}

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

function LogRow({ log }: { log: Log }) {
  return (
    <li className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:gap-8">
      <span className="w-20 shrink-0 font-mono text-sm text-link">Day {log.day}</span>
      <span className="flex-1 text-[1.0625rem] font-medium tracking-[-0.01em] text-fg">{log.title}</span>
      <time dateTime={log.date} className="text-sm text-subtle">
        {formatDate(log.date)}
      </time>
    </li>
  );
}

function TopicLink({ slug, name, direction }: { slug: string; name: string; direction: "prev" | "next" }) {
  const next = direction === "next";
  return (
    <Link
      href={`/learning/${slug}`}
      className={`group flex flex-col gap-1.5 rounded-2xl border border-line p-5 transition-colors hover:border-tint-line hover:bg-card ${next ? "sm:col-start-2 sm:items-end sm:text-right" : ""}`}
    >
      <span className="inline-flex items-center gap-1.5 text-[0.8125rem] text-subtle">
        {!next && (
          <ArrowLeft
            size={rem(14)}
            aria-hidden
            className="transition-transform group-hover:-translate-x-0.5"
          />
        )}
        {next ? "Next topic" : "Previous topic"}
        {next && (
          <ArrowRight
            size={rem(14)}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        )}
      </span>
      <span className="font-medium text-fg">{name}</span>
    </Link>
  );
}

export default async function CategoryPage({ params }: PageProps<"/learning/[slug]">) {
  const { slug } = await params;
  const index = categories.findIndex((category) => category.slug === slug);
  if (index === -1) notFound();

  const category = categories[index];
  const { Icon, name, blurb, topics } = category;
  const logs = logsIn(category.slug);
  const latest = logs[0];
  const prev = categories[index - 1];
  const next = categories[index + 1];
  const viewer = await getViewer();

  return (
    <>
      <Link
        href="/"
        className="enter inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
      >
        <ArrowLeft size={rem(15)} aria-hidden />
        Learning Journey
      </Link>

      <header className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
        <div>
          <div className="enter flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl border border-tint-line bg-tint text-link">
              <Icon size={rem(22)} aria-hidden />
            </span>
            <span className="eyebrow">
              Topic {String(index + 1).padStart(2, "0")} of {categories.length}
            </span>
          </div>
          <h1 className="enter-rise mt-6 text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.04em] text-fg sm:text-[3.5rem] xl:text-[4.25rem]">
            {name}
          </h1>
          <p
            className="enter mt-5 max-w-[38.75rem] text-[1.0625rem] leading-[1.75] text-muted"
            style={delay(80)}
          >
            {blurb}
          </p>
          <ul className="enter mt-6 flex flex-wrap gap-2" aria-label={`${name} topics`} style={delay(120)}>
            {topics.map((topic) => (
              <li key={topic} className="rounded-lg border border-line px-2.5 py-1 text-sm text-muted">
                {topic}
              </li>
            ))}
          </ul>
        </div>

        <aside
          aria-label={`${name} stats`}
          className="enter rounded-3xl border border-line bg-card/60 p-6 backdrop-blur-sm sm:p-8"
          style={delay(160)}
        >
          <dl className="grid grid-cols-2">
            <StatTile label="Logs" value={logs.length} note={logs.length ? "so far" : "first one soon"} />
            <StatTile
              label="Latest"
              value={latest ? `Day ${latest.day}` : "—"}
              note={latest ? formatDate(latest.date) : "not started yet"}
            />
          </dl>
        </aside>
      </header>

      <section aria-labelledby="logs-title" className="enter mt-16 lg:mt-20" style={delay(200)}>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="logs-title" className="eyebrow">
            Logs
          </h2>
          <span className="eyebrow">
            {logs.length} {logs.length === 1 ? "day" : "days"}
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center sm:py-20">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-tint-line bg-tint text-link">
              <NotebookPen size={rem(21)} aria-hidden />
            </span>
            <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-fg">First log coming soon</h3>
            <p className="mx-auto mt-2 max-w-[28.75rem] text-[0.9375rem] leading-relaxed text-muted">
              Day-by-day notes on {name} will land here as I study it.
            </p>
            {authEnabled && !viewer && (
              <Link
                href="/login"
                className="group mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-accent-fg transition-[filter] hover:brightness-110"
              >
                Join the learners to follow along
                <ArrowRight
                  size={rem(15)}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            )}
          </div>
        ) : (
          <ol className="border-t border-line">
            {logs.map((log) => (
              <LogRow key={log.day} log={log} />
            ))}
          </ol>
        )}
      </section>

      <nav aria-label="More topics" className="mt-12 grid gap-4 sm:grid-cols-2">
        {prev && <TopicLink slug={prev.slug} name={prev.name} direction="prev" />}
        {next && <TopicLink slug={next.slug} name={next.name} direction="next" />}
      </nav>
    </>
  );
}
