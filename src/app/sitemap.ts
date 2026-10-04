import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";
import { logs } from "@/content/logs";
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
    ...logs.map((log) => ({
      url: `${siteUrl}/day/${log.day}`,
      lastModified: log.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
