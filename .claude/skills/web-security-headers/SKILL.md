---
name: web-security-headers
description: Security posture for a static export on Cloudflare Pages — the live public/_headers (HSTS, X-Frame-Options, Permissions-Policy, nosniff, Referrer-Policy, the detached ACAO wildcard), a report-only-first CSP path around the inline GTM snippet, public/_redirects, PII and consent on the Web3Forms lead form, secret hygiene, and the dead GitHub Pages origin. Use when adding headers, planning a CSP, or auditing security. Triggers: "security headers", "CSP", "HSTS", "_headers", "is the form safe", "clickjacking".
---

# Security headers & posture

`output: "export"` means Next's `headers()` is unavailable. **Cloudflare Pages reads
`public/_headers`** — shipped 2026-08-17 (backlog §12.1) with HSTS (no `preload`),
`X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` and a **report-only** CSP. ✅ **Live at the edge** since the 2026-08-17 deploy and re-verified 2026-09-06 — the table below is
the current production response.

## What the live site actually returns

Verified against `https://betonplus.co.il/` on 2026-09-06 (cache-busted, UA-bearing curl):

| Header                                             | Status                                                                                                    |
| -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `strict-transport-security`                        | ✅ `max-age=31536000; includeSubDomains` (no `preload`, deliberately)                                     |
| `x-frame-options: SAMEORIGIN`                      | ✅                                                                                                        |
| `x-content-type-options: nosniff`                  | ✅                                                                                                        |
| `referrer-policy: strict-origin-when-cross-origin` | ✅                                                                                                        |
| `permissions-policy`                               | ✅ camera, microphone, geolocation, browsing-topics, payment, usb, serial, midi, display-capture all `()` |
| `content-security-policy-report-only`              | ✅ present — **no `report-to`/`report-uri`**, so nothing collects its reports                             |
| `access-control-allow-origin`                      | ⚠️ `*` (Pages default) — `! Access-Control-Allow-Origin` added 2026-09-06, live after the next deploy     |
| `/_next/static/*` `cache-control`                  | ✅ `public, max-age=31536000, immutable`                                                                  |
| `/opengraph-image` `content-type`                  | ✅ `image/png` (extensionless file, typed by `_headers`)                                                  |

**Always verify against the live response, never against the repo's intent:**

```bash
curl -sSI https://betonplus.co.il/ | grep -iE 'strict-transport|content-security|x-frame|permissions|access-control'
```

## `public/_headers` — the baseline

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

Notes before shipping this:

- **HSTS `preload` is close to irreversible.** Only add the `preload` token if the owner accepts that
  the domain and every subdomain must stay HTTPS indefinitely. Ship `max-age` first without it — the
  block above deliberately omits it.
- `SAMEORIGIN` over `DENY` leaves room for a future Business Profile or map embed of the site itself.
- Cloudflare Pages merges `_headers` with its defaults; it does not replace them.

## CSP — report-only first, always

GTM is injected via `dangerouslySetInnerHTML` in `app/layout.tsx`, and **a static export cannot
generate a per-request nonce**. So the options are a hash of the inline snippet, or `'unsafe-inline'`
for scripts. Neither is free, which is exactly why this goes report-only first.

Two facts that shape the enforcement path (verified 2026-09-06):

- **The live report-only policy has no reporting directive and there is no `Reporting-Endpoints`
  header**, so "observe a week of traffic" observes nothing outside a developer's own console. Pick a
  collector first (a third-party report endpoint, or a Cloudflare Worker — an owner account decision),
  add `report-to`/`report-uri` to the CSP-RO, deploy, then observe (roadmap 8.1).
