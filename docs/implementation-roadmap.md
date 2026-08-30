# Implementation roadmap — betonplus.co.il

The sequenced plan for turning the standards in [docs/README.md](README.md) into shipped changes.
Established **2026-08-30** against commit `67ef7d0` (wave 6) and a live verification of the production
origin.

**Severity/priority key:** 🔴 blocking · 🟠 high · 🟡 medium · ⚪ low.
**Owner key:** 🔧 repo work · 👤 owner-supplied · 🌩️ Cloudflare zone (owner).

---

## Sprint 0 — Baseline verification ✅ DONE (2026-08-30)

Everything in waves 1–6 is **live**, not merely committed. Verified directly against
`https://betonplus.co.il/`:

| Claim                             | Result                                                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Security headers live at the edge | ✅ HSTS, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |
| CSP                               | ✅ present, **report-only** as designed                                                                   |
| AI-crawler policy                 | ✅ live `robots.txt` matches `app/robots.ts` exactly — the Cloudflare managed block is gone               |
| Serving                           | ✅ `Server: cloudflare`, `cf-cache-status: DYNAMIC`, HTTP 200                                             |
| Known looseness                   | ⚪ `Access-Control-Allow-Origin: *` (Cloudflare default) — Sprint 8                                       |

Two rows in [business-facts.md](business-facts.md) §F were stale as a result and have been corrected.

> **This is why Sprint 0 exists.** Two of the repo's own documents asserted a blocked crawler policy and
> absent security headers that had in fact shipped. Verify the live origin before planning against a
> document.

---

## The critical path

```
Sprint 1 (owner intake)  ──┬── 1.1 coverage    ANSWERED 2026-08-30 -> Sprint 4 unblocked
                           ├── 1.3 named human ANSWERED 2026-08-30 -> Sprint 5 partly unblocked
                           ├── 1.4 GA4 id      ANSWERED 2026-08-30 -> Sprint 7 unblocked
                           ├── 1.2 photos      pending            -> Sprints 5, 6 still blocked
                           └── 1.5 GBP         pending            -> reviews + sameAs still blocked

Sprint 2 (technical) ──> Sprint 3 (AEO content) ──> Sprint 4 (local silo)
                     └──> Sprint 8 (security close-out)
```

**Unblocked as of 2026-08-30: Sprints 2, 3, 4, 7 and 8.** Only Sprint 6 (image pipeline) and most of
Sprint 5 still wait on the owner — photos (1.2), the GBP (1.5), and אור שוורץ's own biographical
facts. Sprint 4 additionally depends on 2.1 and 2.3, so Sprint 2 still comes first.

---

## Sprint 1 — Owner intake 🔴 (blocks five sprints, costs no engineering time)

**Goal:** convert the 🔶 rows in [business-facts.md](business-facts.md) into ✅ or into deletions.
**Owner:** 👤 entirely. Nothing here can be inferred, and no agent may fill a 🔶 with a plausible number.

| #   | Question                                                                                                                                                             | Unblocks                           |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 1.1 | ✅ **Answered 2026-08-30 — גוש דן והמרכז.** ירושלים and מודיעין removed, "פריסה ארצית" removed, hero stat corrected. Shipped in the repo the same day.               | Sprint 4 — **unblocked**           |
| 1.2 | **Photos:** can you supply photographs of real completed work — openings, core holes, the kit on site?                                                               | Sprints 5, 6                       |
| 1.3 | ✅ **Answered 2026-08-30 — אור שוורץ, owner**, consents to publishing his name and photos. 🔶 Still needed: the biographical facts themselves (see §1.3 note below). | Sprint 5 — **partially unblocked** |
| 1.4 | ✅ **Answered 2026-08-30 — `G-VMVP7XQKMG`.** GA4 property exists; the GTM wiring is the remaining work.                                                              | Sprint 7 — **unblocked**           |
| 1.5 | **Google עסק שלי:** does a profile exist? If not, create and verify it.                                                                                              | Sprints 4, 5 (reviews, sameAs)     |

**Second tier — each either becomes a trust asset or comes out of the copy. There is no third option:**

