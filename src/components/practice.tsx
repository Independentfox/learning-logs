import { ArrowUpRight, Code } from "lucide-react";
import Link from "next/link";
import { authEnabled } from "@/auth";
import { PlatformLogo } from "@/components/platform-logo";
import { QuestionStatus } from "@/components/question-status";
import type { Question } from "@/content/logs";
import { platforms, type Difficulty } from "@/content/platforms";
import { myStatuses, questionStats } from "@/lib/progress";
import { cn, rem } from "@/lib/utils";
import type { Viewer } from "@/lib/viewer";

const difficultyStyle: Record<Difficulty, string> = {
  easy: "border-emerald-600/25 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  hard: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export function DifficultyTag({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium capitalize",
        difficultyStyle[difficulty],
      )}
    >
      {difficulty}
    </span>
  );
}

/** The day's practice questions: where each is from, how hard, how many learners solved it. */
export async function Practice({ questions, viewer }: { questions: Question[]; viewer: Viewer }) {
  const ids = questions.map((q) => q.id);
  const [stats, mine] = await Promise.all([
    questionStats(ids),
    viewer ? myStatuses(viewer.id, ids) : Promise.resolve({} as Awaited<ReturnType<typeof myStatuses>>),
  ]);
  const solvedByMe = ids.filter((id) => mine[id] === "solved").length;

  return (
    <section aria-labelledby="practice-title">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="practice-title" className="eyebrow">
          Practice
        </h2>
        <span className="text-[0.8125rem] text-subtle">
          {viewer ? (
            <>
              You&apos;ve solved <span className="font-medium text-fg">{solvedByMe}</span> of{" "}
              {questions.length}
            </>
          ) : authEnabled ? (
            <>
              <Link href="/login" className="inline-link">
                Sign in
              </Link>{" "}
              to track what you&apos;ve solved
            </>
          ) : (
            `${questions.length} questions`
          )}
        </span>
      </div>

      <ol className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card/60">
        {questions.map((q, i) => {
          const s = stats[q.id] ?? { solved: 0, attempted: 0 };
          return (
            <li
              key={q.id}
              className="grid grid-cols-[1.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 px-4 py-3.5 md:grid-cols-[1.5rem_minmax(0,1fr)_4.5rem_5.5rem_auto_auto] md:gap-x-5"
            >
              <span className="font-mono text-xs text-subtle">{i + 1}</span>

              <a
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-w-0 items-center gap-2.5"
              >
                <PlatformLogo platform={q.platform} />
                <span className="truncate font-medium text-fg transition-colors group-hover:text-link">
                  {q.title}
                </span>
                <ArrowUpRight
                  size={rem(14)}
                  aria-label={`Open on ${platforms[q.platform].name}`}
                  className="shrink-0 text-subtle transition-colors group-hover:text-link"
                />
              </a>

              {/* On phones the details wrap onto a second line under the title. */}
              <div className="col-start-2 flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                <DifficultyTag difficulty={q.difficulty} />
                <span
                  title={`${s.solved} solved · ${s.attempted} attempted`}
                  className="text-sm text-muted tabular-nums md:text-right"
                >
                  <span className="text-fg">{s.solved}</span> / {s.attempted}
                </span>
                {viewer ? <QuestionStatus questionId={q.id} initial={mine[q.id] ?? null} /> : <span />}
                <Link
                  href={`/code?q=${encodeURIComponent(q.id)}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-medium text-muted transition-colors hover:border-tint-line hover:text-link"
                >
                  <Code size={rem(14)} aria-hidden />
                  Code
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-right text-xs text-subtle">Solved / attempted, by learners on this site</p>
    </section>
  );
}
