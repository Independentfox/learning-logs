import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto grid min-h-dvh w-full max-w-[47.5rem] content-center px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.035em] text-fg">
        No log <span className="font-serif font-normal text-link italic">here</span>.
      </h1>
      <p className="mt-4 text-muted">This day hasn&apos;t been written yet, or the page moved.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 w-fit items-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg"
      >
        Back to the logs
      </Link>
    </main>
  );
}