| #   | Claim                              | Currently                                                 |
| --- | ---------------------------------- | --------------------------------------------------------- |
| 1.6 | ביטוח צד ג׳                        | Claimed 3× with no insurer, policy or cover amount        |
| 1.7 | `+1,000 פרויקטים`                  | Displayed as a headline stat, unverified                  |
| 1.8 | `foundedYear: 2005` → "מעל 20 שנה" | Drives 4 copy sites **and** `foundingDate` in the JSON-LD |
| 1.9 | Pricing — `₪150 למ״ר`, `₪190 למ׳`  | Unconfirmed; blocks `OfferCatalog` and the FAQ cost table |

**Exit gate:** every 🔶 row in [business-facts.md](business-facts.md) §§A–C and §E is either ✅ with a
source, or the claim has been removed from `lib/site.ts`.

---

## Sprint 2 — Technical foundations & the link mesh 🔧 (unblocked — start now)

**Goal:** close every repo-side item that needs no owner input, and prepare the data shapes the later
sprints depend on.

| #   | Task                                                                                                                                                                                                                                                                                 | Pri | Est |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | --- |
| 2.1 | **Type the service areas.** Convert `serviceAreas: string[]` into typed entries with `kind` (city/region) and `prefixed` so `ב${name}` produces correct Hebrew. Backlog §5.5. **Do this before Sprint 4, not during it.**                                                            | 🟠  | ½ d |
| 2.2 | **Header reaches every service in one hop.** A services dropdown/section in `Header`. Currently the five services sit one level behind `/services/`.                                                                                                                                 | 🟠  | ½ d |
| 2.3 | **Kill the dead ends.** The 14 area chips on `/service-areas/` link nowhere. Until Sprint 4 lands they link to `/services/` + a contact anchor; after it, to their city page.                                                                                                        | 🟠  | ¼ d |
| 2.4 | **Contextual in-copy links.** There are currently **zero**. Add 2–3 per content page with descriptive Hebrew anchors, per `/internal-linking`.                                                                                                                                       | 🟠  | 1 d |
| 2.5 | **Ship `public/llms.txt`.** Short, factual, no unconfirmed claim. Backlog §6.4 — now unblocked because crawlers can reach us.                                                                                                                                                        | ⚪  | ¼ d |
| 2.6 | **Surface `dateModified`** visibly on service pages and in the page-type schema, sourced from `routeUpdated`. Half of backlog §6.3; the author half waits on 1.3.                                                                                                                    | 🟡  | ½ d |
| 2.7 | **Delete the dead weight.** The snapshot layer (`scripts/*.mjs`, `content/site.json` 1.1 MB, `lib/content.ts`, `lib/wp.ts`, `lib/enrich/`, `app/enrich.css`, `SiteFrame`/`SiteAssets`/`ThemeScripts`) plus the Next-starter SVGs in `public/` that ship for no reason. Backlog §1.5. | 🟡  | ½ d |
| 2.8 | **Guard the title mechanism.** Add a `/qa-build-gate` assertion that no rendered title contains the brand twice, so a new page copying the wrong sibling fails the build rather than the SERP. Backlog §2.3.                                                                         | 🟡  | ¼ d |

**Exit gate:** `npm run lint && npm run typecheck && npm run format:check && npm run build` clean ·
`/qa-build-gate` passes including the new title assertion · `seo-auditor` and `ts-react-reviewer` report
no new findings · zero orphans and zero dead-end links.

---

## Sprint 3 — AEO & the guides hub 🔧 (unblocked; depends on 2.4)

**Goal:** own the question axis. This is the highest-value _content_ work available without the owner,
and it is what makes the site citable by AI assistants.

