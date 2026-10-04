import { Bookmark, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authEnabled } from "@/auth";
import { Avatar } from "@/components/avatar";
import { ensureLearner } from "@/lib/learners";
import { cn, delay, rem } from "@/lib/utils";
import { signOutAction, updateEmailUpdates } from "./actions";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false },
};

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  if (!authEnabled) redirect("/");

  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect("/login");

  const learner = await ensureLearner(user.id);
  const { welcome } = await searchParams;
  const firstName = user.name?.split(" ")[0];
  const emailOn = learner?.emailUpdates ?? false;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
      <div>
        <p className="enter eyebrow">{welcome ? "Welcome aboard" : "Your account"}</p>
        <h1 className="enter-rise mt-5 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-fg sm:text-[3.5rem] xl:text-[4.25rem]">
          {welcome ? "You're learner" : "Learner"}{" "}
          <span className="text-link tabular-nums">#{learner?.number ?? "—"}</span>
          {welcome && firstName ? (
            <>
              ,
              <br />
              <span className="font-serif font-normal italic">{firstName}.</span>
            </>
          ) : null}
        </h1>

        <div className="enter mt-8 flex items-center gap-3.5" style={delay(80)}>
          <Avatar name={user.name} image={user.image} size={48} />
          <div className="min-w-0">
            <p className="truncate font-medium text-fg">{user.name}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <div className="enter mt-8 flex flex-wrap items-center gap-3" style={delay(140)}>
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-xl bg-accent px-5 text-[0.9375rem] font-medium text-accent-fg transition-[filter] hover:brightness-110"
          >
            Back to the logs
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="inline-flex h-11 items-center rounded-xl border border-line-strong px-5 text-[0.9375rem] font-medium text-fg transition-colors hover:bg-card"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-4 lg:pt-10">
        <section
          className="enter flex items-start gap-4 rounded-3xl border border-line bg-card/70 p-6 backdrop-blur-sm"
          style={delay(180)}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-tint-line bg-tint text-link">
            <Mail size={rem(18)} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="email-updates" className="font-medium text-fg">
              Email me new logs
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              One email when each new Day goes up{user.email ? ` to ${user.email}` : ""}. Turn it off any
              time.
            </p>
          </div>
          <form action={updateEmailUpdates}>
            <input type="hidden" name="on" value={emailOn ? "0" : "1"} />
            <button
              type="submit"
              role="switch"
              aria-checked={emailOn}
              aria-labelledby="email-updates"
              className={cn(
                "relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors",
                emailOn ? "bg-accent" : "bg-line-strong",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
                  emailOn && "translate-x-5",
                )}
              />
            </button>
          </form>
        </section>

        <section
          className="enter flex items-start gap-4 rounded-3xl border border-dashed border-line-strong p-6"
          style={delay(220)}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-subtle">
            <Bookmark size={rem(18)} aria-hidden />
          </span>
          <div>
            <h2 className="flex items-center gap-2 font-medium text-fg">
              Progress &amp; bookmarks
              <span className="rounded-full border border-line px-2 py-px text-[0.6875rem] font-normal text-subtle">
                soon
              </span>
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Coming with the daily log pages: mark days as read and save the ones you want to revisit.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
