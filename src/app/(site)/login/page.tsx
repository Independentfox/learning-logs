import { Bookmark, GraduationCap, Mail, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, authEnabled, providerIds, signIn } from "@/auth";
import { GitHubIcon, GoogleIcon } from "@/components/icons";
import { learnerCount } from "@/lib/learners";
import { delay, rem } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Join the learners",
  description: "Sign in with Google or GitHub to follow along and get your learner number.",
  alternates: { canonical: "/login" },
  robots: { index: false },
};

const providers = {
  google: { label: "Continue with Google", Icon: GoogleIcon },
  github: { label: "Continue with GitHub", Icon: GitHubIcon },
};

// Auth.js sends people back here with ?error=<code> when sign-in fails.
const errors: Record<string, string> = {
  OAuthAccountNotLinked:
    "That email already joined with the other button. Sign in with the one you used the first time.",
  AccessDenied: "Sign-in was cancelled. You can try again whenever you like.",
};
const fallbackError = "Something went wrong signing you in. Please try again in a minute.";

const perks: { Icon: LucideIcon; title: string; text: string; soon?: boolean }[] = [
  {
    Icon: GraduationCap,
    title: "Your learner number",
    text: "Everyone who joins gets a number, in the order they signed up.",
  },
  {
    Icon: Mail,
    title: "An email for every new log",
    text: "Switch it on from your account, and off again any time.",
  },
  {
    Icon: Bookmark,
    title: "Progress & bookmarks",
    text: "Mark days as read and save the ones worth revisiting.",
    soon: true,
  },
];

/** Only same-site paths, so ?next= can't bounce people to another site. */
const safeNext = (next: unknown) =>
  typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : "/account";

function ProviderButton({ id, redirectTo }: { id: keyof typeof providers; redirectTo: string }) {
  const { label, Icon } = providers[id];
  return (
    <form
      action={async () => {
        "use server";
        await signIn(id, { redirectTo });
      }}
    >
      <button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-canvas text-[0.9375rem] font-medium text-fg transition-[background-color,transform] hover:bg-card active:scale-[0.99]"
      >
        <Icon size={rem(18)} />
        {label}
      </button>
    </form>
  );
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (!authEnabled) {
    return (
      <div className="max-w-[35rem] pt-4 sm:pt-8 lg:pt-14">
        <p className="eyebrow">Join the learners</p>
        <h1 className="mt-4 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] text-fg">
          Sign-in opens <span className="font-serif font-normal text-link italic">soon.</span>
        </h1>
        <p className="mt-4 text-base leading-[1.7] text-muted">Check back in a day or two.</p>
      </div>
    );
  }

  const { error, next } = await searchParams;
  const redirectTo = safeNext(next);

  const session = await auth();
  if (session?.user) redirect(redirectTo);

  const code = typeof error === "string" ? error : undefined;
  const count = await learnerCount();

  return (
    <div className="grid gap-12 pt-4 sm:pt-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-20 lg:pt-14">
      <div>
        <p className="enter eyebrow">Join the learners</p>
        <h1 className="enter-rise mt-5 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-fg sm:text-[3.5rem] xl:text-[4.25rem]">
          Learn alongside us,
          <br />
          <span className="font-serif font-normal text-link italic">day by day.</span>
        </h1>
        <p className="enter mt-6 max-w-[35rem] text-[1.0625rem] leading-[1.75] text-muted" style={delay(80)}>
          Follow the journey as it happens
          {count > 0 && (
            <>
              {" "}
              with <span className="font-medium text-fg">{count}</span>{" "}
              {count === 1 ? "other learner" : "other learners"}
            </>
          )}
          . It&apos;s free and takes one click.
        </p>

        <ul className="enter mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1" style={delay(140)}>
          {perks.map(({ Icon, title, text, soon }) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-tint-line bg-tint text-link">
                <Icon size={rem(18)} aria-hidden />
              </span>
              <div>
                <p className="flex items-center gap-2 font-medium text-fg">
                  {title}
                  {soon && (
                    <span className="rounded-full border border-line px-2 py-px text-[0.6875rem] font-normal text-subtle">
                      soon
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section
        aria-labelledby="signin-title"
        className="enter rounded-3xl border border-line bg-card/70 p-6 backdrop-blur-sm sm:p-8"
        style={delay(180)}
      >
        <h2 id="signin-title" className="text-xl font-semibold tracking-[-0.015em] text-fg">
          Sign in or create your account
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">New or returning, the same buttons work.</p>

        {code && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-tint-line bg-tint px-4 py-3 text-sm leading-relaxed text-fg"
          >
            {errors[code] ?? fallbackError}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {providerIds.map((id) => (
            <ProviderButton key={id} id={id} redirectTo={redirectTo} />
          ))}
        </div>

        <p className="mt-6 border-t border-line pt-5 text-[0.8125rem] leading-relaxed text-subtle">
          We only see your name, email and profile picture, and nothing is ever posted for you.
        </p>
      </section>
    </div>
  );
}
