import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubtopicChecklist } from "@/components/subtopic-checklist";
import { getCategory } from "@/content/categories";
import { pageHref, pagesByName } from "@/content/subtopic-pages";
import { getGuide, guides, subtopicsOf } from "@/content/subtopics";
import { readSubtopics } from "@/lib/reading";
import { delay, rem } from "@/lib/utils";
import { getViewer } from "@/lib/viewer";

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
  const viewer = await getViewer();
  const published = pagesByName(guide);
  const read = viewer ? await readSubtopics(viewer.id) : null;

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
        <span className="eyebrow">{guide.subtopics.length} subtopics</span>
      </header>

      <section className="enter mt-10 max-w-[52rem]" style={delay(40)}>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-fg">{guide.topic}</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{guide.blurb}</p>
      </section>

      <section aria-label={`${guide.topic} subtopics`} className="enter mt-8" style={delay(80)}>
        <SubtopicChecklist
          topic={guide.topic}
          items={subtopicsOf(guide).map((item) => {
            const page = published.get(item.name);
            return page ? { ...item, href: pageHref(page) } : item;
          })}
          initialRead={read ? subtopicsOf(guide).flatMap(({ id }) => (read.has(id) ? [id] : [])) : []}
          signedIn={Boolean(viewer)}
          loginHref={`/login?next=${encodeURIComponent(`/learning/${slug}/${topic}`)}`}
        />
      </section>
    </>
  );
}
