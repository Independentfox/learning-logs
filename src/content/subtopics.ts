import { getCategory } from "./categories";

/** A lesson in the course a topic follows, by its number there. */
export type Lesson = { number: string; url: string };

export type Subtopic = {
  name: string;
  /** One line on what it covers, in our words. */
  about: string;
  lessons: readonly Lesson[];
};

export type TopicGuide = {
  /** A category slug from categories.ts. */
  category: string;
  /** Exactly as in that category's topics list. */
  topic: string;
  /** The page lives at /learning/<category>/<slug>. */
  slug: string;
  blurb: string;
  /** The course the lessons come from, and the part of it this topic covers. */
  source: { name: string; url: string; covers: string };
  subtopics: readonly Subtopic[];
};

const learncpp = (number: string, path: string): Lesson => ({
  number,
  url: `https://www.learncpp.com/cpp-tutorial/${path}/`,
});

const LEARNCPP = { name: "learncpp.com", url: "https://www.learncpp.com/" };

/**
 * Topics broken into subtopics, in study order. A topic listed here gets its own
 * page, linked from its card on the category page.
 */
export const guides: readonly TopicGuide[] = [
  {
    category: "cpp-oops",
    topic: "C++ Basics & Functions",
    slug: "cpp-basics-and-functions",
    blurb:
      "Everything before types get serious: how a C++ program gets built, variables and console I/O, and splitting code into functions and files.",
    source: { ...LEARNCPP, covers: "Chapters 0–2" },
    subtopics: [
      {
        name: "What C++ is",
        about: "Programs and languages, and where C++ came from.",
        lessons: [
          learncpp("0.1", "introduction-to-these-tutorials"),
          learncpp("0.2", "introduction-to-programming-languages"),
          learncpp("0.3", "introduction-to-cplusplus"),
        ],
      },
      {
        name: "From source code to a running program",
        about: "Write, compile, link, run, and the errors each step catches.",
        lessons: [
          learncpp("0.4", "introduction-to-cpp-development"),
          learncpp("0.5", "introduction-to-the-compiler-linker-and-libraries"),
          learncpp("0.7", "compiling-your-first-program"),
          learncpp("0.8", "a-few-common-cpp-problems"),
        ],
      },
      {
        name: "Setting up the compiler",
        about: "An IDE, debug vs release builds, strict warnings, and choosing a language standard.",
        lessons: [
          learncpp("0.6", "installing-an-integrated-development-environment-ide"),
          learncpp("0.9", "configuring-your-compiler-build-configurations"),
          learncpp("0.10", "configuring-your-compiler-compiler-extensions"),
          learncpp("0.11", "configuring-your-compiler-warning-and-error-levels"),
          learncpp("0.12", "configuring-your-compiler-choosing-a-language-standard"),
          learncpp("0.13", "what-language-standard-is-my-compiler-using"),
        ],
      },
      {
        name: "Statements and program structure",
        about: "Statements, main(), and comments that explain why rather than what.",
        lessons: [
          learncpp("1.1", "statements-and-the-structure-of-a-program"),
          learncpp("1.2", "comments"),
        ],
      },
      {
        name: "Variables and initialization",
        about: "Objects in memory, and the different ways to give a variable its first value.",
        lessons: [
          learncpp("1.3", "introduction-to-objects-and-variables"),
          learncpp("1.4", "variable-assignment-and-initialization"),
        ],
      },
      {
        name: "Console input and output",
        about: "Printing with std::cout, reading with std::cin, and when output gets flushed.",
        lessons: [learncpp("1.5", "introduction-to-iostream-cout-cin-and-endl")],
      },
      {
        name: "Uninitialized variables and undefined behavior",
        about: "Why reading a variable you never set can do anything at all.",
        lessons: [learncpp("1.6", "uninitialized-variables-and-undefined-behavior")],
      },
      {
        name: "Identifiers, keywords and formatting",
        about: "What you can name things, naming conventions, and laying code out readably.",
        lessons: [
          learncpp("1.7", "keywords-and-naming-identifiers"),
          learncpp("1.8", "whitespace-and-basic-formatting"),
        ],
      },
      {
        name: "Literals, operators and expressions",
        about: "Values written into code, the operators that combine them, and how an expression evaluates.",
        lessons: [
          learncpp("1.9", "introduction-to-literals-and-operators"),
          learncpp("1.10", "introduction-to-expressions"),
        ],
      },
      {
        name: "Functions, return values and parameters",
        about: "Defining and calling functions, returning a value or not, and passing arguments in.",
        lessons: [
          learncpp("2.1", "introduction-to-functions"),
          learncpp("2.2", "function-return-values-value-returning-functions"),
          learncpp("2.3", "void-functions-non-value-returning-functions"),
          learncpp("2.4", "introduction-to-function-parameters-and-arguments"),
        ],
      },
      {
        name: "Local scope and using functions well",
        about: "Where a local variable lives and dies, and when a piece of code deserves its own function.",
        lessons: [
          learncpp("2.5", "introduction-to-local-scope"),
          learncpp("2.6", "why-functions-are-useful-and-how-to-use-them-effectively"),
        ],
      },
      {
        name: "Forward declarations and multiple files",
        about: "Declaring before use, and splitting one program across several .cpp files.",
        lessons: [
          learncpp("2.7", "forward-declarations"),
          learncpp("2.8", "programs-with-multiple-code-files"),
        ],
      },
      {
        name: "Namespaces",
        about: "How names clash, and what the std:: prefix is really doing.",
        lessons: [learncpp("2.9", "naming-collisions-and-an-introduction-to-namespaces")],
      },
      {
        name: "Preprocessor, headers and header guards",
        about: "#include and #define, writing your own header files, and stopping a header from being included twice.",
        lessons: [
          learncpp("2.10", "introduction-to-the-preprocessor"),
          learncpp("2.11", "header-files"),
          learncpp("2.12", "header-guards"),
        ],
      },
      {
        name: "Designing programs, and the chapter quizzes",
        about: "Breaking a problem into steps before writing code, then testing it all on the quizzes.",
        lessons: [
          learncpp("1.11", "developing-your-first-program"),
          learncpp("2.13", "how-to-design-your-first-programs"),
          learncpp("1.x", "chapter-1-summary-and-quiz"),
          learncpp("2.x", "chapter-2-summary-and-quiz"),
        ],
      },
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
