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
Sprint 5 still wait on the owner — photos (1.2), the GBP (1.5), and the founding-year conflict (1.8).
Sprint 2 shipped 2026-08-31, so Sprint 4 has no remaining technical dependency.

> **Status 2026-09-06 (repo-side sweep — nothing here needed the owner):** Sprint 5.3 bylines shipped
> (`components/Byline.tsx`, `author` on service-page `WebPage` nodes); Sprint 7.1 sync run
> (`site.config.json` now carries `ga4MeasurementId`), 7.2 verified from the live `gtm.js`, 7.7
> verified, and the `lead_fallback`/`form_error` events from the dataLayer contract implemented;
> Sprint 8.4 done in `public/_headers` (live since the 2026-09-16 deploy, verified: no `access-control`
> header on the origin response); every remaining `🔶` literal for
> the 2005 claim marked and the claim removed from `/about/`'s meta description; CLAUDE.md, the
> registers and the `.claude` toolkit corrected to the post-Sprint-2 state (they had described deleted
> files, 16 areas, font preloads and a null GA4 id). ✅ **Deployed 2026-09-16** (`5bb6943a.betonplus.pages.dev`, gate passed at 205 files) and live-verified: `/guides/` + 4 articles 200 with `Article`/`author`/`Person`/`FAQPage`, bylines and the מדריכים block on service pages, sitemap 19, no `Access-Control-Allow-Origin` on the origin response, all standing checks green.

---

## Sprint 1 — Owner intake 🔴 (blocks five sprints, costs no engineering time)

**Goal:** convert the 🔶 rows in [business-facts.md](business-facts.md) into ✅ or into deletions.
**Owner:** 👤 entirely. Nothing here can be inferred, and no agent may fill a 🔶 with a plausible number.

| #   | Question                                                                                                                                                                                                                                                                                                                     | Unblocks                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1.1 | ✅ **Answered 2026-08-30 — גוש דן והמרכז.** ירושלים and מודיעין removed, "פריסה ארצית" removed, hero stat corrected. Shipped in the repo the same day.                                                                                                                                                                       | Sprint 4 — **unblocked**                    |
| 1.2 | **Photos:** can you supply photographs of real completed work — openings, core holes, the kit on site?                                                                                                                                                                                                                       | Sprints 5, 6                                |
| 1.3 | ✅ **Answered 2026-08-30 — אור שוורץ, owner**, consents to publishing his name and photos. Bio published on `/about/` in his own words; bylines on service pages since 2026-09-06. 🔶 Still withheld: his "למעלה מעשור" sentence, which conflicts with the 2005 claim (1.8 — business-facts §A lists the three resolutions). | Sprint 5 — **unblocked except 5.1/5.4–5.6** |
| 1.4 | ✅ **Answered 2026-08-30 — `G-VMVP7XQKMG`.** In the roster, synced to `site.config.json` 2026-09-06, and the live container already routes the hostname to it (page views flow). Remaining: event tags in the container (7.3).                                                                                               | Sprint 7 — **unblocked**                    |
| 1.5 | **Google עסק שלי:** does a profile exist? If not, create and verify it.                                                                                                                                                                                                                                                      | Sprints 4, 5 (reviews, sameAs)              |

**Second tier — each either becomes a trust asset or comes out of the copy. There is no third option:**

| #   | Claim                              | Currently                                                                                    |
| --- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| 1.6 | ביטוח צד ג׳                        | Claimed at **four** copy sites (incl. the hero chip) with no insurer, policy or cover amount |
| 1.7 | `+1,000 פרויקטים`                  | Displayed as a headline stat, unverified                                                     |
| 1.8 | `foundedYear: 2005` → "מעל 20 שנה" | Drives 4 copy sites **and** `foundingDate` in the JSON-LD                                    |
| 1.9 | Pricing — `₪150 למ״ר`, `₪190 למ׳`  | Unconfirmed; blocks `OfferCatalog` and the FAQ cost table                                    |

**Exit gate:** every 🔶 row in [business-facts.md](business-facts.md) §§A–C and §E is either ✅ with a
source, or the claim has been removed from `lib/site.ts`.

---

## Sprint 2 — Technical foundations & the link mesh ✅ DONE (2026-08-31)

**Goal:** close every repo-side item that needs no owner input, and prepare the data shapes the later
sprints depend on.

