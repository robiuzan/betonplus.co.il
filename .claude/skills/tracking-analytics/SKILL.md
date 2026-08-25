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
  being `null` locally is expected; the property still has to exist (backlog §13.3).
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

## Head placement (backlog §13.1)

`app/layout.tsx:51` renders the GTM script as the **first child of `<body>`**. Google's own install
requires `<head>`; body placement delays container load and can miss early events.

This layout has no explicit `<head>` element — React 19 hoists the `<link>` tags on their own. Adding
the script to a real `<head>` is the fix; keep the `<noscript>` iframe in `<body>`, where it belongs.

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

| Surface          | Attributes                                                                |
| ---------------- | ------------------------------------------------------------------------- |
| Header / Hero    | `header-call` · `hero-call`                                               |
| Service sidebar  | `sidebar-call` · `sidebar-whatsapp` · `sidebar-form`                      |
| Contact section  | `contact-call` · `contact-whatsapp` · `contact-email`                     |
| Form             | `form-submit` · `form-whatsapp-fallback`                                  |
| Thank-you        | `thankyou-call` · `thankyou-whatsapp`                                     |
| Footer           | `footer-call` · `footer-whatsapp` · `footer-email`                        |
| Sticky bar / CTA | `sticky-call` · `sticky-whatsapp` · `finalcta-call` · `finalcta-whatsapp` |

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

- **GA4 property** for betonplus.co.il: `analytics.ga4MeasurementId` is `null` in the roster. Once the
  property exists, the measurement id goes in the roster manifest and the container's hostname table.
- Mark `lead_submit`, call clicks and WhatsApp clicks as **Key events** in GA4, or they won't appear as
  conversions.
- **Search Console:** resolved 2026-08-17 — the token lives in the roster manifest
  (`analytics.googleSiteVerification`), synced to `site.config.json`, read from the manifest in
  `app/layout.tsx` (renders nothing when null, so clones don't inherit it). Next step: submit
  `https://betonplus.co.il/sitemap.xml`.

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
- [ ] GA4 key events marked; Search Console token in the manifest; sitemap submitted.

## Gotchas

- Editing `site.config.json` directly is wrong — the id syncs from the roster.
- A shared container means a broken trigger is a **fleet-wide** outage. Test in Preview first.
- Client-side route changes don't apply here (static export, full page loads), so a History Change
  trigger is not needed and will not fire.
