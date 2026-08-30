# Optimization backlog — betonplus.co.il

The prioritized register of everything known to be wrong, thin, or missing. Every auditor agent cites
section numbers from this file; every skill's "current state" claims trace back here.

**Execution wave 1 landed 2026-08-17** (growth-plan Phases 0–1 plus the free Phase-2 wins): rows
marked "Resolved 2026-08-17" are done **in the repo**. ⚠️ None of it is live until the next deploy.

**Established 2026-08-16** against commit `da61e0b`, the `out/` export of that commit (15 content
routes + `/404/`), and the live production site. After wave 1 the export is **14 content routes +
`/thank-you/` (noindex) + `/404/` + `/_not-found/`** (`/reviews/` removed). Items marked ✅ were
verified as _already correct_ and are recorded so a future pass doesn't "fix" them back.

**Severity:** 🔴 stop-ship · 🟠 high · 🟡 medium · ⚪ low.

---

## §0. The one-line summary

The build is technically clean — one H1 per page, canonicals everywhere, breadcrumbs on every nested
route, sitemap parity, no oversized chunks, AA-passing contrast — and wave 1 removed the fabricated
testimonials, fixed the lead form, shipped security headers and closed the tracking gaps in the repo.
Wave 2 (same day) took the five service pages to 456–574 unique words with answer blocks and
per-service `FAQPage`. Wave 3 rebuilt `/faq/` (852 words, two citable comparison tables, 16 questions
in schema) and `/service-areas/` (428 words, grouped areas, no longer a dead end).

Wave 4 (2026-08-24) cleared the last three pages under their floors — `/pricing/` 602, `/about/` 525,
`/services/` 377 unique words — and single-sourced the prices.

Wave 5 (2026-08-25) closed the last repo-side technical items — page-type schema, GTM in `<head>`,
real sitemap dates, Hebrew-subset font preloads. Wave 6 found Cloudflare's AI-crawler block **gone**
and made the allow stance explicit in `app/robots.ts`.

**Every content page meets its floor and the technical backlog is essentially exhausted.** What
remains is **proof**, and nearly all of it needs the owner: no location silo, no dedicated editorial
surface (`/faq/` is the interim host), no photography, no named human, `sameAs` empty, and no GA4
property — so nothing is being measured.

---

## §1. Technical SEO

| #   | Item                                                                                                                                                                                                                                                                                                                 | Sev |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1.1 | ✅ **Resolved 2026-08-17.** `app/sitemap.ts` now derives from `staticRoutes` in `lib/site.ts` plus `services` — one registry; the build gate asserts parity every build.                                                                                                                                             | ✅  |
| 1.2 | ✅ **Resolved 2026-08-25 (wave 5).** `lastModified` now comes from `routeUpdated` in `lib/site.ts` — hand-maintained **real content dates**, all 14 URLs. Deliberately not `new Date()`, which would stamp every URL as freshly changed on every deploy. Bump a route's date only when its content actually changes. | ✅  |
| 1.3 | ✅ **Resolved 2026-08-17.** `.github/workflows/deploy.yml` is build-gate CI only (lint / typecheck / format:check / build); the GitHub Pages publish steps were removed.                                                                                                                                             | ✅  |
| 1.4 | ✅ `public/CNAME` deleted 2026-08-17.                                                                                                                                                                                                                                                                                | ✅  |
| 1.5 | The vestigial snapshot layer (`scripts/*.mjs`, `content/site.json` 1.1 MB, `lib/content.ts`, `lib/wp.ts`, `lib/enrich/`, `app/enrich.css`, `SiteFrame`/`SiteAssets`/`ThemeScripts`) is imported by **nothing** under `app/`. Dead weight in the repo, not in the export. See `/legacy-wordpress-layer`.              | 🟡  |
| 1.6 | ✅ Sitemap parity verified after wave 1: 14 `<loc>` = 14 indexable content routes. `/404/`, `/_not-found/` and `/thank-you/` (noindex) correctly excluded.                                                                                                                                                           | ✅  |
| 1.7 | ✅ `robots.txt` emitted; `trailingSlash: true` consistent; `out/` is 3.9 MB with no `.js` over 1 MB.                                                                                                                                                                                                                 | ✅  |

---

## §2. On-page SEO

