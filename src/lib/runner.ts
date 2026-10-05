import { languages, type LanguageId, type RunResult } from "@/lib/languages";

/**
 * Runs code on a Judge0 server — never on Vercel itself. JUDGE0_URL points at either
 * Judge0 on RapidAPI (https://judge0-ce.p.rapidapi.com) or a self-hosted Judge0;
 * JUDGE0_KEY is the RapidAPI key or the self-hosted auth token.
 */
const url = process.env.JUDGE0_URL?.replace(/\/+$/, "");
const key = process.env.JUDGE0_KEY;

export const runnerEnabled = Boolean(url);

function headers(): Record<string, string> {
  const base = { "Content-Type": "application/json" };
  if (!url || !key) return base;
  const host = new URL(url).host;
  return host.endsWith("rapidapi.com")
    ? { ...base, "X-RapidAPI-Key": key, "X-RapidAPI-Host": host }
    : { ...base, "X-Auth-Token": key };
}

const encode = (text: string) => Buffer.from(text, "utf8").toString("base64");
const decode = (text: string | null | undefined) =>
  text ? Buffer.from(text, "base64").toString("utf8") : "";

type Judge0Response = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: { id: number; description: string };
  time: string | null;
  memory: number | null;
};

export class RunnerError extends Error {}

export async function runCode(language: LanguageId, source: string, stdin: string): Promise<RunResult> {
  if (!url) throw new RunnerError("The compiler isn't set up yet.");
  const lang = languages[language];

  const res = await fetch(
    `${url}/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,compile_output,message,status,time,memory`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        language_id: lang.judge0,
        source_code: encode(source),
        stdin: encode(stdin),
        compiler_options: lang.compilerOptions,
        cpu_time_limit: 2,
        wall_time_limit: 5,
        memory_limit: 256_000,
      }),
      signal: AbortSignal.timeout(25_000),
      cache: "no-store",
    },
  );

  if (res.status === 429) throw new RunnerError("The compiler is busy right now — try again in a minute.");
  if (!res.ok) throw new RunnerError(`The compiler returned an error (${res.status}).`);

  const data = (await res.json()) as Judge0Response;
  return {
    status: data.status.description,
    // 3 = ran to completion. (Judge0 calls it "Accepted"; there's no expected output to compare against.)
    ok: data.status.id === 3,
    stdout: decode(data.stdout),
    stderr: decode(data.stderr) || decode(data.message),
    compileOutput: decode(data.compile_output),
    time: data.time ? Number(data.time) : null,
    memory: data.memory,
  };
}
