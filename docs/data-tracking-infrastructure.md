# Data & tracking infrastructure

How this site is measured without slowing it down or collecting anything it shouldn't. Mechanics live
in the `/tracking-analytics` skill; this file is the **architecture and the contract**.

---

## 1. The stack as it stands

```
Static HTML (Cloudflare Pages)
   |
   +-- <head>  inline GTM loader  -> gtm.js  (container GTM-KWGGH438, shared IL fleet container)
   |                                   |
   |                                   +-- GA4 tag, routed by hostname inside the container
   |                                          -> measurement ID for betonplus.co.il: NOT SET
   |
   +-- <body>  <noscript> GTM iframe
   |
   +-- data-cta="..."  on every conversion element  -> click triggers in the container
   +-- trackEvent("lead_submit")  from @ishub/site-kit/analytics  -> dataLayer
   +-- navigation to /thank-you/   -> URL-based conversion
   |
   +-- form POST -> api.web3forms.com -> email to info@betonplus.co.il   [the actual lead delivery]
```

| Component             | State                                                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GTM container         | ✅ `GTM-KWGGH438` — verified HTTP 200, live in production, loaded from `<head>`                                                                                                     |
| GTM placement         | ✅ In `<head>` via an explicit `<head>` in `app/layout.tsx` (React 19 does not hoist inline scripts)                                                                                |
| GA4 property          | ✅ `G-VMVP7XQKMG` — routed by hostname in the container; **event tags live since container v5 (2026-09-16)**. DebugView confirmed `page_view` and `cta_click` arriving the same day |
| Search Console        | ✅ Token in the roster manifest, read from the manifest in `app/layout.tsx`                                                                                                         |
| Sitemap               | ✅ `/sitemap.xml` submitted to Search Console 2026-09-03 — 14 URLs, 0 errors, 0 warnings; re-fetched 09-04                                                                          |
| Indexing              | 🟠 **1/14 indexed** (2026-09-06). Only `/` is in the index (crawled 08-22); the other 13 are discovered via the sitemap but **not yet crawled** — see §1a                           |
| CTA instrumentation   | ✅ Full `data-cta` coverage ([ux-cro-security.md](ux-cro-security.md) §4)                                                                                                           |
| Lead event            | ✅ `lead_submit` on confirmed delivery → `/thank-you/`, plus `lead_fallback` and `form_error`; one GA4 Event tag on a Custom Event trigger matching all three                       |
| Server-side analytics | ❌ none                                                                                                                                                                             |
| CRM                   | ❌ none — leads arrive as email                                                                                                                                                     |

**The single most important fact on this page: the measurement chain is closed end to end.**
Container **version 5** (published 2026-09-16) carries the Google tag routed by hostname, a
`cta_click` GA4 Event tag reading `cta_id` from the `data-cta` attribute, and one GA4 Event tag
whose event name is `{{Event}}` firing on a Custom Event trigger matching
`^(lead_submit|lead_fallback|form_error)$` with `form`, `reason` and `field` as parameters. GA4
DebugView confirmed `page_view` and `cta_click` arriving on 2026-09-16.

What is **not** yet true: the three lead events have not been observed from a real submit; GA4-side work is all that remains: mark `lead_submit` and the `/thank-you/` page view as key events, register `cta_id`, `form`, `reason` and `field` as event-scoped custom dimensions (until then they are transmitted but appear in no report), and link GA4 to Search Console.

_(Read the container, never this page, when the two disagree. On 2026-09-06 this file said the id was
`null`; before that it said the property did not exist. Both were stale.)_

---

## 1a. Indexing status — the sitemap is not the bottleneck

`/sitemap.xml` was submitted 2026-09-03 and accepted cleanly (14 URLs, 0 errors, 0 warnings); Google
re-fetched it on 09-04. **Discovery is working — the sitemap is the recorded discovery source for the
pages Google knows about.**

What the URL Inspection API showed on 2026-09-06:

| State                                | Count | Meaning                                          |
| ------------------------------------ | ----- | ------------------------------------------------ |
| `Submitted and indexed`              | 1     | `/` only — last crawled 2026-08-22               |
| `Discovered - currently not indexed` | 6–13  | Google knows the URL, **has not fetched it yet** |
| `URL is unknown to Google`           | 0–7   | not yet registered in this replica               |

