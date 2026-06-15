---
name: responsive-accessibility
description: Responsive layout and accessibility for betonplus — breakpoints, no horizontal scroll, semantic heading order, alt text, keyboard/focus, and AA contrast, all within the 1:1 fidelity constraint. Use when adding markup/sections or verifying a page works on phone/tablet/desktop and for assistive tech.
---

# Responsive & accessibility

Goal: the page works on every device and for assistive tech — **without** deviating from the live design
(`/migration-fidelity`). Most responsiveness comes from the vendored `zapo` theme CSS; your job is to not
break it and to keep authored sections (`/content-enrichment`) just as robust.

## Responsive
- Test widths: **phone 375–414px, tablet 768–834px, desktop ≥1024px**. The enriched grids in
  [app/enrich.css](app/enrich.css) already collapse via media queries — follow that pattern for new
  sections.
- **No horizontal scroll** at any width (common RTL offenders: fixed widths, negative margins, oversized
  images, `100vw` + padding). Check both directions since layout is RTL (`/rtl-hebrew`).
- Images scale (`max-width:100%`); tables (spec/pricing) stay readable or scroll within a container, not the
  page.

## Accessibility (target WCAG AA)
- **Headings:** one H1, no skipped levels — same hierarchy as the source. Authored sections continue the
  order correctly.
- **Alt text:** decorative images `alt=""`; meaningful images get descriptive Hebrew alt. Captured WP images
  keep their original alt — don't strip it.
- **Keyboard & focus:** interactive elements (FAQ accordion, nav, the floating call/WhatsApp buttons in
  `/conversion-cro`) reachable and operable by keyboard with a visible focus state.
- **Names:** links/buttons have discernible text or `aria-label` (esp. icon-only call/WhatsApp buttons).
- **Contrast:** text vs background ≥ 4.5:1 (≥3:1 large). Watch the dark stats band and overlay text.
- **Semantics:** prefer real `<a>`/`<button>`/`<nav>`/`<ul>` over `div` soup in authored markup.

## How to verify
- Resize / device emulation across the three widths; confirm no overflow.
- Run axe or Lighthouse a11y on key templates (home, a service page, a location page).
- Tab through the page; confirm focus order and visible focus.
- Deeper pass → the `fidelity-auditor` (layout drift) and a Lighthouse a11y run.

## Checklist
- [ ] No horizontal scroll at 375 / 768 / 1024.
- [ ] One H1, ordered headings; meaningful alt text.
- [ ] Icon buttons have accessible names; keyboard-operable; visible focus.
- [ ] AA contrast on text, incl. dark/overlay sections.
- [ ] Matches the live layout at each breakpoint (`/qa-build-gate`).
