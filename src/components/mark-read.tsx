"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { markSubtopicRead } from "@/lib/reading-actions";
import { cn, rem } from "@/lib/utils";

/** "Mark as read" for one subtopic — the same tick as its checkbox on the topic page. */
export function MarkRead({
  id,
  initial,
  signedIn,
  loginHref,
}: {
  id: string;
  initial: boolean;
  signedIn: boolean;
  loginHref: string;
}) {
  const [read, setRead] = useOptimistic(initial);
  const [, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <Link
        href={loginHref}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-line px-3 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
      >
        Sign in to track your reading
      </Link>
    );
  }

  const toggle = () =>
    startTransition(async () => {
      setRead(!read);
      await markSubtopicRead(id, !read);
    });

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={read}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
        read
          ? "border-tint-line bg-tint text-link"
          : "border-line text-muted hover:border-line-strong hover:text-fg",
      )}
    >
      <span
        className={cn(
          "grid size-4 place-items-center rounded border",
          read ? "border-transparent bg-accent text-accent-fg" : "border-line-strong",
        )}
      >
        {read && <Check size={rem(12)} strokeWidth={3} aria-hidden />}
      </span>
      {read ? "Read" : "Mark as read"}
    </button>
  );
}
