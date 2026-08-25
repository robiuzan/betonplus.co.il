---
name: conversion-cro
description: Lead conversion on betonplus — click-to-call above the fold, the sticky mobile bar, the Web3Forms lead form (per-field validation, WhatsApp fallback, the /thank-you/ conversion URL — all shipped 2026-08-17), full data-cta coverage, the remaining pricing-page and B2B-path gaps, and the honest-trust-signal gate. Use when conversions are weak, a page is missing its CTAs, or the form needs work. Triggers: "improve conversions", "CRO pass", "form validation", "thank you page", "add click-to-call", "why aren't leads tracked".
---

# Conversion

Three actions, in priority order: **phone call → WhatsApp → lead form.** The structural mechanics are
now in place (wave 1, 2026-08-17); the remaining gaps are proof and per-page depth.

## The current machine — don't regress any of it

- `FloatingCTA` is fixed bottom on mobile (call + WhatsApp), with the `pb-16 lg:pb-0` spacer on
  `<main>` so it never covers the footer. Click-to-call is above the fold on every page.
- **The form** (`components/ContactForm.tsx`): per-field Hebrew errors tied via `aria-invalid` +
  `aria-describedby`, focus moves to the first invalid field, and `normalizeIsraeliPhone()` accepts
  every real Israeli format (05X / 0X landline / +972 prefixed, any separator) while rejecting
  non-numbers. Keep `noValidate` — the custom Hebrew messages are the point.
- **WhatsApp fallback:** on delivery failure the form renders a `wa.me` deep link prefilled with the
  user's own submission (`data-cta="form-whatsapp-fallback"`). The user's data going to the user's own
  app is fine; don't extend the pattern to anything else.
- **`/thank-you/`** is the confirmed-success destination — noindex, excluded from the sitemap, and the
  clean URL-based conversion for GA4/Ads. The form navigates there only after Web3Forms confirms.
- `trackEvent("lead_submit", { form: "lead" })` fires **only on confirmed success** — never on submit,
  and never in the dev simulation. No PII in `dataLayer`. Keep all three properties.
- The consent line links to `/privacy/`.
- **`data-cta` coverage is complete** — every `tel:`/`wa.me`/mailto/submit surface carries one,
  `{location}-{action}`: `header-call`, `hero-call`, `sidebar-*`, `contact-*`, `footer-*`,
  `sticky-*`, `finalcta-*`, `form-submit`, `form-whatsapp-fallback`, `thankyou-*`. A new CTA without
  one is invisible to GTM forever (`/tracking-analytics`).

## Remaining gaps

### `/pricing/` under-converts its intent (backlog §8.5)

The highest-buying-intent page has only the shared `CtaBanner` at the bottom. Add an inline quote CTA
next to the price table — the reader is doing the arithmetic right there.

### One undifferentiated journey (growth plan, Phase 3)

Contractors and homeowners want different things. Contractors: availability, subcontractor terms,
insurance certificate, per-m² rates, a fast quote from a photo. Homeowners: is the building safe, how
much mess, what does it cost. Concrete additions worth building when asked: a "send a photo on
WhatsApp for a quote" path, a stated response-time promise (**owner must confirm the promise first**),
and per-audience proof placement.

### Proof is still missing (backlog §7.2–7.6)

The form and CTAs can only convert the trust the page has earned. Still absent: photos of real work,
real reviews, a named human, verifiable insurance/credentials. All owner-supplied.

## The trust gate

Conversion work that adds pressure without adding proof makes the page worse. Before adding urgency
copy, badges or counters, check `docs/business-facts.md`:

- **Never write a testimonial, customer name, or quote.** The three invented ones this site once
  shipped were removed 2026-08-17 (backlog §7.1) — that mistake is permanent-stop-ship territory now.
  Real attributed reviews (ideally GBP) are the only way social proof returns.
- `+1,000 פרויקטים` and ביטוח צד ג׳ are 🔶 — unverified, and displayed as headline stats. Substantiate
  or soften; don't amplify.
- **No invented urgency** — no "X לקוחות החודש", no countdown timers.
- The highest-value CRO change available is not a button colour — it is replacing absent proof with
  real proof. Escalate to the owner rather than substituting.

## Checklist

- [ ] Call and WhatsApp reachable without scrolling on every page, mobile and desktop.
- [ ] Every CTA carries a `data-cta` following `{location}-{action}`.
- [ ] Form errors stay per-field with `aria-invalid` + `aria-describedby` and focus management.
- [ ] Phone validation still accepts every real Israeli format.
- [ ] WhatsApp fallback intact on POST failure; `/thank-you/` still noindex and sitemap-excluded.
- [ ] `trackEvent` fires only on confirmed success.
- [ ] No trust signal on the page that `docs/business-facts.md` doesn't confirm.
