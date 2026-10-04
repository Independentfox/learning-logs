import { Redis } from "@upstash/redis";

// The Vercel × Upstash integration injects KV_REST_API_*; a store created
// directly on upstash.com hands out UPSTASH_REDIS_REST_*. Either works.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/** `null` until a store is connected — the visit counter hides itself. */
export const redis = url && token ? new Redis({ url, token }) : null;

export type VisitStats = { views: number; visitors: number };
