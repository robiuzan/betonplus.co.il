---
name: web-security-headers
description: Security posture for a static export on Cloudflare Pages — the missing public/_headers for HSTS, X-Frame-Options and Permissions-Policy, a report-only-first CSP path around the inline GTM snippet, public/_redirects, PII and consent on the Web3Forms lead form, secret hygiene, and the dead GitHub Pages origin. Use when adding headers, planning a CSP, or auditing security. Triggers: "security headers", "CSP", "HSTS", "_headers", "is the form safe", "clickjacking".
---

# Security headers & posture

`output: "export"` means Next's `headers()` is unavailable. **Cloudflare Pages reads
`public/_headers`** — shipped 2026-08-17 (backlog §12.1) with HSTS (no `preload`),
`X-Frame-Options: SAMEORIGIN`, `Permissions-Policy` and a **report-only** CSP. ⚠️ It is **live only
after the next deploy** — until then the live table below still describes production.

## What the live site actually returns

Verified against `https://betonplus.co.il/` on 2026-08-16:

| Header                                             | Status                              |
| -------------------------------------------------- | ----------------------------------- |
| `x-content-type-options: nosniff`                  | ✅ Cloudflare Pages default         |
| `referrer-policy: strict-origin-when-cross-origin` | ✅ Pages default                    |
| `strict-transport-security`                        | ❌ absent                           |
| `x-frame-options` / `frame-ancestors`              | ❌ absent — the site is framable    |
| `permissions-policy`                               | ❌ absent                           |
| `content-security-policy`                          | ❌ absent                           |
| `access-control-allow-origin`                      | ⚠️ `*` on HTML — looser than needed |

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

The only key in the repo is the public Web3Forms access key. `.env.local` holds `NEXT_PUBLIC_WP_URL`,
which only the dead snapshot layer reads.

```bash
npm audit --omit=dev    # runtime — matters
npm audit               # includes dev — usually informational for a static export
```

Report the two separately. A devDependency advisory does not ship to users here.

## The second origin

`.github/workflows/deploy.yml` publishes to **GitHub Pages** while production is wrangler → Cloudflare
Pages, and `public/CNAME` is its leftover (backlog §1.3, §12.4). A second origin serving stale content
is a real risk: it can be indexed, it can be linked, and it will drift the moment anything ships
through wrangler. Strip the publish step (keep the build as CI) and delete `public/CNAME`.

## Checklist

- [ ] `public/_headers` shipped; verified with `curl -sSI` against the live site after deploy.
- [ ] HSTS without `preload` unless the owner has explicitly accepted it.
- [ ] CSP is **report-only** and has been observed for a full week including a real form submit.
- [ ] Form links to `/privacy/`.
- [ ] No PII in `dataLayer`.
- [ ] `npm audit --omit=dev` clean or triaged.
- [ ] No second live origin.

## Gotchas

- Never verify a header from the repo. Cloudflare adds, merges and sometimes overrides.
- A CSP that blocks `googletagmanager.com` silently kills every conversion signal — the pages still
  look fine.
- A CSP that omits the Google Fonts hosts silently changes the site's typography.
- Zone-level settings (Scrape Shield, AI Crawl Control, cache rules) are the **owner's** to change.
  Document the toggle; never assume it was flipped.
