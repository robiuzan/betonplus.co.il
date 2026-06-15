/**
 * SEO helpers for the designed site: a per-page Metadata builder (canonical/OG/Twitter)
 * and typed JSON-LD structured-data builders (LocalBusiness, Service, FAQPage, Breadcrumb).
 */
import type { Metadata } from "next";
import { site, services, faqs } from "@/lib/site";

const absolute = (path: string): string =>
  `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

// Build-time-generated share image (app/opengraph-image.tsx). Referenced explicitly so every
// page — not just the root — emits a single, deterministic og:image / twitter:image.
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "בטון פלוס — ניסור בטון וקידוח יהלום",
};

interface PageMetaInput {
  title: string;
  description: string;
  /** Route path with trailing slash, e.g. "/services/". Home is "/". */
  path: string;
  /** Set true on the home page to use the title verbatim (no template suffix). */
  absoluteTitle?: boolean;
}

/** Build a Next.js Metadata object with canonical + Open Graph + Twitter for a page. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
}: PageMetaInput): Metadata {
  const url = absolute(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

type JsonLd = Record<string, unknown>;

/** Site-wide LocalBusiness schema (rendered in the root layout). */
export function localBusinessJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.shortPitch,
    url: site.url,
    telephone: site.phoneTel,
    email: site.email,
    foundingDate: String(site.foundedYear),
    image: `${site.url}/brand/betonplus-logo.svg`,
    logo: `${site.url}/brand/betonplus-mark.svg`,
    priceRange: "₪₪",
    areaServed: { "@type": "AdministrativeArea", name: "גוש דן והמרכז, ישראל" },
    address: { "@type": "PostalAddress", addressCountry: "IL", addressRegion: "מרכז" }, // 🔶 add street/city/postal when confirmed
    // 🔶 hours assumed (mirror site.hours) — confirm
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "07:00",
        closes: "18:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "07:00", closes: "13:00" },
    ],
    knowsLanguage: "he",
    sameAs: [], // 🔶 add Google Business Profile / social URLs when available
  };
}

/** Service schema for a single service page. */
export function serviceJsonLd(slug: string): JsonLd | null {
  const svc = services.find((s) => s.slug === slug);
  if (!svc) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    serviceType: svc.title,
    description: svc.description,
    url: `${site.url}/services/${svc.slug}/`,
    provider: { "@type": "GeneralContractor", "@id": `${site.url}/#business` },
    areaServed: { "@type": "AdministrativeArea", name: "גוש דן והמרכז, ישראל" },
  };
}

/** FAQPage schema from a list of Q/A pairs (defaults to the global FAQ list). */
export function faqJsonLd(items: { q: string; a: string }[] = faqs): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList schema. Pass [{name, path}] from home to the current page. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}
