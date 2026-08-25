---
name: betonplus-architecture
description: Start-here orientation for betonplus.co.il — the roster → site.config.json → lib/site.ts → routes data flow, the file map, the vestigial WordPress snapshot layer nothing imports, static-export constraints (no headers, redirects, middleware or API routes), Next 16's Promise params, the npm scripts, and the deploy truth. Use at the start of any task in this repo, or when unsure where content, routes, metadata or business facts come from. Triggers: "where does X live", "how is this site built", "orient me", "architecture", "why is this not working in production".
user-invocable: true
---

# betonplus.co.il architecture

בטון פלוס — diamond concrete cutting, coring and controlled demolition, גוש דן. Hebrew RTL marketing
site, 14 content routes (+ a noindex `/thank-you/`), Next.js 16 App Router compiled to static HTML.
Read this before changing
anything.

## The thing that will confuse you first

This repo contains **two sites**. Only one of them is real.

The original project was a strict 1:1 WordPress→Next port. That approach was abandoned and replaced by
a brief-driven build (`brief.md`, commit "Build brief-driven betonplus marketing site"). The migration
machinery was never deleted:

| Vestigial — imported by nothing under `app/`                           | Live                  |
| ---------------------------------------------------------------------- | --------------------- |
| `scripts/scrape.mjs` `transform.mjs` `build-manifest.mjs` `enrich.mjs` | `app/**/page.tsx`     |
| `content/site.json` (1.1 MB snapshot)                                  | `lib/site.ts` ⭐      |
| `lib/content.ts` `lib/wp.ts` `lib/enrich/`                             | `lib/seo.ts`          |
| `app/enrich.css`                                                       | `app/globals.css`     |
| `components/SiteFrame.tsx` `SiteAssets.tsx` `ThemeScripts.tsx`         | every other component |
| `npm run snapshot` · `npm run enrich`                                  | `npm run build`       |

**`lib/site.ts` is the live content source. `lib/content.ts` is the dead snapshot reader.** The names
are backwards relative to the rest of the fleet — check the import, not the filename.

Don't build on the dead layer, and don't delete it without asking (it is the only record of the
original WP content).

## The stack, and what it forbids

Next **16.2.9** · React **19** · TypeScript strict (**`noUncheckedIndexedAccess` is NOT on**) ·
Tailwind **v4** (CSS-first `@theme` in `app/globals.css` — **there is no `tailwind.config.ts`**; the
full framework including preflight is imported) · icons from the hand-rolled inline-SVG set in `components/Icon.tsx`
(`lucide-react` is declared but unused) ·
`@ishub/site-kit` (vendored tarball, ships raw TS, hence `transpilePackages`).

```ts
// next.config.ts
output: "export",       trailingSlash: true,
images: { unoptimized: true },
transpilePackages: ["@ishub/site-kit"],
```

`output: "export"` **forbids** `headers()`, `redirects()`, `rewrites()`, middleware, API routes, ISR
and server actions. Response headers would come from `public/_headers` at the Cloudflare edge, redirects
from `public/_redirects` — **neither file exists yet** (`/web-security-headers`). If a task seems to need
one of the forbidden APIs, the answer is at the edge, not in Next.

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
lib/site.ts    manifest · site · services[5] · serviceAreas[16] · navItems
        │      telHref · whatsappHref · faqs · reviews · trustStats · processSteps · differentiators
        ├─► lib/seo.ts   pageMetadata() · localBusinessJsonLd() · serviceJsonLd()
        │                faqJsonLd() · breadcrumbJsonLd()   (thin wrappers over @ishub/site-kit/seo)
        ▼
app/**/page.tsx  →  components/**
```

**Identity and NAP go up to the roster. Wording goes in `lib/site.ts`. Layout goes in components.**
A phone number or service name typed into a component is a bug.

## Routes

| Route                                                                                                              | Source                                             | Count |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- | ----- |
| `/`                                                                                                                | `app/page.tsx`                                     | 1     |
| `/services/{slug}/`                                                                                                | `app/services/[slug]/page.tsx`                     | 5     |
| `/services/` `/pricing/` `/service-areas/` `/about/` `/reviews/` `/faq/` `/contact/` `/privacy/` `/accessibility/` | own dirs under `app/`                              | 9     |
| `/404`                                                                                                             | Next default                                       | —     |
| `/sitemap.xml` `/robots.txt` `/opengraph-image`                                                                    | `app/sitemap.ts` `robots.ts` `opengraph-image.tsx` | —     |

14 content routes, all ASCII slugs (`/reviews/` was removed 2026-08-17 — fabricated testimonials —
and 301s via `public/_redirects`; `/thank-you/` is the noindex form-conversion target). **There is no
location silo** — the 16 service areas are strings
rendered as chips on `/service-areas/`, linking nowhere. That is the biggest structural gap
(`/local-seo-il`, `/new-city`).

## The two metadata mechanisms

`app/layout.tsx` sets `title.template = "%s | בטון פלוס"`. Static pages pass a bare subject to
`pageMetadata()` and let the template append the brand. **Service pages pass `absoluteTitle: true`**
with a `metaTitle` that already carries the brand. Both are correct; mixing them produces a doubled
suffix. See `/seo-metadata`.

## What `@ishub/site-kit` gives you

| Subpath        | Symbols                                                                 | Used here                                  |
| -------------- | ----------------------------------------------------------------------- | ------------------------------------------ |
| root           | `telHref`, `whatsappHref`, `ogImageMeta`, `SiteManifest`                | yes, via `lib/site.ts`                     |
| `./seo`        | `localBusinessJsonLd`, `serviceJsonLd`, `faqJsonLd`, `breadcrumbJsonLd` | yes, via `lib/seo.ts`                      |
| `./analytics`  | `gtmHeadSnippet`, `gtmNoScriptSrc`, `trackEvent`                        | yes                                        |
| `./media`      | `mediaUrl`, `srcsetFor`, `preloadPropsFor`                              | **unused** — see `/performance-web-vitals` |
| `./components` | `SiteImage` (Cloudflare `/cdn-cgi/image` srcset)                        | **unused**                                 |

## Commands

```
npm run dev · build · lint · typecheck · format · format:check
npm run snapshot · enrich       # the dead WordPress layer — do not run
```

Build gate: `npm run lint && npm run typecheck && npm run format:check && npm run build`.

## Deploy

**Cloudflare Pages, direct upload via wrangler. Pushing to `main` deploys nothing.**
`.github/workflows/deploy.yml` still targets GitHub Pages and is a dead second origin; `public/CNAME`
is its leftover. See `/deploy-betonplus`.

## Where to go next

`/seo-metadata` · `/schema-structured-data` · `/rtl-hebrew` · `/local-seo-il` · `/new-service` ·
`/new-city` · `/qa-build-gate` · `/deploy-betonplus`. The acceptance bars live in `docs/`:
`optimization-backlog.md`, `content-standards.md`, `keyword-map.md`, `schema-graph.md`,
`business-facts.md`.
