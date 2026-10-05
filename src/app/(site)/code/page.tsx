import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { authEnabled } from "@/auth";
import { PlatformLogo } from "@/components/platform-logo";
import { Playground } from "@/components/playground";
import { DifficultyTag } from "@/components/practice";
import { questionsById } from "@/content/logs";
import { platforms } from "@/content/platforms";
import { rem } from "@/lib/utils";
import { runnerEnabled } from "@/lib/runner";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = {
  title: "Code",
  description: "Write and run C++, Python or Java right in the browser.",
  robots: { index: false },
};

export default async function CodePage({ searchParams }: PageProps<"/code">) {
  const { q } = await searchParams;
  const entry = typeof q === "string" ? questionsById.get(q) : undefined;
  const question = entry?.question;
  const viewer = await getViewer();
  const here = question ? `/code?q=${encodeURIComponent(question.id)}` : "/code";

  return (
    <>
      <header className="enter flex min-w-0 items-center gap-2.5 text-sm">
        <Link
          href={entry ? `/day/${entry.day}` : "/"}
          className="inline-flex shrink-0 items-center gap-1.5 text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft size={rem(15)} aria-hidden />
          {entry ? `Day ${entry.day}` : "Learning Journey"}
        </Link>
        <span aria-hidden className="text-subtle">
          /
        </span>
        <h1 className="font-semibold text-fg">Code</h1>
      </header>

      {question ? (
        <div className="enter mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-2xl border border-line bg-card/60 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <PlatformLogo platform={question.platform} size={20} />
            <p className="truncate text-lg font-semibold tracking-[-0.01em] text-fg">{question.title}</p>
            <DifficultyTag difficulty={question.difficulty} />
          </div>
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-link"
          >
            Read it on {platforms[question.platform].name}
            <ArrowUpRight size={rem(14)} aria-hidden />
          </a>
          <p className="w-full text-[0.8125rem] text-subtle">
            Test your solution here with your own input, then submit it on {platforms[question.platform].name}{" "}
            for the official verdict. Running it here marks it attempted.
          </p>
        </div>
      ) : (
        <p className="enter mt-6 text-[0.9375rem] text-muted">
          A scratchpad for trying things out — write some C++, Python or Java, give it input, run it.
        </p>
      )}

      <div className="enter mt-6">
        <Playground
          questionId={question?.id}
          signedIn={Boolean(viewer)}
          runnerEnabled={runnerEnabled && authEnabled}
          loginHref={`/login?next=${encodeURIComponent(here)}`}
        />
      </div>
    </>
  );
}
