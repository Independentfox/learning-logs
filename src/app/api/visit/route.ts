import type { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { redis, type VisitStats } from "@/lib/redis";
import { DAY_SECONDS } from "@/lib/utils";

const KEY = {
  views: "views:total",
  learners: "learners",
  rate: (id: string) => `rate:${id}`,
};

// One visit per browser per day: the first page load sets this cookie, and
// loads while it lasts don't count again.
const VISIT_COOKIE = "ll_visit";

// Scripts ignore cookies, so this cap stops them pumping the number: at most 30
// new visits an hour from one IP and browser. Real people on a shared campus
// network stay well under it.
const RATE_LIMIT = 30;
const RATE_WINDOW_SECONDS = 60 * 60;

// Link-preview crawlers (LinkedIn fetches the page on every post), search
// engines and headless browsers shouldn't count as visits.
const BOT_UA =
  /bot|crawl|spider|slurp|preview|linkedin|facebookexternalhit|whatsapp|telegram|slack|discord|embedly|lighthouse|headless|curl|wget|python|axios|node-fetch/i;

const noStore = { "Cache-Control": "no-store" };

// Local dev and preview deployments share the production store, so only the
// live site records visits; everywhere else just reads the totals.
const countsVisits = process.env.VERCEL_ENV === "production";

async function visitorId(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ua = request.headers.get("user-agent") ?? "";
  const salt = process.env.VISITOR_SALT ?? "learning-logs";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${ip}|${ua}|${salt}`));
  return Buffer.from(digest).toString("hex").slice(0, 32);
}

async function readStats(db: Redis): Promise<VisitStats> {
  const [views, learners] = await Promise.all([db.get<number>(KEY.views), db.scard(KEY.learners)]);
  return { views: views ?? 0, learners };
}

/** Current totals, for the live refresh. */
export async function GET() {
  if (!redis) return Response.json(null, { status: 503, headers: noStore });
  try {
    return Response.json(await readStats(redis), { headers: noStore });
  } catch {
    return Response.json(null, { status: 503, headers: noStore });
  }
}

/** Records a visit (once per browser per day) and returns the totals. */
export async function POST(request: Request) {
  if (!redis) return Response.json(null, { status: 503, headers: noStore });

  try {
    const ua = request.headers.get("user-agent") ?? "";
    const jar = await cookies();
    if (!countsVisits || !ua || BOT_UA.test(ua) || jar.has(VISIT_COOKIE)) {
      return Response.json(await readStats(redis), { headers: noStore });
    }

    const id = await visitorId(request);
    const [hits] = await redis
      .pipeline()
      .incr(KEY.rate(id))
      .expire(KEY.rate(id), RATE_WINDOW_SECONDS, "NX")
      .exec<[number, number]>();
    if (hits > RATE_LIMIT) {
      return Response.json(await readStats(redis), { headers: noStore });
    }

    const [views, learners] = await redis
      .pipeline()
      .incr(KEY.views)
      .scard(KEY.learners)
      .exec<[number, number]>();

    jar.set(VISIT_COOKIE, "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: DAY_SECONDS,
    });
    return Response.json({ views, learners } satisfies VisitStats, { headers: noStore });
  } catch {
    return Response.json(null, { status: 503, headers: noStore });
  }
}
