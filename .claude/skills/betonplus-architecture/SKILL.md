---
name: betonplus-architecture
description: Start-here orientation for betonplus.co.il — the roster → site.config.json → lib/site.ts → routes data flow, the file map, static-export constraints (no headers, redirects, middleware or API routes), Next 16's Promise params, the npm scripts, and the deploy truth. Use at the start of any task in this repo, or when unsure where content, routes, metadata or business facts come from. Triggers: "where does X live", "how is this site built", "orient me", "architecture", "why is this not working in production".
user-invocable: true
---

# betonplus.co.il architecture

בטון פלוס — diamond concrete cutting, coring and controlled demolition, גוש דן והמרכז. Hebrew RTL
marketing site, 14 indexable routes (+ a noindex `/thank-you/`), Next.js 16 App Router compiled to
static HTML. Read this before changing anything.

## The thing that will confuse you first

This repo **used to** contain two sites. The original project was a strict 1:1 WordPress→Next port;
that approach was abandoned for the brief-driven build (`brief.md`, commit "Build brief-driven
betonplus marketing site"), and the migration machinery — `scripts/*.mjs`, `content/site.json`,
`lib/content.ts`, `lib/wp.ts`, `lib/enrich/`, `app/enrich.css`, `SiteFrame`/`SiteAssets`/`ThemeScripts`,
the `snapshot`/`enrich` npm scripts and five dependencies — was **deleted 2026-08-31 in `58d0749`**
(Sprint 2). Any reference to it you still meet is stale; see `/legacy-wordpress-layer`.

**`lib/site.ts` is the content source — the only one.** `lib/` holds exactly two files: `site.ts`
(manifest facade + every Hebrew string) and `seo.ts` (metadata + JSON-LD builders).

## The stack, and what it forbids

Next **16.2.9** · React **19** · TypeScript strict (**`noUncheckedIndexedAccess` is NOT on**) ·
Tailwind **v4** (CSS-first `@theme` in `app/globals.css` — **there is no `tailwind.config.ts`**; the
full framework including preflight is imported) · icons from the hand-rolled inline-SVG set in
`components/Icon.tsx`, keyed by the `IconName` union in `lib/site.ts` (no icon library) ·
`@ishub/site-kit` (vendored tarball, ships raw TS, hence `transpilePackages`). Runtime dependencies
are exactly `next`, `react`, `react-dom` and the kit.

```ts
// next.config.ts
output: "export",       trailingSlash: true,
images: { unoptimized: true },
transpilePackages: ["@ishub/site-kit"],
```

`output: "export"` **forbids** `headers()`, `redirects()`, `rewrites()`, middleware, API routes, ISR
and server actions. Response headers come from `public/_headers` at the Cloudflare edge (HSTS,
X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, report-only CSP — **live**) and
redirects from `public/_redirects` (`/reviews/` → `/` 301). If a task seems to need one of the
forbidden APIs, the answer is at the edge, not in Next (`/web-security-headers`).

**Next 16 specifics.** `params` is a `Promise` — `const { slug } = await params` in both
`generateMetadata` and the page component. Every route sets `export const dynamic = "force-static"`.
Read `node_modules/next/dist/docs/` before touching routing, metadata or image APIs (`/nextjs-app-router`).

## Data flow — the thing to internalise

```
Israeli services sites/roster/sites/betonplus.json   ← EDIT HERE for NAP, brand, schema, analytics
        │  (ops sync)
        ▼
site.config.json          SiteManifest              ← NEVER edit directly
        │
        ▼
lib/site.ts    manifest · site · services[5] · serviceDepth · relatedServices · serviceAreas[14]
        │      serviceAreaGroups · navItems · staticRoutes[9] · routeUpdated · owner · faqs
        │      telHref · whatsappHref · hoursLines · priceLabel/priceAmount · trustStats …
        ├─► lib/seo.ts   pageMetadata() · localBusinessJsonLd() · personJsonLd() · serviceJsonLd()
        │                faqJsonLd() · breadcrumbJsonLd() · webPage/collectionPage/aboutPage/
        │                contactPageJsonLd() · webSiteJsonLd()   (over @ishub/site-kit/seo)
        ▼
app/**/page.tsx  →  components/**
```

**Identity and NAP go up to the roster. Wording goes in `lib/site.ts`. Layout goes in components.**
A phone number or service name typed into a component is a bug.

## File map

```
app/         layout.tsx (explicit <head> for GTM, LocalBusiness JSON-LD, lang/dir) · page.tsx
             services/page.tsx · services/[slug]/page.tsx · pricing/ service-areas/ about/ faq/
             contact/ privacy/ accessibility/ · thank-you/ (noindex) · not-found.tsx (Hebrew 404)
             sitemap.ts · robots.ts · opengraph-image.tsx · icon.svg · globals.css (.ltr helper)
components/  ui.tsx (Section, SectionHeading, Button, Logo) · Header (client) · Footer · FloatingCTA
             PageHero · CtaBanner · ContactSection · ContactForm (client) · Hero · TrustBar
             ServicesGrid · WhyUs · ProcessSteps · Faq · ServiceAreasSection · CompareTable
             Hours (LTR-isolated time ranges) · Byline (author + עודכן date) · Icon · JsonLd
lib/         site.ts ⭐ · seo.ts ⭐
scripts/     check-titles.mjs — runs as `postbuild`; fails the build on a doubled brand title
public/      _headers · _redirects · llms.txt · brand/
docs/        the acceptance bars (see below)
```

## Routes

| Route                                                                                                  | Source                                                 | Count |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ----- |
| `/`                                                                                                    | `app/page.tsx`                                         | 1     |
| `/services/{slug}/`                                                                                    | `app/services/[slug]/page.tsx`                         | 5     |
| `/services/` `/pricing/` `/service-areas/` `/about/` `/faq/` `/contact/` `/privacy/` `/accessibility/` | own dirs under `app/` — with `/`, the 9 `staticRoutes` | 8     |
| `/thank-you/`                                                                                          | `app/thank-you/page.tsx` — noindex, not in the sitemap | 1     |
| `/404/` `/_not-found/`                                                                                 | `app/not-found.tsx`                                    | —     |
| `/sitemap.xml` `/robots.txt` `/opengraph-image`                                                        | `app/sitemap.ts` `robots.ts` `opengraph-image.tsx`     | —     |

**14 sitemap URLs** (`staticRoutes` 9 + 5 services, derived in `app/sitemap.ts`) and **15 routes
with an H1** (those 14 + `/thank-you/`). All emitted slugs are ASCII. `/reviews/` was removed
2026-08-17 (fabricated testimonials) — there is no `reviews` export and no `Reviews` component.
**There is no location silo** — `serviceAreas` is a typed `ServiceArea[]` (Hebrew `slug`, `name`,
`kind`, `prefixed`) rendered as deliberately unlinked chips; `slug` is reserved for
`/locations/[city]/`. That is the biggest structural gap (`/local-seo-il`, `/new-city`).

## The two metadata mechanisms

`app/layout.tsx` sets `title.template = "%s | בטון פלוס"`. Static pages pass a bare subject to
`pageMetadata()` and let the template append the brand. **Service pages pass `absoluteTitle: true`**
with a `metaTitle` that already carries the brand. Both are correct; mixing them produces a doubled
suffix — which `scripts/check-titles.mjs` now catches at `postbuild`. See `/seo-metadata`.

## What `@ishub/site-kit` gives you

| Subpath        | Symbols                                                                 | Used here                                  |
| -------------- | ----------------------------------------------------------------------- | ------------------------------------------ |
| root           | `telHref`, `whatsappHref`, `ogImageMeta`, `SiteManifest`                | yes, via `lib/site.ts` / `app/layout.tsx`  |
| `./seo`        | `localBusinessJsonLd`, `serviceJsonLd`, `faqJsonLd`, `breadcrumbJsonLd` | yes, via `lib/seo.ts`                      |
| `./analytics`  | `gtmHeadSnippet`, `gtmNoScriptSrc`, `trackEvent`                        | yes                                        |
| `./media`      | `mediaUrl`, `srcsetFor`, `preloadPropsFor`                              | **unused** — see `/performance-web-vitals` |
| `./components` | `SiteImage` (Cloudflare `/cdn-cgi/image` srcset)                        | **unused**                                 |

The page-type nodes (`WebSite`, `Person`, `WebPage`…) have no kit builder and are hand-assembled in
`lib/seo.ts`.

## Commands

```
npm run dev · build (→ postbuild: scripts/check-titles.mjs) · lint · typecheck · format · format:check
```

Build gate: `npm run lint && npm run typecheck && npm run format:check && npm run build`.

## Deploy

**Cloudflare Pages, direct upload via wrangler (`ops/deploy-site.ps1`). Pushing to `main` deploys
nothing.** `.github/workflows/deploy.yml` is build-gate CI only; the GitHub Pages origin is dead
(404) and `public/CNAME` is gone. See `/deploy-betonplus`.

## Where to go next

`/seo-metadata` · `/schema-structured-data` · `/rtl-hebrew` · `/local-seo-il` · `/new-service` ·
`/new-city` · `/qa-build-gate` · `/deploy-betonplus`. The acceptance bars live in `docs/`:
`optimization-backlog.md`, `content-standards.md`, `keyword-map.md`, `schema-graph.md`,
`business-facts.md`.
