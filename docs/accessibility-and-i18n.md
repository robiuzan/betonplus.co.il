# Accessibility & internationalisation

Two subjects in one file because on this site they are one problem: the markup that makes a page
navigable by a screen reader is the same markup that makes it survive a direction flip.

The standard: **WCAG 2.1 level AA**, plus **תקן ישראלי 5568** — which is legally binding in Israel and
which `/accessibility/` publicly claims. Mechanics and the current measured state live in the
`/responsive-accessibility` and `/rtl-hebrew` skills and the `perf-a11y-auditor` agent.

---

## 1. What already passes — do not regress it

| Property             | Implementation                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Language & direction | `<html lang="he-IL" dir="rtl">` in `app/layout.tsx`                                           |
| Skip link            | `דלגו לתוכן` → `#main`, visible on focus                                                      |
| Focus indicator      | Global `:focus-visible` — 3 px steel outline, 2 px offset, never removed                      |
| Tap targets          | `.btn` carries `min-height: 2.75rem` (44 px) because padding alone computed to 41.6 px        |
| Reduced motion       | `prefers-reduced-motion` kills `scroll-behavior: smooth` and all decorative transitions       |
| Landmarks            | `<header>` / `<nav aria-label>` / `<main id="main">` / `<footer>`                             |
| Mobile menu          | `aria-expanded`, `aria-controls`, Escape closes and returns focus to the toggle               |
| Form errors          | `aria-invalid` + `aria-describedby` per field, `role="alert"` on the delivery error           |
| Contrast (verified)  | `.btn-cta` 6.77:1 · `.eyebrow` 5.17:1 · muted-on-white 7.56:1 · footer white-on-brand 14.54:1 |
| LTR isolation        | `.ltr` helper (`direction: ltr; unicode-bidi: isolate`) on every phone number                 |

**The mobile menu deliberately has no focus trap.** It is a non-modal disclosure — the page stays
visible and scrollable — so a trap would be wrong. If it ever becomes a full-screen overlay, it becomes
a dialog and then it _needs_ `role="dialog"`, `aria-modal`, a trap and a scroll lock. Do not add half
of that.

---

## 2. Non-negotiable rules

- **One `<h1>` per page.** No skipped levels. Headings describe structure, never styling.
- **Never remove a focus outline.** If it looks wrong, restyle it.
- **Colour is never the only carrier of meaning.** A red border needs text next to it.
- **Every interactive element is a real element** — `<button>` for actions, `<a href>` for navigation.
  No `<div onClick>`, ever.
- **Every image has a purposeful Hebrew `alt`**; decorative images get `alt=""` (and decorative inline
  SVG gets `aria-hidden="true"`, as `Icon` already does at the form).
- **Icon-only controls need an accessible name** — `aria-label`, as the mobile toggle, the sticky bar
  and the WhatsApp bubble already do.
- **44 × 44 px minimum** for anything tappable. WCAG 2.1 SC 2.5.5 is AAA at 44 px; we hold it as a
  floor anyway because this is a phone-first trade site.
- **Text reflows to 320 px** with no horizontal scroll (SC 1.4.10). Wide tables — and this site has
  two on `/faq/` — scroll inside their own `overflow-x` container, never the page body.
- **Zoom to 200 %** without loss of content or function.
- **Keyboard-only pass** on every new interactive surface, in RTL: `Tab` order must follow visual order
  right-to-left.

---

## 3. ARIA policy

**First rule of ARIA: don't.** Native semantics before attributes; a correct `<button>` needs nothing.

Where ARIA is legitimately required here:

| Pattern            | Required attributes                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Disclosure (menu)  | `aria-expanded`, `aria-controls` on the trigger                                              |
| Navigation regions | `aria-label` on each `<nav>` when more than one exists — already `ניווט ראשי` / `ניווט נייד` |
| Field errors       | `aria-invalid` on the input, `aria-describedby` → the message element's `id`                 |
| Async status       | `role="alert"` (assertive) for failures; `role="status"` (polite) for progress               |
| Decorative SVG     | `aria-hidden="true"`                                                                         |
| Icon-only control  | `aria-label` describing the **action**, not the icon                                         |

**Hebrew accessible names.** `aria-label` text is read aloud by a Hebrew screen reader — write it in
Hebrew, and write the action: `שליחת הודעת וואטסאפ`, not `whatsapp`. Include the phone number in the
call button's label as it already does (`התקשרו 055-6601006`).

---

## 4. Forms

- Every input has a **real `<label>`**, not a placeholder standing in for one.
- Placeholders are examples, never instructions.
- Validate on **submit and blur**. Never on keystroke.
- On failure: set `aria-invalid`, link the message with `aria-describedby`, and **move focus to the
  first invalid field** — which `ContactForm` already does.
- Error text states the fix: `נא להזין מספר טלפון ישראלי תקין, למשל 055-6601006`.
- Required fields are marked in text, not by an unexplained asterisk alone.
- Success is a **navigation to `/thank-you/`**, which is the most robust possible announcement — a new
  page with its own `<h1>`.

---

## 5. RTL discipline (mandatory — CLAUDE.md §6)

**Logical utilities only** for horizontal spacing and positioning:

| Use                                           | Never                                            |
| --------------------------------------------- | ------------------------------------------------ |
| `ps-*` `pe-*` `ms-*` `me-*` `start-*` `end-*` | `pl-*` `pr-*` `ml-*` `mr-*` `left-*` `right-*`   |
| `text-start` `text-end`                       | `text-left` `text-right`                         |
| `space-x-reverse` where needed                | forced `flex-row-reverse` (except an LTR island) |

`components/` and `app/` are currently **clean** of the banned set. Keep them that way — a single
`pl-4` is a visible bug the moment an English locale exists. The only permitted exception is a
genuinely direction-agnostic case, and it must carry a comment saying why.

