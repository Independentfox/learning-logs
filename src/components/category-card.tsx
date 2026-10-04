import type { categories } from "@/content/categories";
import { logsIn } from "@/content/logs";

export function CategoryCard({ category, index }: { category: (typeof categories)[number]; index: number }) {
  const { Icon, name, blurb, topics } = category;
  const logs = logsIn(category.slug);
  const latest = logs[0];

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-xl border border-tint-line bg-tint text-link">
          <Icon size={19} aria-hidden />
        </span>
        <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-fg">{name}</h3>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{blurb}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${name} topics`}>
        {topics.map((topic) => (
          <li key={topic} className="rounded-md border border-line px-2 py-0.5 text-xs text-muted">
            {topic}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between border-t border-line pt-4 text-[13px]">
          <span className="text-muted">
            <span className="font-medium text-fg tabular-nums">{logs.length}</span>{" "}
            {logs.length === 1 ? "log" : "logs"}
          </span>
          <span className="text-subtle">{latest ? `Latest · Day ${latest.day}` : "First log soon"}</span>
        </div>
      </div>
    </article>
  );
}
