---
name: seo-metadata
description: SEO and metadata for betonplus — generateMetadata via buildMetadata, canonical/OG/Twitter, sitemap.ts/robots.ts, JSON-LD (Breadcrumb/Service/HowTo/FAQ/LocalBusiness), and identical-to-WP titles/descriptions and heading hierarchy. Use when auditing or changing anything search engines read.
---

# SEO & metadata

The Primary Directive applies to SEO too: **titles, descriptions, canonicals, and URLs must match the live
WordPress source** (`/migration-fidelity`). The enrichment layer may *add* schema-bearing sections, but must
not contradict the captured `<head>`.

## Where metadata comes from
- Per page: `generateMetadata()` in [app/page.tsx](app/page.tsx) and
  [app/[...slug]/page.tsx](app/[...slug]/page.tsx) calls **`buildMetadata(page.seo)`** from
  [lib/content.ts](lib/content.ts), which maps `SeoData` → Next's `Metadata`:
  - `title` → `{ absolute: title }` (no template suffix — exact match)
  - `description`, `canonical` → `alternates.canonical`
  - `og:*` → `openGraph`, `twitter:*` → `twitter`
  - entities decoded with `he.decode()`
- `SeoData` is populated by the scraper from the live `<head>` (`/migration-fidelity`).
- Root [app/layout.tsx](app/layout.tsx) sets `metadataBase` and icons only.

⚠️ **Note:** `buildMetadata` currently forces `robots: { index: true, follow: true }`, overriding any WP
`noindex`. That's deliberate for production launch — but if the live source intentionally noindexes a page,
flag it rather than silently diverging.

## Canonicals & URLs
- One canonical per URL, equal to the WP permalink (`trailingSlash`, Hebrew slug). Never change a slug
  (`/migration-fidelity`).
- Sitemap [app/sitemap.ts](app/sitemap.ts) excludes `/step/`, `/pages_automation/`, `sample-page`,
  `hello-world`; uses `seo.canonical || seo.ogUrl || base+path`; front page priority 1 / weekly,
  services & locations 0.8 / monthly, others 0.6.
- [app/robots.ts](app/robots.ts) allows `/` and points at `https://betonplus.co.il/sitemap.xml`.

## Structured data (JSON-LD)
- Emitted as `page.jsonLd` strings by [scripts/enrich.mjs](scripts/enrich.mjs) and rendered in
  [components/SiteFrame.tsx](components/SiteFrame.tsx):
  - **BreadcrumbList** (all enriched pages), **Service** (service/brand-key/location, with `areaServed`),
    **HowTo** (if `process`), **FAQPage** (if `faq.items`), **LocalBusiness** (homepage `#LocalBusiness`).
- Don't hand-write duplicate schema — author the data (`/content-enrichment`) and let `enrich.mjs` emit it.
- Validate with Google's Rich Results Test; one entity per type per page.

## On-page
- **Single H1**, logical H2/H3 — identical hierarchy to the source. Descriptive internal links and `alt`
  text (already in captured HTML).
- Israeli localization signals (he-IL, ₪, local phone) — `/rtl-hebrew`.

## Checklist
- [ ] Title/description/canonical match the live page.
- [ ] One canonical; URL = WP permalink.
- [ ] Sitemap + robots correct; excluded pages stay excluded.
- [ ] JSON-LD valid, non-duplicated, matches visible content.
- [ ] Single H1 + ordered headings.
- Deeper audit → run the `seo-auditor` agent.
