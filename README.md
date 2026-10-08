# Learning Logs

Learning in public, one day at a time — daily logs on DSA, CS fundamentals, software
engineering and AI & LLMs, plus the open-source projects we build along the way.

Built by [Devanshi Gupta](https://github.com/gitgeek28) and [Manav Punjabi](https://github.com/Independentfox).
Live at [thelearninglogs.vercel.app](https://thelearninglogs.vercel.app).

Next.js 16 · Tailwind CSS 4 · Upstash Redis · deployed on Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## How changes reach the site

Every change goes through a pull request into `main` and is merged with a **merge commit** (not
squash or rebase). Vercel deploys each push to `main`; on the Hobby plan it only deploys commits
by the project owner, and the merge commit is the owner's, so that's the one that goes live.

| Work                     | Branch                                                                     | Label                       |
| ------------------------ | -------------------------------------------------------------------------- | --------------------------- |
| C++ & OOPs track         | `track/cpp-oops` — long-running; fast-forward it to `main` before new work | `track: cpp-oops`           |
| New features             | `feat/<name>`                                                              | `enhancement`               |
| Fixes                    | `fix/<name>`                                                               | `bug`                       |
| Layout and styling       | `style/<name>`                                                             | `ui`                        |
| Tracks, syllabi and days | `content/<name>`                                                           | `content`                   |
| Docs and process         | `docs/<name>`                                                              | `documentation`, `workflow` |

Commit messages are one line with a type prefix — `feat:`, `fix:`, `style:`, `content:`, `docs:`.
Every PR fills in the template (summary, changes, testing) and gets a label. Short-lived branches
are deleted once merged.

## Where things live

| What                                                                 | File                           |
| -------------------------------------------------------------------- | ------------------------------ |
| Learning tracks (a card each, and a page each at `/learning/<slug>`) | `src/content/categories.ts`    |
| Building Journey cards                                               | `src/content/projects.ts`      |
| Daily logs — one Markdown file per day (format below)                | `content/days/*.md`            |
| Site name, links                                                     | `src/content/site.ts`          |
| Home: hero, stats panel, tabs                                        | `src/app/(journey)/layout.tsx` |
| Topic, day, code, login and account pages                            | `src/app/(site)/`              |
| Visit counter API                                                    | `src/app/api/visit/route.ts`   |
| Sign-in config (Google, GitHub)                                      | `src/auth.ts`                  |
| Learner numbers, email opt-in                                        | `src/lib/learners.ts`          |

## Writing a subtopic page

Each subtopic can have its own page — one published page is **one log**. A page is a folder:

```text
content/subtopics/<category>/<guide slug>/<subtopic slug>/
  index.md
  <diagram>.excalidraw      (zero or more)
```

and lives at `/learning/<category>/<guide slug>/<subtopic slug>`. The folder name is the URL, in
lowercase-with-hyphens. `index.md`:

```md
---
subtopic: What C++ is # exactly as in that guide's list in src/content/subtopics.ts
published: 2026-10-09
summary: # optional — "Revise in 30 seconds"
  - C++ compiles straight to machine code.
sources: # required, never shown — what the page was cross-checked against
  - https://…
questions: # optional — same format as a day's questions
  - title: Watermelon
    url: https://codeforces.com/problemset/problem/4/A
    difficulty: easy
---

The write-up, in Markdown.
```

In the body:

- **Diagrams** — `![Caption](diagram:compile-pipeline)` shows `compile-pipeline.excalidraw` from
  the same folder. Run `npm run notes:render` after adding or changing one; the build fails if a
  diagram is missing or stale.
- **Code** — every fenced block is a VS Code-style panel with Copy and Edit. C++, Java and Python
  programs (anything with a `main`) also get **Run**, which compiles through `/api/run`. Set the
  file tab with ` ```cpp title="vector.cpp" `.
- **Expected output** — ` ```text title="Output" ` right after a program shows a terminal panel.
- **Callouts** — `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`.

The subtopic's name on its topic page becomes a link, readers get **Mark as read** (the same tick
as the checkbox), and the page counts towards the track's and the home page's logs.

## Logging a day

Each day is one Markdown file in `content/days/`, named by its number (`001.md`, `002.md`, …):

```md
---
day: 1
date: 2026-10-06
title: Two pointers on sorted arrays
category: dsa # a slug from src/content/categories.ts
topic: Sliding Window & Two Pointers # must be in that category's syllabus
linkedin: https://www.linkedin.com/posts/... # optional
summary: # "Revise in 30 seconds" — a few one-liners
  - Sorted input is the hint that two pointers will work.
questions: # practice; the platform is detected from the link
  - title: Two Sum II - Input Array Is Sorted
    url: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
    difficulty: medium # easy | medium | hard
---

The text notes, in Markdown — explanation, complexity, code (highlighted).
```

The day gets a page at `/day/1`, shows under its topic on `/learning/dsa`, and counts towards the
Day number and streak grid. Known platforms (logo or badge) are in `src/content/platforms.ts`:
Codeforces, LeetCode, CodeChef, GeeksforGeeks, CSES, AtCoder, VJudge, HackerRank, HackerEarth,
SPOJ, InterviewBit. Research Papers, Cool Things and AI Race have no fixed syllabus, so `topic`
there can be anything. A typo in `category`/`topic`, an unknown platform, a bad difficulty or the
same day twice fails the build with a message saying what to fix.

### Drawn notes (Excalidraw)

Each page of a day's drawn notes is an Excalidraw file: `content/notes/<day>/1.excalidraw`,
`2.excalidraw`, … Render them with

```bash
npm run notes:render   # → public/notes/<day>/<n>.svg, via headless Chrome
```

and commit both. The SVGs stay sharp at any size and are inverted for dark mode. A source can
start as a quick draft (`{"skeleton": true, "elements": [...]}` in Excalidraw's element-skeleton
format); rendering expands it into a full Excalidraw file you can open and edit on
excalidraw.com. `npm run notes:check` runs before every build and fails if any page is missing
or out of date.

### Progress

Signed-in learners mark each question Attempted or Solved; running code for a question marks it
attempted. Each question shows solved / attempted across learners, and topic pages show each
learner's own progress. Stored in Redis: `q:<id>:attempted` and `q:<id>:solved` (sets of user
ids) and `learner:<user>:questions` (hash).

## Code runner

`/code` (or the Code button on any question) is an editor with C++17, Python 3 and Java. Code
runs on a [Judge0](https://judge0.com) server, never on Vercel:

- `JUDGE0_URL` — `https://judge0-ce.p.rapidapi.com` (Judge0 on RapidAPI) or a self-hosted Judge0
- `JUDGE0_KEY` — the RapidAPI key, or the self-hosted auth token
- `RUNNER_DAILY_LIMIT` — runs per day across the site (default 45; match your plan)

Only signed-in learners can run code, 20 runs per 10 minutes each. Without `JUDGE0_URL` the editor
still works but Run is disabled.

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

- Google: `https://thelearninglogs.vercel.app/api/auth/callback/google`
- GitHub: `https://thelearninglogs.vercel.app/api/auth/callback/github`
