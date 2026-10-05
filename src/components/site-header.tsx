import Link from "next/link";
import { authEnabled } from "@/auth";
import { Avatar } from "@/components/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn, rem, shell } from "@/lib/utils";
import type { Viewer } from "@/lib/viewer";

/** Same mark as the favicon: an "L" with a teal dot. */
function LogoMark() {
  return (
    <svg viewBox="0 0 64 64" width={rem(30)} height={rem(30)} aria-hidden className="shrink-0">
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="#111111"
        stroke="#2a9d8f"
        strokeOpacity=".45"
        strokeWidth="2"
      />
      <path
        d="M22 17v29h18"
        fill="none"
        stroke="#ededed"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="49" cy="46" r="4" fill="#2a9d8f" />
    </svg>
  );
}

function AccountControl({ viewer }: { viewer: Viewer }) {
  if (!authEnabled) return null;
  if (!viewer) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-fg"
      >
        Sign in
      </Link>
    );
  }
  return (
    <Link
      href="/account"
      aria-label="Your account"
      title={viewer.learner ? `Learner #${viewer.learner.number}` : "Your account"}
      className="rounded-full transition-opacity hover:opacity-85"
    >
      <Avatar name={viewer.name} image={viewer.image} size={34} />
    </Link>
  );
}

export function SiteHeader({ viewer }: { viewer: Viewer }) {
  return (
    <header className={cn(shell, "flex h-16 items-center justify-between gap-4 sm:h-20")}>
      <Link href="/" className="inline-flex items-center gap-2.5">
        <LogoMark />
        <span className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-fg">Learning Logs</span>
        <span className="hidden text-[0.9375rem] text-subtle sm:inline">by Manav Punjabi</span>
      </Link>
      <div className="flex items-center gap-1.5">
        <Link
          href="/code"
          className="inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-muted transition-colors hover:bg-card hover:text-fg"
        >
          Code
        </Link>
        <AccountControl viewer={viewer} />
        <ThemeToggle />
      </div>
    </header>
  );
}