| #   | Task                                                                                                                                                                                                                       | Pri | Est    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------ |
| 3.1 | **Build `/מדריכים/`** — the hub route, the typed block model, `Article` + `BreadcrumbList` + `FAQPage` schema. `/new-article` has the mechanics.                                                                           | 🟠  | 1 d    |
| 3.2 | **First four articles**, from the Tier-3 list in [keyword-map.md](keyword-map.md) §2: ניסור מול הריסה · האם פתיחת פתח פוגעת ביציבות · מתי צריך אישור קונסטרוקטור · קידוח יבש מול רטוב. 900-word floor, answer block first. | 🟠  | 3–4 d  |
| 3.3 | **A comparison table per article.** Tables are the most liftable asset we have — `/faq/`'s two existing ones prove the pattern. `components/CompareTable.tsx` already exists.                                              | 🟠  | in 3.2 |
| 3.4 | **Cross-link articles ↔ services** contextually, both directions.                                                                                                                                                          | 🟡  | ¼ d    |
| 3.5 | **Cost table by thickness/reinforcement on `/faq/`** — the highest-value missing answer block. 🔴 **Blocked on 1.9.**                                                                                                      | 🟡  | ½ d    |

**Exit gate:** every article clears the 900-word floor with _specific_ content (no generic reassurance
counts) · passes the doorway substitution test · opens with a 40–60 word answer block under a
question-form `<h2>` · `aeo-geo-strategist` and `eeat-trust-auditor` clean · every claim traces to
[business-facts.md](business-facts.md).

---

## Sprint 4 — The location silo 🟢 (unblocked 2026-08-30; depends on 2.1, 2.3)

**Goal:** own the place axis — the single largest untapped tier for a trade chosen by proximity.

✅ **1.1 answered and shipped.** Coverage is **גוש דן והמרכז**, 14 cities, all four surfaces agreeing.
The gate this sprint waited on is closed; 4.1 below is already done. What remains is 2.1 and 2.3 from
Sprint 2 — do those first, then build.

| #   | Task                                                                                                                                                                                                                                                | Pri | Est    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------ |
| 4.1 | ✅ **Done 2026-08-30.** Coverage aligned across `serviceAreas` (14), `serviceAreaGroups` (3), the FAQ answer and the hero stat. `schema.areaServed` needed no change.                                                                               | 🔴  | ½ d    |
| 4.2 | **`/locations/[city]/` route** with `Service` + `BreadcrumbList` + `FAQPage` schema, sitemap parity, breadcrumbs.                                                                                                                                   | 🟠  | 1 d    |
| 4.3 | **Tier-1 cities only** — up to 8: תל אביב · רמת גן · גבעתיים · בני ברק · פתח תקווה · ראשון לציון · חולון · בת ים.                                                                                                                                   | 🟠  | 4–6 d  |
| 4.4 | **Genuinely unique copy per city.** 350-word floor, **and three or more true local specifics** from [content-standards.md](content-standards.md) §2 — neighbourhoods, building stock, access reality, municipal working hours, a city-specific FAQ. | 🔴  | in 4.3 |
| 4.5 | **Bidirectional links** — city ↔ services, city ↔ neighbouring cities from the same `AreaGroup`, hub ↔ children.                                                                                                                                    | 🟠  | ½ d    |

> **The stop rule.** If three true, city-specific facts cannot be written for a city, **that city does
> not get a page.** Record it in [business-facts.md](business-facts.md) §E instead of padding. 5 services
> × 14 areas = 70 cells; building them mechanically converts this site into a doorway network, which is
> a ranking _penalty_, not a ranking strategy.

**Exit gate:** every city page passes the substitution test (swap the city name — is it still correct?
then it does not ship) · `local-seo-strategist` and `seo-auditor` clean · sitemap parity · no orphans.

---

## Sprint 5 — E-E-A-T & trust 🔒 (blocked on 1.2, 1.3, 1.5)

**Goal:** fix the two letters that currently score **zero** — Experience and Authoritativeness. Expertise
is already the site's strong suit; more expert copy will not move a site with no proof and no
corroboration.

