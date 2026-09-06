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

| Component             | State                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| GTM container         | ✅ `GTM-KWGGH438` — verified HTTP 200, live in production, loaded from `<head>`                         |
| GTM placement         | ✅ In `<head>` via an explicit `<head>` in `app/layout.tsx` (React 19 does not hoist inline scripts)    |
| GA4 property          | 🔴 **`analytics.ga4MeasurementId` is `null` in the roster** — the container fires into nothing          |
| Search Console        | ✅ Token in the roster manifest, read from the manifest in `app/layout.tsx`                             |
| Sitemap               | ✅ `/sitemap.xml` submitted to Search Console 2026-09-03 — 14 URLs, 0 errors, 0 warnings, 0 indexed yet |
| CTA instrumentation   | ✅ Full `data-cta` coverage ([ux-cro-security.md](ux-cro-security.md) §4)                               |
| Lead event            | ✅ `lead_submit` on confirmed delivery, then `/thank-you/`                                              |
| Server-side analytics | ❌ none                                                                                                 |
| CRM                   | ❌ none — leads arrive as email                                                                         |

**The single most important fact on this page: we are not currently collecting any analytics data.**
The container is live and the events are wired, but with no GA4 measurement ID they land nowhere. Every
"did it work?" question in [seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md) §7 is unanswerable until
the owner creates the property.

---

## 2. Fixing the measurement gap — the ordered path

1. **Owner creates a GA4 property** for `betonplus.co.il` and supplies the measurement ID.
2. The ID goes into the **roster manifest** (`analytics.ga4MeasurementId`), then syncs down. Never into
   `site.config.json` and never hardcoded in a component.
3. Inside the shared container, the GA4 tag is routed **by hostname** — that is how one container serves
   the whole IL fleet without cross-contaminating properties. Verify the hostname condition before
   publishing the container version.
4. Mark `lead_submit` and the `/thank-you/` pageview as **conversions** in GA4.
5. Link GA4 ↔ Search Console.
6. Verify end to end with GTM Preview **and** GA4 DebugView — a tag that fires in Preview but not in
   DebugView is a routing failure, not a success.

> **Container-ID rule, from a fleet incident: a GTM snippet in the HTML proves nothing.** Whenever a
> container ID changes, assert that `https://www.googletagmanager.com/gtm.js?id=<ID>` returns **200**.
> Two fabricated IDs once cost the fleet 18 days of zero analytics across every site. `GTM-KWGGH438` is
> verified.

---

## 3. The dataLayer contract

One shared vocabulary, so the container's triggers never depend on a component's internals.

| Event           | When                                                | Parameters                                           |
| --------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `cta_click`     | Any element with `data-cta` is clicked              | `cta_id` (the `data-cta` value), `page_path`         |
| `lead_submit`   | Form delivery **confirmed** by Web3Forms            | `service_category`, `area_group` — **both optional** |
| `lead_fallback` | Delivery failed and the WhatsApp fallback was shown | `page_path`                                          |
| `form_error`    | Client-side validation blocked a submit             | `field` (`name` \| `phone`)                          |

**Rules — these are hard:**

- **Never put PII in `dataLayer`.** No name, phone, email, free-text message, or anything derived from
  them. A "hashed phone" is still PII to a privacy regulator and is banned here.
- **`lead_submit` fires only after confirmed delivery**, never on click of the submit button. A
  submit-click conversion inflates the number that the whole site is optimised against.
- **Naming is snake_case and stable.** Renaming an event orphans every historical report.
- **The event name is the contract; the container owns the interpretation.** Do not encode GA4-specific
  parameters in component code.
- Events are pushed through `trackEvent` from `@ishub/site-kit/analytics` — never `window.dataLayer.push`
  written by hand in a component.

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
5. GA4 DebugView shows the same events (once the property exists).
6. `dataLayer` contains **no** name, phone, email or message text — inspect it directly.
7. Search Console: the verification meta tag is still present and the property still verified.
