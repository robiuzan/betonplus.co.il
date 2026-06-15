import type { MetadataRoute } from "next";
import { site, services } from "@/lib/site";

export const dynamic = "force-static";

// Static /sitemap.xml for the designed site — lists every real route by absolute URL.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticPaths = [
    "/",
    "/services/",
    "/pricing/",
    "/service-areas/",
    "/about/",
    "/reviews/",
    "/faq/",
    "/contact/",
    "/privacy/",
    "/accessibility/",
  ];
  const servicePaths = services.map((s) => `/services/${s.slug}/`);

  return [...staticPaths, ...servicePaths].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "/" ? 1 : path.startsWith("/services/") ? 0.8 : 0.6,
  }));
}
