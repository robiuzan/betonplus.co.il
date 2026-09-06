# Business facts — intake sheet

Every claim this site makes must trace to a source. This file is the register of what is **confirmed**
and what is **🔶 unconfirmed**. Nothing here may be filled in by inference, industry norm, or a
competitor's page.

**How to use it:** if you need a fact that is 🔶, do not state it. Write around it, mark the line
`// 🔶 confirm` in code, and make sure the row below exists. When the owner supplies a value, update
the row, update the roster manifest (`Israeli services sites/roster/sites/betonplus.json`) if it is an
identity/NAP/schema field, sync, and remove the marker.

**Never edit `site.config.json` directly** — it is synced from the roster.

---

## A. Identity & history

| Fact               | Current value                      | Source                                                                                                                                                                                                                                                                                                                                                           | Status                                         |
| ------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Brand name         | בטון פלוס                          | roster manifest                                                                                                                                                                                                                                                                                                                                                  | ✅ confirmed                                   |
| Legal entity / ח.פ | `legalName: "בטון פלוס"`           | roster, echoed in `lib/site.ts` (`site.legalName`)                                                                                                                                                                                                                                                                                                               | 🔶 is this the registered entity?              |
| Founded            | 2005                               | roster `foundedYear` → `foundingDate` in the JSON-LD on every page, plus the literals in `lib/site.ts` (FAQ answer, trustStats, differentiator), `components/Hero.tsx` (chip + stat) and `app/about/page.tsx` (hero lead, AboutPage description, first paragraph) — **all marked 🔶 since 2026-09-06**; removed from the `/about/` meta description the same day | 🔶 owner-asserted, never evidenced             |
| "מעל 20 שנה"       | `site.yearsLabel` in `lib/site.ts` | derived from 2005                                                                                                                                                                                                                                                                                                                                                | ✅ consistent **if** 2005 is right             |
| Named person       | **אור שוורץ** — בעלים              | owner-supplied 2026-08-30                                                                                                                                                                                                                                                                                                                                        | ✅ name + photo consent given                  |
| His biography      | `owner` in `lib/site.ts`           | his own words, 2026-08-30                                                                                                                                                                                                                                                                                                                                        | ✅ published on `/about/`                      |
| His years in trade | "למעלה מעשור" (his phrasing)       | owner-supplied 2026-08-30                                                                                                                                                                                                                                                                                                                                        | 🔶 **held back — conflicts with "מעל 20 שנה"** |
| Address            | region only (`מרכז`, `IL`)         | roster `schema.address`                                                                                                                                                                                                                                                                                                                                          | 🔶 street address? or deliberate?              |
| Hours              | א׳–ה׳ 07:00–18:00 · ו׳ 07:00–13:00 | `hoursLines` in `lib/site.ts`                                                                                                                                                                                                                                                                                                                                    | 🔶 marked confirm in code                      |

**✅ The anonymity problem is solved (2026-08-30).** אור שוורץ, בעלים, is named on `/about/` in his own
words, with a `Person` node in the graph (`#owner`, `worksFor` the business — deliberately **not**
`founder`, see below). He consented to publishing his name and photographs. His four biographical
paragraphs are first-person claims by a real, identifiable person: **nothing in them may be
embellished, extended or "improved".**

**🔴 One open conflict, and it needs the owner.** He describes himself as being in construction
**"למעלה מעשור"**, while the site claims the business has run **"מעל 20 שנה"** (from
`foundedYear: 2005`, which drives `foundingDate` in the JSON-LD plus the `yearsLabel` claim in four
places). Both appear on `/about/`. That sentence is therefore **held back from the published bio** —
shipping both would put a visible contradiction on a single page, which is worse for trust than either
claim alone. Three ways it resolves:

1. The business really has run since 2005 and אור came to it later — then both are true and the
   sentence can ship once the relationship is stated.
2. The business is roughly a decade old — then `foundedYear` is wrong and must change in the **roster**,
   which also corrects `foundingDate` and all four `yearsLabel` sites.
3. He has more years in the trade than "עשור" conveys — then the number simply gets restated.

Until one of those is confirmed, neither figure gains evidence and the bio ships without the claim.

---

## B. Proof & authority — the site's biggest liability

