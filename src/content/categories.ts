import { Binary, BrainCircuit, Cpu, Layers, type LucideIcon } from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  topics: readonly string[];
  Icon: LucideIcon;
};

/** The cards on the Learning Journey tab. Add a topic here and it gets a card. */
export const categories = [
  {
    slug: "dsa",
    name: "DSA",
    blurb: "Patterns, problems and the intuition behind them.",
    topics: ["Arrays", "Trees", "Graphs", "DP"],
    Icon: Binary,
  },
  {
    slug: "cs-fundamentals",
    name: "CS Fundamentals",
    blurb: "How computers really work, under the abstractions.",
    topics: ["OS", "DBMS", "Networks", "OOP"],
    Icon: Cpu,
  },
  {
    slug: "software-engineering",
    name: "Software Engineering",
    blurb: "Designing, building and shipping real systems.",
    topics: ["System Design", "Backend", "Databases", "Tooling"],
    Icon: Layers,
  },
  {
    slug: "ai-llms",
    name: "AI & LLMs",
    blurb: "From ML basics to transformers, RAG and agents.",
    topics: ["ML Basics", "Transformers", "RAG", "Agents"],
    Icon: BrainCircuit,
  },
] as const satisfies readonly Category[];

export type CategorySlug = (typeof categories)[number]["slug"];
