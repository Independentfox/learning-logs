# Learning Logs

Learning in public, one day at a time — daily logs on DSA, CS fundamentals, software
engineering and AI & LLMs, plus the open-source projects I build along the way.

Next.js 16 · Tailwind CSS 4 · Upstash Redis (visit counter) · deployed on Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Where things live

| What                                                                  | File                           |
| --------------------------------------------------------------------- | ------------------------------ |
| Learning topics (the 14 cards, and a page each at `/learning/<slug>`) | `src/content/categories.ts`    |
| Building Journey cards                                                | `src/content/projects.ts`      |
| Daily logs — each day is tagged with one or more topics               | `src/content/logs.ts`          |
| Site name, links                                                      | `src/content/site.ts`          |
| Home: hero, stats panel, tabs                                         | `src/app/(journey)/layout.tsx` |
| Topic, login and account pages                                        | `src/app/(site)/`              |
| Visit counter API                                                     | `src/app/api/visit/route.ts`   |
| Sign-in config (Google, GitHub)                                       | `src/auth.ts`                  |
| Learner numbers, email opt-in                                         | `src/lib/learners.ts`          |

## Visit counter

`POST /api/visit` records a visit and returns `{ views, learners }`; `GET` returns the totals.

- **views** — every page load on the live site counts (capped at 20 a minute per visitor, so a script can't pump it). Local dev and preview deployments share the store, so they read the totals without adding to them.
- **learners** — people who have signed up (see below).
- Link-preview crawlers (LinkedIn fetches the page on every post), search bots and scripts are ignored.

It needs an Upstash Redis store. On Vercel: **Project → Storage → Upstash (Redis) → Connect**,
then redeploy. Locally, `vercel env pull .env.local`. Without a store the counter simply hides.

## Learners (sign-in)

Learners sign in with Google or GitHub (Auth.js). Users and linked accounts are stored in the
same Redis store under `auth:*`; the session is an encrypted cookie, so nothing piles up.

Each new learner gets the next number (`learners:seq`) and joins the `learners` set, whose size
is the count on the home page. Learners who switch on "Email me new logs" are kept in the
`subscribers` set, ready for when log emails go out.

Env vars: `AUTH_SECRET`, plus `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` and
`AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`. A provider's button only shows once its id is set.

OAuth callback URLs:

- Google: `https://manav-learning-logs.vercel.app/api/auth/callback/google`
- GitHub: `https://manav-learning-logs.vercel.app/api/auth/callback/github`