The split between the last two **flip-flopped between consecutive API calls minutes apart** — GSC was
returning inconsistent snapshots because it was actively processing the sitemap. Do not treat either
number as settled. The fact that held across every call: **`lastCrawlTime` was absent on all 13
non-homepage routes — none of them has been crawled even once.**

Two consequences worth internalising:

- This is **not** `Crawled - currently not indexed`. Google has not judged these pages and found them
  wanting; it simply has not fetched them. The fix is not more on-page SEO.
- Internal linking is **not** the cause either — every one of the 13 routes is linked from the
  homepage (verified against `out/index.html`; 1–3 links each, zero orphans).

The real constraint is crawl scheduling on a new, low-authority domain. What moves it: external
authority (a live Google עסק שלי listing, real citations, genuine inbound links) and time. What does
not move it: re-submitting the sitemap, or editing metadata that is already correct.

⚠️ **Google's Indexing API cannot be used here** — it accepts only `JobPosting` and `BroadcastEvent`
pages. Per-URL "Request Indexing" is a manual action in the Search Console UI, not scriptable. If the
owner wants to prioritise, the highest-value manual requests are `/services/` and the five service
pages.

---

## 2. Fixing the measurement gap — the ordered path

1. ✅ **Owner created the GA4 property** — `G-VMVP7XQKMG`, supplied 2026-08-30.
2. ✅ The ID went into the **roster manifest** (`analytics.ga4MeasurementId`) and was synced down with
   `ops/sync-manifest.ps1 -Confirm` on 2026-09-06. Never edit `site.config.json` by hand and never
   hardcode the id in a component — nothing in the repo reads it; GA4 lives entirely in the container.
3. ✅ Inside the shared container the Google tag is routed **by hostname** — verified 2026-09-06 in the
   live `gtm.js`. That is how one container serves the whole IL fleet without cross-contaminating
   properties. Re-verify after every container publish.
4. ✅ **The event tags shipped** in container **v5** (2026-09-16): one GA4 Event tag on a Custom
   Event trigger matching `^(lead_submit|lead_fallback|form_error)$` with the event name set to
   `{{Event}}`, and the `cta_click` tag on an all-elements click trigger scoped to
   `[data-cta], [data-cta] *`, whose `cta_id` comes from a Custom JavaScript variable walking
   `closest("[data-cta]")` so a click on an icon inside a button still resolves.
5. 🔴 Mark `lead_submit` and the `/thank-you/` page view as **key events** in GA4.
6. 🔴 Register `cta_id`, `form`, `reason` and `field` as **custom dimensions** (event scope).
   Until this is done GA4 receives them but no report can display them.
7. 🔴 Link GA4 ↔ Search Console.
8. Verify end to end with GTM Preview **and** GA4 DebugView — a tag that fires in Preview but not in
   DebugView is a routing failure, not a success. Record the date and result in §8.

> ⚠️ **Two container-side items are still open, and the first affects the whole fleet.**
>
> **`www` collects nothing, and the fix needs TWO checkboxes, not one.** GTM's RegEx Table
> (`__remm`) does `if (fullMatch) key = "^" + key + "$"`, then `regex.test(input)`, then — only when
> capture groups are enabled — `String(input).replace(regex, output)`. The table's keys are written
> `(^|\.)<domain>$`, designed for an unanchored "apex or any sub-domain" match. With **Full Matches
> Only** ticked the extra anchors cancel that prefix, so `www.<domain>` matches no row and returns
> no measurement id.
>
> Unticking **Full Matches Only** on its own is **worse, not better**: with **Enable Capture Groups
> and Replace Functionality** still ticked, the variable returns `input.replace(...)`, which keeps
> the unmatched prefix — `www.betonplus.co.il` yields the string `wwwG-VMVP7XQKMG`. That fails the
> Google tag's `^G-` guard, so page views stay dead, and it hands the two event tags a malformed id.
>
> **Untick both** (verified by reimplementing `__remm`: apex and `www` then both return
> `G-VMVP7XQKMG`, and an unlisted host such as a `*.pages.dev` preview still returns nothing).
> Neither flag is load-bearing here — no output value contains a `$1` back-reference. betonplus
> still serves `www` on 200 (backlog §1.8), as do most fleet sites, so this is fleet-wide.
>
> Separately, the container holds a second, unreferenced copy of the `data-cta` Custom JavaScript
> variable — clutter, not a defect.

