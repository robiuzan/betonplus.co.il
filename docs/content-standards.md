# Content standards — the acceptance bar for Hebrew copy

Every page on betonplus.co.il is judged against this file. It is the gate the `hebrew-copywriter`
agent writes to and the bar the `seo-auditor` and `eeat-trust-auditor` measure against.

---

## 1. The depth bar

Unique **body** words, excluding the ~110 words of site chrome (header nav, footer, sticky CTA,
CTA banner).

| Page type                               | Floor | Current state                                                                      |
| --------------------------------------- | ----- | ---------------------------------------------------------------------------------- |
| Service page                            | 450   | ✅ 456–574 unique-to-page words since 2026-08-17 (`serviceDepth` in `lib/site.ts`) |
| Location page                           | 350   | — the silo does not exist yet                                                      |
| Index (`/services/`, `/service-areas/`) | 250   | ✅ 377 / 434 unique words (waves 3–4)                                              |
| `/pricing/` `/about/` `/faq/`           | 300   | ✅ 602 / 525 / 850 unique words (waves 3–4)                                        |
| Article (`/guides/`)                    | 900   | ✅ hub + 4 articles shipped 2026-09-06, each over the floor (`lib/articles/`)      |
| Legal pages                             | none  | ✅ `/privacy/`, `/accessibility/` are fine as they are                             |

Word count alone is not the bar — **generic reassurance does not count toward it.** "מקצועיים,
אמינים, בזמן" is chrome wearing the costume of content. What counts: tolerances, concrete thickness
and reinforcement, access constraints, equipment choice, dust and water management, noise, what a
neighbour experiences, what gets left behind, what the customer must prepare.

---

## 2. The doorway test — mandatory for every service and location page

> Replace the service name (or the city name) with a different one. Is the page now correct and
> publishable for that other service/city? **If yes, it does not ship.**

The 5 service pages **pass** as of 2026-08-17: each `serviceDepth` entry carries substance that is
only true for that service (a lintel and a bearing-wall decision for openings; wet/dry and
post-tensioned cables for coring; two-floor work and the piece-that-must-not-fall for slabs; the
no-depth-limit cable and pulley safety zone for wire sawing; separate-then-dismantle for demolition).
Re-run the swap test whenever a page is edited — it is easy to regress into shared reassurance.

For a **location** page (none exist yet), passing requires **three or more** true, specific items:

- Named neighbourhoods, streets or industrial zones.
- Building-stock reality — 1960s reinforced shear walls versus new post-tensioned slabs, and how that
  changes the cut.
- Access reality — crane access, parking, lift dimensions, water supply for wet cutting, permitted
  working hours in that municipality.
- A real job reference from that city (with permission).
- Travel and scheduling reality for that distance.
- A city-specific FAQ that would read oddly anywhere else.

**If none of those can be said truthfully about a city, that city does not warrant a page.** Record it
in [business-facts.md](business-facts.md) §E rather than padding.

---

## 3. Required blocks per page type

### Service page

1. `<h1>` = the service, matching the title's intent.
2. **Answer block** (§5) — 40–60 words under a question-form `<h2>`.
3. What the service is, and on what substrate — reinforced vs plain concrete, block, stone.
4. **What's included and what isn't** — the most-asked pre-purchase question in this trade.
5. Equipment and method — disc vs wire vs core bit, wet vs dry, and _why_ for this job type.
6. Dust, water, noise and vibration — what the customer and the neighbours actually experience.
7. Safety and structure — when a קונסטרוקטור sign-off is required. **Never imply one isn't needed.**
8. Process (already present — keep).
9. Price, **interpolated from `services[].priceFrom`**, never restated as a literal.
10. 3–5 service-specific FAQs → `FAQPage`.
11. Related services + (once they exist) related locations.
12. CTA.

### Location page (when the silo is built)

Answer block → city-specific intro → local notes (§2) → the service list → nearby locations →
city FAQ → CTA.

### Index pages

A real introduction, not just a grid. `/services/` should explain how to choose between ניסור and
קידוח; `/service-areas/` should say something true about working across גוש דן — traffic, access,
municipal hours — and link contextually into its children.

---

## 4. Brand voice

- **Tone:** מקצועי · ענייני · רגוע · מדויק. This is a B2B-first trade — contractors and engineers read
  it before homeowners do. Confidence comes from specificity, never from adjectives.
