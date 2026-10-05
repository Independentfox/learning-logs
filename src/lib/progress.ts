import { redis } from "@/lib/redis";

export type Status = "attempted" | "solved";
export type QuestionStats = { solved: number; attempted: number };

const KEY = {
  // Sets of learner ids. Solving also counts as attempting.
  attempted: (question: string) => `q:${question}:attempted`,
  solved: (question: string) => `q:${question}:solved`,
  // One hash per learner: question id → status.
  mine: (userId: string) => `learner:${userId}:questions`,
};

/** "solved / attempted" for each question, counted across all learners. */
export async function questionStats(ids: string[]): Promise<Record<string, QuestionStats>> {
  if (!redis || ids.length === 0) return {};
  const pipe = redis.pipeline();
  for (const id of ids) pipe.scard(KEY.solved(id)).scard(KEY.attempted(id));
  const counts = await pipe.exec<number[]>();
  return Object.fromEntries(
    ids.map((id, i) => [id, { solved: counts[2 * i], attempted: counts[2 * i + 1] }]),
  );
}

/** This learner's status on each question they've touched. */
export async function myStatuses(userId: string, ids: string[]): Promise<Record<string, Status>> {
  if (!redis || ids.length === 0) return {};
  const values = await redis.hmget<Record<string, Status>>(KEY.mine(userId), ...ids);
  return Object.fromEntries(Object.entries(values ?? {}).filter(([, status]) => status));
}

export async function setStatus(userId: string, question: string, status: Status | null) {
  if (!redis) return;
  const pipe = redis.pipeline();
  if (status === null) {
    pipe
      .hdel(KEY.mine(userId), question)
      .srem(KEY.attempted(question), userId)
      .srem(KEY.solved(question), userId);
  } else {
    pipe.hset(KEY.mine(userId), { [question]: status }).sadd(KEY.attempted(question), userId);
    if (status === "solved") pipe.sadd(KEY.solved(question), userId);
    else pipe.srem(KEY.solved(question), userId);
  }
  await pipe.exec();
}

/** Running code for a question counts as attempting it — but never downgrades a solve. */
export async function markAttempted(userId: string, question: string) {
  if (!redis) return;
  const current = await redis.hget<Status>(KEY.mine(userId), question);
  if (!current) await setStatus(userId, question, "attempted");
}
