import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DayLink } from "@/components/day-link";
import { getCategory } from "@/content/categories";
import { logsIn } from "@/content/logs";
import { getGuide, guides } from "@/content/subtopics";
import { delay, rem } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map(({ category, slug }) => ({ slug: category, topic: slug }));
}

export async function generateMetadata({ params }: PageProps<"/learning/[slug]/[topic]">): Promise<Metadata> {
  const { slug, topic } = await params;
  const guide = getGuide(slug, topic);
  const category = getCategory(slug);
  if (!guide || !category) return {};
  return {
    title: `${guide.topic} · ${category.name}`,
    description: guide.blurb,
    alternates: { canonical: `/learning/${slug}/${topic}` },
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function TopicPage({ params }: PageProps<"/learning/[slug]/[topic]">) {
  const { slug, topic } = await params;
  const guide = getGuide(slug, topic);
  const category = getCategory(slug);
  if (!guide || !category) notFound();

  const { Icon } = category;
  const number = pad(category.topics.indexOf(guide.topic) + 1);
  const days = logsIn(category.slug).filter((log) => log.topic === guide.topic);

  return (
    <>
      <header className="enter flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-center gap-2.5 text-sm">
          <Link
            href={`/learning/${category.slug}`}
            className="inline-flex min-w-0 items-center gap-2 text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={rem(15)} aria-hidden className="shrink-0" />
            <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-tint-line bg-tint text-link">
              <Icon size={rem(15)} aria-hidden />
            </span>
            <span className="truncate">{category.name}</span>
          </Link>
          <span aria-hidden className="text-subtle">
            /
          </span>
          <span className="shrink-0 font-semibold text-fg">Topic {number}</span>
        </div>
        <span className="eyebrow">
          {guide.subtopics.length} subtopics · {days.length} {days.length === 1 ? "log" : "logs"}
        </span>
      </header>

      <section className="enter mt-10 max-w-[52rem]" style={delay(40)}>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-fg">{guide.topic}</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{guide.blurb}</p>
      </section>

      <section aria-label={`${guide.topic} subtopics`} className="enter mt-8" style={delay(80)}>
        {/* A grid, not columns, so every block is the same width and height. */}
        <ol className="grid auto-rows-fr gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {guide.subtopics.map((subtopic, i) => (
            <li
              key={subtopic}
              className="flex items-baseline gap-3 rounded-2xl border border-line bg-card px-6 py-5"
            >
              <span className="font-mono text-sm text-subtle">{pad(i + 1)}</span>
              <h2 className="min-w-0 flex-1 text-lg font-medium text-fg lg:text-xl">{subtopic}</h2>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="days-title" className="enter mt-12 max-w-[52rem]" style={delay(120)}>
        <h2 id="days-title" className="eyebrow">
          Days on this topic
        </h2>
        {days.length > 0 ? (
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {days.map((log) => (
              <DayLink key={log.day} log={log} />
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-line px-5 py-4 text-sm text-muted">
            No days logged yet. They&apos;ll show up here as we work through these subtopics.
          </p>
        )}
      </section>
    </>
  );
}
