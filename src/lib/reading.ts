import { guidesIn, subtopicsOf, type TopicGuide } from "@/content/subtopics";
import { redis } from "@/lib/redis";

/** One learner's read subtopics: a set of subtopic ids. */
const key = (userId: string) => `learner:${userId}:read`;

export type Progress = { read: number; total: number };

export async function readSubtopics(userId: string): Promise<Set<string>> {
  if (!redis) return new Set();
  return new Set(await redis.smembers<string[]>(key(userId)));
}

export async function setRead(userId: string, subtopic: string, read: boolean) {
  if (!redis) return;
  if (read) await redis.sadd(key(userId), subtopic);
  else await redis.srem(key(userId), subtopic);
}

/** How many of a guide's subtopics are in `read`. */
export function guideProgress(guide: TopicGuide, read: Set<string>): Progress {
  const items = subtopicsOf(guide);
  return { read: items.filter(({ id }) => read.has(id)).length, total: items.length };
}

/** Progress across every guide in a category, or null if it has none. */
export function trackProgress(category: string, read: Set<string>): Progress | null {
  const all = guidesIn(category).map((guide) => guideProgress(guide, read));
  if (all.length === 0) return null;
  return all.reduce((sum, p) => ({ read: sum.read + p.read, total: sum.total + p.total }), {
    read: 0,
    total: 0,
  });
}
