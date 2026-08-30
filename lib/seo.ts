/**
 * SEO helpers for the designed site: a per-page Metadata builder (canonical/OG/Twitter)
 * and typed JSON-LD structured-data builders (LocalBusiness, Service, FAQPage, Breadcrumb).
 */
import type { Metadata } from "next";
import * as kit from "@ishub/site-kit/seo";
import { site, services, faqs, manifest, owner } from "@/lib/site";

const absolute = (path: string): string => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

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
export function pageMetadata({ title, description, path, absoluteTitle }: PageMetaInput): Metadata {
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

/**
 * Site-wide WebSite node (homepage only). Hand-assembled deliberately —
 * @ishub/site-kit/seo has no builder for it. `publisher` points at the business
 * node's kit-emitted `@id` (`${url}/#business`); keep the two in sync.
 */
export function webSiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    inLanguage: "he-IL",
    publisher: { "@id": `${site.url}/#business` },
  };
}

/** Site-wide LocalBusiness schema (rendered in the root layout). */
export function localBusinessJsonLd(): JsonLd {
  return kit.localBusinessJsonLd(manifest, {
    image: "/brand/betonplus-logo.svg",
    logo: "/brand/betonplus-mark.svg",
  });
}

/**
 * The named owner as a `Person` node, linked to the business.
 *
 * Deliberately **not** `founder`: `foundedYear: 2005` is owner-asserted and unevidenced
 * (business-facts §A), so asserting he founded the business in that year would be a claim
 * nobody has made. `jobTitle` + `worksFor` says exactly what is confirmed and no more.
 */
export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#owner`,
    name: owner.name,
    jobTitle: owner.role.split(",")[0]?.trim() ?? owner.role,
    worksFor: { "@id": `${site.url}/#business` },
    url: absolute("/about/"),
  };
}

/** Service schema for a single service page. */
export function serviceJsonLd(slug: string): JsonLd | null {
  const svc = services.find((s) => s.slug === slug);
  if (!svc) return null;
  return kit.serviceJsonLd(manifest, {
    name: svc.title,
    description: svc.description,
    slug: svc.slug,
  });
}

/** FAQPage schema from a list of Q/A pairs (defaults to the global FAQ list). */
export function faqJsonLd(items: { q: string; a: string }[] = faqs): JsonLd {
  return kit.faqJsonLd(items);
}

/** BreadcrumbList schema. Pass [{name, path}] from home to the current page. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]): JsonLd {
  return kit.breadcrumbJsonLd(manifest, crumbs);
}

/**
 * Page-type nodes for the index and static routes (backlog §4.4). Hand-assembled —
 * the kit has no builders for these. Each is tied to the business node's kit-emitted
 * `@id` (`${url}/#business`) so nothing dangles, and `@id` follows the canonical.
 *
 * `isPartOf` points at the WebSite node, which only the homepage emits; that is a
 * valid cross-page reference and is how schema.org expects the graph to link up.
 */
function pageNode(type: string, path: string, name: string, description: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absolute(path)}#page`,
    url: absolute(path),
    name,
    description,
    inLanguage: "he-IL",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#business` },
  };
}

/** CollectionPage — for index routes that list children (`/services/`, `/service-areas/`). */
export function collectionPageJsonLd(path: string, name: string, description: string): JsonLd {
  return pageNode("CollectionPage", path, name, description);
}

/** AboutPage — `/about/`. */
export function aboutPageJsonLd(path: string, name: string, description: string): JsonLd {
  return pageNode("AboutPage", path, name, description);
}

/** ContactPage — `/contact/`. */
export function contactPageJsonLd(path: string, name: string, description: string): JsonLd {
  return pageNode("ContactPage", path, name, description);
}