All eight items shipped on branch `sprint-2-technical-foundations`, merged `--ff-only` to `main`
(`58d0749`) and pushed. Gate green: lint, typecheck, format:check and build all clean, 21 routes,
14 sitemap URLs, one `<h1>` per page, canonicals on every content route, no fabricated-review strings.

✅ **DEPLOYED 2026-08-31** — `deploy-site.ps1 -Confirm`, wrangler → Pages project `betonplus`,
deployment `381b06de.betonplus.pages.dev`, script gate passed at 161 files. Live-verified on the
production origin: HSTS / XFO / Permissions-Policy / Referrer-Policy / report-only CSP all present ·
`robots.txt` byte-matches the export with **no Cloudflare managed AI-crawler block** · sitemap 14 ·
GTM `gtm.js` 200 · `/llms.txt` 200 `text/plain` · all five services reachable from `/privacy/`
(the header-one-hop proof) · `dateModified` and the visible `עודכן:` line on service pages ·
title carries the brand exactly once.

> **One correction worth recording.** 2.2 was first built as `{servicesOpen && <ul>…}`, which renders
> the dropdown only after a click. The menu worked for a user and was **invisible to a crawler** — the
> five service links were absent from the static export, so the crawl-depth half of the task silently
> did not happen. It now always renders and toggles with `hidden`. Verified: all five services appear
> in `/privacy/index.html`, a page with no services grid. **Check the export, not the component.**

| #   | Task                                                                                                                                                                                                                                                                                   | Pri | Est |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- |
| 2.1 | ✅ **Done.** `serviceAreas` is `ServiceArea[]` (`slug`, `name`, `kind`, `prefixed`), moved above `serviceAreaGroups`, which resolves members through `area()` — an unknown name fails the build. `slug` is reserved for sprint 4 and **nothing links to it yet**.                      | ✅  | ½ d |
| 2.2 | ✅ **Done.** Services disclosure in `Header` — desktop dropdown (Escape + click-outside) and an inline nested list on mobile. Always rendered, toggled with `hidden`, so the links are in the static export. All five services now appear in `/privacy/index.html`.                    | ✅  | ½ d |
| 2.3 | ✅ **Done — differently than specified.** The chips stay unlinked (backlog §9.3 settled that: linking them to non-existent pages is the doorway trap). The actual dead end was that the homepage area section had **no onward link at all**; it now links to `/service-areas/`.        | ✅  | ¼ d |
| 2.4 | ✅ **Mostly pre-existing — the "zero" was stale.** Backlog §9.2 resolved this in wave 4; only `/contact/` had none. It now carries three descriptive links, placed **below** the form so they don't compete with the primary conversion.                                               | ✅  | 1 d |
| 2.5 | ✅ **Done.** `public/llms.txt` → `/llms.txt`. Omits every 🔶 claim and states the site carries no ratings, so an assistant cannot invent one.                                                                                                                                          | ✅  | ¼ d |
| 2.6 | ✅ **Done.** `dateModified` in every page node from `routeUpdated`; service pages gained a `WebPage` node to carry it (`Service` has no date property); visible `עודכן:` line in an LTR-isolated `<time>`. The author half shipped 2026-09-06 as sprint 5.3 (`components/Byline.tsx`). | ✅  | ½ d |
| 2.7 | ✅ **Done.** Whole snapshot layer deleted (1.2 MB `content/site.json` included), plus the starter SVGs, the `snapshot`/`enrich` npm scripts, and five dependencies only that layer used.                                                                                               | ✅  | ½ d |
| 2.8 | ✅ **Done.** `scripts/check-titles.mjs` runs as `postbuild` — doubled brand, missing `<title>` and unexpected duplicates all fail `npm run build`. Proven by injecting a doubled brand into the export and watching it exit 1.                                                         | ✅  | ¼ d |

**Exit gate:** `npm run lint && npm run typecheck && npm run format:check && npm run build` clean ·
`/qa-build-gate` passes including the new title assertion · `seo-auditor` and `ts-react-reviewer` report
no new findings · zero orphans and zero dead-end links.

---

## Sprint 3 — AEO & the guides hub ✅ 3.1–3.4 DONE (2026-09-06) · DEPLOYED 2026-09-16