| Fact                | Current value                                                                               | Source                               | Status                                     |
| ------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------ |
| Customer reviews    | none published — the 3 invented testimonials + `/reviews/` route **removed 2026-08-17**     | —                                    | ✅ resolved; real GBP reviews still needed |
| Google rating       | —                                                                                           | none                                 | 🔶 does a GBP exist at all?                |
| Project count       | `+1,000 פרויקטים בוצעו`                                                                     | `trustStats` in `lib/site.ts`        | 🔶 marked confirm in code                  |
| Insurance (צד ג׳)   | claimed **4×** (three copy sites in `lib/site.ts` + the hero chip in `components/Hero.tsx`) | `grep -rn "צד ג" lib app components` | 🔶 policy? insurer? cover amount?          |
| Licences / תעודות   | —                                                                                           | nowhere                              | 🔶 any certification to show?              |
| `schema.sameAs`     | `[]`                                                                                        | roster                               | 🔶 no off-site profile at all              |
| Photos of real work | **none** — `public/` has brand only                                                         | —                                    | 🔶 can the owner supply photos?            |

**✅ Resolved 2026-08-17.** The three invented testimonials (אבי כהן, מאיה לוי, דניאל אזולאי) and the
`/reviews/` route were **removed**; `public/_redirects` 301s the old URL, and a note at the former
array site in `lib/site.ts` documents the rule. This ends the policy exposure — it does **not** create
social proof. The permanent rules:

1. **Never write a testimonial, a customer name, or a quote** — not even as a placeholder. Fabricated
   reviews are a Google spam-policy violation and, in Israel, a consumer-protection exposure.
2. Reviews return only as **real, attributed quotes with a verifiable public source** — realistically
   from a Google Business Profile (§F). Only then may a reviews section, route, and eventually
   `Review`/`AggregateRating` schema come back, in that order.

**No `Review` or `AggregateRating` JSON-LD may be added until real, publicly verifiable reviews
exist.** Currently the graph correctly emits none.

---

## C. Commercial terms

| Fact                           | Current value           | Source                                  | Status                     |
| ------------------------------ | ----------------------- | --------------------------------------- | -------------------------- |
| ניסור קירות — price from       | `₪150 למ״ר`             | `services[].priceFrom` (wall-sawing)    | 🔶                         |
| קידוח יהלום — price from       | `₪190 למ׳`              | `services[].priceFrom` (core-drilling)  | 🔶                         |
| רצפות/תקרות · wire saw · הריסה | "הצעת מחיר" (no number) | `services[].priceFrom` (three services) | ✅ safe                    |
| Minimum call-out / travel fee  | —                       | nowhere                                 | 🔶                         |
| Warranty / אחריות              | not claimed             | —                                       | ✅ nothing to substantiate |
| Payment terms, VAT inclusion   | —                       | nowhere                                 | 🔶                         |

**Consistency check — single-sourced since 2026-08-24.** Every price on the site derives from
`services[].priceFrom` through `priceOf()` / `priceAmount()` / `priceLabel()` in `lib/site.ts` — the
pricing table, the FAQ answer and the hero chips. Change a `priceFrom` and every surface follows.
(The FAQ used to restate `₪150`/`₪190` as hand-copied literals; the hero re-introduced the same bug
once and was fixed 2026-09-01. Any new price literal in JSX is a regression.)

The `* המחירים הם מחירי התחלה להמחשה בלבד` disclaimer on `/pricing/` is doing real work — keep it.

---

## D. Media

| Asset                     | Status                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `public/brand/*`          | ✅ logo + mark, referenced by the JSON-LD                   |
| OG card (`imgquarry.com`) | ✅ in the manifest with sha256 + dimensions                 |
| `app/opengraph-image.tsx` | ✅ build-time 1200×630, used by every page via `lib/seo.ts` |
| Photos of completed work  | 🔶 **none exist**                                           |
| Team / equipment photos   | 🔶 none                                                     |

**The gap:** a concrete-cutting site with zero photographs of concrete being cut. Before/after openings,
core-drilled penetrations and the diamond kit itself are the proof this trade sells on, and competitors
all show them. This is an owner-supply item, not something to source from stock. **Never use a stock or
generated image as evidence of this business's own work** — that is the same class of error as the fake
reviews.

---

## E. Coverage

