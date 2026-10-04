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
| Daily logs — one Markdown file per day (format below)                 | `content/days/*.md`            |
| Site name, links                                                      | `src/content/site.ts`          |
| Home: hero, stats panel, tabs                                         | `src/app/(journey)/layout.tsx` |
| Topic, login and account pages                                        | `src/app/(site)/`              |
| Visit counter API                                                     | `src/app/api/visit/route.ts`   |
| Sign-in config (Google, GitHub)                                       | `src/auth.ts`                  |
| Learner numbers, email opt-in                                         | `src/lib/learners.ts`          |

## Logging a day

Each day is one Markdown file in `content/days/`, named by its number (`001.md`, `002.md`, …):

```md
---
day: 1
date: 2026-10-06
title: Two pointers, and when they beat a hash map
category: dsa # a slug from src/content/categories.ts
topic: Two Pointers & Sliding Window # must be in that category's syllabus
linkedin: https://www.linkedin.com/posts/... # optional
---

The notes, in Markdown — headings, lists, tables, code blocks.
```

The day gets a page at `/day/1`, appears under its topic on `/learning/dsa`, and counts towards
the Day number and streak grid on the home page. Research Papers, Cool Things and AI Race have
no fixed syllabus, so `topic` there can be anything (a paper's title, say). A typo in `category`
or `topic`, a missing field, or the same day twice fails the build with a message saying what
to fix.

## Visit counter

`POST /api/visit` records a visit and returns `{ views, learners }`; `GET` returns the totals.

- **views** — one per browser per day on the live site: the first load sets a 24-hour `ll_visit` cookie, and loads while it lasts don't count again. Scripts that ignore cookies are capped at 30 new visits an hour per IP and browser. Local dev and preview deployments share the store, so they read the totals without adding to them.
- **learners** — people who have signed up (see below).
- Link-preview crawlers (LinkedIn fetches the page on every post), search bots and scripts are ignored.

It needs an Upstash Redis store. On Vercel: **Project → Storage → Upstash (Redis) → Connect**,
then redeploy. Locally, `vercel env pull .env.local`. Without a store the counter simply hides.

## Learners (sign-in)

Learners sign in with Google or GitHub (Auth.js). Users and linked accounts are stored in the
same Redis store under `auth:*`; the session is an encrypted cookie, so nothing piles up.
A sign-in lasts one day, then the learner signs in again.

Each new learner gets the next number (`learners:seq`) and joins the `learners` set, whose size
is the count on the home page. Learners who switch on "Email me new logs" are kept in the
`subscribers` set, ready for when log emails go out.

Env vars: `AUTH_SECRET`, plus `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` and
`AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`. A provider's button only shows once its id is set.

OAuth callback URLs:

- Google: `https://manav-learning-logs.vercel.app/api/auth/callback/google`
- GitHub: `https://manav-learning-logs.vercel.app/api/auth/callback/github`
