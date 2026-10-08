import { getCategory } from "./categories";

export type TopicGuide = {
  /** A category slug from categories.ts. */
  category: string;
  /** Exactly as in that category's topics list. */
  topic: string;
  /** The page lives at /learning/<category>/<slug>. */
  slug: string;
  blurb: string;
  /** In study order. */
  subtopics: readonly string[];
};

/**
 * Topics broken into subtopics. A topic listed here gets its own page, linked
 * from its card on the category page.
 */
export const guides: readonly TopicGuide[] = [
  {
    category: "cpp-oops",
    topic: "C++ Basics & Functions",
    slug: "cpp-basics-and-functions",
    blurb:
      "Everything before types get serious: how a C++ program gets built, variables and console I/O, and splitting code into functions and files.",
    subtopics: [
      "What C++ is",
      "From source code to a running program",
      "Setting up the compiler",
      "Statements and program structure",
      "Variables and initialization",
      "Console input and output",
      "Uninitialized variables and undefined behavior",
      "Identifiers, keywords and formatting",
      "Literals, operators and expressions",
      "Functions, return values and parameters",
      "Local scope and using functions well",
      "Forward declarations and multiple files",
      "Namespaces",
      "Preprocessor, headers and header guards",
      "Designing your first programs",
    ],
  },
];

// A guide must point at a real syllabus topic, so a renamed topic fails the build.
for (const guide of guides) {
  if (!getCategory(guide.category)?.topics.includes(guide.topic))
    throw new Error(`subtopics.ts: "${guide.topic}" isn't a topic of "${guide.category}" in categories.ts`);
}

export function getGuide(category: string, slug: string) {
  return guides.find((guide) => guide.category === category && guide.slug === slug);
}

/** The guide for a syllabus topic, if it has one. */
export function guideFor(category: string, topic: string) {
  return guides.find((guide) => guide.category === category && guide.topic === topic);
}
