# Schema graph — target JSON-LD

What the structured data on betonplus.co.il should be. The `schema-structured-data` skill is how to
emit it; the `schema-auditor` agent validates the export against this file.

All nodes are built with `@ishub/site-kit/seo` through the thin wrappers in `lib/seo.ts`
(`localBusinessJsonLd`, `serviceJsonLd`, `faqJsonLd`, `breadcrumbJsonLd`). Per-page nodes are rendered
by `components/JsonLd.tsx`; the **site-wide business node is rendered inline in `app/layout.tsx:35,66`**
with its own escaped `<script>`, not through that component. **Never hand-assemble a node the builders
cover.**

---

## 1. `@id` scheme

**Only one `@id` exists in the export today:** the business node's, which the kit hardcodes as
`` `${m.url}/#business` `` (`@ishub/site-kit/src/seo/index.ts:98`). `Service`, `FAQPage` and
`BreadcrumbList` nodes carry no `@id` at all. Verified: `grep -o '"@id":"[^"]*"' out/index.html` returns
`https://betonplus.co.il/#business` and nothing else.

The scheme below is the **target**, not the current state. Adopting it means extending the kit builders
— don't hand-assemble `@id`s per page to fake it.

```
https://betonplus.co.il/#business          the business node (site-wide) -- THE ONLY ONE THAT EXISTS
https://betonplus.co.il/#website           WebSite
https://betonplus.co.il/services/wall-sawing/#service
https://betonplus.co.il/pricing/#breadcrumb
```

`@id`s use the same percent-escaped form as the canonical and the sitemap `<loc>`. Betonplus's routes
are ASCII, so escaping is a non-issue here — but keep the property if a Hebrew route is ever added.

---

## 2. Node per route type

