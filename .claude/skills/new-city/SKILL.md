---
name: new-city
description: Build or extend the location silo that doesn't exist yet — turn the 14 flat serviceAreas strings in lib/site.ts into typed entries with kind and prefixed, author genuinely unique per-city content, and add the /locations/[city]/ route so schema, links and the sitemap follow. Use when expanding local coverage or when asked for city pages. Triggers: "add a city", "new location page", "cover <city>", "city pages", "doorway", "local landing pages".
---

# Build or extend the location silo

**Read this first — two gates before any of this ships:**

1. ✅ **The 5 service pages cleared the 450-word floor** in wave 2 (456–574 unique words each). This
   prerequisite is met — location pages no longer sit on top of thin service pages.
2. ✅ **The coverage story was resolved 2026-08-30** (owner): the area is **גוש דן והמרכז**, ירושלים
   and מודיעין are out, and all four surfaces agree. `serviceAreas` holds 14 cities.
   `docs/business-facts.md` §E records the decision.

Betonplus has the rare advantage of not having shipped 14 doorway pages. Don't create them.

## Where things stand

`lib/site.ts` holds 14 area names as flat strings:

```ts
export const serviceAreas: string[] = ["תל אביב", "רמת גן", …]; // coverage confirmed 2026-08-30: גוש דן והמרכז
```

`components/ServiceAreasSection.tsx` renders them as chips that link nowhere. There is no
`/locations/` route, no per-city content, and no `kind`/`prefixed` metadata.

## The data model to move to

```ts
// lib/site.ts
export interface ServiceArea {
  slug: string; // ASCII or Hebrew — see the note at the bottom
  name: string; // display name: "תל אביב"
  kind: "city" | "region"; // drives City vs AdministrativeArea in the schema
  prefixed: string; // name with its preposition: "בתל אביב", "באזור השרון"
}

export const serviceAreas: ServiceArea[] = [
  { slug: "tel-aviv", name: "תל אביב", kind: "city", prefixed: "בתל אביב" },
  { slug: "ramat-gan", name: "רמת גן", kind: "city", prefixed: "ברמת גן" },
];
```

`prefixed` carries the preposition so no template has to guess. A bare `ב${name}` produces wrong Hebrew
for regions — "בשרון" should be "באזור השרון". `kind` drives the schema type
(`/schema-structured-data`).

```ts
export interface CityContent {
  answer: { q: string; a: string };  // 40–60 words, the AEO block
  intro: string[];                   // 2–3 paragraphs, city-specific
  localNotes: string[];              // the substance — see the doorway test
  neighborhoods?: string[];
  access?: string;                   // parking, crane access, lift size, water supply, working hours
  travel?: string;                   // realistic scheduling for this distance
  faqs: Faq[];                       // 2–3, city-specific
  nearby: readonly string[];         // 2–4 adjacent areas
}

export const cityContent: Record<string, CityContent> = { … };
```

## The doorway test — the gate

> Replace the city name with a different city name. Is the page now correct and publishable for that
> other city? **If yes, it does not ship.**

To pass, `localNotes` needs **three or more** true, specific items:

- Named neighbourhoods, streets or industrial zones.
- Building-stock reality — the 1960s שיכונים with heavily reinforced shear walls versus the new towers
  with post-tensioned slabs, and how that changes the cut, the equipment and the price.
- Access reality — parking and crane access, whether a wire saw fits the building's lift, water supply
  for wet cutting, and that municipality's permitted working hours.
- A real job reference from that city (with permission), or a photo.
- Travel and scheduling reality — how far, whether same-day genuinely applies at that distance.
- Local pricing reality if it differs.

**If none of those can be said truthfully about a city, that city does not warrant a page.** Record
that in `docs/business-facts.md` §E rather than padding. A page that exists to hold a keyword is
exactly what Google's doorway policy names, and the penalty lands on the domain.

## Steps

1. **Check the gates** at the top of this file, and the expansion cap in `docs/keyword-map.md` §6 —
   a realistic first tier is תל אביב, רמת גן, גבעתיים, בני ברק, פתח תקווה, ראשון לציון, חולון, בת ים.
2. Migrate `serviceAreas` from `string[]` to `ServiceArea[]`. Update
   `components/ServiceAreasSection.tsx` and `app/service-areas/page.tsx` to read `.name`.
3. Add the `cityContent` entry. Meet the 350-word floor in `docs/content-standards.md` §1 with genuine
   local substance, not longer versions of the shared paragraphs.
4. Set `nearby` from real geography, and add this city to the `nearby` of its neighbours — the edge is
   bidirectional; a one-way link is a modelling error.
5. Create `app/locations/[city]/page.tsx` following `app/services/[slug]/page.tsx`: `force-static`,
   `dynamicParams = false`, `generateStaticParams`, `await params`, `pageMetadata()`, `JsonLd` with
   `serviceJsonLd` + `breadcrumbJsonLd`, `PageHero` with crumbs.
   Render order: answer block → intro → local notes → the service list → nearby areas → city FAQ → CTA.
6. Metadata per `docs/keyword-map.md` §3 — `ניסור בטון ב${prefixed}`, and **no second brand token**
   (the layout template appends it; don't set `absoluteTitle` here).
7. Schema: `Service` + `areaServed` with `City` or `AdministrativeArea` per `kind`, plus
   `BreadcrumbList`. **Never a business node per city** (`/local-seo-il`).
8. Link the chips on `/service-areas/` to the new pages, and add 4–6 area links to each service page
   (`/internal-linking` §3).
9. Add the route to `staticPaths` in `app/sitemap.ts` — or better, fix §1.1 first and derive it.
10. `npm run lint && npm run typecheck && npm run format:check && npm run build`, then verify the
    route in `out/` **and** in `out/sitemap.xml`.

## Slug choice

Betonplus's routes are all ASCII today (`/services/wall-sawing/`). Staying ASCII (`/locations/tel-aviv/`)
keeps the URL scheme consistent and avoids the fleet's percent-encoding trap entirely. If you choose
Hebrew slugs instead, params arrive **percent-encoded** during static export and must be matched with
`decodeURIComponent(slug).normalize("NFC")` — skipping that works in dev and 404s in production — and
`app/sitemap.ts` needs `encodeURI` so the `<loc>` is byte-identical to the canonical.

Pick one and apply it to the whole silo. Never rename a slug after launch without a `public/_redirects` 301.

## Checklist

- [ ] Both gates at the top of this file still hold (depth ✅ wave 2, coverage ✅ 2026-08-30).
- [ ] `kind` and `prefixed` set; no template interpolates a bare `ב${name}`.
- [ ] ≥350 unique words; three or more genuinely local items.
- [ ] Passes the doorway substitution test.
- [ ] Opens with a 40–60 word answer block.
- [ ] `nearby` set on both sides.
- [ ] Title has the brand exactly once; canonical has both slashes.
- [ ] `Service` + `areaServed` + `BreadcrumbList` emitted; no business node per city.
- [ ] Chips link to real pages; service pages link back.
- [ ] Present in `out/` and `out/sitemap.xml`.

## Gotchas

- Never invent a neighbourhood, a landmark, an access detail or a local job. Unverified →
  `// 🔶 confirm` + `docs/business-facts.md`.
- Don't ship 14 pages in one pass. Ship two that pass the doorway test, then judge.
- ירושלים and מודיעין are **out of the service area** as of 2026-08-30 — never build pages for them.
