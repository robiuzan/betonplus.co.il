---
name: performance-web-vitals
description: Core Web Vitals for the betonplus static export — image dimensions/unoptimized, the ThemeScripts replay cost, font loading, vendored-CSS weight, and LCP/CLS/INP. Use when pages feel slow or before launch to hit performance budgets without breaking 1:1 fidelity.
---

# Performance & Core Web Vitals

Static export means the HTML/CSS/JS is shipped as-is — fast by default, but the vendored `zapo` theme
assets and replayed scripts are the main cost. Optimize within fidelity (`/migration-fidelity`): you may
change *how* assets load, not *what* the page looks like.

## The constraints here
- `images.unoptimized: true` ([next.config.ts](next.config.ts)) — there is **no Next image optimizer** in a
  static export. Images are served as vendored files, so their source weight matters directly.
- Theme `<script>`s are **replayed sequentially** by [components/ThemeScripts.tsx](components/ThemeScripts.tsx)
  (`async:false` to preserve order) — necessary for correctness, but it's the biggest JS cost on the page.
- All theme CSS is vendored and loaded as captured (`/web-design-ui`).

## LCP (largest contentful paint)
- The hero image is usually LCP. Ensure it has explicit `width`/`height` (prevents CLS) and isn't
  needlessly huge — vendored uploads can be multi-MB. Compress/resize the source file in `public/` if it's
  oversized (keep visual parity).
- Don't lazy-load the LCP/hero image.

## CLS (layout shift)
- Every `<img>` needs width/height (or aspect-ratio) so space is reserved. Watch the marquee/logo row and
  authored cards.
- Fonts: avoid invisible-then-swap jumps; prefer `font-display: swap` and preconnect to the font origin if
  fonts are remote.

## JS / INP
- The `ThemeScripts` replay is required for parity — don't rip it out. Reduce cost by ensuring only the
  scripts the live page actually uses were captured (no stray third-party tags) and that none throw (a
  thrown script can stall the sequential `run()`).
- No new heavy client libraries — most of this site is static markup (`/react-components`).

## CSS / fonts
- Vendored CSS can be large; it's loaded as the theme expects. Don't try to purge it (it backs the 1:1
  look). Do confirm there are no 404ing stylesheets forcing reflows.

## How to measure
- Lighthouse / PageSpeed Insights on home + a service page (mobile profile). Track LCP, CLS, INP, TBT.
- Compare against the live site as the baseline — the port should be **at least as fast**, not slower.

## Checklist
- [ ] Hero/LCP image sized, compressed, not lazy-loaded.
- [ ] All images have width/height (no CLS); fonts swap, not block.
- [ ] No 404 assets; no throwing replayed scripts; no stray third-party tags.
- [ ] No new heavy client JS.
- [ ] Lighthouse vitals ≥ the live baseline (gate via `/qa-build-gate`).
