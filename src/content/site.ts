export type Person = {
  name: string;
  firstName: string;
  role: string;
  /** Leave a link out until there is one — anything listed here shows up on the site. */
  links: { linkedin?: string; github?: string; portfolio?: string };
};

/** The people behind the site, in order: Devanshi builds it, Manav contributes. */
export const people: Person[] = [
  {
    name: "Devanshi Gupta",
    firstName: "Devanshi",
    role: "Builder",
    links: {
      linkedin: "https://www.linkedin.com/in/devanshi-gupta-891a0b304/",
      github: "https://github.com/gitgeek28",
    },
  },
  {
    name: "Manav Punjabi",
    firstName: "Manav",
    role: "Contributor",
    links: {
      portfolio: "https://manav-punjabi-portfolio.vercel.app",
      github: "https://github.com/Independentfox",
      linkedin: "https://www.linkedin.com/in/manav-punjabi-861122282",
    },
  },
];

/** A person's best link: LinkedIn first, since that's where the logs are posted. */
export const profileLink = (person: Person) =>
  person.links.linkedin ?? person.links.portfolio ?? person.links.github;

const names = people.map((p) => p.name);

export const site = {
  name: "Learning Logs",
  /** Short form for tight spots, e.g. "Devanshi & Manav". */
  byline: people.map((p) => p.firstName).join(" & "),
  /** "Devanshi Gupta & Manav Punjabi". */
  authors: names.join(" & "),
  title: `Learning Logs — ${names.join(" & ")}`,
  description:
    "Learning in public, one day at a time. Daily logs on DSA, CS fundamentals, software engineering and AI & LLMs — plus everything we build in the open.",
} as const;
