---
name: new-service
description: Add or deepen a service page the data-driven way — append to services in lib/site.ts with a valid IconName, add the depth blocks and per-service FAQs the page template doesn't have yet, so the route, the services grid, the pricing table, the form select, cross-links, schema and the sitemap update automatically. Use when adding a service or retrofitting one of the 5 thin service pages. Triggers: "add a service", "new service page", "deepen the service copy", "per-service FAQ", "service page is thin".
---

# Add or deepen a service page

**State as of 2026-08-17:** all 5 service pages clear the 450 floor (456–574 unique-to-page words)
through the **`serviceDepth` map** in `lib/site.ts` — answer block, intro, included/excluded, method,
site impact, a קונסטרוקטור note, 3–4 FAQs (→ `FAQPage`) and descriptive contextual links. The page
template in `app/services/[slug]/page.tsx` renders all of it when a `serviceDepth[slug]` entry
exists, and falls back to the old bullets-only layout when it doesn't.

**A new service therefore needs TWO entries: one in `services` and one in `serviceDepth`.** A service
without a depth entry ships thin and fails `docs/content-standards.md` §1 — the build won't warn you.

## The data model

```ts
// lib/site.ts — what exists today
export interface Service {
  slug: string;
  icon: IconName; // must be a member of the IconName union — components/Icon.tsx keys off it
  title: string;
  teaser: string; // one-liner for cards
  description: string; // the page hero lead
  audience: string;
  priceFrom?: string;
  bullets: string[];
  process: string[];
  metaTitle: string; // ⚠️ already contains "| בטון פלוס" — the page uses absoluteTitle: true
  metaDescription: string;
}
```

```ts
// lib/site.ts — the depth layer, a SEPARATE map keyed by slug (shipped 2026-08-17)
export interface ServiceDepth {
  answer: Faq; // 40–60 words, the AEO answer block — rendered first under a question-form h2
  intro: string[]; // 2–3 paragraphs of genuine substance
  included: string[]; // what's in — replaces the card-level `bullets` on the page
  excluded: string[]; // what's out, and who owns it (engineer / contractor / client)
  method: string; // equipment, substrate, wet vs dry, and why for this job
  siteImpact: string; // noise, dust, water, weight, neighbours, occupied buildings
  structural: string; // when a קונסטרוקטור must sign off — never imply it can be skipped
  faqs: Faq[]; // 3–5 service-specific Q/A → FAQPage on this route
  links: ContextLink[]; // 2–3 descriptive-anchor links to related routes
}
export const serviceDepth: Record<string, ServiceDepth> = { "wall-sawing": { … }, … };
```

Also add the new slug to **`relatedServices`** (the adjacency map) on both sides of each edge.

`icon` must be one of the `IconName` union members (`saw`, `drill`, `layers`, `wire`, `demolition`, …)
— `components/Icon.tsx` is keyed by it and TypeScript will surface a miss at compile time.

## The depth bar

450 unique words, and the doorway test applies here too: **swap the service name — does the page still
read correctly?** If yes, it isn't a service page, it's a template.

What actually creates depth in this trade (and what competitors' pages usually lack):

- **Substrate and thickness** — plain vs reinforced concrete, block, stone; what changes at 20 cm vs
  40 cm; what dense rebar does to the time and the price.
- **Equipment choice and why** — the threshold where a disc saw stops being viable and a wire saw
  starts; when core drilling beats sawing.
- **Wet vs dry** — what water the job needs, where it goes, and what the customer must prepare.
- **What's included and excluded** — scaffolding, waste removal, making good, permits.
- **Site impact** — decibels, dust containment, working hours in an occupied building, what the
  neighbours will notice.
- **Structural honesty** — when a קונסטרוקטור approval is required. Saying so plainly is both correct
  and disproportionately trusted; implying it can be skipped is a liability.
- **Failure modes** — cutting into rebar, hitting a live conduit, corner cracking at an opening.

## Steps

1. Add or edit the entry in `services` (`lib/site.ts`). Array order drives the grid, the pricing table,
   the footer column and — until `/internal-linking` §1 is done — the related-services `slice`.
2. Fill the depth fields above. **`answer` first**, then the substance.
3. Add 3–5 service-specific `faqs`. These become a `FAQPage` on the route
   (`/schema-structured-data`) — five more schema-eligible pages.
4. Update `app/services/[slug]/page.tsx` to render the new blocks. Order: answer block → intro →
   what's included/excluded → method → site impact → structural note → process (exists) → price
   (interpolated from `priceFrom`, never restated) → FAQ → related services → CTA.
5. Add relevance-based related services (`/internal-linking` §1) and 2–3 contextual in-copy links.
6. Metadata per `docs/keyword-map.md` §3 — `metaTitle` carries the brand and the page passes
   `absoluteTitle: true`. **Don't mix that with the layout template** (`/seo-metadata`).
7. Confirm `Service` + `BreadcrumbList` + the new `FAQPage` are emitted.
8. Add `data-cta` to the sidebar call/WhatsApp buttons while you're in the file (backlog §13.2).
9. `npm run lint && npm run typecheck && npm run format:check && npm run build`, then verify the route
   in `out/` **and** in `out/sitemap.xml`.

## What follows automatically

`generateStaticParams` picks up the route · `ServicesGrid` on `/` and `/services/` · the footer service
column · the `/pricing/` table row · the `ContactForm` service `<select>` · `app/sitemap.ts` (services
are derived, unlike `staticPaths`).

## Checklist

- [ ] Valid `IconName`; entry complete.
- [ ] ≥450 unique words of genuine substance.
- [ ] Opens with a 40–60 word answer block under a question-form `<h2>`.
- [ ] `included` / `excluded` present — no shared bullets across services.
- [ ] 3–5 service-specific FAQs, all rendered on the page.
- [ ] Price interpolates from `priceFrom`; nothing retyped.
- [ ] Passes the service-name substitution test.
- [ ] `Service` + `BreadcrumbList` + `FAQPage` emitted.
- [ ] Present in `out/` and `out/sitemap.xml`.

## Gotchas

- `params` is a `Promise` in Next 16 — `const { slug } = await params` in both `generateMetadata` and
  the component. The existing route does this; don't regress it.
- A new service means a new price row appears on `/pricing/` automatically — make sure `priceFrom` is
  either a confirmed number or an honest "הצעת מחיר".
- Never invent thicknesses, durations, decibel figures, insurance terms or prices. Unverified →
  `// 🔶 confirm` + a row in `docs/business-facts.md`.
- Five services with genuine depth beat eight that paraphrase each other. `wall-sawing` and
  `floor-ceiling-sawing` already overlap and need differentiating, not company.
