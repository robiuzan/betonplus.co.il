import type { MetadataRoute } from "next";
import { site, services, staticRoutes } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /sitemap.xml — derived, never hand-maintained here. Static routes come from
 * `staticRoutes` in lib/site.ts (the single list new pages register in) and service
 * URLs from `services`. `/thank-you/` is noindex and deliberately excluded there.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const servicePaths = services.map((s) => `/services/${s.slug}/`);

  return [...staticRoutes, ...servicePaths].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.6,
  }));
}
