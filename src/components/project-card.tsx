import { ArrowUpRight } from "lucide-react";
import { logsFor } from "@/content/logs";
import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const { name, description, status, stack, repo } = project;
  const logs = logsFor(project.slug);

  return (
    <article className="flex flex-col rounded-3xl border border-line bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-[-0.015em] text-fg">{name}</h3>
        <span
          className={cn(
            "inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-xs font-medium",
            status === "building" ? "border-tint-line bg-tint text-link" : "border-line text-muted",
          )}
        >
          {status === "building" ? "In progress" : "Shipped"}
        </span>
      </div>
      <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{description}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${name} stack`}>
        {stack.map((tech) => (
          <li key={tech} className="rounded-md border border-line px-2 py-0.5 text-xs text-muted">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between border-t border-line pt-4 text-[13px]">
          <span className="text-muted">
            <span className="font-medium text-fg tabular-nums">{logs.length}</span> build{" "}
            {logs.length === 1 ? "log" : "logs"}
          </span>
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 inline-link"
            >
              Repo
              <ArrowUpRight size={14} aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