> **Container-ID rule, from a fleet incident: a GTM snippet in the HTML proves nothing.** Whenever a
> container ID changes, assert that `https://www.googletagmanager.com/gtm.js?id=<ID>` returns **200**.
> Two fabricated IDs once cost the fleet 18 days of zero analytics across every site. `GTM-KWGGH438` is
> verified.

---

## 3. The dataLayer contract

One shared vocabulary, so the container's triggers never depend on a component's internals.

| Event           | When                                                | Parameters                                                        |
| --------------- | --------------------------------------------------- | ----------------------------------------------------------------- |
| `cta_click`     | Any element with `data-cta` is clicked              | derived **in the container** from `data-cta` — not pushed by code |
| `lead_submit`   | Form delivery **confirmed** by Web3Forms            | `form` (`lead`)                                                   |
| `lead_fallback` | Delivery failed and the WhatsApp fallback was shown | `form`, `reason` (`delivery` \| `no_key`)                         |
| `form_error`    | Client-side validation blocked a submit             | `form`, `field` (`name` \| `phone`) — never the value             |

_Status 2026-09-06: `lead_submit`, `lead_fallback` and `form_error` are pushed by
`components/ContactForm.tsx`; `cta_click` is a container-side click trigger that does not exist yet
(§2 step 4). Page path is a built-in GTM variable and is not pushed._

**Rules — these are hard:**

- **Never put PII in `dataLayer`.** No name, phone, email, free-text message, or anything derived from
  them. A "hashed phone" is still PII to a privacy regulator and is banned here.
- **`lead_submit` fires only after confirmed delivery**, never on click of the submit button. A
  submit-click conversion inflates the number that the whole site is optimised against.
- **Naming is snake_case and stable.** Renaming an event orphans every historical report.
- **The event name is the contract; the container owns the interpretation.** Do not encode GA4-specific
  parameters in component code.
- Events are pushed through `trackEvent` from `@ishub/site-kit/analytics` — never `window.dataLayer.push`
  written by hand in a component. `trackEvent` pushes `{ event, ...params }` **flat**, which is what
  the container's Data Layer Variables read.
- **Every push carries the full parameter shape.** GTM merges pushes into one persistent model, so a
  key set by an earlier event survives until something overwrites it: a `form_error` with
  `field: "phone"` followed by a successful `lead_submit` would attach that field to the conversion.
  `components/ContactForm.tsx` routes all three events through a local `trackFormEvent` helper that
  always sends `form`, `reason` and `field`, passing `undefined` where a key does not apply.

---

## 4. Lightweight & server-side analytics

The brief asks for server-side analytics. On a static export behind Cloudflare Pages, the honest option
set is short, and the recommendation is not the most sophisticated one.

| Option                             | Weight on the page                                       | Verdict                                                                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare Web Analytics**       | ~ 1 small beacon, no cookies                             | ✅ **Ship this.** Free, privacy-first, consent-free, gives real traffic + CWV field data independent of GA4                                                                       |
| **Cloudflare Zaraz**               | Moves third-party tags off the main thread, edge-managed | ✅ **Worth evaluating with the owner.** The closest thing to "server-side tagging" available at zero infrastructure cost                                                          |
| **Server-side GTM (sGTM)**         | None on the page                                         | ⚠️ **Defer.** Requires a hosted container (Cloud Run / Worker), ongoing cost and maintenance. Justified by ad-spend attribution, which does not exist yet                         |
| **Self-hosted Plausible / Umami**  | ~1 KB script                                             | ⚠️ Only if the owner wants to leave Google entirely — it adds a server to maintain                                                                                                |
| **Cloudflare access-log analysis** | Zero                                                     | ✅ Free and genuinely useful for one job: **sampling AI-crawler user agents** to see whether assistants actually fetch us ([seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md) §7) |

**Recommended posture:** Cloudflare Web Analytics as the always-on, consent-free baseline; GTM + GA4 as
the conversion and behaviour layer once the property exists; Zaraz evaluated if a third tag is ever
added; sGTM only when there is paid media to attribute.

Both Cloudflare options are **zone-level settings — owner-only**. Document the exact toggle; never
assume it was flipped.

---

## 5. What we can and cannot measure