| #   | Task                                                                                                                                                                             | Pri | Blocked by |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ---------- |
| 5.1 | **Work gallery** — real photos with Hebrew `alt` and a technical caption (element, thickness, method). Faces, plates and unit numbers cropped. **Never stock, never generated.** | 🟠  | 1.2        |
| 5.2 | ✅ **Done 2026-08-30.** אור שוורץ (בעלים) on `/about/` in his own words, plus a `Person` node (`#owner`). The photo slot renders an initial until 1.2 lands.                     | ✅  | —          |
| 5.3 | **Author bylines + visible dates** on service pages and articles; `author` in the `Article` schema.                                                                              | 🟡  | 1.3, 2.6   |
| 5.4 | **Populate `sameAs`** in the roster manifest — the GBP first, then any real directory or association profile.                                                                    | 🟠  | 1.5        |
| 5.5 | **Two case studies** — the structure in [eeat-and-trust.md](eeat-and-trust.md) §5. Client consent, or anonymise the client and keep the technical detail.                        | 🟠  | 1.2        |
| 5.6 | **Review acquisition, then display, then schema — in that order.** No `Review`/`AggregateRating` JSON-LD until real, publicly verifiable reviews exist.                          | 🟠  | 1.5        |
| 5.7 | **Resolve 1.6–1.8** — substantiate or delete the insurance, project-count and founding claims.                                                                                   | 🟡  | 1.6–1.8    |

**Exit gate:** `eeat-trust-auditor` reports zero unsourced claims · no fabricated testimonial (the build
gate greps for the three removed names — any reappearance is a stop-ship) · every published photo is
this business's own work.

---

## Sprint 6 — Image pipeline & performance 🔒 (triggered by 5.1)

**Do this _before_ the photos ship, not after.** `images: { unoptimized: true }` plus `output: "export"`
means **Next generates no `srcset` at all** — dropping a gallery in as-is puts full-resolution JPEGs on
mobile and destroys LCP on the exact pages meant to build trust.

| #   | Task                                                                                                                                                                                    | Pri | Est |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- |
| 6.1 | **Variant generation** — 400/800/1200/1600 px, AVIF + WebP + JPEG fallback, at or before build time. Or 🌩️ Cloudflare Images at the edge, if the owner prefers no binaries in the repo. | 🟠  | 1 d |
| 6.2 | **Real `srcset` + `sizes`** reflecting actual layout width; `width`/`height` on every image (CLS).                                                                                      | 🟠  | ½ d |
| 6.3 | **`loading="lazy"` + `decoding="async"`** below the fold; `fetchpriority="high"` and no lazy on any LCP image.                                                                          | 🟠  | ¼ d |
| 6.4 | **Strip EXIF** — job photos carry GPS and device identifiers.                                                                                                                           | 🔴  | ¼ d |
| 6.5 | **Re-baseline Core Web Vitals.** Confirm the LCP element per route type — it is the Hebrew `<h1>` today, and may change once a gallery exists.                                          | 🟠  | ¼ d |
| 6.6 | ⚪ **Drop `Header` to a server component** (CSS/`<details>` disclosure instead of `useState`) — removes the nav tree from the client bundle on every route.                             | ⚪  | ½ d |

**Exit gate:** [performance-guidelines.md](performance-guidelines.md) §1 budgets met on a throttled
mobile profile · Lighthouse mobile ≥ 90 on `/`, one service page and `/contact/` · `perf-a11y-auditor`
clean on both verdicts.

---

## Sprint 7 — Measurement & consent 🔒 (blocked on 1.4)

**Goal:** stop flying blind. The container is live and every event is wired, but with no GA4 measurement
ID **we are currently collecting nothing.**

| #   | Task                                                                                                                                                                                                      | Pri | Blocked by |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ---------- |
| 7.1 | **Record `G-VMVP7XQKMG` in the roster manifest** (`analytics.ga4MeasurementId`) and sync. ⚠️ Record-keeping only — **nothing in the repo reads it**; GA4 is configured entirely inside the GTM container. | 🔴  | 1.4        |
| 7.2 | **Verify hostname routing inside `GTM-KWGGH438`** — one shared fleet container serves every IL site; the hostname condition is what keeps properties separate.                                            | 🔴  | 1.4        |
| 7.3 | **Mark `lead_submit` and the `/thank-you/` pageview as conversions**; link GA4 ↔ Search Console.                                                                                                          | 🟠  | 7.1        |
| 7.4 | 🌩️ **Enable Cloudflare Web Analytics** — cookieless, consent-free, gives real traffic and CWV field data independent of GA4.                                                                              | 🟠  | owner      |
| 7.5 | **Consent Mode for GA4** if a banner is added; Cloudflare Web Analytics runs unconditionally either way.                                                                                                  | 🟡  | 7.1        |
| 7.6 | **Verify end to end** — GTM Preview _and_ GA4 DebugView. A tag that fires in Preview but not DebugView is a routing failure, not a success.                                                               | 🔴  | 7.1        |
| 7.7 | **Audit `dataLayer` for PII.** No name, phone, email or message body, ever. Inspect it directly, don't assume.                                                                                            | 🔴  | —          |

