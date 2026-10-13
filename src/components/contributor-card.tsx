import { networks } from "@/components/icons";
import type { Contributor } from "@/content/contributors";
import { cn, rem } from "@/lib/utils";

/** "Devanshi Gupta" → "DG". */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

export function ContributorCard({ contributor }: { contributor: Contributor }) {
  const { name, role, contribution, links, core } = contributor;
  const profiles = networks.filter(({ key }) => links[key]);

  return (
    <article className="flex flex-col rounded-3xl border border-line bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-2xl border border-tint-line bg-tint text-[0.9375rem] font-semibold tracking-[0.02em] text-link"
        >
          {initials(name)}
        </span>
        <span
          className={cn(
            "inline-flex h-6 shrink-0 items-center rounded-full border px-2.5 text-xs font-medium",
            core ? "border-tint-line bg-tint text-link" : "border-line text-muted",
          )}
        >
          {role}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-[-0.015em] text-fg">{name}</h3>
      {contribution && <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{contribution}</p>}

      {profiles.length > 0 && (
        <div className="mt-auto pt-6">
          <ul
            aria-label={`${name} elsewhere`}
            className="flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-[0.8125rem]"
          >
            {profiles.map(({ key, label, Icon }) => (
              <li key={key}>
                <a
                  href={links[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on ${label}`}
                  className="inline-flex items-center gap-1.5 text-muted capitalize transition-colors hover:text-fg"
                >
                  <Icon size={rem(14)} aria-hidden />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
