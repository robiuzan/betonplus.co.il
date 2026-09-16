---
name: tracking-analytics
description: GTM, GA4 and conversion events for betonplus on the shared Israeli fleet container GTM-KWGGH438 — head placement, hostname-based GA4 routing inside the container, the data-cta inventory and its gaps, lead_submit, thank-you-URL conversions, Search Console verification drift, and the mandatory gtm.js 200-check whenever a container id changes. Use when turning on analytics or when conversions are not being recorded. Triggers: "set up GTM", "GA4", "track calls", "conversion tracking not firing", "Search Console", "container id".
---

# Tracking & analytics

## The container is shared — this changes everything

`GTM-KWGGH438` is **one container for all ~10 Israeli fleet domains**, with GA4 resolved _inside_ the
container by a RegEx table on `{{Page Hostname}}`. Consequences:

- Changing container config affects **every fleet site**, not just betonplus. Never edit a shared
  trigger or variable to fix one site — add a hostname condition.
- betonplus's GA4 property is resolved in the container, not in this repo. `analytics.ga4MeasurementId`
  (`G-VMVP7XQKMG`, in the roster and synced to `site.config.json`) is record-keeping — nothing in the
  repo reads it. The live `gtm.js` maps the `betonplus.co.il` hostname to that property
  (re-verified 2026-09-16 on container version 5).
- The container id lives in the **roster manifest**, not `site.config.json` directly.

## The 200-check — non-negotiable

**A GTM snippet in the HTML proves nothing.** A wrong id renders identical markup and silently collects
nothing.

