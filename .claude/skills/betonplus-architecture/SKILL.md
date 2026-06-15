---
name: betonplus-architecture
description: Start-here orientation for the betonplus.co.il codebase — the snapshot→enrich→render pipeline, the key file map, the npm scripts, and the build gate. Use at the start of any task here, or when you are unsure where content/styles/routes/metadata come from.
user-invocable: true
---

# betonplus.co.il — Architecture map

This is a **strict 1:1 WordPress→Next.js migration** of `https://betonplus.co.il` (concrete cutting &
coring — ניסור בטון, theme `zapo`). It is **NOT a redesign**. Read `/migration-fidelity` before changing
any page output.

## The data flow (read this first)
```
WordPress (live)  ──scrape.mjs──▶  content/site.json  ──lib/content.ts──▶  app/* pages ──SiteFrame──▶ HTML
   │                                      ▲
   └ value-add: content/enriched/<id>.mjs ─┘  (build-manifest.mjs + enrich.mjs, optional layer)
```
- The **source of truth at build time is `content/site.json`**, not the live WP API. The scraper captures
  each page's *rendered* HTML (the `zapo` theme renders from server-side meta the REST API does not
  expose) and vendors every same-origin asset into `public/` at its original path.
- Pages render captured HTML via `dangerouslySetInnerHTML`; there are **no hand-built header/nav/footer
  components** — that chrome lives inside `page.bodyHtml`.

## Key files
| Path | Role |
|------|------|
| [scripts/scrape.mjs](scripts/scrape.mjs) | Fetch live HTML, vendor assets, rewrite links, extract SEO → writes `content/site.json` |
| [scripts/transform.mjs](scripts/transform.mjs) | Post-scrape: rewrite Contact Form 7 → FormSubmit, strip CF7 JS |
| [scripts/build-manifest.mjs](scripts/build-manifest.mjs) | Classify pages (service / brand-key / location / core), build related-link index → `content/enriched/_manifest.json` |
| [scripts/enrich.mjs](scripts/enrich.mjs) | Inject authored `content/enriched/<id>.mjs` HTML + SEO + JSON-LD into pages |
| [content/site.json](content/site.json) | The snapshot — single source of truth |
| [content/enriched/](content/enriched/) | Authored value-add modules + `_manifest.json` |
| [lib/content.ts](lib/content.ts) | `SiteData`/`SitePage`/`SeoData` types; `getFrontPage()`, `getContentPages()`, `getPageBySegments()`, `buildMetadata()` |
| [lib/wp.ts](lib/wp.ts) | WordPress REST types (`WP_Page`, `WP_Post`, `WP_Rendered`) |
| [lib/enrich/types.ts](lib/enrich/types.ts) | `EnrichedPage` interface (authoring schema) |
| [lib/enrich/render.mjs](lib/enrich/render.mjs) | HTML block renderers for enriched sections |
| [app/page.tsx](app/page.tsx) | Front page → `<SiteFrame page={getFrontPage()} />` |
| [app/[...slug]/page.tsx](app/[...slug]/page.tsx) | Every other permalink; `generateStaticParams` + `dynamicParams=false` |
| [app/sitemap.ts](app/sitemap.ts) / [app/robots.ts](app/robots.ts) | `/sitemap.xml`, `/robots.txt` |
| [components/SiteFrame.tsx](components/SiteFrame.tsx) | Renders JSON-LD + `bodyHtml` + replays scripts |
| [components/ThemeScripts.tsx](components/ThemeScripts.tsx) | `"use client"` — sequential script replay |
| [app/globals.css](app/globals.css) | Tailwind v4 **utilities only** (preflight/theme intentionally NOT imported) |
| [app/enrich.css](app/enrich.css) | Styling for authored value-add sections |
| [next.config.ts](next.config.ts) | `output:"export"`, `trailingSlash`, `images.unoptimized` |

## npm scripts (verbatim)
```
dev      → next dev
build    → next build
start    → next start
lint     → eslint
snapshot → node scripts/scrape.mjs && node scripts/transform.mjs
enrich   → node scripts/build-manifest.mjs && node scripts/enrich.mjs
```
Run **`npm run snapshot` first** on a fresh checkout — until then `content/site.json` is an empty stub and
`npm run build` fails by design (no front page).

## Stack quick facts
- Next.js 16 App Router, React 19, **TypeScript strict (no `any`)**, Tailwind v4 (CSS-first), static export.
- `@/*` path alias → repo root. RTL Hebrew (`<html lang="he" dir="rtl">`).
- ⚠️ Next 16 has breaking changes — **read `node_modules/next/dist/docs/` before touching routing/metadata/image APIs** (see `/nextjs-app-router`).

## Where to go next
- Changing/verifying page output → `/migration-fidelity`
- Authoring value-add sections → `/content-enrichment`
- Routing/metadata APIs → `/nextjs-app-router`, `/seo-metadata`
- Components → `/react-components`  •  Styles → `/web-design-ui`  •  RTL → `/rtl-hebrew`
- Shipping → `/qa-build-gate`, `/performance-web-vitals`