| Fact                  | Current value                       | Source        | Status                         |
| --------------------- | ----------------------------------- | ------------- | ------------------------------ |
| `schema.areaServed`   | `גוש דן והמרכז, ישראל`              | roster        | ✅                             |
| Area list (14 cities) | תל אביב … ראש העין                  | `lib/site.ts` | ✅ confirmed 2026-08-30        |
| Area groups           | 3 groups, all inside גוש דן והמרכז  | `lib/site.ts` | ✅ confirmed 2026-08-30        |
| FAQ coverage answer   | names the real area, no wider claim | `lib/site.ts` | ✅ confirmed 2026-08-30        |
| Hero coverage stat    | `גוש דן` / אזור הפעילות             | `Hero.tsx`    | ✅ confirmed 2026-08-30        |
| Travel / minimum job  | —                                   | nowhere       | 🔶 is there a callout minimum? |

**✅ Resolved 2026-08-30 (owner decision).** The service area is **גוש דן והמרכז**, matching
`schema.areaServed` exactly. All four surfaces were aligned in one pass:

1. **ירושלים and מודיעין removed** from `serviceAreas` (16 → 14 cities), and the fourth area group
   ("מחוץ לגוש דן — בתיאום מראש") was deleted.
2. **"פריסה ארצית" removed** from the FAQ answer, replaced by the real city list.
3. **The hero stat "ארצי" replaced** with `גוש דן`.

Rationale, recorded so it is not silently re-widened: a coverage claim wider than the business can
service does nothing for proximity-weighted local ranking, and it generates leads that have to be
declined. Re-widening requires an owner decision and an update to this row.

**Still open:** whether there is a minimum job size or a callout/travel fee. That one matters for the
location silo (`/new-city`) and for `/pricing/`.

---

## F. Infrastructure — owner-only changes

| Item                             | State                                                                                                                                                                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GTM container                    | ✅ `GTM-KWGGH438` — verified 200, live in production                                                                                                                                                                                                 |
| GA4 property for betonplus.co.il | ✅ `G-VMVP7XQKMG` — supplied 2026-08-30, in the roster, synced to `site.config.json` 2026-09-06. The live container routes hostname `betonplus.co.il` to it (page views flow). ⚠️ **Lead events are not yet tagged in the container** — roadmap 7.3. |
| Search Console verification      | ✅ resolved 2026-08-17 — token lives in the roster manifest (`analytics.googleSiteVerification`), synced down, read from the manifest in `app/layout.tsx`                                                                                            |
| Google עסק שלי (GBP)             | 🔶 unknown whether one exists                                                                                                                                                                                                                        |
| Cloudflare AI-crawler policy     | ✅ **verified live 2026-08-30** — `robots.txt` matches `app/robots.ts` exactly; the managed block is gone. Still a zone setting: re-verify with `curl`, never infer from source.                                                                     |
| Security headers                 | ✅ **verified live 2026-08-30** — HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy and the report-only CSP all present on the origin response.                                                                     |

_(The Search Console token drift was resolved 2026-08-17 — the value now lives in the roster manifest,
so a sync manages it and cloned sites no longer inherit betonplus's token.)_

The AI-crawler policy is a **zone setting**, changed only in the Cloudflare dashboard by the owner. No
repo change overrides it — which is why `app/robots.ts` being correct proves nothing on its own.
Verified allowing on 2026-08-30 (`curl https://betonplus.co.il/robots.txt` matched the source exactly),
but a zone change could silently reverse it. **Re-verify against the live file, never against source.**
See `/aeo-answer-content`.

---

## Verified during the 2026-08-16 audit — no action needed

- Phone `055-6601006` and email `info@betonplus.co.il` are consistent everywhere they appear.
- `GTM-KWGGH438` returns HTTP 200 and is present in the live HTML.
- No `Review` or `AggregateRating` JSON-LD is emitted anywhere in `out/`.
- Prices on `/pricing/` match `services[].priceFrom` and match the FAQ.
- All 15 content routes carry exactly one `<h1>` and one self-referencing canonical.
- Brand-token contrast passes AA: `.btn-cta` (amber `#f59e0b` on brand `#1f2a37`) is **6.77:1**,
  `.eyebrow` steel on white **5.17:1**, muted on white **7.56:1**, footer white on brand **14.54:1**.
