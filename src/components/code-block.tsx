"use client";

import {
  Check,
  Copy,
  FileCode2,
  LoaderCircle,
  PencilLine,
  Play,
  RotateCcw,
  SquareTerminal,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { RunOutput } from "@/components/playground";
import type { LanguageId, RunResult } from "@/lib/languages";
import { cn, rem } from "@/lib/utils";

export type RunnerState = {
  /** The compiler is configured on the server. */
  enabled: boolean;
  signedIn: boolean;
  loginHref: string;
};

const action =
  "inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-[var(--panel-muted)] transition-colors hover:bg-white/5 hover:text-[var(--panel-fg)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent";

/**
 * A code sample in a VS Code-style panel: file tab, line numbers, syntax colours, Copy and
 * Edit. Runnable samples (`language` set) also get Run and Input once a compiler is configured,
 * compiling and running the code as it currently stands — edits included — through /api/run.
 */
export function CodeBlock({
  code,
  html,
  title,
  language,
  runner,
}: {
  code: string;
  /** `code` already syntax-highlighted on the server. */
  html: string;
  title: string;
  /** Set when the sample is a whole program that can be run. */
  language?: LanguageId;
  runner: RunnerState;
}) {
  const docRef = useRef(code);
  const [editing, setEditing] = useState(false);
  const [resets, setResets] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [stdin, setStdin] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lines = code.split("\n").length;
  // Without a compiler a program is copy-and-edit like any other sample: no Run, no Input.
  const runnable = Boolean(language) && runner.enabled;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(editing ? docRef.current : code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const reset = () => {
    docRef.current = code;
    setResets((n) => n + 1);
  };

  const run = async () => {
    if (!language || !runner.enabled || !runner.signedIn || running) return;
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, source: editing ? docRef.current : code, stdin }),
      });
      const data = await res.json();
      if (res.ok) setResult(data as RunResult);
      else {
        setResult(null);
        setError(data.error ?? "Something went wrong.");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <figure className="code-panel not-prose my-7 overflow-hidden rounded-xl border border-[var(--panel-line)] bg-[var(--panel-bg)] text-[var(--panel-fg)] shadow-[0_12px_32px_-18px_rgb(0_0_0/0.6)]">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--panel-line)] bg-[var(--panel-bar)] pr-2">
        <span className="inline-flex h-10 items-center gap-2 border-t-2 border-t-[var(--panel-accent)] bg-[var(--panel-bg)] px-4 font-mono text-xs">
          <FileCode2 size={rem(14)} aria-hidden className="text-[var(--panel-accent)]" />
          {title}
        </span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={copy} className={action} aria-label="Copy code">
            {copied ? <Check size={rem(13)} aria-hidden /> : <Copy size={rem(13)} aria-hidden />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
          {editing ? (
            <button type="button" onClick={reset} className={action} aria-label="Reset to the original code">
              <RotateCcw size={rem(13)} aria-hidden />
              <span className="hidden sm:inline">Reset</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={action}
              aria-label="Edit this code"
            >
              <PencilLine size={rem(13)} aria-hidden />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
          {runnable && (
            <>
              <button
                type="button"
                onClick={() => setShowInput((v) => !v)}
                aria-pressed={showInput}
                className={cn(action, showInput && "bg-white/5 text-[var(--panel-fg)]")}
                aria-label="Program input"
              >
                <SquareTerminal size={rem(13)} aria-hidden />
                <span className="hidden sm:inline">Input</span>
              </button>
              {!runner.signedIn ? (
                <Link
                  href={runner.loginHref}
                  className="ml-1 inline-flex h-7 items-center gap-1.5 rounded-md bg-[var(--panel-accent)] px-2.5 text-xs font-semibold text-[#06201c] transition-[filter] hover:brightness-110"
                >
                  <Play size={rem(12)} aria-hidden />
                  Sign in to run
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={run}
                  disabled={running}
                  title="Compile and run"
                  className="ml-1 inline-flex h-7 items-center gap-1.5 rounded-md bg-[var(--panel-accent)] px-2.5 text-xs font-semibold text-[#06201c] transition-[filter,opacity] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:brightness-100"
                >
                  {running ? (
                    <LoaderCircle size={rem(12)} aria-hidden className="animate-spin" />
                  ) : (
                    <Play size={rem(12)} aria-hidden />
                  )}
                  Run
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div
          className="code-panel-editor"
          style={{ height: `calc(${Math.min(Math.max(lines + 1, 6), 32)} * 1.65 * 0.9375rem + 1.5rem)` }}
        >
          <CodeEditor
            key={resets}
            language={language ?? "cpp"}
            storageKey={null}
            starter={code}
            docRef={docRef}
            onRun={run}
          />
        </div>
      ) : (
        <div className="flex overflow-x-auto py-3.5 font-mono text-[0.9375rem] leading-[1.65]">
          <span
            aria-hidden
            className="sticky left-0 shrink-0 bg-[var(--panel-bg)] pr-4 pl-4 text-right text-[var(--panel-gutter)] select-none"
          >
            {Array.from({ length: lines }, (_, i) => (
              <span key={i} className="block">
                {i + 1}
              </span>
            ))}
          </span>
          <pre className="m-0 min-w-0 flex-1 pr-6">
            <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
          </pre>
        </div>
      )}

      {runnable && showInput && (
        <div className="border-t border-[var(--panel-line)]">
          <label className="block px-4 pt-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--panel-muted)] uppercase">
            Input
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              spellCheck={false}
              rows={3}
              placeholder="What the program reads from std::cin"
              className="mt-1.5 block w-full resize-y bg-transparent pb-2.5 font-mono text-[0.8125rem] tracking-normal text-[var(--panel-fg)] normal-case outline-none placeholder:text-[var(--panel-gutter)]"
            />
          </label>
        </div>
      )}

      {runnable && (running || result || error) && (
        <div className="border-t border-[var(--panel-line)] bg-[var(--panel-bar)]">
          <p className="px-4 pt-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--panel-muted)] uppercase">
            Output
          </p>
          <RunOutput result={result} error={error} running={running} />
        </div>
      )}
    </figure>
  );
}

/** A program's expected output, as a terminal-style panel. */
export function OutputBlock({ text, title }: { text: string; title: string }) {
  return (
    <figure className="code-panel not-prose -mt-4 mb-7 overflow-hidden rounded-xl border border-[var(--panel-line)] bg-[var(--panel-term)] text-[var(--panel-fg)]">
      <figcaption className="flex h-9 items-center gap-2 border-b border-[var(--panel-line)] px-4 font-mono text-[0.6875rem] tracking-[0.12em] text-[var(--panel-muted)] uppercase">
        <SquareTerminal size={rem(13)} aria-hidden />
        {title}
      </figcaption>
      <pre className="m-0 overflow-x-auto px-4 py-3 font-mono text-[0.875rem] leading-[1.65] whitespace-pre">
        {text}
      </pre>
    </figure>
  );
}
