---
name: rtl-hebrew
description: RTL and Hebrew (he-IL) discipline for betonplus — logical Tailwind utilities only with the pl/pr/ml/mr/left/right/text-left/text-right ban, dir="ltr" islands for phone, email, price and URL (via the .ltr helper in app/globals.css), Israeli number and date formats, Hebrew punctuation with גרש and גרשיים, and trade vocabulary. Use whenever writing markup, classes or copy that appears on the page. Mandatory per CLAUDE.md §6. Triggers: "RTL", "Hebrew", "which padding utility", "text direction", "LTR island", "phone renders backwards".
---

# Hebrew & RTL discipline

`<html lang="he-IL" dir="rtl">` is set in `app/layout.tsx`. Do not remove it. Everything below follows.

## Logical utilities only — the ban list

For horizontal spacing and positioning, use **direction-aware** utilities so the layout mirrors
correctly:

| Use                                     | Never use                     |
| --------------------------------------- | ----------------------------- |
| `ps-*` / `pe-*`                         | `pl-*` / `pr-*`               |
| `ms-*` / `me-*`                         | `ml-*` / `mr-*`               |
| `start-*` / `end-*`                     | `left-*` / `right-*`          |
| `text-start` / `text-end`               | `text-left` / `text-right`    |
| `space-x-reverse` alongside `space-x-*` | bare `space-x-*`              |
| `rounded-s-*` / `rounded-e-*`           | `rounded-l-*` / `rounded-r-*` |
| `border-s-*` / `border-e-*`             | `border-l-*` / `border-r-*`   |

`components/` and `app/` are currently **clean** of every banned utility. That is a property worth
protecting — verify before you hand back:

```bash
grep -rnE '\b(pl|pr|ml|mr)-[0-9]|\b(left|right)-[0-9]|text-(left|right)\b' components app
```

The only exception is a genuinely direction-agnostic case — a centred absolute overlay, a
mathematically symmetric transform — and it **must carry an explanatory comment** saying why.

In `app/globals.css` prefer logical CSS properties too: the existing `.container-x` uses
`margin-inline` / `padding-inline`, and `.section` uses `padding-block`. Match that.

Let `dir="rtl"` mirror flex and grid. Don't reach for `flex-row-reverse` to "fix" order; if the order
looks wrong, the DOM order is wrong. Vertical utilities (`pt`, `pb`, `mt`, `mb`, `top`, `bottom`) are
unaffected — use them normally.

## LTR islands

Latin and numeric content inside Hebrew must be isolated or the bidi algorithm reorders it — phone
numbers render backwards, prices lose their currency position, URLs fragment.

**Resolved 2026-08-17** (backlog §11.3): the `.ltr` helper exists in the `@layer components` block of
`app/globals.css`, and the phone is isolated everywhere it renders — `Header`, `Hero`, `CtaBanner`,
the service sidebar, `/thank-you/`, plus the pre-existing `Footer`/`ContactSection` `dir="ltr"`
attributes. **Every new Latin/numeric snippet inside Hebrew must use it too.** The helper:

```css
.ltr {
  direction: ltr;
  unicode-bidi: isolate;
}
```

Then use it for phone numbers, emails, URLs, prices with `₪`, and any Latin string:

```tsx
<span className="ltr">{site.phoneDisplay}</span>
<a href={telHref} dir="ltr">{site.phoneDisplay}</a>
```

**Write the plain value in `lib/site.ts`** — `055-6601006`, `₪150 למ״ר`. The component adds the
isolation. Never put markup in the content file.

### 🔴 Digit RANGES are the trap this rule keeps missing

The list above says "phone, email, URL, price" and that framing is what let the **opening hours ship
reversed on all 15 routes for months**, through six deploys and every prior audit. `site.hours` was
interpolated bare:

```tsx
// "א׳–ה׳ 07:00–18:00" in the data → renders "א׳–ה׳ 18:00–07:00" on the page
<li>{site.hours}</li>
```

**Why.** `07:00` and `18:00` are European Numbers. The `–` between them is a _neutral_. Bidi rule N1:
a neutral between two runs that both act as R takes the paragraph direction — and numbers act as R for
this purpose. So the dash resolves RTL, the two number runs sit at level 2, and the reorder swaps
them. The result is a plausible-looking time range that is **backwards**, which is why nobody caught
it by eye.

