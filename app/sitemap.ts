import type { MetadataRoute } from "next";
import { site, services, staticRoutes, routeUpdated } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /sitemap.xml — derived, never hand-maintained here. Static routes come from
 * `staticRoutes` in lib/site.ts (the single list new pages register in) and service
 * URLs from `services`. `/thank-you/` is noindex and deliberately excluded there.
 *
 * `lastModified` comes from `routeUpdated` — real content dates, not build time. A
 * route with no entry omits the field rather than claiming a date we don't have.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const servicePaths = services.map((s) => `/services/${s.slug}/`);

  return [...staticRoutes, ...servicePaths].map((path) => {
    const updated = routeUpdated[path];
    return {
      url: `${base}${path}`,
      ...(updated ? { lastModified: new Date(`${updated}T00:00:00Z`) } : {}),
      changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.6,
    };
  });
}
