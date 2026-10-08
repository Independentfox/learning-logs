import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";
import { logs } from "@/content/logs";
import { pageHref, subtopicPages } from "@/content/subtopic-pages";
import { guides } from "@/content/subtopics";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/building`, changeFrequency: "weekly", priority: 0.8 },
    ...categories.map(({ slug }) => ({
      url: `${siteUrl}/learning/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...guides.map(({ category, slug }) => ({
      url: `${siteUrl}/learning/${category}/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
    ...subtopicPages.map((page) => ({
      url: `${siteUrl}${pageHref(page)}`,
      lastModified: page.published,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...logs.map((log) => ({
      url: `${siteUrl}/day/${log.day}`,
      lastModified: log.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
