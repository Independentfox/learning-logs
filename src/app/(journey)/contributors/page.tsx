import { UserPlus } from "lucide-react";
import type { Metadata } from "next";
import { ContributorCard } from "@/components/contributor-card";
import { contributors, friends } from "@/content/contributors";
import { rem } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contributors",
  description: "The people building Learning Logs, and the friends who help out.",
  alternates: { canonical: "/contributors" },
};

/** Fills the grid until the first friend is added. */
function MoreSoon() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line-strong px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-line text-subtle">
        <UserPlus size={rem(20)} aria-hidden />
      </span>
      <p className="mt-4 text-[0.9375rem] font-medium text-fg">More names coming soon</p>
      <p className="mt-1 max-w-[18rem] text-sm leading-relaxed text-muted">
        Friends who help build Learning Logs get credited here.
      </p>
    </div>
  );
}

export default function Contributors() {
  return (
    <section aria-labelledby="contributors-title">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="contributors-title" className="eyebrow">
          Who&apos;s building this
        </h2>
        <span className="eyebrow">
          {contributors.length} {contributors.length === 1 ? "person" : "people"}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {contributors.map((contributor) => (
          <ContributorCard key={contributor.name} contributor={contributor} />
        ))}
        {friends.length === 0 && <MoreSoon />}
      </div>
    </section>
  );
}
