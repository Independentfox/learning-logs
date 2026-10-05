import { Hammer } from "lucide-react";
import type { Metadata } from "next";
import { GitHubIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";
import { people } from "@/content/site";
import { rem } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Building Journey",
  description: "Open-source projects we're building in public, and the build logs behind them.",
  alternates: { canonical: "/building" },
};

const onGitHub = people.filter((person) => person.links.github);

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-line-strong px-6 py-16 text-center sm:py-20">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-tint-line bg-tint text-link">
        <Hammer size={rem(21)} aria-hidden />
      </span>
      <h3 className="mt-6 text-xl font-semibold tracking-[-0.015em] text-fg">
        The first build is on its way
      </h3>
      <p className="mx-auto mt-2 max-w-[27.5rem] text-[0.9375rem] leading-relaxed text-muted">
        We&apos;ll be building open-source projects in public. Each one gets a card here with its repo, its
        progress and the build logs behind it.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onGitHub.map((person) => (
          <a
            key={person.name}
            href={person.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:bg-card active:scale-[0.98]"
          >
            <GitHubIcon size={rem(16)} />
            {onGitHub.length > 1 ? `${person.firstName} on GitHub` : "Follow on GitHub"}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function BuildingJourney() {
  return (
    <section aria-labelledby="building-title">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="building-title" className="eyebrow">
          What we&apos;re building
        </h2>
        <span className="eyebrow">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>
      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
