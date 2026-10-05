"use client";

import { LoaderCircle, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { languages, type LanguageId, type RunResult } from "@/lib/languages";
import { cn, rem } from "@/lib/utils";

const clear = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-card/60",
        className,
      )}
    >
      <h2 className="border-b border-line px-4 py-2.5 font-mono text-xs tracking-[0.12em] text-subtle uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Output({
  result,
  error,
  running,
}: {
  result: RunResult | null;
  error: string | null;
  running: boolean;
}) {
  if (running) {
    return (
      <p className="flex items-center gap-2 p-4 text-sm text-muted">
        <LoaderCircle size={rem(15)} aria-hidden className="animate-spin" />
        Running…
      </p>
    );
  }
  if (error) return <p className="p-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>;
  if (!result) return <p className="p-4 text-sm text-subtle">Run your code to see its output here.</p>;

  const details = [
    result.time !== null && `${result.time.toFixed(2)} s`,
    result.memory !== null && `${(result.memory / 1024).toFixed(1)} MB`,
  ].filter(Boolean);

  return (
    <div className="min-h-0 space-y-3 overflow-auto p-4">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span
          className={cn(
            "inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium",
            result.ok
              ? "border-emerald-600/25 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
              : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
          )}
        >
          {result.ok ? "Ran successfully" : result.status}
        </span>
        {details.length > 0 && <span className="text-xs text-subtle">{details.join(" · ")}</span>}
      </p>
      {result.compileOutput && (
        <pre className="overflow-x-auto font-mono text-[0.8125rem] whitespace-pre-wrap text-rose-700 dark:text-rose-400">
          {result.compileOutput}
        </pre>
      )}
      <pre className="overflow-x-auto font-mono text-[0.8125rem] whitespace-pre-wrap text-fg">
        {result.stdout || <span className="text-subtle">(no output)</span>}
      </pre>
      {result.stderr && (
        <pre className="overflow-x-auto font-mono text-[0.8125rem] whitespace-pre-wrap text-amber-700 dark:text-amber-400">
          {result.stderr}
        </pre>
      )}
    </div>
  );
}

/**
 * Editor + custom input + output. Code runs on the Judge0 server via /api/run;
 * drafts stay in this browser, one per question and language.
 */
export function Playground({
  questionId,
  signedIn,
  runnerEnabled,
  loginHref,
}: {
  questionId?: string;
  signedIn: boolean;
  runnerEnabled: boolean;
  loginHref: string;
}) {
  const [language, setLanguage] = useState<LanguageId>("cpp");
  const [resets, setResets] = useState(0);
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const docRef = useRef("");

  const storageKey = `ll:code:${questionId ?? "scratch"}:${language}`;
  const canRun = signedIn && runnerEnabled && !running;

  const run = useCallback(async () => {
    if (!signedIn || !runnerEnabled || running) return;
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, source: docRef.current, stdin, questionId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(null);
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data as RunResult);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setRunning(false);
    }
  }, [signedIn, runnerEnabled, running, language, stdin, questionId]);

  const reset = () => {
    if (!window.confirm("Replace your code with the starter template?")) return;
    clear(storageKey);
    setResets((n) => n + 1);
  };

  return (
    <div className="grid gap-4 lg:h-[36rem] lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
      <section className="flex h-[28rem] min-h-0 flex-col overflow-hidden rounded-2xl border border-line bg-card/60 lg:h-auto">
        <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
          <div className="flex items-center gap-2">
            <label htmlFor="language" className="sr-only">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageId)}
              className="h-8 rounded-lg border border-line bg-canvas px-2 text-sm text-fg"
            >
              {(Object.keys(languages) as LanguageId[]).map((id) => (
                <option key={id} value={id}>
                  {languages[id].label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={reset}
              title="Reset to the starter template"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs text-subtle transition-colors hover:text-fg"
            >
              <RotateCcw size={rem(13)} aria-hidden />
              Reset
            </button>
          </div>

          {signedIn ? (
            <button
              type="button"
              onClick={run}
              disabled={!canRun}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-[filter,opacity] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {running ? (
                <LoaderCircle size={rem(15)} aria-hidden className="animate-spin" />
              ) : (
                <Play size={rem(15)} aria-hidden />
              )}
              Run
              <kbd className="hidden font-mono text-[0.6875rem] opacity-70 sm:inline">⌘↵</kbd>
            </button>
          ) : (
            <Link
              href={loginHref}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-[filter] hover:brightness-110"
            >
              Sign in to run
            </Link>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <CodeEditor
            key={`${storageKey}:${resets}`}
            language={language}
            storageKey={storageKey}
            starter={languages[language].starter}
            docRef={docRef}
            onRun={run}
          />
        </div>
        {!runnerEnabled && (
          <p className="border-t border-line px-4 py-2 text-xs text-subtle">
            The compiler is being set up — you can write code now and run it soon.
          </p>
        )}
      </section>

      <div className="grid min-h-0 gap-4 lg:grid-rows-[auto_minmax(0,1fr)]">
        <Panel title="Input">
          <label htmlFor="stdin" className="sr-only">
            Input
          </label>
          <textarea
            id="stdin"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            spellCheck={false}
            placeholder="Custom input (stdin)"
            className="h-36 w-full resize-none bg-transparent p-4 font-mono text-[0.8125rem] text-fg outline-none placeholder:text-subtle"
          />
        </Panel>
        <Panel title="Output" className="min-h-[12rem]">
          <Output result={result} error={error} running={running} />
        </Panel>
      </div>
    </div>
  );
}
