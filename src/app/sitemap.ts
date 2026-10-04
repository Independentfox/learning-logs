import type { MetadataRoute } from "next";
import { categories } from "@/content/categories";
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
  ];
}
