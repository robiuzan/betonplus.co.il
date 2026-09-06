---
name: schema-structured-data
description: Emit the JSON-LD graph with the lib/seo.ts wrappers over @ishub/site-kit/seo — GeneralContractor from the manifest, Service per service page, BreadcrumbList on every nested route, FAQPage matched to visible FAQs, OfferCatalog on pricing, WebSite on the homepage, and Review/AggregateRating only when genuinely sourced. Use when wiring or auditing structured data, or before a Rich Results Test. Triggers: "add schema", "JSON-LD", "BreadcrumbList", "structured data", "rich results", "Offer".
---

# Structured data

Target graph: `docs/schema-graph.md`. This skill is how to emit it.

## The builders

```ts
import { pageMetadata, serviceJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
```

`lib/seo.ts` wraps `@ishub/site-kit/seo` and injects the manifest, so you never pass business facts by
hand. `components/JsonLd.tsx` renders one or many nodes:

```tsx
<JsonLd
  data={[
    serviceJsonLd(svc.slug) ?? {},
    breadcrumbJsonLd([
      { name: "שירותים", path: "/services/" },
      { name: svc.title, path: `/services/${svc.slug}/` },
    ]),
  ]}
/>
```

The site-wide `GeneralContractor` node is emitted once in `app/layout.tsx` — never repeat it on a page.

**Never hand-assemble a node the builders cover, and never hardcode a value the manifest carries.**

## What's already right — don't regress it