| #   | Item                                                                                                                                                                                                                                                      | Sev |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 2.1 | ✅ **Resolved 2026-08-17.** `/about/` now passes the bare subject `אודות`; zero doubled-brand titles anywhere in the export.                                                                                                                              | ✅  |
| 2.2 | `/service-areas/` title is 51 rendered characters — within limits. (An earlier claim that it exceeded ~60 was measured and corrected 2026-08-17.)                                                                                                         | ✅  |
| 2.3 | Two title mechanisms coexist: static pages use the layout template, service pages use `absoluteTitle: true` with a brand-bearing `metaTitle`. It works, but a new page copying the wrong sibling produces a double suffix. Documented in `/seo-metadata`. | 🟡  |
| 2.4 | ✅ Exactly one `<h1>` on every route; no duplicate `<title>` or description among content routes.                                                                                                                                                         | ✅  |
| 2.5 | ✅ Every content route (incl. `/thank-you/`) has one self-referencing trailing-slash canonical. Only `/404/` and `/_not-found/` lack one, which is correct.                                                                                               | ✅  |

---

## §3. Content depth

| #   | Item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Sev |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 3.1 | ✅ **Resolved 2026-08-17 (wave 2).** `serviceDepth` in `lib/site.ts` gives every service page intro, included/excluded, method, site impact and a קונסטרוקטור note. Measured unique-to-page words (not shared across all five): wall-sawing 574 · core-drilling 525 · floor-ceiling 500 · wire-saw 456 · demolition 491 — all above the 450 floor, each with distinct substance (doorway test passes). Business-specific numbers were deliberately kept out; general trade facts are qualitative. | ✅  |
| 3.2 | ✅ **Resolved 2026-08-17.** Every service page opens with a question-form `<h2>` and a 40–60-word self-contained answer (`serviceDepth[slug].answer`).                                                                                                                                                                                                                                                                                                                                            | ✅  |
| 3.3 | ✅ **Resolved 2026-08-17.** 3–4 service-specific FAQs per page rendered via `<Faq items>` and emitted as `FAQPage` — five more schema-eligible routes. The global six-question array still serves `/`, `/pricing/`, `/faq/`.                                                                                                                                                                                                                                                                      | ✅  |
| 3.4 | ✅ **Resolved 2026-08-17 (wave 3).** `/service-areas/` rebuilt: answer block, areas grouped by real geography (`serviceAreaGroups`), an `areaLogistics` section on access/building-stock/working-hours/water, and links to all 5 services. **428 unique-to-page words** vs a 250 floor. Note the grouping is consistent with both the manifest and the FAQ but does **not** resolve §5.2 — the list is still 🔶.                                                                                  | ✅  |
| 3.5 | **Mostly resolved.** Substrate/reinforcement, wet-vs-dry, dust and water management, noise, and the קונסטרוקטור requirement are now covered on all 5 service pages (wave 2) and in the `/faq/` safety group (wave 3). Still thin on `/about/`, `/services/` and `/pricing/`. _(Previously read "absent everywhere" — stale since wave 2; corrected 2026-08-17.)_                                                                                                                                  | 🟡  |
| 3.6 | ✅ **Resolved 2026-08-17 (wave 3).** `/faq/` rebuilt as the interim Tier-3 host: answer block, the ניסור-מול-שבירה comparison table, the method-selection table, and 10 new topic-grouped FAQs (`faqGroups`: safety/structure, noise/dust/occupied buildings, quoting/execution). **852 unique-to-page words** vs a 300 floor; 16 questions in `FAQPage`, all visible.                                                                                                                            | ✅  |

---

## §4. Structured data

