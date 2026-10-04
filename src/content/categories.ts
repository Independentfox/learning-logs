import {
  Binary,
  Boxes,
  Braces,
  Brain,
  BrainCircuit,
  Component,
  Cpu,
  Database,
  Layers,
  Lightbulb,
  MonitorCog,
  Network,
  ScrollText,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  topics: readonly string[];
  Icon: LucideIcon;
};

/**
 * The cards on the Learning Journey tab, in order. Each one gets a page at
 * /learning/<slug>. Add an entry here and it gets a card and a page.
 */
export const categories = [
  {
    slug: "dsa",
    name: "DSA & Advanced Algos",
    blurb: "Patterns, problems and the intuition behind them, all the way to the advanced stuff.",
    topics: ["Arrays", "Graphs", "DP", "Segment Trees"],
    Icon: Binary,
  },
  {
    slug: "cpp-oops",
    name: "C++ & OOPs",
    blurb: "Modern C++, the STL and object-oriented design done right.",
    topics: ["STL", "Templates", "Memory", "OOP Principles"],
    Icon: Braces,
  },
  {
    slug: "computer-architecture",
    name: "Computer Architecture",
    blurb: "What actually happens inside the processor.",
    topics: ["Pipelining", "Caches", "Memory Hierarchy", "ISA"],
    Icon: Cpu,
  },
  {
    slug: "operating-systems",
    name: "Operating Systems",
    blurb: "Processes, memory and the scheduler that juggles it all.",
    topics: ["Processes", "Scheduling", "Virtual Memory", "Concurrency"],
    Icon: MonitorCog,
  },
  {
    slug: "computer-networks",
    name: "Computer Networks",
    blurb: "How bytes find their way across the internet.",
    topics: ["TCP/IP", "HTTP", "DNS", "Routing"],
    Icon: Network,
  },
  {
    slug: "dbms",
    name: "DBMS",
    blurb: "Storing data so it stays correct, consistent and fast.",
    topics: ["SQL", "Indexing", "Transactions", "Normalization"],
    Icon: Database,
  },
  {
    slug: "system-design-lld",
    name: "System Design — LLD",
    blurb: "Clean classes, interfaces and the patterns that hold them together.",
    topics: ["Design Patterns", "SOLID", "Class Design", "Machine Coding"],
    Icon: Component,
  },
  {
    slug: "system-design-hld",
    name: "System Design — HLD",
    blurb: "Architecting services that scale to millions of users.",
    topics: ["Scalability", "Caching", "Load Balancing", "Sharding"],
    Icon: Boxes,
  },
  {
    slug: "ml-dl",
    name: "ML & DL Concepts",
    blurb: "The math and intuition behind machine and deep learning.",
    topics: ["Regression", "Neural Nets", "Backprop", "CNNs"],
    Icon: Brain,
  },
  {
    slug: "research-papers",
    name: "Research Paper Summarizations",
    blurb: "Dense papers, distilled into what actually matters.",
    topics: ["Key Ideas", "Methods", "Results", "Takeaways"],
    Icon: ScrollText,
  },
  {
    slug: "software-engineering",
    name: "Software Engineering",
    blurb: "Building, shipping and maintaining real software.",
    topics: ["Testing", "Git", "CI/CD", "Clean Code"],
    Icon: Layers,
  },
  {
    slug: "ai-llms",
    name: "AI & LLMs",
    blurb: "How LLMs work under the hood, and how to build with them.",
    topics: ["Transformers", "RAG", "Agents", "Fine-tuning"],
    Icon: BrainCircuit,
  },
  {
    slug: "cool-things",
    name: "Cool Things to Know!",
    blurb: "Fun, surprising things I picked up along the way.",
    topics: ["How Things Work", "Trivia", "Tools"],
    Icon: Lightbulb,
  },
  {
    slug: "ai-race",
    name: "AI Race — Who Will Win?",
    blurb: "Tracking the labs, models and moves shaping the race.",
    topics: ["Labs", "Models", "Benchmarks", "Compute"],
    Icon: Trophy,
  },
] as const satisfies readonly Category[];

export type CategorySlug = (typeof categories)[number]["slug"];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
