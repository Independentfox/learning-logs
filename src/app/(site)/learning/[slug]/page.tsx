import { ArrowLeft, ArrowRight, NotebookPen } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authEnabled } from "@/auth";
import { DayLink } from "@/components/day-link";
import { ProgressBar } from "@/components/progress-bar";
import { categories, getCategory } from "@/content/categories";
import { logsIn, topicsWithDays, type Log } from "@/content/logs";
import { guideFor, guidesIn } from "@/content/subtopics";
import { myStatuses } from "@/lib/progress";
import { guideProgress, readSubtopics, trackProgress } from "@/lib/reading";
import { cn, columnGrid, delay, rem } from "@/lib/utils";
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
  const { Icon, name } = category;
  const logs = logsIn(category.slug);
  const topics = topicsWithDays(category);
  const prev = categories[index - 1];
  const next = categories[index + 1];
  const viewer = await getViewer();

  // Each topic's practice questions (a question set on two days counts once).
  const questionIds = (days: Log[]) => [...new Set(days.flatMap((log) => log.questions.map((q) => q.id)))];
  const allIds = questionIds(logs);
  const mine = viewer ? await myStatuses(viewer.id, allIds) : {};
  const solved = (ids: string[]) => ids.filter((id) => mine[id] === "solved").length;

  // Subtopics this learner has ticked off, for the topic and track progress bars.
  const hasGuides = guidesIn(category.slug).length > 0;
  const read = viewer && hasGuides ? await readSubtopics(viewer.id) : null;
  const track = read ? trackProgress(category.slug, read) : null;

  return (
    <>
      <header className="enter flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-center gap-2.5 text-sm">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1.5 text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={rem(15)} aria-hidden />
            Learning Journey
          </Link>
          <span aria-hidden className="text-subtle">
            /
          </span>
          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-tint-line bg-tint text-link">
            <Icon size={rem(15)} aria-hidden />
          </span>
          <h1 className="truncate font-semibold text-fg">{name}</h1>
        </div>
        <span className="eyebrow">
          {topics.length > 0 && `${topics.length} topics · `}
          {logs.length} {logs.length === 1 ? "log" : "logs"}
          {allIds.length > 0 &&
            (viewer ? ` · ${solved(allIds)}/${allIds.length} solved` : ` · ${allIds.length} questions`)}
        </span>
      </header>

      {track ? (
        <div className="enter mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-tint-line bg-tint px-5 py-4">
          <span className="text-sm text-muted">
            Your progress · <span className="font-medium text-fg tabular-nums">{track.read}</span> of{" "}
            {track.total} subtopics read
          </span>
          <ProgressBar progress={track} label={`${name}: subtopics read`} className="min-w-[12rem] flex-1" />
        </div>
      ) : (
        hasGuides &&
        authEnabled &&
        !viewer && (
          <p className="enter mt-6 text-sm text-muted">
            <Link
              href={`/login?next=${encodeURIComponent(`/learning/${category.slug}`)}`}
              className="inline-link"
            >
              Sign in
            </Link>{" "}
            to track how much of each topic you&apos;ve read.
          </p>
        )
      )}

      <section aria-label={`${name} topics`} className="enter mt-6" style={delay(80)}>
        {topics.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center sm:py-20">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-tint-line bg-tint text-link">
              <NotebookPen size={rem(21)} aria-hidden />
            </span>
            <h2 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-fg">First log coming soon</h2>
            <p className="mx-auto mt-2 max-w-[28.75rem] text-[0.9375rem] leading-relaxed text-muted">
              Day-by-day notes on {name} will land here as we study it.
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
          // Numbered down each column. Until a day is logged every card is just its name, so all
          // rows are the same height; after that a card grows to list its days and only its own
          // row follows.
          <ol {...columnGrid(topics.length, { equalRows: logs.length === 0 })}>
            {topics.map((topic, i) => {
              const started = topic.days.length > 0;
              const ids = questionIds(topic.days);
              const guide = guideFor(category.slug, topic.name);
              return (
                <li
                  key={topic.name}
                  className={cn(
                    "rounded-2xl border px-6 py-5",
                    // A card that's just a name sits centred when its row is taller than it.
                    started
                      ? "border-line bg-card"
                      : "flex flex-col justify-center border-dashed border-line",
                  )}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <h2
                      className={cn(
                        "min-w-0 flex-1 text-lg font-medium lg:text-xl",
                        started || guide ? "text-fg" : "text-muted",
                      )}
                    >
                      {guide ? (
                        <Link
                          href={`/learning/${category.slug}/${guide.slug}`}
                          className="group transition-colors hover:text-link"
                        >
                          {topic.name.slice(0, topic.name.lastIndexOf(" ") + 1)}
                          {/* The arrow sticks to the last word, so it never wraps onto a line alone. */}
                          <span className="whitespace-nowrap">
                            {topic.name.slice(topic.name.lastIndexOf(" ") + 1)}
                            <ArrowRight
                              size={rem(14)}
                              aria-hidden
                              className="ml-1.5 inline-block align-middle text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-link"
                            />
                          </span>
                        </Link>
                      ) : (
                        topic.name
                      )}
                    </h2>
                    <span className={cn("shrink-0 text-sm", started ? "text-link" : "text-subtle")}>
                      {started
                        ? [
                            `${topic.days.length} ${topic.days.length === 1 ? "day" : "days"}`,
                            ids.length > 0 &&
                              (viewer
                                ? `${solved(ids)}/${ids.length} solved`
                                : `${ids.length} ${ids.length === 1 ? "question" : "questions"}`),
                          ]
                            .filter(Boolean)
                            .join(" · ")
                        : guide
                          ? `${guide.subtopics.length} subtopics`
                          : "Not started"}
                    </span>
                  </div>
                  {guide && read && (
                    <ProgressBar
                      progress={guideProgress(guide, read)}
                      label={`${topic.name}: subtopics read`}
                      className="mt-3.5"
                    />
                  )}
                  {started && (
                    <ul className="mt-2 divide-y divide-line border-t border-line">
                      {topic.days.map((log) => (
                        <DayLink key={log.day} log={log} />
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
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