**Container-ID rule:** whenever an ID changes, assert `https://www.googletagmanager.com/gtm.js?id=<ID>`
returns **200**. Two fabricated IDs once cost the fleet 18 days of zero analytics across every site.

**Exit gate:** a real `lead_submit` appears in GA4 DebugView · `/thank-you/` counts as a conversion ·
`dataLayer` verified PII-free.

---

## Sprint 8 — Security close-out 🔧 (unblocked; sequence after Sprint 7)

| #   | Task                                                                                                                                                           | Pri | Est   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ----- |
| 8.1 | **Collect CSP violation reports** for a full traffic cycle in report-only mode.                                                                                | 🟡  | —     |
| 8.2 | **Replace `'unsafe-inline'` with a build-time hash** of the GTM snippet — a nonce cannot work without a server.                                                | 🟡  | ½ d   |
| 8.3 | **Promote to enforcing `Content-Security-Policy`.** Promoting early breaks GTM silently and takes analytics down with it — which is why this follows Sprint 7. | 🟡  | ¼ d   |
| 8.4 | 🌩️ **Tighten `Access-Control-Allow-Origin: *`** at the zone.                                                                                                   | ⚪  | owner |
| 8.5 | **Re-check `/privacy/` against actual data flow** after every Sprint 7 change.                                                                                 | 🟠  | ¼ d   |

**Exit gate:** `security-auditor` clean · CSP enforcing with no console violations on `/`, a service
page, `/contact/` and `/thank-you/` · GTM and the form still work under enforcement.

---

## Deferred — not scheduled

| Item                              | Why deferred                                                                                                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **English `/en/` tree**           | No evidence of English demand. Revisit only on a real Search Console signal or a real client need — see `/i18n-multilingual` step 0                                         |
| **`OfferCatalog` on `/pricing/`** | Two prices are 🔶 and three are non-numeric. Emit only after 1.9                                                                                                            |
| **Service × location cells**      | Only after Sprint 4 proves the silo, and only for ניסור קירות and קידוח יהלום                                                                                               |
| **Server-side GTM (sGTM)**        | Justified by ad-spend attribution, which does not exist yet. Cloudflare Zaraz is the cheaper first step                                                                     |
| **Call tracking (DNI)**           | Publishes a phone number that differs from the manifest, the JSON-LD and the GBP — the NAP cost outweighs the data                                                          |
| **Time-of-day CTA adaptation**    | Ready to build (see [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §6) but the "נחזור אליכם בבוקר" message is a commitment needing owner confirmation |

---

## If you only have one week

1. **Send the owner the five Sprint 1 questions today.** They cost nothing and unblock five sprints.
2. **Sprint 2 in full** — the link mesh, the typed areas, `llms.txt`, the dead-code deletion. All
   unblocked, all compounding.
3. **Sprint 3.1–3.2** — the guides hub and the first two articles. This is the largest ranking and AEO
   gain available without the owner.

Do **not** start the location silo in that week. It is the biggest opportunity on the site and the
easiest thing to get badly wrong.

---

## Standing rules for every sprint

1. **The build gate before every deploy:** `npm run lint && npm run typecheck && npm run format:check && npm run build`, then `/qa-build-gate` on `out/`.
2. **Deploying is a production mutation — always ask first.** Pushing to `main` deploys nothing; deploys
   are wrangler direct upload via `ops/deploy-site.ps1` (dry-run, then `-Confirm`).
3. **Verify on the live origin after deploy.** A local build proves nothing about the edge — Sprint 0 is
   the evidence.
4. **Never fabricate a business fact.** Not a review, not a rating, not a project count, not a
   certification, not a customer name. Mark `// 🔶 confirm` and add a row to
   [business-facts.md](business-facts.md).
5. **Update the register as you go.** A sprint is not done until
   [optimization-backlog.md](optimization-backlog.md) reflects what actually shipped.