| #   | Item                                                                                                                                                                                                                                                                                                               | Sev |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| 4.1 | ✅ **Resolved 2026-08-17.** `WebSite` node (`#website`, `publisher` → `#business`) emitted on `/` via `webSiteJsonLd()` in `lib/seo.ts`.                                                                                                                                                                           | ✅  |
| 4.2 | ✅ **Resolved 2026-08-17.** `FAQPage` now also emitted on `/pricing/`; `/` and `/faq/` already had it. All three render the full `faqs` array visibly.                                                                                                                                                             | ✅  |
| 4.3 | No `OfferCatalog` on `/pricing/`. **Deferred deliberately:** two `priceFrom` values are 🔶 unconfirmed and three are non-numeric ("הצעת מחיר") — emit it only after the owner confirms pricing (business-facts §C).                                                                                                | 🟡  |
| 4.4 | ✅ **Resolved 2026-08-25 (wave 5).** `collectionPageJsonLd` / `aboutPageJsonLd` / `contactPageJsonLd` in `lib/seo.ts` now emit on `/services/`, `/service-areas/`, `/about/` and `/contact/`. Each carries `@id` from the canonical, `isPartOf` → `#website` and `about` → `#business`; verified no dangling refs. | ✅  |
| 4.5 | `schema.sameAs` is `[]` and there is no `geo`/`hasMap`. Nothing off-site corroborates the entity. Business-facts §B/§F.                                                                                                                                                                                            | 🟠  |
| 4.6 | ✅ `Service` + `BreadcrumbList` on all 5 service pages; `BreadcrumbList` on 13/14 content routes (home is the root; `/thank-you/` is noindex and intentionally bare).                                                                                                                                              | ✅  |
| 4.7 | ✅ **No `Review`/`AggregateRating` anywhere.** Correct — and stays that way until real, publicly sourced reviews exist.                                                                                                                                                                                            | ✅  |

---

## §5. Local SEO

| #   | Item                                                                                                                                                                                                                                                                                             | Sev |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| 5.1 | **There is no location silo.** 14 areas exist as strings in `lib/site.ts`, rendered as chips linking nowhere. Zero pages target `<service> ב<city>`.                                                                                                                                             | 🟠  |
| 5.2 | ✅ **Resolved 2026-08-30 (owner decision).** The area is **גוש דן והמרכז**. ירושלים and מודיעין removed from `serviceAreas` (16 → 14) and the fourth area group deleted; "פריסה ארצית" removed from the FAQ; the hero stat now reads `גוש דן`. All four surfaces agree with `schema.areaServed`. | ✅  |
| 5.3 | No Google עסק שלי link anywhere; `sameAs` empty. For a local trade this is the single highest-leverage off-page asset. Owner action.                                                                                                                                                             | 🟠  |
| 5.4 | No street address published (region only). Legitimate for a mobile trade, but it removes the strongest local signal — confirm it's deliberate.                                                                                                                                                   | 🟡  |
| 5.5 | The areas array has no `kind`/`prefixed` fields, so any future template will interpolate a bare `ב${name}` and produce wrong Hebrew for regions.                                                                                                                                                 | 🟡  |

---

## §6. AEO / GEO

| #   | Item                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Sev |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 6.1 | ✅ **Resolved 2026-08-25 (wave 6).** Cloudflare`s managed block is **gone** — the live robots.txt is now byte-identical to the export (verified cache-busted, `cf-cache-status: REVALIDATED`). Every AI crawler is allowed, and `app/robots.ts`now states that explicitly rather than relying on the`*`default, so the stance survives a Cloudflare default changing again. ⚠️ The edge can still prepend rules — always verify with`curl`, never from source. | ✅  |
| 6.2 | ✅ **Resolved 2026-08-24 (wave 4).** Answer blocks now open all 5 service pages plus `/faq/`, `/service-areas/`, `/pricing/`, `/about/` and `/services/` — every page targeting a question. `/` and `/contact/` don't need one (brand and transactional intent). _(Row previously read "No answer blocks anywhere" — stale since wave 2.)_                                                                                                                     | ✅  |
| 6.3 | No `datePublished` / `dateModified` / author on any page. Assistants discount undated, unattributed content.                                                                                                                                                                                                                                                                                                                                                   | 🟡  |
| 6.4 | No `public/llms.txt`. **Now unblocked** — §6.1 is resolved and crawlers can reach the site, so a short factual pointer file is finally worth shipping.                                                                                                                                                                                                                                                                                                         | ⚪  |
| 6.5 | **Partially resolved 2026-08-17 (wave 3).** `/faq/` now carries two genuinely citable tables: **ניסור מול שבירה בפטישון** (8 criteria) and **method selection** (4 diamond methods, each with its limit). Still missing: a cost breakdown by thickness/reinforcement — blocked on confirmed pricing (§4.3, business-facts §C).                                                                                                                                 | 🟡  |
| 6.6 | ✅ The FAQ answers ship in the DOM at first paint — extractable as-is. Preserve that property.                                                                                                                                                                                                                                                                                                                                                                 | ✅  |

---

## §7. E-E-A-T & trust

