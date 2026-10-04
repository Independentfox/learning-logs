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

| What                                             | File                           |
| ------------------------------------------------ | ------------------------------ |
| Learning Journey cards (DSA, CS Fundamentals, …) | `src/content/categories.ts`    |
| Building Journey cards                           | `src/content/projects.ts`      |
| Daily logs (drives counts and the "Day N" badge) | `src/content/logs.ts`          |
| Site name, links                                 | `src/content/site.ts`          |
| Visit counter API                                | `src/app/api/visit/route.ts`   |
| Shared header + tabs                             | `src/app/(journey)/layout.tsx` |

## Visit counter

`POST /api/visit` records a visit and returns `{ views, learners }`; `GET` returns the totals.

- **views** — every page load counts (capped at 20 a minute per visitor, so a script can't pump it).
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