| Route                         | Emit                                                                                  | Today                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`                           | `GeneralContractor` + `WebSite` + `FAQPage`                                           | ✅ all three (WebSite added 2026-08-17)                                                                         |
| `/services/{slug}/`           | `Service` + `BreadcrumbList` + `FAQPage`                                              | ✅ all three (per-service FAQPage added 2026-08-17)                                                             |
| `/services/`                  | `CollectionPage` + `BreadcrumbList`                                                   | ⚠️ breadcrumb only                                                                                              |
| `/pricing/`                   | `OfferCatalog` + `FAQPage` + `BreadcrumbList`                                         | ✅ breadcrumb + `FAQPage` (added 2026-08-17); `OfferCatalog` deferred until prices are confirmed (backlog §4.3) |
| `/faq/`                       | `FAQPage` + `BreadcrumbList`                                                          | ✅ both                                                                                                         |
| `/service-areas/`             | `CollectionPage` + `BreadcrumbList`                                                   | ⚠️ breadcrumb only                                                                                              |
| `/about/`                     | `AboutPage` + `BreadcrumbList`                                                        | ⚠️ breadcrumb only                                                                                              |
| `/contact/`                   | `ContactPage` + `BreadcrumbList`                                                      | ⚠️ breadcrumb only                                                                                              |
| `/reviews/`                   | — route **removed 2026-08-17** (fabricated testimonials); 301 via `public/_redirects` | ✅ gone; still **never** `Review`/`AggregateRating` without a source (§4)                                       |
| `/thank-you/`                 | nothing — noindex conversion page                                                     | ✅ intentionally bare                                                                                           |
| `/privacy/` `/accessibility/` | `BreadcrumbList`                                                                      | ✅                                                                                                              |
| `/locations/{slug}/` (future) | `Service` + `areaServed` + `BreadcrumbList`                                           | — silo doesn't exist                                                                                            |
| `/מדריכים/{slug}/` (future)   | `Article` + `BreadcrumbList` + `FAQPage`                                              | — hub doesn't exist                                                                                             |

**Verified 2026-08-17 (post wave 1):** all 14 content routes carry at least one `ld+json` block;
13 of 14 carry `BreadcrumbList` (the homepage correctly does not — it is the root; `/thank-you/` is
noindex and intentionally bare). `WebSite` + `FAQPage` ship on `/`; `FAQPage` also ships on `/faq/`
and `/pricing/`.

The cheapest remaining additions are the `CollectionPage`/`AboutPage`/`ContactPage` nodes (§2), all
low priority. `OfferCatalog` waits on confirmed pricing.

---

## 3. The business node

`@type: GeneralContractor` (a `LocalBusiness` subtype), sourced from the manifest — never hardcoded.

| Field                       | Source                            | State                                          |
| --------------------------- | --------------------------------- | ---------------------------------------------- |
| `name`, `url`               | `brandName`, `url`                | ✅                                             |
| `telephone`                 | `contact.phoneE164`               | ✅                                             |
| `email`                     | `contact.email`                   | ✅                                             |
| `image`, `logo`             | `public/brand/*` via `lib/seo.ts` | ✅                                             |
| `priceRange`                | `schema.priceRange` (`₪₪`)        | ✅                                             |
| `areaServed`                | `schema.areaServed`               | ✅ but contradicts the FAQ — business-facts §E |
| `openingHoursSpecification` | `schema.openingHours`             | ✅                                             |
| `address`                   | region only (`מרכז`, `IL`)        | ⚠️ no `streetAddress`/`postalCode`             |
| `foundingDate`              | `foundedYear: 2005`               | ⚠️ present but owner-asserted                  |
| `sameAs`                    | `schema.sameAs: []`               | ❌ empty — nothing corroborates the entity     |
| `geo`, `hasMap`             | —                                 | ❌ absent                                      |
| `aggregateRating`           | —                                 | ✅ correctly absent — see §4                   |

A `PostalAddress` with only `addressRegion` and `addressCountry` is valid, and for a mobile trade with
no walk-in premises it may be deliberate. But **an empty `sameAs` plus no `geo` means there is nothing
anywhere that corroborates this business exists** — that is a local-SEO and an AEO problem at once.
Route both to [business-facts.md](business-facts.md), don't invent values.

---

## 4. Gating rules — correctness, not preference

1. **`Review` / `AggregateRating` ship only with a verifiable public source.** Correctly absent from
   the graph today. **This is load-bearing here:** the three invented testimonials this site once
   rendered were removed 2026-08-17 — marking up anything like them would convert a content problem
   into a structured-data policy violation and a Rich Results failure. Do not do it — not even "to
   test the markup". Real reviews first (a GBP is the realistic source), schema after. See
   [business-facts.md](business-facts.md) §B.
2. **Schema must match visible content.** A `FAQPage` question not rendered on the page is a violation.
   `Offer` prices must equal the visible price table. Never mark up hidden content.
3. **`FAQPage` only where FAQs are visible.** `/` , `/faq/` and `/pricing/` all render the shared
   `faqs` array in full, so all three qualify. Keep the unconditional rendering in
   `components/Faq.tsx` — an accordion that conditionally renders would disqualify the markup.
4. **One business node, site-wide.** When the location silo is built, **never emit a `LocalBusiness`
   per city** — one operation means one node. Locations get `Service` + `areaServed`.
5. **No dangling `@id`s.** `serviceJsonLd` wires `provider` to the business `@id`; don't invent refs.
6. **`foundingDate` follows `foundedYear`.** If the roster ever sets it to `null`, the field disappears
   — it is never inferred from "מעל 20 שנה" in the copy.

---

## 5. Location-page schema (when the silo is built)

⚠️ **The current builders cannot express this yet.** The kit's signature is
`serviceJsonLd(m, { name, description?, slug?, url? })` — it derives `serviceType` from `name` and
hardcodes `areaServed` to `{ "@type": "AdministrativeArea", name: m.schema.areaServed }`
(`@ishub/site-kit/src/seo/index.ts:118-134`). The local wrapper narrows it further to
`serviceJsonLd(slug: string)` (`lib/seo.ts:71-79`).

So a per-city `areaServed` — and the `City` vs `AdministrativeArea` distinction — requires **extending
the kit builder first**, not hand-assembling a node around it. Target shape once extended:

```ts
serviceJsonLd(manifest, {
  name: `ניסור וקידוח בטון ב${city.prefixed}`,
  areaServed: { "@type": city.kind === "region" ? "AdministrativeArea" : "City", name: city.name },
});
```

`גוש דן` and `השרון` are regions, not cities — typing a region as a `City` is a factual error in the
graph. Add `kind` and `prefixed` to the location entries before building the silo (`/new-city`).

---

## 6. Article schema (when the hub is built)

`Article` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`
(a `Person` with a **real** name), `publisher` (`@id` → `#organization`), `mainEntityOfPage`. Plus
`BreadcrumbList` (`בית › מדריכים › {title}`) and `FAQPage` derived from the article's own FAQ block, so
the schema cannot drift from the copy.

**The author must be a real named person** — blocked on [business-facts.md](business-facts.md) §A.
Never invent a byline.

---

## 7. Verification

```bash
# every deep page carries JSON-LD
grep -rL 'application/ld+json' out --include=index.html

# breadcrumbs everywhere they should be — expect 13 (all content routes except / and /thank-you/)
grep -rl 'BreadcrumbList' out --include=index.html | wc -l

# nothing fabricated — expect no output
grep -rl 'aggregateRating\|"@type": *"Review"' out --include=index.html
```

Then run Google's Rich Results Test on one URL per route type. **Zero errors is the bar.**
