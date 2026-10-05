import { Fragment } from "react";
import { people, profileLink } from "@/content/site";
import { cn, shell } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className={cn(shell, "pt-16 pb-10")}>
      <div className="flex flex-col gap-3 border-t border-line pt-6 text-[0.8125rem] text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built by{" "}
          {people.map((person, i) => {
            const href = profileLink(person);
            return (
              <Fragment key={person.name}>
                {i > 0 && (i === people.length - 1 ? " and " : ", ")}
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-link">
                    {person.name}
                  </a>
                ) : (
                  <span className="text-muted">{person.name}</span>
                )}
              </Fragment>
            );
          })}
          , one log at a time.
        </p>
        <p>Learning in public, together.</p>
      </div>
    </footer>
  );
}
