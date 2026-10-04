"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theming");
    const dark = !root.classList.contains("dark");
    root.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
    window.setTimeout(() => root.classList.remove("theming"), 400);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      className="grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-card hover:text-fg"
    >
      {/* Both icons render on the server; CSS picks one, so there's no hydration flicker. */}
      <Sun size={19} aria-hidden className="hidden dark:block" />
      <Moon size={19} aria-hidden className="block dark:hidden" />
    </button>
  );
}