| #   | Item                                                                                                                                                                                                                                                                                                                                                                                        | Sev |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 7.1 | ✅ **RESOLVED 2026-08-17: the three fabricated testimonials and the `/reviews/` route were REMOVED.** `public/_redirects` 301s the old URL; nav, footer and sitemap entries are gone. Reviews may return only as real, attributed quotes (ideally GBP-sourced) — see the note at the former array site in `lib/site.ts`. **Never add an invented one again — it is a permanent stop-ship.** | ✅  |
| 7.2 | **No photography of real work.** `public/` carries brand assets only. For this trade, photos of openings and core holes are the primary proof. Owner-supply item — never substitute stock or generated imagery.                                                                                                                                                                             | 🟠  |
| 7.3 | ✅ **Resolved 2026-08-30.** אור שוורץ (בעלים) is named on `/about/` in his own words, with a `Person` node (`#owner`) in the graph. 🔶 His "למעלה מעשור" claim is held back pending the `foundedYear: 2005` conflict — business-facts §A.                                                                                                                                                   | ✅  |
| 7.4 | `+1,000 פרויקטים` (`lib/site.ts`, trustStats) is 🔶 and displayed as a headline stat.                                                                                                                                                                                                                                                                                                       | 🟡  |
| 7.5 | ביטוח צד ג׳ claimed three times with no policy, insurer or cover amount.                                                                                                                                                                                                                                                                                                                    | 🟡  |
| 7.6 | No licences, certifications or association memberships shown.                                                                                                                                                                                                                                                                                                                               | 🟡  |
| 7.7 | ✅ **Resolved 2026-08-24 (wave 4).** The FAQ answer now interpolates via `priceOf(slug)` → `services[].priceFrom`. One source; a price edit can no longer contradict the `/pricing/` table. the same page.                                                                                                                                                                                  | ✅  |
| 7.8 | ✅ `foundedYear: 2005` and "מעל 20 שנה" agree with each other and with `foundingDate` in the graph.                                                                                                                                                                                                                                                                                         | ✅  |

---

## §8. Conversion