| Signal                        | Measurable?                                                              |
| ----------------------------- | ------------------------------------------------------------------------ |
| Page views, sources, devices  | ✅ Once GA4 exists (and immediately via Cloudflare Web Analytics)        |
| Call **tap**                  | ✅ `cta_click` with `cta_id="header-call"` / `hero-call` / `sticky-call` |
| Call **connected / answered** | ❌ Not without a call-tracking number, which fragments NAP consistency   |
| WhatsApp **tap**              | ✅                                                                       |
| WhatsApp **conversation**     | ❌ Not without the WhatsApp Business API                                 |
| Form submit                   | ✅ `lead_submit` + `/thank-you/`                                         |
| Lead → job won                | ❌ Not without a CRM (§6)                                                |

**Design implication:** the two primary goals are structurally unconfirmable. Optimise on **tap rate**,
treat it as an upper bound, and reconcile against the owner's real job count periodically.

**On call tracking:** a dynamic-number-insertion service would close the gap, but it publishes a phone
number that differs from the one in the manifest, the JSON-LD and (eventually) the GBP. For a local
trade whose ranking depends on NAP consistency, that trade is **not worth it**. If the owner insists,
use a single static tracking number consistently everywhere or not at all.

---

## 6. CRM integration

Today a lead is an email. That is fine at current volume and it is the reason the site has no backend
to maintain.

**When a CRM becomes justified** (roughly: more leads than one inbox can triage, or a need to measure
lead → job), integrate it **without touching the page**:

- ✅ **Web3Forms webhook → the CRM.** Server-to-server, zero page weight, zero PII in the browser.
- ✅ **Email parsing / a Zapier-style relay** off the delivery inbox. Crude but costs the page nothing.
- ❌ **A CRM JavaScript snippet in the page.** Chat widgets and tracking pixels are the single most
  common cause of a collapsed INP score on a site like this, and they read the form fields — i.e. the
  PII — client-side.

**Rules for any integration:**

- Nothing on the critical path. Nothing render-blocking. No new render-blocking request, ever.
- Every third-party origin needs a **CSP entry** in `public/_headers`
  ([ux-cro-security.md](ux-cro-security.md) §6) before it will work in enforcing mode.
- A new processor of personal data means `/privacy/` changes **in the same commit**.
- Budget check against [performance-guidelines.md](performance-guidelines.md) §1 before, not after.

---

## 7. Privacy & consent

- **The lead form is the only place personal data is collected.** Name, phone and free text go to
  Web3Forms, which relays to `info@betonplus.co.il`. `/privacy/` must describe exactly that.
- **GA4 sets cookies.** Israeli practice and any EU visitor make a consent decision necessary. The
  cheapest correct posture: run **Cloudflare Web Analytics unconditionally** (cookieless) and gate GA4
  behind **GTM Consent Mode**.
- **If a consent banner is ever added:** it must be a fixed overlay that reserves no layout space
  (CLS — [performance-guidelines.md](performance-guidelines.md) §5), must be keyboard-operable and
  screen-reader-announced ([accessibility-and-i18n.md](accessibility-and-i18n.md) §3), and must be in
  Hebrew. Reject must be as easy as accept.
- **IP anonymisation on** in GA4. **No user-ID, no cross-site identifiers, no remarketing audiences**
  unless the owner explicitly asks and `/privacy/` is updated to match.
- **Data retention** set deliberately in GA4, not left at the default.

---

## 8. Verification routine

Run after any tracking change, and after every deploy that touches `app/layout.tsx`:

1. `curl -s https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438 -o /dev/null -w "%{http_code}"` → `200`.
2. View source on the live site: the GTM snippet is in `<head>`, the `<noscript>` iframe in `<body>`.
3. GTM Preview: click one CTA of **each** `data-cta` family; each fires exactly once.
4. Submit the form with a real number; confirm `lead_submit` fires **once**, on the confirmed response,
   and that `/thank-you/` registers.
5. GA4 DebugView shows the same events (property `G-VMVP7XQKMG`). Confirmed for `page_view` and
   `cta_click` on 2026-09-16; confirm `lead_submit` the first time a real lead is submitted.
   Check `cta_id` reads an id such as `header-call`, not the button's Hebrew label.
6. `dataLayer` contains **no** name, phone, email or message text — inspect it directly.
7. Search Console: the verification meta tag is still present and the property still verified.
