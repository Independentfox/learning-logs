/**
 * Canonical origin for metadata, sitemap and OG images.
 *
 * Order of precedence:
 *   1. NEXT_PUBLIC_SITE_URL — set this once a custom domain is live
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected automatically on Vercel
 *   3. localhost for development
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
