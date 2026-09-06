---
name: new-city
description: Build or extend the location silo that doesn't exist yet — serviceAreas in lib/site.ts is already a typed ServiceArea[] (14 entries; the slug must become ASCII before /locations/[city]/ exists — Next 16 static export aborts on Hebrew params; kind and prefixed for schema and grammar); author genuinely unique per-city content, then add the route so schema, links and the sitemap follow. Use when expanding local coverage or when asked for city pages. Triggers: "add a city", "new location page", "cover <city>", "city pages", "doorway", "local landing pages".
---

# Build or extend the location silo

> ⚠️ **City slugs must be ASCII** (`tel-aviv`, `ramat-gan`), not the Hebrew values currently in
> `serviceAreas[].slug`: the static export of Next 16.2.9 `btoa`-encodes dynamic params and aborts on
> Hebrew (`InvalidCharacterError`, hit 2026-09-06 on the guides hub). Change the `slug` values to ASCII
> before building `/locations/[city]/`; `prefixed`/`name` carry the Hebrew.

**Read this first — two gates before any of this ships:**

1. ✅ **The 5 service pages cleared the 450-word floor** in wave 2 (456–574 unique words each). This
   prerequisite is met — location pages no longer sit on top of thin service pages.
2. ✅ **The coverage story was resolved 2026-08-30** (owner): the area is **גוש דן והמרכז**, ירושלים
   and מודיעין are out, and all four surfaces agree. `serviceAreas` holds 14 cities.
   `docs/business-facts.md` §E records the decision.

Betonplus has the rare advantage of not having shipped 14 doorway pages. Don't create them.

## Where things stand

`lib/site.ts` already holds the typed model (Sprint 2, 2026-08-31):

```ts
export interface ServiceArea {
  slug: string; // Hebrew, hyphenated: "תל-אביב" — reserved for /locations/[city]/
  name: string; // display name: "תל אביב"
  kind: "city" | "region"; // drives City vs AdministrativeArea in the schema
  prefixed: string; // name with its preposition: "בתל אביב", "באזור השרון"
}

export const serviceAreas: ServiceArea[] = [
  { slug: "תל-אביב", name: "תל אביב", kind: "city", prefixed: "בתל אביב" },
  { slug: "רמת-גן", name: "רמת גן", kind: "city", prefixed: "ברמת גן" },
  // … 14 entries, all `kind: "city"` today
];
```

`serviceAreaGroups` groups them by real geography and resolves members through `area(name)`, which
**throws at build time** on an unknown name — a typo can no longer render a chip for a city we don't
serve. `components/ServiceAreasSection.tsx` and `app/service-areas/page.tsx` render `.name` as chips
that are **deliberately unlinked**: `slug` exists so the URL form is agreed before the silo is built,
and nothing may link to it until the route exists. There is no `/locations/` route and no per-city
content.

`prefixed` carries the preposition so no template has to guess. A bare `ב${name}` produces wrong Hebrew
for regions — "בשרון" should be "באזור השרון". `kind` drives the schema type
(`/schema-structured-data`).

## The data model still to add

