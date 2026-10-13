import { people, type Person } from "@/content/site";

export type Contributor = {
  name: string;
  /** A word or two on what they do here: "Builder", "Contributor", "Design"… */
  role: string;
  /** Optional: one line on what they helped with. */
  contribution?: string;
  /** Leave a link out until there is one — anything listed here shows up on the site. */
  links: Person["links"];
  /** Devanshi and Manav, who run the site. Set automatically below. */
  core?: boolean;
};

/** The two of us, taken from site.ts so names and links live in one place. */
const team: Contributor[] = people.map(({ name, role, links }) => ({ name, role, links, core: true }));

/**
 * Friends who help build Learning Logs, in the order they joined. Add one entry per person:
 * { name: "…", role: "Contributor", contribution: "…", links: { github: "…", linkedin: "…" } }
 */
export const friends: Contributor[] = [];

export const contributors: Contributor[] = [...team, ...friends];