- **Hashing the GTM snippet alone cannot remove `'unsafe-inline'`.** The static export ships ~28 inline
  scripts per page (Next's RSC payload pushes). Either a `postbuild` step hashes every inline script
  per route and emits per-path `_headers` rules, or `'unsafe-inline'` stays for `script-src` and the
  other directives are hardened (roadmap 8.2).
- `! Access-Control-Allow-Origin` in `_headers` **detaches** the Pages default wildcard — that item was
  never a zone change (roadmap 8.4).

```
/*
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://api.web3forms.com https://www.google-analytics.com https://*.googletagmanager.com; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://imgquarry.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src https://www.googletagmanager.com; base-uri 'self'; form-action 'self' https://api.web3forms.com
```

The hosts that must be present or something breaks:

- `googletagmanager.com` — the container, plus `frame-src` for the `<noscript>` iframe.
- `api.web3forms.com` — the lead form POST, in `connect-src` **and** `form-action`.
- `fonts.googleapis.com` / `fonts.gstatic.com` — `app/layout.tsx` loads Heebo + Assistant from Google
  Fonts by `<link>`. Miss these and the site renders in system fonts.
- `imgquarry.com` — the media host in the manifest (the OG card).
- `'unsafe-inline'` in `style-src` — Next emits inline styles; removing it needs more work than it's
  worth here.

**Process:** ship report-only → collect reports for at least a week of real traffic, including a real
form submission and a GTM-tracked call click → only then tighten and switch to enforcing. Shipping an
enforcing CSP untested breaks analytics or the form silently, and on a lead-gen site that is a revenue
bug.

## `public/_redirects`

Also available on Cloudflare Pages, and also absent. Relevant the moment any route is renamed — a
rename without a 301 discards every ranking signal the old URL holds. Betonplus's slugs are ASCII and
stable, so there is nothing to redirect today.

## The lead form

- POSTs to `https://api.web3forms.com/submit` over HTTPS with a **public-by-design** access key from
  the manifest. It is not a leaked secret; don't report it as one.
- Honeypot field `_honey` present and checked first (`ContactForm.tsx:26`). No client-side rate
  limiting — acceptable for the volume, and Web3Forms applies its own.
- `NEXT_PUBLIC_WEB3FORMS_KEY` is a documented local-dev override. In production an empty key is treated
  as a misconfiguration and surfaces an error rather than silently simulating success — that guard is
  correct, keep it.
- **Consent:** the form collects name, phone, city and free text. `/privacy/` exists and the form's
  consent line doesn't link to it. Add the link (see `/conversion-cro`).
- **No PII in `dataLayer`** — the current `trackEvent("lead_submit", { form: "lead" })` sends none.
  Keep it that way.

## Secret hygiene

The only key in the repo is the public Web3Forms access key. `.env.local`, if present, may hold `NEXT_PUBLIC_WEB3FORMS_KEY` — a dev-only override that
`components/ContactForm.tsx` reads when the manifest carries no key. (The snapshot layer that once read
`NEXT_PUBLIC_WP_URL` was deleted 2026-08-31.)

```bash
npm audit --omit=dev    # runtime — matters
npm audit               # includes dev — usually informational for a static export
```

Report the two separately. A devDependency advisory does not ship to users here.

## The second origin — resolved

`.github/workflows/deploy.yml` is **build-gate CI only** (its GitHub Pages publish steps were removed
2026-08-17) and `public/CNAME` is deleted. The old GitHub Pages origin returns **404** (verified
2026-09-06), so there is no second live copy to index or drift. Re-check only if the workflow file
changes.

## Checklist

- [x] `public/_headers` shipped; verified with `curl -sSI` against the live site (2026-09-06).
- [ ] HSTS without `preload` unless the owner has explicitly accepted it.
- [ ] CSP is **report-only** with a reporting endpoint, observed for a full week including a real form submit (endpoint still missing — roadmap 8.1).
- [x] Form links to `/privacy/`.
- [ ] No PII in `dataLayer`.
- [ ] `npm audit --omit=dev` clean or triaged.
- [x] No second live origin (GitHub Pages origin 404, 2026-09-06).

## Gotchas

- Never verify a header from the repo. Cloudflare adds, merges and sometimes overrides.
- A CSP that blocks `googletagmanager.com` silently kills every conversion signal — the pages still
  look fine.
- A CSP that omits the Google Fonts hosts silently changes the site's typography.
- Zone-level settings (Scrape Shield, AI Crawl Control, cache rules) are the **owner's** to change.
  Document the toggle; never assume it was flipped.
