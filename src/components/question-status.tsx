"use client";

import { Check, CircleDashed } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import type { Status } from "@/lib/progress";
import { updateQuestionStatus } from "@/lib/progress-actions";
import { cn, rem } from "@/lib/utils";

const options = [
  { value: "attempted", label: "Attempted", Icon: CircleDashed },
  { value: "solved", label: "Solved", Icon: Check },
] as const;

/** The learner's own Attempted / Solved toggle. Clicking the active one clears it. */
export function QuestionStatus({ questionId, initial }: { questionId: string; initial: Status | null }) {
  const [status, setOptimistic] = useOptimistic(initial);
  const [, startTransition] = useTransition();

  const toggle = (value: Status) => {
    const next = status === value ? null : value;
    startTransition(async () => {
      setOptimistic(next);
      await updateQuestionStatus(questionId, next);
    });
  };

  return (
    <div role="group" aria-label="Your progress" className="inline-flex rounded-lg border border-line p-0.5">
      {options.map(({ value, label, Icon }) => {
        const active = status === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(value)}
            className={cn(
              "inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors",
              active
                ? value === "solved"
                  ? "bg-accent text-accent-fg"
                  : "bg-tint text-link"
                : "text-subtle hover:text-fg",
            )}
          >
            <Icon size={rem(13)} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