**Goal:** own the question axis. This is the highest-value _content_ work available without the owner,
and it is what makes the site citable by AI assistants.

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Pri | Est    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------ |
| 3.1 | ✅ **Done.** `/guides/` hub (`app/guides/page.tsx`, `CollectionPage`, ≥250 words) and `/guides/[slug]/` with the typed block model (`lib/articles/types.ts`), the registry (`lib/articles/index.ts`), `components/ArticleBody.tsx`, `articleJsonLd()` in `lib/seo.ts`, `Article` + `Person` + `BreadcrumbList` + `FAQPage` derived from the `faq` block, Hebrew slugs decoded + NFC-normalised, percent-encoded canonicals and sitemap `<loc>`s, hub in `navItems`/`staticRoutes`/`routeUpdated`. | ✅  | 1 d    |
| 3.2 | ✅ **Done.** Four articles, each over the 900-word floor with the answer block first, question-form `<h2>`s, a comparison table, a 4-question FAQ and a closing CTA: sawing-vs-demolition · opening-and-stability · engineer-approval · wet-vs-dry-drilling. General trade facts only — no price, no project count, no business-specific number (content-standards §6). Author: the owner (`Byline` + `author`).                                                                                  | ✅  | 3–4 d  |
| 3.3 | ✅ **Done.** One `table` block per article, rendered through `CompareTable` (סוגי קירות · ניסור מול הריסה · מתי נדרש מהנדס · יבש מול רטוב).                                                                                                                                                                                                                                                                                                                                                       | ✅  | in 3.2 |
| 3.4 | ✅ **Done.** Articles link into the services in-copy (`paragraphLinks`) and list them in a sidebar; each service page renders a "מדריכים בנושא" block from `articlesForService()`; one article ↔ article link.                                                                                                                                                                                                                                                                                    | ✅  | ¼ d    |
| 3.5 | **Cost table by thickness/reinforcement on `/faq/`** — the highest-value missing answer block. 🔴 **Blocked on 1.9.**                                                                                                                                                                                                                                                                                                                                                                             | 🟡  | ½ d    |

**Exit gate:** every article clears the 900-word floor with _specific_ content (no generic reassurance
counts) · passes the doorway substitution test · opens with a 40–60 word answer block under a
question-form `<h2>` · `aeo-geo-strategist` and `eeat-trust-auditor` clean · every claim traces to
[business-facts.md](business-facts.md).

---

## Sprint 4 — The location silo 🟢 (fully unblocked — 2.1 and 2.3 shipped 2026-08-31)

**Goal:** own the place axis — the single largest untapped tier for a trade chosen by proximity.

✅ **1.1 answered and shipped.** Coverage is **גוש דן והמרכז**, 14 cities, all four surfaces agreeing.
The gate this sprint waited on is closed; 4.1 below is already done, and the typed `ServiceArea[]`
(with Hebrew slugs, so the route must `decodeURIComponent` + NFC-normalise `params`) is in place.
Nothing technical blocks 4.2 — only the stop rule below.

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                 | Pri | Est    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ------ |
| 4.1 | ✅ **Done 2026-08-30.** Coverage aligned across `serviceAreas` (14), `serviceAreaGroups` (3), the FAQ answer and the hero stat. `schema.areaServed` needed no change.                                                                                                                                                                                                                | 🔴  | ½ d    |
| 4.2 | ⚠️ **ASCII city slugs first** — the static export of Next 16.2.9 `btoa`-encodes dynamic params and aborts on Hebrew (`InvalidCharacterError`, hit 2026-09-06 on the guides hub); change `serviceAreas[].slug` to `tel-aviv`-style values before this route exists. **`/locations/[city]/` route** with `Service` + `BreadcrumbList` + `FAQPage` schema, sitemap parity, breadcrumbs. | 🟠  | 1 d    |
| 4.3 | **Tier-1 cities only** — up to 8: תל אביב · רמת גן · גבעתיים · בני ברק · פתח תקווה · ראשון לציון · חולון · בת ים.                                                                                                                                                                                                                                                                    | 🟠  | 4–6 d  |
| 4.4 | **Genuinely unique copy per city.** 350-word floor, **and three or more true local specifics** from [content-standards.md](content-standards.md) §2 — neighbourhoods, building stock, access reality, municipal working hours, a city-specific FAQ.                                                                                                                                  | 🔴  | in 4.3 |
| 4.5 | **Bidirectional links** — city ↔ services, city ↔ neighbouring cities from the same `AreaGroup`, hub ↔ children.                                                                                                                                                                                                                                                                     | 🟠  | ½ d    |

> **The stop rule.** If three true, city-specific facts cannot be written for a city, **that city does
> not get a page.** Record it in [business-facts.md](business-facts.md) §E instead of padding. 5 services
> × 14 areas = 70 cells; building them mechanically converts this site into a doorway network, which is
> a ranking _penalty_, not a ranking strategy.

