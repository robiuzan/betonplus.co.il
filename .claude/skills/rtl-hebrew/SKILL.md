---
name: rtl-hebrew
description: RTL & Hebrew (he-IL) localization for betonplus — html lang/dir, logical Tailwind utilities, ₪ currency, Israeli date/phone formatting, and he.decode() entity handling. Use whenever writing markup, classes, copy, or numbers that appear on the page. Mandatory per project rules.
---

# RTL & Hebrew localization

The site is Hebrew, right-to-left. This is **mandatory**, not optional — layout and text flow must mirror
the source perfectly.

## Document & flow
- Root shell is `<html lang="he" dir="rtl">` with `<body class="rtl wp-theme-zapo">`
  ([app/layout.tsx](app/layout.tsx)). Don't change `lang`/`dir`.
- Locale is **he-IL**: dates, currency, and phone formatting follow Israeli conventions.

## Use logical / RTL-aware utilities (never physical L/R)
| Instead of | Use |
|------------|-----|
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `left-*` / `right-*` | `start-*` / `end-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| horizontal `space-x-*` | add `space-x-reverse` |
- For authored sections, follow the RTL flips already in [app/enrich.css](app/enrich.css).

## Numbers, money, dates, phones
- **Currency:** Israeli Shekel `₪` (e.g. `₪350`), matching the live pricing.
- **Phone:** Israeli format (e.g. `050-000-0000`); click-to-call uses `tel:+972…` (`/conversion-cro`).
- **Dates:** he-IL ordering.

## Entities & encoding
- Hebrew copy captured from WP may contain HTML entities (`&#8217;`, `&#1500;` …). The pipeline decodes
  with **`he.decode()`** (used in [lib/content.ts](lib/content.ts) and the scraper). When authoring
  enrichment content, write real Unicode Hebrew — don't paste raw entities.
- Save files as UTF-8.

## Fidelity note
- Don't translate, transliterate, or "fix" Hebrew copy from the source (`/migration-fidelity`). Authored
  enrichment copy must be natural, correct Hebrew (`/content-enrichment`).

## Checklist
- [ ] Only logical utilities (`ps/pe`, `ms/me`, `start/end`, `text-start/end`, `space-x-reverse`).
- [ ] `₪` for prices; Israeli phone/date formats.
- [ ] Real Unicode Hebrew, UTF-8, no stray entities.
- [ ] Renders correctly RTL with no left-aligned bleed (`/responsive-accessibility`).