```bash
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

**200 or the id is wrong.** Two fabricated container ids in a row previously cost the Israeli fleet
**18 days of zero analytics across every site**, with the snippet sitting in the HTML looking correct
the whole time. betonplus's `_needsConfirmation` flagged `analytics.gtmId` at the time and the flag went
unchased. Run this check any time an id changes, and again after deploy.

Verified 2026-08-16: `GTM-KWGGH438` returns 200 and is present in the live HTML of betonplus.co.il.

## Head placement (backlog §13.1) — done

`app/layout.tsx` renders the GTM loader inside an **explicit `<head>`** (since 2026-08-25). React 19
hoists `<link>` tags on its own but does **not** hoist an inline `dangerouslySetInnerHTML` script, so
the explicit `<head>` is what puts the snippet where Google's install requires it. The `<noscript>`
iframe stays in `<body>`.

```tsx
<head>{gtmHead && <script id="gtm-init" dangerouslySetInnerHTML={{ __html: gtmHead }} />}</head>
```

Note this inline script is what a future CSP must accommodate — see `/web-security-headers`.

The loader is inert by design: `gtmHeadSnippet(manifest.analytics?.gtmId)` renders nothing when the id
is absent, so a site with no container ships no snippet.

## The `data-cta` inventory

Call and WhatsApp conversions are tracked in GTM by click triggers reading `data-cta`. **No JS ships
for them**, which is why the attribute is load-bearing. Convention: `{location}-{action}`.
`components/ui.tsx` threads it through `Button`, so adding one is a single prop.

**Coverage is complete as of 2026-08-17** (backlog §13.2). The full inventory:

| Surface          | Attributes                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Header / Hero    | `header-call` · `hero-call` · `hero-form`                                                                                                       |
| Service sidebar  | `sidebar-call` · `sidebar-whatsapp` · `sidebar-form`                                                                                            |
| Pricing          | `pricing-call` · `pricing-whatsapp` · `pricing-form`                                                                                            |
| Contact section  | `contact-call` · `contact-whatsapp` · `contact-email`                                                                                           |
| Form             | `form-submit` · `form-whatsapp-fallback`                                                                                                        |
| Thank-you        | `thankyou-call` · `thankyou-whatsapp`                                                                                                           |
| 404              | `notfound-call` · `notfound-whatsapp` · `notfound-home`                                                                                         |
| Articles         | `article-call` · `article-whatsapp` (the closing `cta` block)                                                                                   |
| Footer           | `footer-call` · `footer-whatsapp` · `footer-email`                                                                                              |
| Sticky bar / CTA | `sticky-call` · `sticky-whatsapp` (mobile bar) · `bubble-whatsapp` (desktop bubble, renamed 2026-08-31) · `finalcta-call` · `finalcta-whatsapp` |

26 unique values, each used once in source (`grep -rhoE 'data-cta="[^"]+"' app components | sort -u`).

A new CTA without an attribute is permanently invisible — audit before shipping:

```bash
grep -rn 'href={telHref}\|href={whatsappHref}' components app | grep -v 'data-cta'
```

## Events

- `trackEvent("lead_submit", { form: "lead" })` fires **only on confirmed Web3Forms success**, never on
  submit. The dev-mode simulation deliberately doesn't fire it. Keep both properties — firing on
  submit inflates conversions with failures.
- **`/thank-you/` exists (2026-08-17)** — the form navigates there on confirmed success. Register its
  page view as the URL-based conversion in GA4/Google Ads; it is noindex and sitemap-excluded so the
  count stays clean.
- **Never put PII in `dataLayer`** — no name, phone, email or message text. The current call sends only
  `{ form: "lead" }`, which is correct.

## GA4 and Search Console

- **GA4 property** for betonplus.co.il: `G-VMVP7XQKMG` — in the roster since 2026-08-30, synced to
  `site.config.json` 2026-09-06, and routed by hostname in the live container, so **page views flow**.
- **The event tags shipped in container v5** (2026-09-16). Two GA4 Event tags:
  `cta_click`, on an all-elements click trigger scoped to `[data-cta], [data-cta] *`, sending
  `cta_id` from a Custom JavaScript variable that walks `closest("[data-cta]")` — so a click on an
  icon inside a button still resolves to the button's id; and one tag whose event name is
  `{{Event}}`, on a Custom Event trigger matching `^(lead_submit|lead_fallback|form_error)$`,
  sending `form`, `reason` and `field` from Data Layer Variables. DebugView confirmed `page_view`
  and `cta_click` the same day.
- **Still open on the GA4 side** (not container work, not repo work): mark `lead_submit` and the
  `/thank-you/` page view as **Key events**; register `cta_id`, `form`, `reason` and `field` as
  **event-scoped custom dimensions** — until that is done GA4 receives them but no report can show
  them; and link Search Console.
- 🌩️ **Still open in the container, and it affects every fleet site:** the hostname lookup table has
  **Full matching** ticked. GTM anchors the key when that is on, which cancels the `(^|\.)`
  sub-domain prefix every row uses, so `www.<domain>` resolves to no measurement id and collects
  nothing. Untick it and republish. The container also holds a second, unreferenced copy of the
  `data-cta` Custom JavaScript variable — clutter, not a defect.
- **Search Console:** resolved 2026-08-17 — the token lives in the roster manifest
  (`analytics.googleSiteVerification`), synced to `site.config.json`, read from the manifest in
  `app/layout.tsx` (renders nothing when null, so clones don't inherit it). Sitemap submitted
  2026-09-03 (14 URLs, 0 errors); resubmit after the guides hub ships (19 URLs).

## Verifying a deploy

1. Live page source contains `googletagmanager.com/gtm.js?id=` — ideally inside `<head>`.
2. `curl` the `gtm.js` URL → 200.
3. GTM Preview mode on the live domain: fire a call click, a WhatsApp click, and a form submit; confirm
   each trigger fires **once**.
4. GA4 Realtime shows the events with the right hostname.
5. Confirm no PII appears in any `dataLayer` push.

## Checklist

- [ ] GTM script in `<head>`; `<noscript>` iframe in `<body>`.
- [ ] `gtm.js?id=…` returns 200.
- [ ] Every CTA has a `data-cta` following `{location}-{action}`.
- [ ] `lead_submit` fires only on confirmed success.
- [ ] No PII in `dataLayer`.
- [ ] Container edits are hostname-scoped so other fleet sites are unaffected.
- [ ] GA4 key events marked; custom dimensions registered for `cta_id`/`form`/`reason`/`field`;
      Search Console token in the manifest and the property linked; sitemap submitted.
- [ ] `cta_id` in DebugView reads the attribute value (`header-call`), not the button's Hebrew label.
- [ ] Every form event pushes the **full** parameter shape — see the Gotchas.

## Gotchas

- Editing `site.config.json` directly is wrong — the id syncs from the roster.
- A shared container means a broken trigger is a **fleet-wide** outage. Test in Preview first.
- **Client-side route changes DO happen here.** The lead form calls `router.push("/thank-you/")`, an
  App Router navigation with no document load, so there is no fresh `gtm.js` event for that page. The
  `/thank-you/` page view exists only through GA4 Enhanced Measurement's history-change tracking —
  confirm it appears in DebugView before marking it a key event. (This bullet previously said the
  opposite; a static export still ships a client-side router.)
- **GTM keeps dataLayer values between events.** Each push is merged into one persistent model, so a
  key set by an earlier event survives until something overwrites it — a `form_error` with
  `field: "phone"` followed by a successful `lead_submit` would attach that field to the conversion.
  `components/ContactForm.tsx` therefore routes all three events through a `trackFormEvent` helper
  that always sends `form`, `reason` and `field`, passing `undefined` where a key does not apply.
  Keep that property when adding an event.
- **Do not add Click URL to the `cta_click` tag.** The WhatsApp delivery-failure fallback link carries
  the visitor's own name, phone and message in its query string; sending `cta_id` alone keeps that out
  of GA4.
