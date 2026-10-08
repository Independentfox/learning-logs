import type { Progress } from "@/lib/reading";
import { cn } from "@/lib/utils";

/** A thin bar showing how much of something has been read, with the percentage beside it. */
export function ProgressBar({
  progress,
  label,
  showPercent = true,
  className,
}: {
  progress: Progress;
  /** What the bar measures, for screen readers. */
  label: string;
  showPercent?: boolean;
  className?: string;
}) {
  const percent = progress.total ? Math.round((progress.read / progress.total) * 100) : 0;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={progress.total}
        aria-valuenow={progress.read}
        aria-valuetext={`${progress.read} of ${progress.total} read`}
        className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-link transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showPercent && (
        <span className="w-9 shrink-0 text-right text-xs text-subtle tabular-nums">{percent}%</span>
      )}
    </div>
  );
}
