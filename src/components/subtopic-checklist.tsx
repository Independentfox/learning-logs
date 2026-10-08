"use client";

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { ProgressBar } from "@/components/progress-bar";
import { markSubtopicRead } from "@/lib/reading-actions";
import { cn, columnGrid, rem } from "@/lib/utils";

/** A subtopic; `href` is set once it has its own page. */
type Item = { id: string; name: string; href?: string };
type Change = { id: string; read: boolean };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A topic's subtopics as a checklist. Ticks show straight away and save in the background;
 * visitors who aren't signed in are sent to sign in first.
 */
export function SubtopicChecklist({
  topic,
  items,
  initialRead,
  signedIn,
  loginHref,
}: {
  topic: string;
  items: Item[];
  initialRead: string[];
  signedIn: boolean;
  loginHref: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [read, apply] = useOptimistic(new Set(initialRead), (state: Set<string>, change: Change) => {
    const next = new Set(state);
    if (change.read) next.add(change.id);
    else next.delete(change.id);
    return next;
  });

  const toggle = (id: string) => {
    if (!signedIn) return router.push(loginHref);
    const change = { id, read: !read.has(id) };
    startTransition(async () => {
      apply(change);
      await markSubtopicRead(change.id, change.read);
    });
  };

  const done = items.filter(({ id }) => read.has(id)).length;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        {signedIn ? (
          <>
            <span className="text-sm text-muted">
              <span className="font-medium text-fg tabular-nums">{done}</span> of {items.length} read
            </span>
            <ProgressBar
              progress={{ read: done, total: items.length }}
              label={`${topic}: subtopics read`}
              className="w-full max-w-[26rem] flex-1"
            />
          </>
        ) : (
          <p className="text-sm text-muted">
            <Link href={loginHref} className="inline-link">
              Sign in
            </Link>{" "}
            to tick off subtopics as you read them.
          </p>
        )}
      </div>

      {/* Numbered down each column, with every block the same size. */}
      <ol {...columnGrid(items.length)}>
        {items.map(({ id, name, href }, i) => {
          const checked = read.has(id);
          return (
            <li key={id} className="flex">
              <label
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border px-6 py-5 transition-colors",
                  checked ? "border-tint-line bg-tint" : "border-line bg-card hover:border-line-strong",
                )}
              >
                <span className="relative grid size-5 shrink-0 place-items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(id)}
                    className="peer size-5 cursor-pointer appearance-none rounded-md border border-line-strong bg-canvas transition-colors checked:border-transparent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
                  />
                  <Check
                    size={rem(14)}
                    strokeWidth={3}
                    aria-hidden
                    className="pointer-events-none absolute text-accent-fg opacity-0 transition-opacity peer-checked:opacity-100"
                  />
                </span>
                <span className="font-mono text-sm text-subtle">{pad(i + 1)}</span>
                {href ? (
                  // A link inside a label navigates instead of ticking the box.
                  <Link
                    href={href}
                    className="group/link min-w-0 flex-1 text-lg font-medium text-fg transition-colors hover:text-link lg:text-xl"
                  >
                    {name}
                    <ArrowRight
                      size={rem(15)}
                      aria-hidden
                      className="ml-1.5 inline-block align-middle text-subtle transition-transform group-hover/link:translate-x-0.5 group-hover/link:text-link"
                    />
                  </Link>
                ) : (
                  <span className="min-w-0 flex-1 text-lg font-medium text-muted lg:text-xl">{name}</span>
                )}
              </label>
            </li>
          );
        })}
      </ol>
    </>
  );
}
