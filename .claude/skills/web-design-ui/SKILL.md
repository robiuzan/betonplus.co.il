---
name: web-design-ui
description: Visual language and styling for betonplus — Tailwind v4 CSS-first with the full framework imported, the @theme brand tokens, the @layer components block (.container-x, .section, .btn*, .card, .eyebrow) versus the unlayered .hero-grad, when to add a component class instead of utilities, and the contrast constraint on the amber CTA. Use when changing styles, adding a visual section, or introducing a token. Triggers: "styling", "brand colors", "add a section", "which class", "design token", "globals.css".
---

# Visual language & styling

All styling lives in **`app/globals.css`** plus Tailwind utilities in the components. There is **no
`tailwind.config.ts`** — Tailwind v4 is configured CSS-first.

## The import — read this before touching globals.css

```css
@import "tailwindcss"; /* the FULL framework: preflight + theme + utilities */
```

This site imports **all of Tailwind, including preflight**. That is correct and deliberate for the
current build.

⚠️ If you have seen an older instruction in this repo saying preflight is intentionally _not_ imported
and that `@import "tailwindcss"` must never be added — that belonged to the abandoned WordPress 1:1
port, where preflight would have clobbered the vendored `zapo` theme CSS. **That port is retired**
(`/betonplus-architecture`). The designed site has no vendored theme to protect. Don't "fix"
`globals.css` back to a utilities-only import; it would strip the reset the whole design depends on.

## Brand tokens — `@theme`

```css
@theme {
  --color-brand: #1f2a37; /* graphite / concrete — primary */
  --color-brand-light: #28333f;
  --color-steel: #2563eb; /* steel blue — precision / links */
  --color-steel-dark: #1d4ed8;
  --color-cta: #f59e0b; /* safety amber — calls to action */
  --color-cta-dark: #d97706;
  --color-ink: #111827; /* body text */
  --color-muted: #4b5563;
  --color-mist: #f3f4f6; /* light section bg */
  --color-line: #e5e7eb; /* borders */

  --font-heading: "Heebo", …;
  --font-body: "Assistant", …;
}
```

Use them through Tailwind classes — `bg-brand`, `text-cta`, `text-steel`, `bg-mist`, `border-line`,
`text-ink`, `text-muted`, `font-heading`. **Never hardcode a brand hex in a component.**

The palette reads as the trade: graphite for concrete, steel blue for precision, safety amber for
action. Keep new surfaces inside it rather than introducing a fourth hue.

**Manifest drift worth knowing:** `brand.primary` and `brand.themeColor` are in the roster manifest,
but `brand.secondary` and `brand.accent` are `null` there while `--color-steel` and `--color-cta` exist
only in this CSS. If you add a brand-level colour, push it upstream to the roster too.

## The `@layer components` block

Repeated multi-utility patterns are defined as real classes, not copy-pasted utility strings:

| Class                                                                 | Use                                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `.container-x`                                                        | centred max-w-72rem wrapper with logical inline padding    |
| `.section`                                                            | vertical rhythm, `padding-block: clamp(3rem, 6vw, 5.5rem)` |
| `.btn` + `.btn-cta` / `.btn-brand` / `.btn-outline` / `.btn-whatsapp` | every button and CTA link                                  |
| `.card` / `.card-hover`                                               | bordered white surface with the lift-on-hover treatment    |
| `.eyebrow`                                                            | the small steel-blue kicker above a section heading        |

`.hero-grad` (the gradient hero backdrop, no image asset) is **not** in this block — it is a top-level
unlayered rule at `app/globals.css:158`, after the `@layer components { … }` block that spans lines
58–155. Layer membership affects cascade order, so put a new utility-composed class _inside_ the block
and keep standalone visual treatments outside it, matching what's there.

**When to add a class here versus using utilities:** if the same 4+ utility combination appears in
three or more places, it belongs in this block. A one-off stays inline. Prefer extending an existing
class over inventing a parallel one.

Note `.container-x` and `.section` already use **logical** properties (`margin-inline`,
`padding-inline`, `padding-block`). Match that in anything you add — see `/rtl-hebrew`.

## The contrast constraint — non-negotiable

`.btn-cta` works because amber carries **dark brand text**:

| Pairing                               | Ratio          |
| ------------------------------------- | -------------- |
| cta `#f59e0b` bg / brand text         | **6.77:1** ✅  |
| cta `#f59e0b` bg / **white** text     | **2.15:1** ❌  |
| steel `#2563eb` on white (`.eyebrow`) | **5.17:1** ✅  |
| muted `#4b5563` on white              | **7.56:1** ✅  |
| white on brand (footer)               | **14.54:1** ✅ |

**Never put white text on `--color-cta`.** It is the single easiest way to break AA here, and a sibling
site in this fleet shipped exactly that across 34 pages. Compute any new pairing from the actual hex —
never eyeball it. Full rules: `/responsive-accessibility`.

## Components use the primitives

`components/ui.tsx` exports `Section`, `SectionHeading` and `Button`. `Button` already handles variant,
`ariaLabel`, `data-cta`, and choosing `<a>` versus `next/link`. Reach for these before writing new
markup — a hand-rolled button will miss the focus ring, the tap target, or the analytics attribute.

## Typography

Heebo for headings, Assistant for body, both loaded by `<link>` in `app/layout.tsx`. Headings get
`font-heading`, weight 800, `text-wrap: balance` — set globally in the `@layer base` block, so a new
`<h2>` inherits it without classes. Don't restate what base already applies.

## Checklist

- [ ] No hardcoded brand hex in a component — tokens only.
- [ ] New repeated pattern added to `@layer components`, not pasted three times.
- [ ] Logical CSS properties (`padding-inline`, `margin-inline`) in any new rule.
- [ ] Every new text/background pair computed at ≥4.5:1; no white on `--color-cta`.
- [ ] Used `Button` / `Section` / `SectionHeading` rather than re-implementing them.
- [ ] Did not revert the `@import "tailwindcss"` line.
