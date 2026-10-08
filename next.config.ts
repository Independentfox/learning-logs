import path from "node:path";
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Learner avatars from Google and GitHub sign-in.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  // Day notes are read from content/days at request time; ship them with every function.
  outputFileTracingIncludes: {
    "/*": ["./content/days/**/*", "./content/subtopics/**/index.md", "./content/subtopics/**/rendered.json"],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Tracks that were merged or removed, so old links still land somewhere useful.
  async redirects() {
    return [
      {
        source: "/learning/distributed-systems",
        destination: "/learning/system-design-hld",
        permanent: true,
      },
      { source: "/learning/system-internals", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