- The site-wide `GeneralContractor` node from the manifest (layout), the `WebSite` node on `/`, and
  page-type nodes everywhere: `CollectionPage` (`/services/`, `/service-areas/`, `/guides/`),
  `AboutPage` (`/about/`, with the owner's `Person` `#owner`), `ContactPage` (`/contact/`),
  `WebPage` with `dateModified` on the service pages.
- All 5 service pages emit `Service` + `WebPage` (`author: {@id #owner}` + the `Person` node on the
  same page, matching the visible `<Byline>`) + `BreadcrumbList` + their own `FAQPage`.
- Every article emits `Article` (author, publisher, dates from the article's own fields) + `Person` +
  `BreadcrumbList` + `FAQPage` derived from its `faq` block (`lib/articles`).
- `BreadcrumbList` on every nested route (18 of 19 content routes; the homepage correctly does not).
  `breadcrumbJsonLd()` prepends בית itself, because `PageHero` renders that crumb outside the
  `crumbs` prop — the two surfaces cannot drift.
- `FAQPage` on exactly the routes that own a distinct Q&A set: `/faq/` (16), the 5 service pages, the
  articles. **Not** on `/` or `/pricing/` — removed 2026-09-01 because three URLs marking up the same
  six Q&As competed for one entity.
- No `Review` or `AggregateRating` anywhere. This is correct and load-bearing — see the gating rules.

## The gaps

| Route       | Missing                                                                                  | Backlog |
| ----------- | ---------------------------------------------------------------------------------------- | ------- |
| `/pricing/` | `OfferCatalog` — deliberately withheld while two prices are 🔶 and three are non-numeric | §4.3    |
| site-wide   | `sameAs` is `[]` — needs the Google Business Profile URL in the roster                   | §4.5    |
| site-wide   | `Review`/`AggregateRating` — only after real, publicly verifiable reviews exist          | §7      |

## Per route type

| Route                 | Emit                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------- |
| `/`                   | `GeneralContractor` (layout) + `WebSite` — no `FAQPage` (owned by `/faq/`)             |
| `/services/{slug}/`   | `Service` + `WebPage`(author, dateModified) + `Person` + `BreadcrumbList` + `FAQPage`  |
| `/services/`          | `CollectionPage` + `BreadcrumbList`                                                    |
| `/pricing/`           | `WebPage` + `BreadcrumbList` (`OfferCatalog` after 1.9; no `FAQPage` since 2026-09-01) |
| `/faq/`               | `FAQPage` (16 visible questions) + `BreadcrumbList`                                    |
| `/guides/`            | `CollectionPage` + `BreadcrumbList`                                                    |
| `/guides/{slug}/`     | `Article` + `Person` + `BreadcrumbList` + `FAQPage` from the `faq` block               |
| `/service-areas/`     | `CollectionPage` + `BreadcrumbList`                                                    |
| `/about/` `/contact/` | `AboutPage` / `ContactPage` + `BreadcrumbList`                                         |
| `/locations/{slug}/`  | `Service` with `areaServed` + `BreadcrumbList` (silo not built)                        |

## Location pages, when the silo is built

⚠️ **The builders can't express this yet.** The kit is
`serviceJsonLd(m, { name, description?, slug?, url? })` — it derives `serviceType` from `name` and
hardcodes `areaServed` from `m.schema.areaServed` as an `AdministrativeArea`
(`@ishub/site-kit/src/seo/index.ts:118-134`); `serviceJsonLd()` in `lib/seo.ts` narrows it to a single `slug` string.
A per-city `areaServed` means **extending the kit first** — not hand-assembling a node around it.
Target once extended:

```ts
serviceJsonLd(manifest, {
  name: `ניסור וקידוח בטון ב${loc.prefixed}`,
  areaServed: { "@type": loc.kind === "region" ? "AdministrativeArea" : "City", name: loc.name },
});
```

`גוש דן` and `השרון` are regions — typing a region as a `City` is a factual error in the graph.

**Never emit a `GeneralContractor`/`LocalBusiness` node per location.** One operation means one node.
Fourteen of them would imply fourteen premises that don't exist and is a recognised local-spam pattern.

## The gating rules — correctness, not preference

1. **`Review` / `AggregateRating` ship only with a verifiable public source.** This is not theoretical
   here: three **invented** testimonials once shipped on this site and were removed 2026-08-17
   (backlog §7.1). Marking up anything like them would convert a content problem into a
   structured-data policy violation and a Rich Results failure. Do not add the markup — not even to
   "test it". Real reviews first (see `docs/business-facts.md` §B), schema after.
2. **Schema must match visible content.** A `FAQPage` question not rendered on the page is a
   violation. `Offer` values must equal the visible price table. Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible.** `/`, `/faq/` and `/pricing/` all render the full `faqs`
   array unconditionally, so all three _qualify_ — but since 2026-09-01 only `/faq/` emits it, because
   three URLs marking up the same six Q&As competed for one entity. One `FAQPage` per distinct Q&A set. If `components/Faq.tsx` ever becomes a conditionally
   rendering accordion, the markup stops qualifying — keep the answers in the DOM.
4. **No dangling `@id`s.** `serviceJsonLd` wires `provider` to the business `@id`; don't invent refs.
5. **`foundingDate` follows `foundedYear`.** The manifest says 2005, so the field is present. It is
   never inferred from "מעל 20 שנה" in the copy, and if the roster ever nulls it, the field goes.
6. **One business node, site-wide.** It lives in `app/layout.tsx`. Pages add nodes; they never repeat it.

## Missing business fields and what blocks each

`sameAs` (empty), `geo`, `hasMap`, `aggregateRating`, `founder`, `streetAddress` — all blocked on
`docs/business-facts.md`. Add the row; don't fill the value. And they belong in the **roster manifest**
(`Israeli services sites/roster/sites/betonplus.json`), never in `site.config.json` directly.

## Checklist

- [ ] Every nested route emits `BreadcrumbList` built from the same array the UI renders.
- [ ] Every `FAQPage` question is visible on the page.
- [ ] `author` on a `WebPage`/`Article` node only where a visible byline names the same person, with the `Person` node emitted on that page.
- [ ] `Offer` values equal the rendered price table.
- [ ] No `Review` or `AggregateRating` without a public source URL.
- [ ] The business node appears exactly once, from the layout.
- [ ] `@id`s match the canonical.

## Verify

```bash
grep -rL 'application/ld+json' out --include=index.html          # pages with no schema
grep -rl 'BreadcrumbList' out --include=index.html | wc -l       # expect 18
grep -rl 'aggregateRating\|"@type": *"Review"' out --include=index.html   # expect none
```

Then run Google's Rich Results Test on one URL per route type. Zero errors is the bar.
