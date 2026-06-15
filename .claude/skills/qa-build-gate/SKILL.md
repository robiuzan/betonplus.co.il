---
name: qa-build-gate
description: QA and the release gate for betonplus — npm run build must pass with zero TS/compile errors and generateStaticParams must produce all routes, plus lint, link/404 + asset checks on out/, visual diff vs the live source, and a pre-launch checklist. Use to verify a build or before shipping.
---

# QA & build gate

A phase is **not done** until the build gate passes. This is the hard stop before anything ships.

## The build gate (must pass)
```
npm run build      # zero TypeScript/compile errors; generateStaticParams generates ALL routes
npm run lint       # eslint (next/core-web-vitals + typescript) clean
```
- `output: "export"` ([next.config.ts](next.config.ts)) emits static `out/`. Build failure or a missing
  route = blocked.
- Reminder: on a fresh checkout run `npm run snapshot` first, else `content/site.json` is an empty stub and
  the build fails by design (`/migration-fidelity`).

## Functional checks on `out/`
- **Routes:** every WP permalink exists in `out/` with `trailingSlash` (e.g. `out/שירותים/index.html`);
  the front page exists.
- **Links:** crawl for broken internal links/404s; internal links are relative and match permalinks.
- **Assets:** no 404s — every referenced `/wp-content/…` CSS/JS/font/image was vendored into `public/`.
- **Scripts:** open key pages, confirm the theme scripts replay (`ThemeScripts`) with no console errors.
- **Forms:** contact form posts to FormSubmit; call/WhatsApp links work (`/conversion-cro`).

## Fidelity & quality gates
- **Visual diff** key templates (home, a service page, a location page, pricing) against
  `https://betonplus.co.il` — headings, copy, layout, metadata. Use the `fidelity-auditor` agent.
- **SEO:** indexable, sitemap + robots correct, JSON-LD valid, single H1 (`/seo-metadata`; `seo-auditor`).
- **A11y:** axe/Lighthouse AA on key templates (`/responsive-accessibility`).
- **Vitals:** Lighthouse/PSI within budget (`/performance-web-vitals`).
- **Responsive:** no horizontal scroll at 375 / 768 / 1024.

## Pre-launch checklist
- [ ] `npm run build` zero errors; all routes generated. `npm run lint` clean.
- [ ] No broken links / 404 assets in `out/`; no console errors.
- [ ] Forms send; call/WhatsApp CTAs work.
- [ ] Visual + content match live source on key templates.
- [ ] SEO: indexable, sitemap/robots/schema valid; canonicals = permalinks.
- [ ] A11y (AA) and Core Web Vitals budgets met.
- [ ] Responsive across phone/tablet/desktop.
