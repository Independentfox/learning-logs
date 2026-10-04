import { redis } from "@/lib/redis";

const KEY = {
  // Set of user ids — its size is the "learners" count.
  all: "learners",
  // Hands out learner numbers: #1, #2, …
  seq: "learners:seq",
  learner: (userId: string) => `learner:${userId}`,
  // User ids who want an email for each new log.
  subscribers: "subscribers",
};

export type Learner = { number: number; joinedAt: string; emailUpdates: boolean };

export async function getLearner(userId: string): Promise<Learner | null> {
  if (!redis) return null;
  const data = await redis.hgetall<Record<string, unknown>>(KEY.learner(userId));
  if (!data?.number) return null;
  return {
    number: Number(data.number),
    joinedAt: String(data.joinedAt ?? ""),
    emailUpdates: Number(data.emailUpdates) === 1,
  };
}

/** Gives a new user the next learner number. Safe to call again for an existing learner. */
export async function ensureLearner(userId: string): Promise<Learner | null> {
  if (!redis) return null;
  const existing = await getLearner(userId);
  if (existing) return existing;

  const number = await redis.incr(KEY.seq);
  const claimed = await redis.hsetnx(KEY.learner(userId), "number", number);
  if (claimed) {
    await redis
      .pipeline()
      .hset(KEY.learner(userId), { joinedAt: new Date().toISOString(), emailUpdates: 0 })
      .sadd(KEY.all, userId)
      .exec();
  }
  return getLearner(userId);
}

export async function setEmailUpdates(userId: string, on: boolean) {
  if (!redis) return;
  const pipe = redis.pipeline().hset(KEY.learner(userId), { emailUpdates: on ? 1 : 0 });
  if (on) pipe.sadd(KEY.subscribers, userId);
  else pipe.srem(KEY.subscribers, userId);
  await pipe.exec();
}

export async function learnerCount(): Promise<number> {
  return redis ? redis.scard(KEY.all) : 0;
}
