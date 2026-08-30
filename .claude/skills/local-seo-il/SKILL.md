---
name: local-seo-il
description: Israeli local-SEO doctrine for בטון פלוס — NAP consistency across site, schema and Google עסק שלי; the missing location silo and the 5-service × 14-area matrix with its expansion cap; Hebrew ב+city grammar; geo signals; and the non-negotiable doorway-page policy. Use when populating locations or services for local ranking, or auditing local visibility. Triggers: "local SEO", "NAP", "city pages", "Google עסק שלי", "doorway pages", "areaServed", "add a city".
---

# Local SEO — Israel

One mobile operation, no published street address, 14 named service areas and **zero location pages**.
Everything below follows from that.

## 1. The structural gap

`lib/site.ts` holds 14 area names as plain strings. `components/ServiceAreasSection.tsx` renders
them as chips. **The chips link nowhere and no page targets `<service> ב<city>`** (backlog §5.1).

For a trade chosen almost entirely by proximity — a contractor in בני ברק wants someone who can be
there tomorrow — that is the single largest missing surface on the site. It is also the easiest one to
get catastrophically wrong (see §4).

## 2. NAP consistency

The name, phone and email must be **byte-identical** everywhere they appear: the site, the JSON-LD, and
the Google Business Profile.

Current state: phone and email are consistent everywhere and sourced from the manifest — genuinely
good, and better than most of the fleet. But:

- **No street address is published.** `schema.address` carries `addressRegion: מרכז` and
  `addressCountry: IL` only. For a mobile operation that may be deliberate, but it removes the
  strongest local signal there is. Confirm the intent (`docs/business-facts.md` §A) before treating it
  as settled.
- The footer shows no address block at all — the most common place a crawler or a human looks.

If an address is ever supplied, it goes in the **roster manifest**, then syncs down. Never type it into
a component.

## 3. Google עסק שלי — the top lever

`schema.sameAs` is `[]`. **There is no GBP link anywhere on the site, and nothing off-site corroborates
that this business exists.** For a single-operation trade business, the Business Profile outranks
almost everything you can do on-page: it drives the map pack, it is where reviews live, and it is the
entity anchor that makes `sameAs` meaningful.

It is also the only legitimate route out of the fabricated-reviews problem (§7.1 of the backlog): real
GBP reviews replace invented ones. This is a `docs/business-facts.md` §B blocker, not a code task.
Escalate it rather than working around it.

Once supplied: URLs go in the **roster manifest** `schema.sameAs`, then sync.

## 4. The doorway policy — non-negotiable

> Replace the city name with another city name. Is the page now correct and publishable for that other
> city? If yes, it is a doorway page.

Betonplus has the rare advantage of **not having shipped 14 doorway pages yet**. Don't create them.

To pass, a location page needs **three or more** true, specific items:

- Named neighbourhoods, streets or industrial zones.
- Building-stock reality — 1960s reinforced shear walls in the older שיכונים versus post-tensioned
  slabs in new towers, and how that changes the cut and the price.
- Access reality — parking and crane access, lift dimensions for getting a wire saw upstairs, water
  supply for wet cutting, and that municipality's permitted working hours.
- A real job reference from that city (with permission).
- Travel and same-day reality for that distance.
- A city-specific FAQ that would read oddly anywhere else.

**If none of those can be said truthfully about a city, that city does not warrant a page.** Full spec:
`docs/content-standards.md` §2. Doorway clusters are an explicit Google spam policy and the penalty
lands on the domain, not the page.

## 5. The expansion cap

5 services × 14 areas = 70 possible cells. **Do not build them.** Order of operations
(`docs/keyword-map.md` §6):

1. ✅ The 5 **service** pages reached the 450-word bar in wave 2 (456–574 unique words each).
2. ✅ Coverage resolved 2026-08-30 — see §6 below.
3. Build a **first tier** of location pages only for areas with real substance — realistically תל אביב,
   רמת גן, גבעתיים, בני ברק, פתח תקווה, ראשון לציון, חולון, בת ים.
4. Only then consider service × location cells, and only for the two heads (ניסור קירות,
   קידוח יהלום). Nobody searches "ניסור בכבל יהלום בגבעתיים".

Both gates are now met. Scaling a thin pattern still multiplies risk, not reach — the doorway test in §4 is what governs from here.

## 6. Coverage honesty — settled

✅ **Resolved 2026-08-30 (owner decision).** All four sources now agree:

| Source                      | Says                                  |
| --------------------------- | ------------------------------------- |
| `schema.areaServed`         | גוש דן והמרכז, ישראל                  |
| `serviceAreas` visible list | 14 cities, all inside גוש דן והמרכז   |
| `serviceAreaGroups`         | 3 groups, no "outside the area" tier  |
| `faqs` coverage answer      | names the real cities, no wider claim |
| Hero stat                   | `גוש דן` / אזור הפעילות               |

ירושלים and מודיעין were removed; the "פריסה ארצית" claim is gone.

**Do not re-widen this.** An `areaServed` the business cannot actually service produces leads it can't
serve and a claim it can't defend — and a wider claim does nothing for proximity-weighted local
ranking. Any change goes to the owner first, then the roster, then the copy, then
`docs/business-facts.md` §E.

## 7. Hebrew grammar per location

When the silo is built, the areas array needs two more fields — the templates must never interpolate a
bare `ב${name}`:

```ts
{ slug: "תל-אביב",  name: "תל אביב",  kind: "city",   prefixed: "בתל אביב" }
{ slug: "ראשון-לציון", name: "ראשון לציון", kind: "city", prefixed: "בראשון לציון" }
{ slug: "גוש-דן",   name: "גוש דן",   kind: "region", prefixed: "בגוש דן" }
{ slug: "השרון",    name: "השרון",    kind: "region", prefixed: "באזור השרון" }
```

`prefixed` carries the preposition so no template has to guess. `kind` drives the schema type —
`City` versus `AdministrativeArea` (see `/schema-structured-data`).

## 8. Geo signals

Missing entirely: `GeoCoordinates`, `hasMap`, any map embed on `/contact/`, and any neighbourhood or
landmark reference anywhere in the copy. Coordinates go in the roster manifest `schema.geo`. For a
business with no published address, a service-area polygon or a city centroid is the honest option —
never a fake pin on a street.

## 9. Internal equity

The 14 area chips are a dead end (backlog §9.3). No service page mentions a city; no city page exists
to link back. When the silo lands, wire both directions in the same pass — see `/internal-linking` §3.

## Checklist

- [ ] NAP renders from the manifest — no literals anywhere.
- [ ] The §6 coverage table still holds — all five surfaces agree.
- [ ] Every location has `kind` and `prefixed`; no template interpolates a bare `ב${name}`.
- [ ] Every location page passes the doorway test.
- [ ] Location pages emit `Service` + `areaServed` with the correct area type.
- [ ] `sameAs` populated, or a 🔶 row exists in `docs/business-facts.md`.
- [ ] Every area shown as a chip either links to a real page or is honestly presented as a list.

## Gotchas

- **Never** a `LocalBusiness`/`GeneralContractor` node per city. One operation, one node.
- Never invent a neighbourhood, a landmark, a local job, or a coverage claim to fill a checkbox.
- Adding city pages will not fix thin service pages — it multiplies them.