**Exit gate:** every city page passes the substitution test (swap the city name — is it still correct?
then it does not ship) · `local-seo-strategist` and `seo-auditor` clean · sitemap parity · no orphans.

---

## Sprint 5 — E-E-A-T & trust 🔒 (5.2 and 5.3 shipped; the rest blocked on 1.2, 1.5 and 1.6–1.8)

**Goal:** fix the two letters that currently score **zero** — Experience and Authoritativeness. Expertise
is already the site's strong suit; more expert copy will not move a site with no proof and no
corroboration.

| #   | Task                                                                                                                                                                                                                                                                                                                                                     | Pri | Blocked by |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ---------- |
| 5.1 | **Work gallery** — real photos with Hebrew `alt` and a technical caption (element, thickness, method). Faces, plates and unit numbers cropped. **Never stock, never generated.**                                                                                                                                                                         | 🟠  | 1.2        |
| 5.2 | ✅ **Done 2026-08-30.** אור שוורץ (בעלים) on `/about/` in his own words, plus a `Person` node (`#owner`). The photo slot renders an initial until 1.2 lands.                                                                                                                                                                                             | ✅  | —          |
| 5.3 | ✅ **Done 2026-09-06.** `components/Byline.tsx` renders מאת אור שוורץ, בעלים · עודכן: on the five service pages; the `WebPage` node carries `author: {@id #owner}` and the `Person` node is emitted on the same page so the reference resolves in-page. Articles reuse the component and get `author` on their `Article` node when the hub exists (3.1). | ✅  | —          |
| 5.4 | **Populate `sameAs`** in the roster manifest — the GBP first, then any real directory or association profile.                                                                                                                                                                                                                                            | 🟠  | 1.5        |
| 5.5 | **Two case studies** — the structure in [eeat-and-trust.md](eeat-and-trust.md) §5. Client consent, or anonymise the client and keep the technical detail.                                                                                                                                                                                                | 🟠  | 1.2        |
| 5.6 | **Review acquisition, then display, then schema — in that order.** No `Review`/`AggregateRating` JSON-LD until real, publicly verifiable reviews exist.                                                                                                                                                                                                  | 🟠  | 1.5        |
| 5.7 | **Resolve 1.6–1.8** — substantiate or delete the insurance, project-count and founding claims.                                                                                                                                                                                                                                                           | 🟡  | 1.6–1.8    |

**Exit gate:** `eeat-trust-auditor` reports zero unsourced claims · no fabricated testimonial (the build
gate greps for the three removed names — any reappearance is a stop-ship) · every published photo is
this business's own work.

---

## Sprint 6 — Image pipeline & performance 🔒 (triggered by 5.1)

**Do this _before_ the photos ship, not after.** `images: { unoptimized: true }` plus `output: "export"`
means **Next generates no `srcset` at all** — dropping a gallery in as-is puts full-resolution JPEGs on
mobile and destroys LCP on the exact pages meant to build trust.

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Pri | Est |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- |
| 6.1 | **Variant generation.** ⚠️ Largely an **adoption** task, not a build: the vendored `@ishub/site-kit` ships a `SiteImage` component and Cloudflare image transforms via the manifest's `images.mediaHost` (`imgquarry.com`), live-verified serving AVIF for this site's catalogued OG image. Adopt it (catalogue images in the roster `images` block, sync, wire call sites) — or pre-generate 400/800/1200/1600 AVIF/WebP/JPEG under `public/` if the owner prefers binaries in the repo. | 🟠  | ½ d |
| 6.2 | **Real `srcset` + `sizes`** reflecting actual layout width; `width`/`height` on every image (CLS).                                                                                                                                                                                                                                                                                                                                                                                        | 🟠  | ½ d |
| 6.3 | **`loading="lazy"` + `decoding="async"`** below the fold; `fetchpriority="high"` and no lazy on any LCP image.                                                                                                                                                                                                                                                                                                                                                                            | 🟠  | ¼ d |
| 6.4 | **Strip EXIF** — job photos carry GPS and device identifiers.                                                                                                                                                                                                                                                                                                                                                                                                                             | 🔴  | ¼ d |
| 6.5 | **Re-baseline Core Web Vitals.** Confirm the LCP element per route type — it is the Hebrew `<h1>` today, and may change once a gallery exists.                                                                                                                                                                                                                                                                                                                                            | 🟠  | ¼ d |
| 6.6 | ⚪ **Drop `Header` to a server component** (CSS/`<details>` disclosure instead of `useState`) — removes the nav tree from the client bundle on every route.                                                                                                                                                                                                                                                                                                                               | ⚪  | ½ d |

