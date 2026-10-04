import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { cn, shell } from "@/lib/utils";

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 transition-colors hover:text-fg"
    >
      {children}
      <ArrowUpRight size={13} aria-hidden />
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className={cn(shell, "pt-16 pb-10")}>
      <div className="flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          Written by{" "}
          <a href={site.links.portfolio} target="_blank" rel="noopener noreferrer" className="inline-link">
            {site.author}
          </a>
          , one log at a time.
        </p>
        <nav aria-label="Elsewhere" className="flex gap-5">
          <FooterLink href={site.links.portfolio}>Portfolio</FooterLink>
          <FooterLink href={site.links.linkedin}>LinkedIn</FooterLink>
          <FooterLink href={site.links.github}>GitHub</FooterLink>
        </nav>
      </div>
    </footer>
  );
}
