---
name: migration-fidelity
description: The 1:1 replication discipline for the betonplus WordPress→Next migration — exact content/headings/permalinks/metadata, the snapshot workflow, asset vendoring and link-rewriting rules, and how to verify a page matches the live source. Use before changing any rendered page output or when judging whether a change preserves fidelity.
---

# Migration fidelity (the Primary Directive)

Every change is judged against one question: **"Does this match the live WordPress source exactly?"**
This is a port, not a redesign. See `/betonplus-architecture` for the pipeline overview.

## Non-negotiables
- **No invented content, no creative liberties.** Do not add, drop, reword, or reorder copy that exists on
  the live site. Authored *additions* are allowed ONLY through the enrichment layer (`/content-enrichment`).
- **Preserve the exact heading hierarchy** H1 → H2 → H3 from the source. One H1 per page.
- **Identical permalinks.** Route paths must equal the WP permalink (Hebrew slugs, `trailingSlash: true`,
  e.g. `/שירותים/`). Never rename a slug — it breaks canonicals and inbound links.
- **Identical metadata** — title, description, canonical, OG/Twitter. Sourced from the live `<head>`
  (see `/seo-metadata`).
- **Internal links stay relative and exact** — same path as the WP permalink, not absolute URLs.

## The snapshot workflow
1. `npm run snapshot` → [scripts/scrape.mjs](scripts/scrape.mjs) fetches each published page's rendered
   HTML, then [scripts/transform.mjs](scripts/transform.mjs) rewrites Contact Form 7 → FormSubmit.
2. Output: [content/site.json](content/site.json) — the build-time source of truth.
3. Re-run snapshot whenever the live site changes; **never hand-edit `content/site.json`** to fake content
   (that defeats verification). Fix the scraper or add an enrichment module instead.

## What the scraper guarantees (don't re-implement by hand)
From [scripts/scrape.mjs](scripts/scrape.mjs):
- **Asset vendoring** — every same-origin CSS/JS/font/image (including CSS `url()` and `@import` deps) is
  mirrored into `public/` at its **original path**, so absolute URLs like `/wp-content/uploads/…` and
  `/wp-content/themes/zapo/…` resolve locally and unchanged.
- **Link rewriting** — same-origin links become relative paths so they hit Next routes.
- **SEO extraction** — title, description, canonical, `og:*`, `twitter:*`, robots pulled from `<head>`.
- HTML entities are decoded with `he.decode()` (see `/rtl-hebrew`).

## Verifying a page matches the source
- Build (`npm run build`) and compare the page in `out/` against the live URL — headings, copy, link
  targets, metadata, layout. Use the **`fidelity-auditor`** agent to diff a route against
  `https://betonplus.co.il`.
- Confirm every referenced asset exists under `public/` at the same path (no 404s).
- Confirm the route path equals the WP permalink exactly.
- Gate the change through `/qa-build-gate`.

## Red flags (stop and reconsider)
- Editing copy/headings directly in `content/site.json` or in a component.
- Changing a slug, dropping `trailingSlash`, or making an internal link absolute.
- Adding a header/nav/footer component (chrome comes from `bodyHtml`).
- "Improving" the design — fidelity beats taste here. Genuine value-add goes through `/content-enrichment`.
