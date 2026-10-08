import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import type { Category } from "@/content/categories";
import { logsIn } from "@/content/logs";
import type { Progress } from "@/lib/reading";
import { rem } from "@/lib/utils";

const SHOWN_TOPICS = 4;

export function CategoryCard({
  category,
  index,
  progress,
}: {
  category: Category;
  index: number;
  /** The signed-in learner's progress through this track's subtopics, if it has any. */
  progress?: Progress | null;
}) {
  const { Icon, name, blurb, topics } = category;
  const logs = logsIn(category.slug);
  const latest = logs.at(-1);
  const more = topics.length - SHOWN_TOPICS;

  return (
    <Link
      href={`/learning/${category.slug}`}
      className="group flex flex-col rounded-3xl border border-line bg-card p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-tint-line hover:shadow-[0_16px_40px_-20px_rgb(15_118_110/0.45)]"
    >
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-xl border border-tint-line bg-tint text-link">
          <Icon size={rem(19)} aria-hidden />
        </span>
        <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-fg">{name}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{blurb}</p>

      {category.freeform ? (
        <p className="mt-4 text-[0.8125rem] text-subtle">Topics added as we go</p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${name} topics`}>
          {topics.slice(0, SHOWN_TOPICS).map((topic) => (
            <li key={topic} className="rounded-md border border-line px-2.5 py-1 text-[0.8125rem] text-muted">
              {topic}
            </li>
          ))}
          {more > 0 && <li className="px-1 py-1 text-[0.8125rem] text-subtle">+{more} more</li>}
        </ul>
      )}

      <div className="mt-auto pt-6">
        {progress && (
          <div className="mb-4">
            <p className="mb-1.5 text-xs text-muted">
              Your progress · <span className="text-fg tabular-nums">{progress.read}</span> of{" "}
              {progress.total}
            </p>
            <ProgressBar progress={progress} label={`${category.name}: subtopics read`} />
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line pt-4 text-[0.8125rem]">
          <span className="text-muted">
            <span className="font-medium text-fg tabular-nums">{logs.length}</span>{" "}
            {logs.length === 1 ? "log" : "logs"}
          </span>
          <span className="inline-flex items-center gap-1 text-subtle transition-colors group-hover:text-link">
            {latest ? `Latest · Day ${latest.day}` : "Coming soon"}
            <ArrowRight
              size={rem(14)}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
