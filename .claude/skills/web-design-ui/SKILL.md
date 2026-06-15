---
name: web-design-ui
description: Visual fidelity and styling for betonplus — Tailwind v4 CSS-first (utilities only; preflight & theme intentionally NOT imported), enrich.css section conventions, vendored zapo-theme CSS, and brand tokens. Use when changing styles or adding visual sections, to match the live look without clobbering theme CSS.
---

# Web design & UI (visual fidelity)

The look must match the live `zapo` theme exactly. The theme's own CSS is **vendored into `public/`** and
loaded as-is; our job is to not disturb it. This is a port — match, don't redesign (`/migration-fidelity`).

## Tailwind v4 — CSS-first, utilities only
- There is **no `tailwind.config.ts`**. Config (if any) is CSS-first via `@theme` in
  [app/globals.css](app/globals.css).
- [app/globals.css](app/globals.css) imports **only the utilities layer**:
  ```css
  @import "tailwindcss/utilities.css" layer(utilities);
  ```
  Tailwind's **preflight (reset) and theme layers are intentionally NOT imported** — they would dump
  `:root` variables and resets that override the vendored WordPress theme CSS and break the 1:1 look.
  **Do not add `@import "tailwindcss"` or re-enable preflight.**
- PostCSS uses `@tailwindcss/postcss` ([postcss.config.mjs](postcss.config.mjs)).

## Where styles live
| Source | Use |
|--------|-----|
| Vendored `zapo` CSS in `public/wp-content/themes/zapo/…` | The site's real look — loaded via captured `<link>`/`<style>` in `bodyHtml` & `SiteAssets` |
| [app/enrich.css](app/enrich.css) | Styling for **authored** value-add sections (process steps, feature cards, stats band, FAQ accordion, guides, spec tables) |
| Tailwind utilities | Small adjustments on our own wrapper markup |

## Styling authored sections
- Reuse the existing classes/patterns in [app/enrich.css](app/enrich.css) — 4-up grids, step badges,
  feature cards, dark stats band, FAQ accordion, guide callouts, zebra spec tables. **Don't invent new
  visual patterns**; extend the existing ones so enriched sections feel native to the theme.
- Keep brand colors/fonts consistent with the vendored theme. If you must add a token, put it in the
  `@theme` block of `globals.css`, don't hardcode scattered hex values.

## RTL
- All layout is right-to-left. Use logical utilities and the RTL flips already in `enrich.css`
  (e.g. `.text-left { text-align: right }`). Details in `/rtl-hebrew`.

## Checklist
- [ ] Did NOT enable Tailwind preflight/theme or add a global reset.
- [ ] Reused vendored theme CSS / existing `enrich.css` patterns; no new design language.
- [ ] New tokens (if any) live in `@theme`, not inline.
- [ ] RTL-correct; matches the live page side-by-side (`/qa-build-gate`).
