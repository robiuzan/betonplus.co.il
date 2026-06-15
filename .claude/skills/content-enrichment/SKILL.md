---
name: content-enrichment
description: Authoring the optional value-add content layer for betonplus — content/enriched/<id>.mjs modules against the EnrichedPage schema, the render.mjs block renderers, page classification + _manifest.json, and the npm run enrich step. Use when adding authored sections (intro, pricing, FAQ, process, related links) on top of the 1:1 snapshot.
---

# Content enrichment (the authored value-add layer)

The snapshot (`/migration-fidelity`) is a strict copy of the live site. The **enrichment layer** is the
only sanctioned place to add authored content — extra service copy, pricing tables, FAQs, process steps,
related links — without violating 1:1 fidelity of the captured page. It is injected at build time.

## How it runs
```
npm run enrich → node scripts/build-manifest.mjs   (classify pages + related-link index → _manifest.json)
               → node scripts/enrich.mjs            (for each content/enriched/<id>.mjs: inject HTML + SEO + JSON-LD)
```

## Authoring a module
1. Find the page `id` (from `_manifest.json` or `content/site.json`).
2. Create [content/enriched/](content/enriched/)`<id>.mjs` exporting an object that satisfies the
   **`EnrichedPage`** interface in [lib/enrich/types.ts](lib/enrich/types.ts).
3. `npm run enrich`, then `npm run build` and verify (`/qa-build-gate`).

## The `EnrichedPage` shape (see lib/enrich/types.ts for the authoritative source)
Required: `id`, `kind` (`"service" | "brand-key" | "location" | "core"`), `keyword`, `seo {title,
description}`, `hero {h1, tagline}`, `intro {heading, paragraphs[], outro?}`, `pricing[]`,
`faq {subtitle?, items[]}`, `related {services[], locations[]}`, `cta {heading, body?}`.
Optional sections: `process[]`, `specsTable`, `scenarios[]`, `guides[]`, `stats[]`, `areas[]`,
`advantages`.

## Rendering
[lib/enrich/render.mjs](lib/enrich/render.mjs) turns the data into HTML strings (no JSX — consumed at build
time by `enrich.mjs`). `renderContentBlocks(page)` assembles the inner HTML; section renderers include
`renderHero`, `renderPageContent`, `renderProcess`, `renderScenarios`, `renderAdvantages`, `renderFaq`,
`renderGuides`, `renderStats`, `renderServicesList`, `renderAreas`, `renderMarquee`, `renderForm`.
Styling for these blocks lives in [app/enrich.css](app/enrich.css) — reuse its classes, don't invent new
visual patterns (`/web-design-ui`).

## Rules for authored copy
- It is real marketing content for a concrete-cutting service — accurate, specific, no fabricated claims,
  certifications, or fake reviews.
- **Hebrew, RTL** — heading hierarchy continues correctly under the page's single H1; prices in ₪; phones
  in Israeli format. See `/rtl-hebrew`.
- `related.*.href` paths must match real `SitePage.path` values exactly (`/migration-fidelity`).
- `seo.title`/`seo.description` flow into metadata and JSON-LD — keep them aligned with `/seo-metadata`.
- JSON-LD (Breadcrumb / Service / HowTo from `process` / FAQ from `faq.items`) is emitted automatically by
  `enrich.mjs` — don't hand-author duplicate schema.

## Verify
- `npm run enrich && npm run build` clean; the new sections render under the page's content area.
- Cross-links resolve (no 404s); headings remain one-H1 + logical order.
- Run the `seo-auditor` agent on the page if it adds schema-bearing sections.
