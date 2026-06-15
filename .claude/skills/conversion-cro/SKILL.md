---
name: conversion-cro
description: Conversion levers for the betonplus service/lead-gen site — click-to-call (tel:), WhatsApp float, the contact form (CF7→FormSubmit rewrite), trust signals, and CTA placement. Use when improving lead capture, but only within the 1:1 fidelity rules.
---

# Conversion / CRO (service & lead-gen)

This is a local service site — the conversion is a **phone call, WhatsApp message, or form lead**. Optimize
those paths, but remember it's a 1:1 port: structural/visual changes to captured pages go through
`/migration-fidelity`; net-new conversion sections go through `/content-enrichment`.

## The primary actions
- **Click-to-call:** phone links use `tel:+972…` (Israeli format, `/rtl-hebrew`). Every page should make
  calling effortless — the live theme's floating call button is captured in `bodyHtml`; keep it working
  (its script is replayed by `ThemeScripts`).
- **WhatsApp:** floating WhatsApp action uses `https://wa.me/972XXXXXXXXX?text=…` (URL-encoded Hebrew
  prefill). Verify the number and the link open correctly on mobile.
- **Contact form:** Contact Form 7 is rewritten to **FormSubmit** by
  [scripts/transform.mjs](scripts/transform.mjs) (CF7 has no backend in a static export). After any snapshot,
  confirm the form still posts to the right FormSubmit endpoint and required fields validate.

## Levers (without breaking fidelity)
- **CTA visibility:** ensure call/WhatsApp/form CTAs are reachable above the fold and persist on scroll
  (the floating buttons). Don't remove or bury the source's existing CTAs.
- **Trust signals:** years of experience, service areas, certifications/insurance, real project photos —
  only if true and sourced; author them via enrichment, never fabricate.
- **Friction:** keep the form short (name + phone + short message). Don't add fields the source didn't have.
- **Clarity:** clear price ranges (₪) and service descriptions reduce hesitation — these live in the
  pricing/FAQ enrichment sections.

## Mobile reality
- Most traffic is mobile. Tap targets ≥44px, call/WhatsApp one tap away, form usable one-handed
  (`/responsive-accessibility`).

## Verify
- [ ] `tel:` and `wa.me` links use the correct number and open the dialer/WhatsApp on a phone.
- [ ] Contact form submits to FormSubmit after `npm run snapshot`; success/redirect works.
- [ ] Floating CTAs render and their replayed scripts run (no console errors).
- [ ] No fabricated trust claims; enrichment copy is accurate (`/content-enrichment`).
