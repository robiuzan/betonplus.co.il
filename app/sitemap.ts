import type { MetadataRoute } from "next";
import { getSite } from "@/lib/content";

export const dynamic = "force-static";

// Static /sitemap.xml listing every real page by its absolute URL. The source site has no
// canonical tags, so the URL falls back to the captured og:url and then to origin + path.
// Excludes WordPress default cruft (sample-page, hello-world), the price-calculator `step`
// pages, and the `pages_automation` utility pages.
export default function sitemap(): MetadataRoute.Sitemap {
  const { wpUrl, pages } = getSite();
  const base = wpUrl.replace(/\/+$/, "");
  const excluded = (path: string) =>
    path.startsWith("/step/") ||
    path.startsWith("/pages_automation/") ||
    path === "/sample-page/" ||
    path.includes("/hello-world/");

  return pages
    .filter((p) => !excluded(p.path))
    .map((p) => {
      const url = p.seo?.canonical || p.seo?.ogUrl || `${base}${p.path}`;
      const isContent = p.path.startsWith("/services/") || p.path.startsWith("/locations/");
      return {
        url,
        changeFrequency: (p.isFront ? "weekly" : "monthly") as "weekly" | "monthly",
        priority: p.isFront ? 1 : isContent ? 0.8 : 0.6,
      };
    });
}