In CSS, prefer logical properties: `margin-inline`, `padding-inline`, `inset-inline-start`. The
`.container-x` helper already uses `margin-inline` / `padding-inline`.

**LTR islands.** Phone numbers, emails, URLs, prices and Latin equipment names inside Hebrew text are
reordered by the bidi algorithm unless isolated. Apply the `.ltr` helper class — never repeat
`dir="ltr"` inline, and never put markup in `lib/site.ts`. The content file holds the plain value; the
component adds the isolation.

**Hebrew typography.** גרש `׳` and גרשיים `״` in abbreviations (`למ״ר`, `למ׳`, `ס״מ`, `צד ג׳`), never
ASCII `'` or `"`. En dashes in ranges (`2–4 שעות`). Israeli formats: `055-6601006`, `₪` with the number,
`dd/mm/yyyy`.

---

## 6. Multilingual architecture (Hebrew RTL + English LTR)

**Current state: the site is Hebrew-only and monolingual by construction.** `lang` and `dir` are
hardcoded in the root layout, `lib/site.ts` holds Hebrew strings directly, and there is no locale
segment in any route. That is the correct shape for today — but the following is the shape to grow into
so nothing has to be unpicked later.

### Should we even add English?

Ask before building. The buyers are Israeli contractors, engineers and homeowners searching in Hebrew.
An English tree doubles the surface to maintain and, if machine-translated or thin, it is a duplicate-
content and quality liability. The honest triggers for adding it:

- Real English-language demand in Search Console.
- International clients, embassies, or foreign-owned project management firms.
- English-language equipment or engineering documentation the business actually wants to publish.

**Do not add English "for SEO".** A second-language tree with no audience ranks for nothing and dilutes
the entity.

### The architecture, when the answer is yes

Hebrew stays at the root (no `/he/` prefix — never change existing URLs); English lives under `/en/`.

```
app/
  layout.tsx              -> lang="he-IL" dir="rtl"  (Hebrew root, unchanged URLs)
  page.tsx  services/  ...
  en/
    layout.tsx            -> lang="en" dir="ltr"
    page.tsx  services/  ...
lib/
  site.ts                 -> Hebrew content (unchanged, stays the default)
  site.en.ts              -> the English mirror, same exported shape
  i18n.ts                 -> locale type, dictionaries map, route<->route mapping
```

**Rules:**

1. **`dir` is set per locale on `<html>`, in that locale's layout.** Never toggle direction with a
   client-side effect — that is a guaranteed layout shift.
2. **Because every utility is already logical, the CSS needs no changes.** This is the payoff of §5 and
   the reason the ban is worth enforcing now, years before an English page exists.
3. **`hreflang` is mandatory and reciprocal.** Emit from `pageMetadata()` in `lib/seo.ts`:

   ```ts
   alternates: {
     canonical: `${site.url}${path}`,
     languages: {
       "he-IL": `${site.url}${path}`,
       "en":    `${site.url}/en${path}`,
       "x-default": `${site.url}${path}`,   // Hebrew is the default for this market
     },
   }
   ```

   Every page must point at its counterpart **and be pointed back at**. A one-way `hreflang` is ignored.

4. **Only pages that exist in both languages get an alternate.** A partial English tree links only its
   own pages — never to a Hebrew page as if it were English.
5. **No machine translation shipped as-is.** Trade vocabulary (ניסור, קידוח יהלום, קונסטרוקטור) does not
   survive it, and the resulting page fails
   [content-standards.md](content-standards.md) §1 on substance even if it passes on word count.
6. **The language switcher is a real `<a>` to the counterpart URL**, labelled in the _target_ language
   (`English` / `עברית`), never an auto-redirect on `Accept-Language`. Auto-redirects break crawling
   and trap users in the wrong tree.
7. **Business facts stay single-sourced.** The phone, email, hours and area come from the manifest in
   both trees — translate the labels, never the values.
8. **JSON-LD gets `inLanguage`** per locale; the organisation node stays one entity with one `@id`.

### What must not happen

- A `/en/` tree that exists only to hold keywords.
- Direction flipped in JavaScript after paint.
- Hebrew and English content in the same page or the same sentence.
- Locale detection via IP — see [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) §5
  for why IP-based swapping is the wrong tool.

---

## 7. Keeping `/accessibility/` truthful

`/accessibility/` publishes a **תקן ישראלי 5568 / WCAG 2.0 AA** statement with a stated update date.
That makes it the one page on the site where a defect elsewhere becomes a **false public claim** — a
legal exposure, not a UX bug.

Rules:

- Any accessibility regression makes the statement false. Fix the defect **or** amend the statement, in
  the same commit.
- The הסתייגויות section must list real, current limitations — not be left empty because it looks
  better.
- The update date changes only when the statement's substance changes.
- **Only raise the claimed conformance level after an audit proves it.** If we hold WCAG 2.1 AA (the
  target of this document), the statement may say so — not before.
- The accessibility contact route must actually reach a human.

---

## 8. Pre-ship checklist

- [ ] Keyboard-only pass, RTL tab order correct, focus visible at every stop.
- [ ] Screen-reader pass on one new surface (NVDA or VoiceOver with a Hebrew voice).
- [ ] Contrast computed for any new colour pairing — including hover and disabled states.
- [ ] 320 px reflow with no horizontal page scroll; 200 % zoom intact.
- [ ] Every new tappable element ≥ 44 px.
- [ ] `grep -rE "\b(pl|pr|ml|mr)-[0-9]|left-|right-|text-left|text-right" components app` returns
      nothing new.
- [ ] Every new Latin string inside Hebrew is `.ltr`-isolated.
- [ ] `/accessibility/` still true.
