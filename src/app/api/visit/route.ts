import type { Redis } from "@upstash/redis";
import { redis, type VisitStats } from "@/lib/redis";

const KEY = {
  views: "views:total",
  // HyperLogLog: ~0.81% error, 12 KB no matter how many visitors.
  visitors: "visitors:hll",
  seen: (id: string) => `seen:${id}`,
};

// A returning visitor counts as a new view after 30 minutes away.
const SESSION_SECONDS = 30 * 60;

// Link-preview crawlers (LinkedIn fetches the page on every post), search
// engines and headless browsers shouldn't count as readers.
const BOT_UA =
  /bot|crawl|spider|slurp|preview|linkedin|facebookexternalhit|whatsapp|telegram|slack|discord|embedly|lighthouse|headless|curl|wget|python|axios|node-fetch/i;

const noStore = { "Cache-Control": "no-store" };

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
  const [views, visitors] = await Promise.all([db.get<number>(KEY.views), db.pfcount(KEY.visitors)]);
  return { views: views ?? 0, visitors };
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

/** Records a visit (at most once per visitor per 30 min) and returns the totals. */
export async function POST(request: Request) {
  if (!redis) return Response.json(null, { status: 503, headers: noStore });

  try {
    const ua = request.headers.get("user-agent") ?? "";
    if (!ua || BOT_UA.test(ua)) {
      return Response.json(await readStats(redis), { headers: noStore });
    }

    const id = await visitorId(request);
    const fresh = await redis.set(KEY.seen(id), 1, { nx: true, ex: SESSION_SECONDS });
    if (!fresh) {
      return Response.json(await readStats(redis), { headers: noStore });
    }

    const [views, , visitors] = await redis
      .pipeline()
      .incr(KEY.views)
      .pfadd(KEY.visitors, id)
      .pfcount(KEY.visitors)
      .exec<[number, number, number]>();

    return Response.json({ views, visitors } satisfies VisitStats, { headers: noStore });
  } catch {
    return Response.json(null, { status: 503, headers: noStore });
  }
}
