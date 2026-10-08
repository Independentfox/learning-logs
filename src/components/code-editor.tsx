"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { LanguageId } from "@/lib/languages";

/** CodeMirror language support, loaded only for the language in use. */
async function languageSupport(language: LanguageId) {
  if (language === "cpp") return (await import("@codemirror/lang-cpp")).cpp();
  if (language === "python") return (await import("@codemirror/lang-python")).python();
  return (await import("@codemirror/lang-java")).java();
}

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
};

/**
 * A CodeMirror editor that keeps a draft in this browser under `storageKey`.
 * The current code is mirrored into `docRef`; ⌘/Ctrl+Enter calls `onRun`.
 * Remount it (change its `key`) to switch language or reset. Pass `storageKey={null}`
 * to start from `starter` every time without saving a draft.
 */
export function CodeEditor({
  language,
  storageKey,
  starter,
  docRef,
  onRun,
}: {
  language: LanguageId;
  storageKey: string | null;
  starter: string;
  docRef: RefObject<string>;
  onRun: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const onRunRef = useRef(onRun);

  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  useEffect(() => {
    let cancelled = false;
    let destroy = () => {};

    (async () => {
      const [
        { basicSetup },
        { EditorView, keymap },
        { EditorState, Prec },
        { indentUnit, syntaxHighlighting },
        { classHighlighter },
        lang,
      ] = await Promise.all([
        import("codemirror"),
        import("@codemirror/view"),
        import("@codemirror/state"),
        import("@codemirror/language"),
        import("@lezer/highlight"),
        languageSupport(language),
      ]);
      if (cancelled || !host.current) return;

      const doc = (storageKey && read(storageKey)) || starter;
      docRef.current = doc;

      const view = new EditorView({
        parent: host.current,
        state: EditorState.create({
          doc,
          extensions: [
            Prec.highest(keymap.of([{ key: "Mod-Enter", run: () => (onRunRef.current(), true) }])),
            basicSetup,
            lang,
            indentUnit.of("    "),
            EditorState.tabSize.of(4),
            syntaxHighlighting(classHighlighter),
            EditorView.updateListener.of((update) => {
              if (!update.docChanged) return;
              const text = update.state.doc.toString();
              docRef.current = text;
              if (storageKey) write(storageKey, text);
            }),
            EditorView.theme({
              "&": {
                height: "100%",
                fontSize: "0.875rem",
                color: "var(--fg)",
                backgroundColor: "transparent",
              },
              "&.cm-focused": { outline: "none" },
              ".cm-scroller": { fontFamily: "var(--font-mono)", lineHeight: "1.65" },
              ".cm-content": { caretColor: "var(--link)", padding: "0.75rem 0" },
              ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--link)" },
              ".cm-gutters": { backgroundColor: "transparent", color: "var(--subtle)", border: "none" },
              ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--fg) 4%, transparent)" },
              ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--fg)" },
              "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
                backgroundColor: "rgb(42 157 143 / 0.3)",
              },
              ".cm-matchingBracket": { backgroundColor: "rgb(42 157 143 / 0.25)", outline: "none" },
              ".cm-tooltip": {
                backgroundColor: "var(--canvas)",
                border: "1px solid var(--line-strong)",
                borderRadius: "0.5rem",
              },
            }),
          ],
        }),
      });
      destroy = () => view.destroy();
    })();

    return () => {
      cancelled = true;
      destroy();
    };
  }, [language, storageKey, starter, docRef]);

  return <div ref={host} className="h-full min-h-0" />;
}
