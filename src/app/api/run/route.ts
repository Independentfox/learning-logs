import { auth } from "@/auth";
import { questionsById } from "@/content/questions";
import { isLanguage } from "@/lib/languages";
import { markAttempted } from "@/lib/progress";
import { redis } from "@/lib/redis";
import { runCode, RunnerError, runnerEnabled } from "@/lib/runner";

const MAX_BYTES = 64 * 1024;

// Each learner gets 20 runs per 10 minutes; the whole site gets RUNNER_DAILY_LIMIT a day,
// so a free Judge0 plan can't be drained by one person (default sized for a 50/day plan).
const USER_LIMIT = 20;
const USER_WINDOW_SECONDS = 10 * 60;
const DAILY_LIMIT = Number(process.env.RUNNER_DAILY_LIMIT ?? 45);

const fail = (status: number, error: string) => Response.json({ error }, { status });

/** Allows the call and counts it, or says why not. */
async function withinLimits(userId: string): Promise<string | null> {
  if (!redis) return null;
  const userKey = `run:user:${userId}`;
  const dayKey = `run:day:${new Date().toISOString().slice(0, 10)}`;
  const [mine, , today] = await redis
    .pipeline()
    .incr(userKey)
    .expire(userKey, USER_WINDOW_SECONDS, "NX")
    .get<number>(dayKey)
    .exec<[number, number, number | null]>();
  if (mine > USER_LIMIT) return "That's a lot of runs — take a breather and try again in a few minutes.";
  if ((today ?? 0) >= DAILY_LIMIT) return "The compiler has hit today's limit. It resets at midnight UTC.";
  await redis
    .pipeline()
    .incr(dayKey)
    .expire(dayKey, 2 * 24 * 60 * 60)
    .exec();
  return null;
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return fail(401, "Sign in to run code.");
  if (!runnerEnabled) return fail(503, "The compiler isn't set up yet.");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail(400, "Bad request.");
  }

  const { language, source, stdin = "", questionId } = body;
  if (!isLanguage(language)) return fail(400, "Pick a language.");
  if (typeof source !== "string" || !source.trim()) return fail(400, "There's no code to run.");
  if (typeof stdin !== "string") return fail(400, "Bad input.");
  if (source.length > MAX_BYTES || stdin.length > MAX_BYTES)
    return fail(413, "Code and input are limited to 64 KB each.");

  const limited = await withinLimits(userId);
  if (limited) return fail(429, limited);

  try {
    const result = await runCode(language, source, stdin);
    if (typeof questionId === "string" && questionsById.has(questionId)) {
      await markAttempted(userId, questionId);
    }
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message =
      error instanceof RunnerError
        ? error.message
        : error instanceof Error && error.name === "TimeoutError"
          ? "The compiler took too long to answer. Try again."
          : "Couldn't reach the compiler. Try again.";
    return fail(502, message);
  }
}
