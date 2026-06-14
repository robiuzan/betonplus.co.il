@AGENTS.md

# betonplus.co.il — WordPress → Next.js 1:1 Migration

This project is a **pixel-perfect 1:1 migration** of an existing WordPress site (ניסור בטון /
concrete-cutting & coring services) to a modern React stack. It is **NOT** a redesign. Every
decision is judged against one question: *"Does this match the live WordPress source exactly?"*

It shares the same stack and migration methodology as the sibling project `3locksmiths.co.il`.

## Stack
- **Next.js 16.2.9** (App Router) — ⚠️ breaking changes vs. older Next; read `node_modules/next/dist/docs/` before touching routing/metadata/image APIs.
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-first config via `@theme` in `app/globals.css` (there is **no** `tailwind.config.ts` by default). Brand colors/fonts go in the `@theme` block.
- Data source: WordPress REST API at `${NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/` (set in `.env.local`).
- Rendering strategy: **SSG** (`generateStaticParams` + a static content snapshot).
- Deploy: static export (`out/`) → GitHub Pages via `.github/workflows/deploy.yml`.

## Source site (discovered so far)
- Live source: **https://betonplus.co.il** — a WordPress site using the **`zapo` theme**.
- Pages discovered via REST (`/wp-json/wp/v2/pages`): עמוד הבית (home, id 5), שירותים (services, id 608),
  מחירון (pricing, id 609), אודות (about, id 610), אזורי שירות (service areas, id 604), plus the default
  `sample-page` (excluded from the sitemap).
- ⚠️ **Not yet investigated** (do this before/while building the snapshot):
  - Whether the REST API returns real `content.rendered` (if so the port is far simpler than the
    locksmiths one, whose builder theme returned empty content and had to be scraped from live HTML).
  - Which custom **public post types** the `zapo` theme registers — `GET /wp-json/wp/v2/types`, then add
    each public `rest_base` to `CONTENT_TYPES` in `scripts/scrape.mjs`.
  - The page chrome (header/nav/main/footer markup), the JS libraries the theme loads, and the fonts.
  - Whether Tailwind's **preflight** reset must stay disabled in `app/globals.css` so it does not clobber
    the vendored theme CSS (it was disabled for the locksmiths port — confirm for `zapo`).

## Migration pipeline (`npm run snapshot`)
- `scripts/scrape.mjs` → fetches each page's live rendered HTML, vendors all same-origin assets
  (CSS/JS/fonts/images, including CSS `url()` deps) into `public/` at their original paths, and writes
  **`content/site.json`** — the source of truth consumed by `lib/content.ts` at build time.
- `scripts/transform.mjs`, `scripts/build-manifest.mjs`, `scripts/enrich.mjs` → optional enrichment layer
  (authored value-add sections live in `content/enriched/<id>.mjs`; see `lib/enrich/`).
- `app/page.tsx` renders the front page; `app/[...slug]/page.tsx` renders every other WP permalink.
- Until the snapshot runs, `content/site.json` is an empty stub and `npm run build` fails **by design**
  (no front page). Run `npm run snapshot` first to populate real content.

## Primary Directive — Strict 1:1 Replication
- Replicate the source WordPress site exactly: **design, content, layout, URL/permalink structure, metadata, and internal links.**
- **No invented content, no creative liberties.** Preserve the exact **H1 → H2 → H3** heading hierarchy from the source.
- Preserve **internal links** exactly (same slugs/paths as WordPress permalinks).

## RTL & Localization (mandatory)
- Document root: `<html lang="he" dir="rtl">`.
- Locale: Hebrew / Israel (`he-IL`). Phone numbers, dates, currency follow Israeli conventions.
- Use **logical/RTL-aware Tailwind utilities**: `ps-*`/`pe-*` (not `pl-*`/`pr-*`), `ms-*`/`me-*`, `start-*`/`end-*`, `text-start`/`text-end`, and `space-x-reverse` where needed.
- Layout and text flow must mirror the Hebrew source perfectly (right-to-left).

## Code Style
- **Strict TypeScript.** No `any` in committed code. Model all WordPress structures with explicit interfaces (`WP_Page`, `WP_Post`, `WP_Media`, etc.) — see `lib/wp.ts` and `lib/content.ts`.
- Keep UI modular: extract repeatable elements (header, footer, nav, contact form, floating call/WhatsApp button, service cards) into `/components`.
- Match the source's existing visual conventions; do not introduce new design patterns.

## SEO / Metadata
- Use `generateMetadata` to emit `<title>`, `<meta name="description">`, and canonical URLs **identical** to the WordPress source (prefer Yoast/RankMath fields if exposed in the REST payload, else fall back to `title`/`excerpt`).
- Never change URLs — the canonical and route paths must equal the WP permalink.

## Images
- `next.config.ts` → `images.remotePatterns` must allow the WordPress domain so `<Image>` can load media directly from WP.

## Build gate
- `npm run build` must pass with **zero** TypeScript/compile errors and `generateStaticParams` must successfully generate all routes before any phase is considered done.
