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

`POST /api/visit` records a visit and returns `{ views, visitors }`; `GET` returns the totals.

- **views** — every page load counts (capped at 20 a minute per visitor, so a script can't pump it).
- **visitors** — unique readers, kept in a Redis HyperLogLog (hashed IP + user agent; nothing raw is stored).
- Link-preview crawlers (LinkedIn fetches the page on every post), search bots and scripts are ignored.

It needs an Upstash Redis store. On Vercel: **Project → Storage → Upstash (Redis) → Connect**,
then redeploy. Locally, `vercel env pull .env.local`. Without a store the counter simply hides.