This applies to **any two numbers joined by a neutral**, not just times:

| Pattern           | Example       | Renders as    |
| ----------------- | ------------- | ------------- |
| Time range        | `07:00–18:00` | `18:00–07:00` |
| Date range        | `2024–2026`   | `2026–2024`   |
| Measurement range | `5–10 ס״מ`    | `10–5 ס״מ`    |
| Price range       | `₪150–₪300`   | `₪300–₪150`   |
| Ratio / dimension | `20/40`       | `40/20`       |

**Rule: isolate the range itself, not the whole string.** Wrapping the entire `"א׳–ה׳ 07:00–18:00"` in
`.ltr` would flip the Hebrew day letters instead. Split the data and isolate only the numeric part —
see `hoursLines` in `lib/site.ts` and `components/Hours.tsx`:

```tsx
<span>
  {line.days} <span className="ltr">{line.time}</span>
</span>
```

**Verify by rendering, not by reading the source.** The source looks correct in both the broken and
the fixed case; only the rendered order differs.

## Israeli formats

- Phone: `055-6601006` displayed; `+972556601006` in `tel:` (both from the manifest via `lib/site.ts`).
- Currency: `₪` — this site writes it **before** the number (`₪150 למ״ר`), which is the existing
  convention here. Be consistent with `services[].priceFrom`; don't mix positions across pages.
- Dates: `dd/mm/yyyy`.
- Ranges: en dash, no spaces — `2–4 שעות`, `07:00–18:00`. ⚠️ Writing the range correctly is only half
  the job — a numeric range **must also be LTR-isolated when rendered**, or it displays reversed. See
  the digit-range section above.
- Thousands separator: comma — `+1,000`.

## Hebrew punctuation

Use **גרש** `׳` (U+05F3) and **גרשיים** `״` (U+05F4) in Hebrew abbreviations. This trade is full of
them and the repo already gets it right — match it:

`למ״ר` · `למ׳` · `ס״מ` · `צד ג׳` · `א׳–ה׳` · `ו׳` · `רח׳` · `ח״פ`

Not the ASCII `'` and `"`, which render wrong and read as English punctuation.

## Trade vocabulary — keep it consistent

| Use                       | Note                                                   |
| ------------------------- | ------------------------------------------------------ |
| ניסור / חיתוך בטון        | searchers use both; the site leads with ניסור          |
| קידוח יהלום / קידוח ליבות | same job, both terms appear                            |
| פתיחת פתח                 | the outcome homeowners actually search for             |
| הריסה מבוקרת              | never plain "הריסה" — the control is the selling point |
| בטון מזוין                | reinforced; matters for the cut and for the price      |
| קונסטרוקטור               | the structural engineer whose sign-off may be required |

An English equipment term gets its own clause, as `ניסור בכבל יהלום (Wire Saw)` already does — never
mid-sentence language mixing.

## Copy rules

- Keep user-facing strings Hebrew. Address the reader as "אתם"; speak as "אנחנו" / בטון פלוס.
- Copy lives in `lib/site.ts`, never in JSX.
- Full voice and depth rules: `docs/content-standards.md` §4 and §7.

## If a Hebrew route is ever added

Betonplus's slugs are all ASCII today, so the fleet's percent-encoding trap doesn't bite here yet. If
you add a Hebrew dynamic route, params arrive **percent-encoded** during static export and must be
matched like this:

```ts
const target = decodeURIComponent(slug).normalize("NFC");
return items.find((i) => i.slug.normalize("NFC") === target);
```

Skipping it works in dev and 404s in production. `app/sitemap.ts` would then need `encodeURI` so the
`<loc>` is byte-identical to the canonical.

## Checklist

- [ ] No banned physical-direction utility, or an exception with a comment.
- [ ] Every phone, email, URL and price is inside an LTR island.
- [ ] Every **digit range** (times, dates, measurements, prices, ratios) is isolated — and the
      isolation wraps only the numeric part, never the surrounding Hebrew.
- [ ] Hebrew abbreviations use `׳` / `״`.
- [ ] Trade terms match the table above.
- [ ] Layout checked at 360px and at desktop, in RTL.
