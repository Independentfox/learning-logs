import { Globe } from "lucide-react";
import { Fragment } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { people, profileLink, type Person } from "@/content/site";
import { cn, rem, shell } from "@/lib/utils";

const networks = [
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "github", label: "GitHub", Icon: GitHubIcon },
  { key: "portfolio", label: "portfolio", Icon: Globe },
] as const;

/** A person's name followed by an icon for each of their links. */
function PersonLinks({ person }: { person: Person }) {
  const links = networks.filter(({ key }) => person.links[key]);
  if (links.length === 0) return null;
  return (
    <li className="flex items-center gap-1">
      <span className="mr-1">{person.firstName}</span>
      {links.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={person.links[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${person.firstName}'s ${label}`}
          title={`${person.firstName}'s ${label}`}
          className="grid size-7 place-items-center rounded-full transition-colors hover:bg-card hover:text-fg"
        >
          <Icon size={rem(14)} aria-hidden />
        </a>
      ))}
    </li>
  );
}

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
        <ul aria-label="Find us elsewhere" className="flex flex-wrap items-center gap-x-5 gap-y-1">
          {people.map((person) => (
            <PersonLinks key={person.name} person={person} />
          ))}
        </ul>
      </div>
    </footer>
  );
}
