---
name: responsive-accessibility
description: WCAG 2.1 AA and Israeli IS 5568 compliance for betonplus — the verified-passing brand contrast and the one pairing that would fail, the mobile menu (Escape closes and returns focus; deliberately no trap), form labelling and error announcement, 44px tap targets, semantic landmarks and one H1, LTR isolation for phone numbers, reduced motion, and keeping /accessibility/ truthful. Use before shipping or when auditing accessibility. Triggers: "accessibility pass", "WCAG", "contrast check", "tap targets", "keyboard navigation", "נגישות", "IS 5568".
---

# Accessibility — WCAG 2.1 AA + IS 5568

This site **publishes an accessibility statement** at `/accessibility/` claiming ת״י 5568 / WCAG AA
conformance. That raises the stakes: a failure here isn't just a bug, it makes a published statement
false. Keep the statement and the site in sync in both directions.

## Contrast — verified passing, with one trap

Computed from the `@theme` tokens in `app/globals.css` (2026-08-16). **Do not eyeball contrast —
compute it from the actual hex values.**

| Pairing                                              | Ratio       | Verdict      |
| ---------------------------------------------------- | ----------- | ------------ |
| `.btn-cta` — cta `#f59e0b` bg / brand `#1f2a37` text | **6.77:1**  | ✅ AA        |
| `.eyebrow` — steel `#2563eb` on white                | **5.17:1**  | ✅ AA        |
| muted `#4b5563` on white                             | **7.56:1**  | ✅ AA        |
| ink `#111827` on white                               | **17.74:1** | ✅           |
| brand `#1f2a37` on white                             | **14.54:1** | ✅           |
| `.btn-whatsapp` — `#25d366` / `#062e16`              | **7.51:1**  | ✅ AA        |
| footer — white on brand                              | **14.54:1** | ✅           |
| ⚠️ **white on cta `#f59e0b`**                        | **2.15:1**  | ❌ never use |

The last row is the trap. The amber CTA works _because_ it carries dark brand text. Anyone reaching for
`text-white` on a `bg-cta` surface — or adding an amber banner with white copy — breaks AA immediately.
The fleet's galbath site shipped exactly that mistake across 34 pages.

Also watch **opacity modifiers**: `text-ink/90` on white is still fine, but `text-white/80` on a mid
surface may not be. Recompute whenever you add one.

Brand colours are roster tokens — a contrast fix belongs upstream in the manifest, not as a hex in JSX.

## Semantics

- **One `<h1>` per page** — currently correct on all 15 routes. Everything else `<h2>`/`<h3>`, no
  skipped levels.
- Landmarks: `header`, `nav`, `main`, `footer` — present. `app/layout.tsx:68` has a real skip link
  (`דלגו לתוכן`) targeting `#main`. Keep it.
- **Interposed wrappers break lists.** If you add an animation or reveal wrapper, it goes _inside_ the
  `<li>`, never between the list and its items. The service page's process `<ol>` is currently clean.
- Real `<button>` / `<a>`, never a clickable `div`. `components/ui.tsx` `Button` renders an `<a>` for
  external/`tel:` hrefs and a `next/link` for internal ones — use it rather than hand-rolling.

## Keyboard

- Visible focus is defined globally in `app/globals.css` (`:focus-visible` → 3px steel outline with
  offset). Don't remove it or override it per-component without an equivalent.
- ✅ **The mobile menu is resolved (2026-08-17,** backlog §11.1): Escape closes it and returns focus
  to the toggle; `aria-expanded`/`aria-controls` were already correct. It is a **non-modal
  disclosure** — the page stays visible and scrollable — so a focus trap and scroll lock are not
  required. If it ever becomes a full-screen overlay, that judgement flips: add both.
- Tab order follows DOM order; in RTL that is still correct — don't reorder visually with CSS.

## Forms

✅ **Resolved 2026-08-17** (backlog §8.1, §11.2): every field has a real `<label>`, errors are
per-field with `aria-invalid` + `aria-describedby` (`name-error`/`phone-error` ids), and focus moves
to the first invalid field on submit. `noValidate` stays — the Hebrew messages are the point. Keep all
of it; a regression to a single generic error is an accessibility bug, not a simplification.

The honeypot is correctly `aria-hidden` with `tabIndex={-1}` — keep both attributes together.

## LTR isolation

Phone numbers, emails, prices and URLs inside Hebrew must be isolated or the bidi algorithm reorders
them. ✅ Resolved 2026-08-17 (backlog §11.3): the `.ltr` helper exists in `app/globals.css` and the
phone is isolated everywhere it renders. Every new occurrence must use it. See `/rtl-hebrew`.

## Images and figures

The site ships almost no imagery, so there is little to get wrong — which also means the rules should
be established _before_ the photos in `docs/business-facts.md` §D arrive:

- Meaningful Hebrew `alt` on every content image; `alt=""` only for genuinely decorative.
- A before/after pair needs an accessible caption that conveys the comparison, not `aria-hidden`.
- Icon-only controls get `aria-label` — `Button` already accepts `ariaLabel` and `Header` uses it.

## Tap targets and mobile

- 44×44px minimum for anything tappable. ✅ `.btn` carries `min-height: 2.75rem` (44px) in
  `app/globals.css` since 2026-08-25 — padding alone computed to 41.6px for a text-only button. The
  footer conversion links got the same treatment 2026-09-01. **Do not regress:** a new tappable element
  that is not a `.btn` needs its own explicit minimum. Measure; don't assume the padding covers it.
- Test at 360px, 768px and ≥1024px. **No horizontal scroll at any width** — common RTL offenders are
  fixed widths, negative margins, oversized images and `100vw` plus padding.
- Text must reflow to 320px without horizontal scroll; zoom to 200% without loss of content.
- Tables (the pricing table) scroll inside their own container, not the page — the existing
  `overflow-hidden rounded-2xl` wrapper needs `overflow-x-auto` on narrow screens.

## Motion

`app/globals.css` sets `scroll-behavior: smooth` on `html` **and** carries a `prefers-reduced-motion: reduce`
reset (since 2026-08-25) that returns it to `auto` and removes decorative transitions. Keep both; any
new animation must live under the same media query.

## Checklist

- [ ] Every text/background pair computed at ≥4.5:1 (≥3:1 for large text and UI boundaries).
- [ ] No white text on `--color-cta`.
- [ ] One `<h1>`; heading order unbroken; landmarks present; skip link intact.
- [ ] No wrapper `<div>` between a list and its `<li>`s.
- [ ] Every interactive element keyboard-reachable with visible focus.
- [ ] Menus and dropdowns: Escape closes, focus returns, `aria-expanded` + `aria-controls` set.
- [ ] Form errors tied via `aria-describedby` + `aria-invalid`, focus moved to the first invalid field.
- [ ] Phone/email/price inside LTR islands.
- [ ] 44px tap targets; no horizontal scroll at 360 / 768 / 1024; 200% zoom usable.
- [ ] `prefers-reduced-motion` respected.
- [ ] `/accessibility/` still describes reality.

## Gotchas

- `aria-hidden` on a caption removes it from the accessibility tree entirely; a visually hidden but
  announced caption is usually what's wanted.
- Don't duplicate text for screen readers — an `sr-only` label repeating visible text is heard twice.
- Fixing contrast may change the visual brand. Flag it before shipping rather than after.