**Exit gate:** [performance-guidelines.md](performance-guidelines.md) §1 budgets met on a throttled
mobile profile · Lighthouse mobile ≥ 90 on `/`, one service page and `/contact/` · `perf-a11y-auditor`
clean on both verdicts.

---

## Sprint 7 — Measurement & consent ✅ DONE (2026-09-16)

**Goal:** stop flying blind. Done: the property is routed by hostname, and container **version 5**
adds a `cta_click` tag plus one GA4 Event tag covering `lead_submit`, `lead_fallback` and
`form_error`. GA4 DebugView confirmed `page_view` and `cta_click` on 2026-09-16.

Container **v7** adds `contact_click` for call and WhatsApp taps. Key events are `lead_submit`
(Once per event) and `contact_click` (Once per session). The owner reported the remaining GA4-side
settings done on 2026-09-16: the four custom dimensions registered and Search Console linked.

⚠️ **Those last two cannot be verified from this repo** — they live only in the GA4 interface. The
check that proves them is a report: build one with `cta_id` as the dimension and confirm it shows
button names rather than "(not set)". Do that before trusting any breakdown by button.

**What is still genuinely unproven:** no real `lead_submit` has been observed yet, because no lead
has been submitted since the tag went live. The first real one confirms the whole path.

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Pri | Blocked by |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | ---------- |
| 7.1 | ✅ **Done.** `G-VMVP7XQKMG` recorded in the roster 2026-08-30; `ops/sync-manifest.ps1 -Confirm` run 2026-09-06, so `site.config.json` carries it (and the `_needsConfirmation` notes moved to `docs/manifest-assumptions.md` instead of the client bundle). Record-keeping only — nothing in the repo reads it.                                                                                                                                              | ✅  | —          |
| 7.2 | ✅ **Verified 2026-09-06** from the live `gtm.js`: the shared container maps `(^\|\.)betonplus\.co\.il$` to the property. Re-verify after any container publish.                                                                                                                                                                                                                                                                                             | ✅  | —          |
| 7.3 | ✅ **Done 2026-09-16 — container v5, extended in v7.** One GA4 Event tag with event name `{{Event}}` on a Custom Event trigger matching the three lead event names, parameters `form`/`reason`/`field` from Data Layer Variables; plus the `cta_click` tag reading `cta_id` from a Custom JavaScript variable over `closest("[data-cta]")`. Remaining GA4-side settings are tracked in 7.8.                                                                  | ✅  | —          |
| 7.4 | 🌩️ **Enable Cloudflare Web Analytics** — cookieless, consent-free, gives real traffic and CWV field data independent of GA4.                                                                                                                                                                                                                                                                                                                                 | 🟠  | owner      |
| 7.5 | **Consent Mode for GA4** if a banner is added; Cloudflare Web Analytics runs unconditionally either way.                                                                                                                                                                                                                                                                                                                                                     | 🟡  | 7.1        |
| 7.6 | 🟡 **Half verified 2026-09-16.** GA4 DebugView showed `page_view` and `cta_click` arriving on the live domain. Still to confirm on the next real submit: `lead_submit`, and that a `page_view` for `/thank-you/` registers — the form navigates with `router.push`, so that view exists only through Enhanced Measurement's history-change tracking.                                                                                                         | 🟡  | —          |
| 7.7 | ✅ **Verified 2026-09-16.** The only pushes are `lead_submit`, `lead_fallback` and `form_error`, carrying `form`/`reason`/`field` only — no name, phone, email or message ever enters `dataLayer`. Since the second 2026-09-16 deploy (`bec05b5e`) every push sends the full parameter shape, so a stale key cannot ride along on the conversion — verified in the live bundle (`form:"lead",reason:void 0,field:void 0`). Re-inspect after any form change. | ✅  | —          |

**Container-ID rule:** whenever an ID changes, assert `https://www.googletagmanager.com/gtm.js?id=<ID>`
returns **200**. Two fabricated IDs once cost the fleet 18 days of zero analytics across every site.