- **Person:** "אנחנו" / בטון פלוס, addressing the reader as "אתם".
- **Favour:** חיתוך מדויק ביהלום · בלי לפגוע ביציבות המבנה · מינימום רעש ואבק · עמידה בלוחות זמנים ·
  מסירה נקייה · הצעת מחיר ברורה.
- **Avoid:** "זול", unevidenced superlatives ("המובילים בישראל"), exclamation spam, and — specifically
  for this trade — any phrasing that implies structural work can skip engineering approval.
- Emoji: a `✓` inside a UI element is fine; never in body copy.
- **Register reference:** _"פותחים את הפתח בדיוק במקום ובמידה — חיתוך יהלום נקי, בלי סדקים ובלי לסכן
  את יציבות הקיר."_

---

## 5. The answer block (AEO)

Every service page, location page and article opens with one:

- Directly under a **question-form heading** (`<h2>כמה עולה ניסור בטון?`).
- **40–60 words.** Shorter reads thin; longer stops being liftable.
- **Complete in the first sentence.** No "יש כמה גורמים" preamble.
- Self-contained — no pronouns pointing outside the block.
- Contains the concrete number, range or duration where one exists **and is confirmed**.

```
## כמה זמן לוקח לפתוח פתח בקיר בטון?
פתח סטנדרטי לדלת בקיר בטון בעובי 20 ס״מ נפתח בדרך כלל תוך 2–4 שעות עבודה, כולל סימון,
ניסור, הוצאת האלמנט ופינוי. עובי גדול יותר, זיון צפוף או גישה מוגבלת מאריכים את הזמן,
ואת ההערכה המדויקת נותנים בבדיקה בשטח.
```

**Rendering rule:** the answer must be in the HTML at first paint — not behind a tab, not
client-fetched. An accordion is acceptable **only** if the content ships in the DOM and is merely
hidden. `components/Faq.tsx` renders every answer unconditionally today — keep that property.

---

## 6. Claims — what may be stated as fact

**Free to state** (sourced in the roster manifest or `lib/site.ts`):

- The brand name, the phone, the email, the hours as published.
- The services offered and what each one is.
- "משנת 2005" / "מעל 20 שנה" — **only while `foundedYear: 2005` stands**; it is owner-asserted.
- The service area as `schema.areaServed` states it.
- The starting prices **exactly as `services[].priceFrom` holds them**, with the disclaimer.

**Gated — needs a row in [business-facts.md](business-facts.md) and a `// 🔶 confirm` marker:**

- Any project count ("+1,000"), any percentage, any "X לקוחות".
- Insurance, licences, certifications, association membership.
- Any review, testimonial, rating, or customer name.
- Any coverage claim beyond `areaServed` — especially "פריסה ארצית".
- Any warranty term.
- Any superlative or comparative against competitors.

**Never, under any circumstance:**

- Write a testimonial. The three invented ones this site once shipped were removed 2026-08-17, and
  the build gate greps for their names — any reappearance is a stop-ship.
- Present a stock or generated image as this business's own work.
- Fill a 🔶 with an industry-typical number because it "sounds right".

---

## 7. Hebrew mechanics

- Hebrew only in user-facing strings; no mid-sentence language mixing. An English equipment term gets
  its own clause (as `ניסור בכבל יהלום (Wire Saw)` already does).
- Israeli formats: `055-6601006`, `₪` with the number, `dd/mm/yyyy`, en dashes in ranges (`2–4 שעות`).
- Hebrew abbreviations use גרש `׳` and גרשיים `״` — `למ״ר`, `למ׳`, `ס״מ`, `צד ג׳`. Never ASCII `'` `"`.
- Write the plain value in `lib/site.ts` — the component adds `dir="ltr"` isolation. Never put markup
  in the content file.
- Copy lives in `lib/site.ts`, never in JSX.

---

## 8. Before publishing

- [ ] Meets the §1 floor with **specific** content.
- [ ] Passes the §2 substitution test.
- [ ] Opens with a §5 answer block.
- [ ] Every claim is either free (§6) or carries a 🔶 and a business-facts row.
- [ ] Prices interpolated, never retyped.
- [ ] 2–3 contextual in-copy links with descriptive Hebrew anchors.
- [ ] Hebrew punctuation correct; LTR islands isolated.
- [ ] `npm run lint && npm run typecheck && npm run format:check && npm run build` clean.
