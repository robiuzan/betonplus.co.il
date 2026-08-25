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

| Fact               | Current value                      | Source                          | Status                              |
| ------------------ | ---------------------------------- | ------------------------------- | ----------------------------------- |
| Brand name         | בטון פלוס                          | roster manifest                 | ✅ confirmed                        |
| Legal entity / ח.פ | `legalName: "בטון פלוס"`           | roster, echoed `lib/site.ts:31` | 🔶 is this the registered entity?   |
| Founded            | 2005                               | roster `foundedYear`            | 🔶 owner-asserted, never evidenced  |
| "מעל 20 שנה"       | `lib/site.ts:37` `yearsLabel`      | derived from 2005               | ✅ consistent **if** 2005 is right  |
| Owner / founder    | —                                  | nowhere                         | 🔶 nobody is named anywhere on site |
| Address            | region only (`מרכז`, `IL`)         | roster `schema.address`         | 🔶 street address? or deliberate?   |
| Hours              | א׳–ה׳ 07:00–18:00 · ו׳ 07:00–13:00 | `lib/site.ts:48`                | 🔶 marked confirm in code           |

**Why it matters:** `foundedYear: 2005` drives `foundingDate` in the JSON-LD and the "מעל 20 שנה" claim
in four places. Unlike the rest of the fleet these two agree with each other — but they agree about a
number nobody has verified. Not naming a single human is the other half of the problem: for a trade
that enters occupied buildings and cuts structural concrete, an anonymous provider is a hard sell.

---

## B. Proof & authority — the site's biggest liability

| Fact                | Current value                                                                           | Source                    | Status                                     |
| ------------------- | --------------------------------------------------------------------------------------- | ------------------------- | ------------------------------------------ |
| Customer reviews    | none published — the 3 invented testimonials + `/reviews/` route **removed 2026-08-17** | —                         | ✅ resolved; real GBP reviews still needed |
| Google rating       | —                                                                                       | none                      | 🔶 does a GBP exist at all?                |
| Project count       | `+1,000 פרויקטים בוצעו`                                                                 | `lib/site.ts:253`         | 🔶 marked confirm in code                  |
| Insurance (צד ג׳)   | claimed 3×                                                                              | `lib/site.ts:254,291,328` | 🔶 policy? cover amount?                   |
| Licences / תעודות   | —                                                                                       | nowhere                   | 🔶 any certification to show?              |
| `schema.sameAs`     | `[]`                                                                                    | roster                    | 🔶 no off-site profile at all              |
| Photos of real work | **none** — `public/` has brand only                                                     | —                         | 🔶 can the owner supply photos?            |

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

| Fact                           | Current value           | Source                    | Status                     |
| ------------------------------ | ----------------------- | ------------------------- | -------------------------- |
| ניסור קירות — price from       | `₪150 למ״ר`             | `lib/site.ts:122`         | 🔶                         |
| קידוח יהלום — price from       | `₪190 למ׳`              | `lib/site.ts:147`         | 🔶                         |
| רצפות/תקרות · wire saw · הריסה | "הצעת מחיר" (no number) | `lib/site.ts:172,197,222` | ✅ safe                    |
| Minimum call-out / travel fee  | —                       | nowhere                   | 🔶                         |
| Warranty / אחריות              | not claimed             | —                         | ✅ nothing to substantiate |
| Payment terms, VAT inclusion   | —                       | nowhere                   | 🔶                         |

**Consistency check — currently passing.** `/pricing/` renders `services[].priceFrom` directly, and
`faqs[0]` (`lib/site.ts:308`) restates `₪150` / `₪190` as literals. The two agree today, but the FAQ is
a **hand-copied duplicate**: change a `priceFrom` and the FAQ silently contradicts the table on the
same page. Interpolate it. The fleet has already shipped that exact bug once on another site.

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

| Fact                  | Current value                     | Source            | Status            |
| --------------------- | --------------------------------- | ----------------- | ----------------- |
| `schema.areaServed`   | `גוש דן והמרכז, ישראל`            | roster            | ✅                |
| Area list (16 cities) | תל אביב … ירושלים                 | `lib/site.ts:362` | 🔶 marked confirm |
| FAQ coverage claim    | "מגיעים לפריסה ארצית בתיאום מראש" | `lib/site.ts:324` | 🔶                |
| Travel / minimum job  | —                                 | nowhere           | 🔶                |

Two things to resolve before any location page is built (`/new-city`):

1. **ירושלים and מודיעין are not גוש דן.** They sit in the visible list while `areaServed` says
   גוש דן והמרכז. Either the list is too wide or the manifest is too narrow.
2. **"פריסה ארצית" contradicts "גוש דן והמרכז".** An `areaServed` the business can't actually service
   produces leads it can't serve and a claim it can't defend.

---

## F. Infrastructure — owner-only changes

| Item                             | State                                                                                                                                                     |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GTM container                    | ✅ `GTM-KWGGH438` — verified 200, live in production                                                                                                      |
| GA4 property for betonplus.co.il | 🔶 `analytics.ga4MeasurementId: null` in the roster                                                                                                       |
| Search Console verification      | ✅ resolved 2026-08-17 — token lives in the roster manifest (`analytics.googleSiteVerification`), synced down, read from the manifest in `app/layout.tsx` |
| Google עסק שלי (GBP)             | 🔶 unknown whether one exists                                                                                                                             |
| Cloudflare AI-crawler policy     | ⚠️ managed `robots.txt` blocks ClaudeBot, GPTBot, Google-Extended, CCBot, Bytespider, Amazonbot, Applebot-Extended, meta-externalagent                    |
| Security headers                 | ⚠️ no HSTS / X-Frame-Options / Permissions-Policy / CSP                                                                                                   |

The verification token drift matters: the value works, but it lives in the wrong place, so a roster
sync can't manage it and the next site cloned from this one inherits betonplus's token. Move it to the
manifest.

The AI-crawler block is a **zone setting**, changed only in the Cloudflare dashboard by the owner. No
repo change overrides it. Document the toggle; never assume it was flipped. See `/aeo-answer-content`.

---

## Verified during the 2026-08-16 audit — no action needed

- Phone `055-6601006` and email `info@betonplus.co.il` are consistent everywhere they appear.
- `GTM-KWGGH438` returns HTTP 200 and is present in the live HTML.
- No `Review` or `AggregateRating` JSON-LD is emitted anywhere in `out/`.
- Prices on `/pricing/` match `services[].priceFrom` and match the FAQ.
- All 15 content routes carry exactly one `<h1>` and one self-referencing canonical.
- Brand-token contrast passes AA: `.btn-cta` (amber `#f59e0b` on brand `#1f2a37`) is **6.77:1**,
  `.eyebrow` steel on white **5.17:1**, muted on white **7.56:1**, footer white on brand **14.54:1**.