```ts
export interface CityContent {
  answer: { q: string; a: string };  // 40–60 words, the AEO block
  intro: string[];                   // 2–3 paragraphs, city-specific
  localNotes: string[];              // the substance — see the doorway test
  neighborhoods?: string[];
  access?: string;                   // parking, crane access, lift size, water supply, working hours
  travel?: string;                   // realistic scheduling for this distance
  faqs: Faq[];                       // 2–3, city-specific
  nearby: readonly string[];         // 2–4 adjacent area slugs
}

export const cityContent: Record<string, CityContent> = { … }; // keyed by ServiceArea.slug
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
2. Add the `cityContent` entry, keyed by the area's `slug`. Meet the 350-word floor in
   `docs/content-standards.md` §1 with genuine local substance, not longer versions of the shared
   paragraphs.
3. Set `nearby` from real geography, and add this city to the `nearby` of its neighbours — the edge is
   bidirectional; a one-way link is a modelling error.
4. Create `app/locations/[city]/page.tsx` following `app/services/[slug]/page.tsx`:
   `export const dynamic = "force-static"`, `export const dynamicParams = false`,
   `generateStaticParams` returning `serviceAreas.map((a) => ({ city: a.slug }))`, and — because the
   slugs are Hebrew — in **both** `generateMetadata` and the component:

   ```ts
   const { city } = await params; // Next 16: params is a Promise
   const slug = decodeURIComponent(city).normalize("NFC");
   const area = serviceAreas.find((a) => a.slug.normalize("NFC") === slug);
   ```

   Skipping the decode+normalise works in dev and 404s in production. Then `pageMetadata()`, `JsonLd`
   with `serviceJsonLd` + `breadcrumbJsonLd` (it prepends בית itself), `personJsonLd()` +
   `webPageJsonLd(…, { author: true })` if you render a `<Byline>`, and `PageHero` with crumbs.
   Render order: answer block → intro → local notes → the service list → nearby areas → city FAQ → CTA.

5. Metadata per `docs/keyword-map.md` §3 — `ניסור בטון ${prefixed}` (`prefixed` already carries the
   ב), and **no second brand token** (the layout template appends it; don't set `absoluteTitle` here).
6. Schema: `Service` + `areaServed` with `City` or `AdministrativeArea` per `kind`, plus
   `BreadcrumbList`. **Never a business node per city** (`/local-seo-il`).
7. Link the chips in `ServiceAreasSection` and on `/service-areas/` to the new pages
   (`href={`/locations/${a.slug}/`}`), and add 4–6 area links to each service page
   (`/internal-linking` §3).
8. Sitemap: `app/sitemap.ts` derives from `staticRoutes` + `services`; add the location URLs there the
   same way (`encodeURI` so the `<loc>` is byte-identical to the canonical), or register each path in
   `staticRoutes` in `lib/site.ts`. Date each route in `routeUpdated`.
9. `npm run lint && npm run typecheck && npm run format:check && npm run build`, then verify the route
   in `out/` **and** in `out/sitemap.xml`.

## Slug choice — made

The slugs in `serviceAreas` are **Hebrew, hyphenated** (`תל-אביב`, `ראשון-לציון`), agreed in Sprint 2
so the whole silo ships with one form. Consequences: params arrive **percent-encoded** during static
export (decode + NFC-normalise as in step 4), `app/sitemap.ts` needs `encodeURI`, and the path you
pass to `pageMetadata()` must produce the same canonical form as the `<loc>` — pick the encoded form
once and use it in both. If you would rather go ASCII (`/locations/tel-aviv/`, matching
`/services/wall-sawing/`), change all 14 slugs in `lib/site.ts` **before** the first page ships.
Never rename a slug after launch without a `public/_redirects` 301.

## Checklist

- [ ] Both gates at the top of this file still hold (depth ✅ wave 2, coverage ✅ 2026-08-30).
- [ ] `kind` and `prefixed` set; no template interpolates a bare `ב${name}`.
- [ ] `decodeURIComponent(…).normalize("NFC")` in both `generateMetadata` and the component.
- [ ] ≥350 unique words; three or more genuinely local items.
- [ ] Passes the doorway substitution test.
- [ ] Opens with a 40–60 word answer block.
- [ ] `nearby` set on both sides.
- [ ] Title has the brand exactly once; canonical has both slashes and matches the sitemap `<loc>`.
- [ ] `Service` + `areaServed` + `BreadcrumbList` emitted; no business node per city.
- [ ] Chips link to real pages; service pages link back.
- [ ] Present in `out/` and `out/sitemap.xml`; dated in `routeUpdated`.

## Gotchas

- Never invent a neighbourhood, a landmark, an access detail or a local job. Unverified →
  `// 🔶 confirm` + `docs/business-facts.md`.
- Don't ship 14 pages in one pass. Ship two that pass the doorway test, then judge.
- ירושלים and מודיעין are **out of the service area** as of 2026-08-30 — never build pages for them.
