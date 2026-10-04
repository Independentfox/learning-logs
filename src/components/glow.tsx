/** Soft teal light behind the top of the page — the same glow as the OG card. */
export function Glow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[47.5rem] bg-[radial-gradient(48%_62%_at_82%_0%,var(--glow),transparent_78%)]"
    />
  );
}
