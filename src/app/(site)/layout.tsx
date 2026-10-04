import type { ReactNode } from "react";
import { Glow } from "@/components/glow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn, shell } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const viewer = await getViewer();

  return (
    <div className="relative isolate">
      <Glow />
      <SiteHeader viewer={viewer} />
      <main id="main" className={cn(shell, "pt-10 pb-8 sm:pt-16 lg:pt-24")}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