| 7.8 | ✅ **Done 2026-09-16** (owner-reported; GA4-side, not verifiable from the repo). Key events: `lead_submit` (Once per event — the submit button disables during send and the page navigates away, so one visit is one lead) and `contact_click` (Once per session — one person taps call repeatedly). Neither carries a default monetary value: no confirmed lead value exists, and the dialog defaults to US Dollar for a shekel business. Custom dimensions registered for `cta_id`/`form`/`reason`/`field`; Search Console linked. The `/thank-you/` page view is deliberately **not** a key event — it would double-count every lead alongside `lead_submit`. | ✅ | — |
| 7.9 | 🌩️ **Untick BOTH "Full Matches Only" AND "Enable Capture Groups and Replace Functionality"** on the container's `GA4 Measurement ID` RegEx Table, then republish. The keys are written `(^\|\.)<domain>$` for an unanchored apex-or-sub-domain match; full matching adds anchors that cancel the prefix, so `www.<domain>` resolves to nothing. Unticking full matching **alone is worse** — with capture groups still on the variable returns `input.replace(...)`, yielding `wwwG-VMVP7XQKMG`, which fails the Google tag's `^G-` guard and hands the event tags a malformed id. Verified by reimplementing GTM's `__remm`. Fleet-wide: 9 of 11 sites serve `www` on 200. | 🟠 | — |

**Exit gate:** ✅ `cta_click` and `contact_click` confirmed arriving · `dataLayer` verified PII-free ·
key events marked · custom dimensions registered. ⏳ **One item outstanding:** a real `lead_submit`
from an actual form submission has not been observed yet. Confirm it on the first live lead, and at
the same time check that `cta_id` resolves to the attribute value rather than the button's Hebrew
label.

---

## Sprint 8 — Security close-out 🔧 (unblocked; sequence after Sprint 7)

| #   | Task                                                                                                                                                                                                                                                                                                                                                                                                                             | Pri | Est         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ----------- |
| 8.1 | **Collect CSP violation reports** for a full traffic cycle. ⚠️ **Blocked on an endpoint:** the live report-only policy has **no `report-to`/`report-uri`** and no `Reporting-Endpoints` header, so nothing is collected today. Choose a collector (third-party report endpoint, or a Cloudflare Worker — owner account), add the directive to `public/_headers`, deploy, then observe.                                           | 🟡  | owner + ¼ d |
| 8.2 | **Replace `'unsafe-inline'`.** A single GTM-snippet hash is **not enough**: the static export ships ~28 inline scripts per page (Next's RSC payload pushes). Either a `postbuild` step that hashes every inline script per route and emits per-path `_headers` rules (regenerated every build; mind the Pages rule limit), or keep `'unsafe-inline'` for `script-src` and harden the other directives. Decide before estimating. | 🟡  | ½–1 d       |
| 8.3 | **Promote to enforcing `Content-Security-Policy`.** Promoting early breaks GTM silently and takes analytics down with it — which is why this follows Sprint 7.                                                                                                                                                                                                                                                                   | 🟡  | ¼ d         |
| 8.4 | ✅ **Done 2026-09-06, live 2026-09-16 (verified: no ACAO header on the origin response).** `! Access-Control-Allow-Origin` under `/*` in `public/_headers` detaches the Pages default wildcard (it was misfiled as a zone change). Verify post-deploy with `curl -sSI`.                                                                                                                                                          | ✅  | —           |
| 8.5 | **Re-check `/privacy/` against actual data flow** after every Sprint 7 change. Partial: it names Web3Forms correctly but still hedges analytics ("ייתכן … כגון Google Analytics") and never names Google Tag Manager, which is unconditionally live. Once 7.3/7.6 confirm the tags, state GTM + GA4 definitively (cookies, purpose, opt-out).                                                                                    | 🟠  | ¼ d         |

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

1. ✅ **Sprint 1 questions sent** — 1.1, 1.3 and 1.4 answered; **1.2 (photos) and 1.5 (GBP) still open
   and still blocking sprints 5 and 6.** Chase those two.
2. ✅ **Sprint 2 shipped in full 2026-08-31** — typed areas, header one-hop, `llms.txt`, the date
   signal, the title guard, and 1.2 MB of dead code gone. Deployed the same day.
3. ✅ **Sprint 3.1–3.4 shipped 2026-09-06** — the hub and four articles. Next: deploy, resubmit the
   sitemap (19 URLs) — deployed 2026-09-16; then the remaining Tier-3 topics. _(Was:)_ the guides hub and the first two articles — the largest ranking and AEO
   gain available without the owner, and the next thing to start.

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