| #   | Item                                                                                                                                                                                                                                                              | Sev |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 8.1 | ✅ **Resolved 2026-08-17.** Per-field Hebrew errors tied via `aria-invalid` + `aria-describedby`, focus moves to the first invalid field, and `normalizeIsraeliPhone()` accepts every real Israeli format (05X / 0X landline / +972) while rejecting non-numbers. | ✅  |
| 8.2 | ✅ **Resolved 2026-08-17.** On delivery failure the form renders a WhatsApp deep link prefilled with the user's own submission (`data-cta="form-whatsapp-fallback"`).                                                                                             | ✅  |
| 8.3 | ✅ **Resolved 2026-08-17.** `/thank-you/` exists (noindex, follow; excluded from `staticRoutes`/sitemap); the form navigates there on confirmed success — the clean GA4/Ads conversion URL.                                                                       | ✅  |
| 8.4 | ✅ **Resolved 2026-08-17.** The consent line links to `/privacy/`.                                                                                                                                                                                                | ✅  |
| 8.5 | ✅ **Resolved 2026-08-24 (wave 4).** `/pricing/` now carries an inline "איך מקבלים הצעה מדויקת בשיחה אחת" block with WhatsApp (`pricing-whatsapp`) and form (`pricing-form`) CTAs plus the phone, and the table's service names link through to their pages.      | ✅  |
| 8.6 | ✅ `FloatingCTA` is sticky on mobile with a matching `pb-16 lg:pb-0` spacer in `app/layout.tsx`; click-to-call is above the fold on every page.                                                                                                                   | ✅  |
| 8.7 | ✅ `trackEvent("lead_submit")` fires only on a **confirmed** send, never on submit (the dev simulation doesn't fire it). Keep both properties.                                                                                                                    | ✅  |

---

## §9. Navigation & internal linking

| #   | Item                                                                                                                                                                                                                                                                                                                                           | Sev |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 9.1 | ✅ **Resolved 2026-08-17.** Related services come from the `relatedServices` adjacency map in `lib/site.ts`, not array order.                                                                                                                                                                                                                  | ✅  |
| 9.2 | ✅ **Resolved 2026-08-24 (wave 4).** Descriptive-anchor links now run across the site: per-service "קשור לנושא" blocks (wave 2), `/service-areas/` → 5 services + `/faq/` + `/pricing/`, `/faq/` → 3 services in prose, `/services/` → `/faq/`, `/about/` → `/services/`, and `/pricing/` table rows → each service page.                      | ✅  |
| 9.3 | ✅ **Resolved 2026-08-17 (wave 3).** No longer a dead end: the page links to all 5 service pages plus `/faq/` and `/pricing/` with descriptive anchors. The city chips themselves stay unlinked **deliberately** — linking them to pages that don't exist is the doorway trap (`/internal-linking` §2). They become links when the silo ships. | ✅  |
| 9.4 | ✅ No unintended orphans. `/404/`, `/_not-found/` and `/thank-you/` are unlinked **by design** (the form navigates to `/thank-you/`); everything else has an inbound link.                                                                                                                                                                     | ✅  |
| 9.5 | ✅ Breadcrumbs render _and_ emit `BreadcrumbList` from the same crumb data on every nested content route.                                                                                                                                                                                                                                      | ✅  |

---

## §10. Performance

| #    | Item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Sev |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 10.1 | `images: { unoptimized: true }` and **zero `srcset` in the export**. Irrelevant today (there is almost no imagery) — it becomes 🟠 the moment §7.2 photos land. Plan the pipeline before shipping photos, not after.                                                                                                                                                                                                                                                                           | 🟡  |
| 10.2 | ✅ **Resolved 2026-08-25 (wave 5).** The **Hebrew-subset** woff2 of Heebo and Assistant (one variable file each, 19 KB total) are now preloaded via `preload()` from `react-dom`, removing a full round trip from the font critical path — the Hebrew `<h1>` is the LCP element. Used the React API rather than a JSX `<link>`, which React hoists **and** leaves in place, emitting each tag twice. URLs are version-pinned; `/qa-build-gate` §12 re-checks them against the live stylesheet. | ✅  |
| 10.3 | `components/Header.tsx` is `"use client"` for the mobile-menu state, shipping the whole nav tree to the client on every page.                                                                                                                                                                                                                                                                                                                                                                  | ⚪  |
| 10.4 | The hero is a pure CSS gradient (`.hero-grad`), so the LCP element is almost certainly the `<h1>` — confirm per route type before optimizing images.                                                                                                                                                                                                                                                                                                                                           | ⚪  |
| 10.5 | ✅ `out/` is 3.9 MB with **no `.js` over 1 MB** — none of the fleet's dev-chunk pollution. Keep `rm -rf .next out` before release builds.                                                                                                                                                                                                                                                                                                                                                      | ✅  |
| 10.6 | ✅ CLS reserves are sound; the sticky CTA bar has its spacer.                                                                                                                                                                                                                                                                                                                                                                                                                                  | ✅  |

---

## §11. Accessibility

| #    | Item                                                                                                                                                                                                                                                                                                                                                                 | Sev |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 11.1 | ✅ **Resolved 2026-08-17.** Escape closes the mobile menu and returns focus to the toggle (`Header.tsx`). The menu is a non-modal disclosure — the page stays visible and scrollable — so a focus trap and scroll lock are not required. `aria-expanded`/`aria-controls` were already correct.                                                                       | ✅  |
| 11.2 | ✅ **Resolved 2026-08-17** together with §8.1 — per-field form errors are announced via `aria-describedby`/`aria-invalid` with focus management.                                                                                                                                                                                                                     | ✅  |
| 11.3 | ✅ **Resolved 2026-08-17.** `.ltr` helper added to `app/globals.css`; the phone is isolated in `Header`, `Hero`, `CtaBanner`, the service sidebar and `/thank-you/` (`Footer`/`ContactSection` already did). `.btn` gained `min-height: 2.75rem` (44px tap targets), the pricing table scrolls in its own container, and a `prefers-reduced-motion` reset was added. | ✅  |
| 11.4 | `/accessibility/` publishes a ת״י 5568 statement — every failure here makes a published statement false. Keep the two in sync both ways.                                                                                                                                                                                                                             | 🟡  |
| 11.5 | ✅ **Contrast passes AA**, computed from the `@theme` tokens: `.btn-cta` 6.77:1, `.eyebrow` 5.17:1, muted-on-white 7.56:1, footer 14.54:1, WhatsApp button 7.51:1. Note white-on-`--color-cta` would be **2.15:1** — never use it.                                                                                                                                   | ✅  |
| 11.6 | ✅ No banned physical-direction utility anywhere in `components/` or `app/` (only in the vestigial `app/enrich.css`).                                                                                                                                                                                                                                                | ✅  |
| 11.7 | ✅ Landmarks present; skip link in `app/layout.tsx`; one H1 per page; visible focus ring defined in `globals.css`.                                                                                                                                                                                                                                                   | ✅  |

---

## §12. Security

| #    | Item                                                                                                                                                                                                                                                                                                       | Sev |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 12.1 | ✅ **Shipped in repo 2026-08-17** — `public/_headers`: HSTS (`max-age=31536000; includeSubDomains`, **no `preload`** — that token is the owner's call), `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy`, and a **report-only** CSP. ⚠️ Live only after the next deploy — verify with `curl -sSI` then. | ✅  |
| 12.2 | Live HTML returns `Access-Control-Allow-Origin: *` — a Cloudflare-side default, looser than needed.                                                                                                                                                                                                        | ⚪  |
| 12.3 | ✅ Report-only CSP shipped with §12.1. Observe ≥1 week of real traffic (incl. a real form submit and a GTM-tracked call click) before any enforcing switch.                                                                                                                                                | ✅  |
| 12.4 | ✅ Resolved with §1.3 — the second origin no longer publishes.                                                                                                                                                                                                                                             | ✅  |
| 12.5 | ✅ Cloudflare Pages already supplies `x-content-type-options: nosniff` and `referrer-policy: strict-origin-when-cross-origin`.                                                                                                                                                                             | ✅  |
| 12.6 | ✅ The Web3Forms access key is **public by design** — not a leaked secret. Honeypot present; HTTPS-only; no PII in `dataLayer`.                                                                                                                                                                            | ✅  |

---

## §13. Tracking

| #    | Item                                                                                                                                                                                                                                                                                                       | Sev |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 13.1 | ✅ **Resolved 2026-08-25 (wave 5).** The layout now renders an explicit `<head>` holding the GTM loader; the `<noscript>` iframe stays in `<body>`. React 19 auto-hoists `<link>`/`<meta>` but **not** an inline `dangerouslySetInnerHTML` script — that had to be placed by hand. Verified in the export. | ✅  |
| 13.2 | ✅ **Resolved 2026-08-17.** Added `sidebar-call/whatsapp/form`, `contact-call/whatsapp/email`, `footer-email`, `form-submit`, `form-whatsapp-fallback`, `thankyou-call/whatsapp`. Every `tel:`/`wa.me`/mailto/submit surface now carries `data-cta`.                                                       | ✅  |
| 13.3 | `analytics.ga4MeasurementId` is `null` in the roster — the GA4 property for this hostname may not exist yet. Owner action; the container fires into nothing until then.                                                                                                                                    | 🟠  |
| 13.4 | ✅ **Resolved 2026-08-17.** Search Console token moved to the roster manifest (`analytics.googleSiteVerification`), synced to `site.config.json`, and read from the manifest in `app/layout.tsx`.                                                                                                          | ✅  |
| 13.5 | ✅ `GTM-KWGGH438` verified: HTTP 200 from `gtm.js`, and present in the live HTML.                                                                                                                                                                                                                          | ✅  |
| 13.6 | ✅ `data-cta` complete and following `{location}-{action}` on every conversion surface (see §13.2).                                                                                                                                                                                                        | ✅  |

---

## Suggested order of work

1. ~~**§7.1** — remove or replace the fabricated testimonials.~~ ✅ Done 2026-08-17 (removed).
2. ~~**§3.1–3.3** — take the five service pages to the depth bar.~~ ✅ Done 2026-08-17 (wave 2):
   456–574 unique words each, answer blocks, per-service `FAQPage`. **Now front of the queue:** §3.4
   (`/service-areas/` intro) and §3.6 (`/faq/` depth), then the guides hub.
3. ~~**§13.2, §8.1–8.3** — close the measurement and lead-capture holes.~~ ✅ Done 2026-08-17 in the
   repo; §13.3 (GA4 property) still needs the owner.
4. ~~**§12.1** — ship `public/_headers`; delete the second origin (§1.3).~~ ✅ Done 2026-08-17 in the
   repo — **deploy to make it live**.
5. **§5.1** — build the location silo, now unblocked — §3 is done and §5.2 was resolved 2026-08-30.
6. **§6.1** — take the AI-crawler decision to the owner; then §6.2/§6.5.
