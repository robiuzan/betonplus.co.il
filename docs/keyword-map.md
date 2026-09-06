# Keyword map — בטון פלוס

The search model for a diamond-cutting contractor in גוש דן. Titles, H1s and descriptions are all
generated from the formulas in §3–§5; the `seo-metadata` skill is the mechanics.

---

## 1. The head term

**ניסור בטון** is the head. It carries the volume, and it is the term contractors and homeowners both
use. **קידוח יהלום** is a near-equal second head with a different buyer — plumbers, electricians and
HVAC installers looking for a penetration, not an opening.

The site's own framing is `ניסור וקידוח בטון`, which is right: the two heads sit together in the root
title and split at the service level.

Note the vocabulary split that matters for matching:

- **ניסור** / **חיתוך** בטון — used interchangeably by searchers. Cover both.
- **קידוח יהלום** / **קידוח ליבות** / **קידוח קורים** — the same job, three names.
- **פתיחת פתח** — the _outcome_ homeowners search for ("פתח לדלת בקיר בטון"), and the highest-intent
  phrasing on the site.

---

## 2. Keyword tiers

**Tier 1 — head/commercial.** The service pages own these.

| Term                        | Route                             |
| --------------------------- | --------------------------------- |
| ניסור בטון                  | `/services/` + `/`                |
| ניסור קירות בטון            | `/services/wall-sawing/`          |
| פתיחת פתח בקיר בטון         | `/services/wall-sawing/`          |
| קידוח יהלום / קידוח ליבות   | `/services/core-drilling/`        |
| ניסור רצפות / תקרות בטון    | `/services/floor-ceiling-sawing/` |
| ניסור בכבל יהלום / wire saw | `/services/wire-saw/`             |
| הריסה מבוקרת                | `/services/demolition/`           |

**Tier 2 — local commercial.** `<service> ב<city>`. **Nothing targets these today** — there is no
location silo, only a chip list on `/service-areas/`. This is the largest untapped tier for a trade
that is chosen by proximity. See `/new-city` and `/local-seo-il` before building it.

**Tier 3 — informational / long tail.** The AEO targets. The site answers none of them properly and
has no editorial surface at all:

- כמה עולה ניסור בטון למ״ר?
- ניסור בטון או הריסה — מה מתאים לפתח שלי?
- האם פתיחת פתח בקיר פוגעת ביציבות המבנה?
- מתי צריך אישור קונסטרוקטור לפתיחת פתח?
- כמה רעש ואבק יש בניסור בטון בדירה מאוכלסת?
- קידוח יבש או רטוב — מה ההבדל?
- כמה זמן לוקח לפתוח פתח לדלת בקיר בטון?
- מה ההבדל בין ניסור דיסק לניסור בכבל יהלום?

These are the natural spine of a `/מדריכים/` hub (`/new-article`). Several are also the questions a
B2B buyer uses to qualify a contractor, which makes them commercial as well as informational.

---

## 3. Title formulas

The root `template` in `app/layout.tsx` appends `| בטון פלוס`. **Never append the brand yourself**
unless you also set `absoluteTitle: true`, which is what the service pages do (their `metaTitle`
already carries the brand).

| Route    | Formula                                 | Example                                      |
| -------- | --------------------------------------- | -------------------------------------------- |
| Home     | brand + head terms, absolute            | `בטון פלוס \| ניסור בטון וקידוח יהלום מדויק` |
| Service  | `<service term>` (+ one differentiator) | `ניסור קירות בטון ופתיחת פתחים`              |
| Location | `ניסור בטון ב<city>`                    | `ניסור בטון ברמת גן`                         |
| Static   | the page's own subject                  | `מחירון ניסור וקידוח בטון`                   |
| Article  | the question, verbatim                  | `כמה עולה ניסור בטון למ״ר?`                  |

Keep the **rendered** title under ~60 characters. Nothing currently exceeds it — the longest is
`/service-areas/` at 51 characters and the homepage is 41 — so this is a constraint to preserve, not a
defect to fix.

⚠️ `/about/` renders `אודות בטון פלוס | בטון פלוס`. The subject shouldn't contain the brand when the
template is going to add it — use `אודות` or `על החברה`.

---

## 4. H1 formulas

One `<h1>` per page, matching the title's intent — not necessarily its words.

| Route    | H1                                           |
| -------- | -------------------------------------------- |
| Home     | the value proposition, containing ניסור בטון |
| Service  | `services[].title` — already correct         |
| Location | `ניסור וקידוח בטון ב<city>`                  |
| Static   | the page name                                |
| Article  | the question                                 |

The H1 may be longer and more human than the title. It should never be a bare keyword.

---

## 5. Description formulas

150–160 characters, unique per route:

> `<service> <where>` + one **true** differentiator + an action with the phone.

```
ניסור קירות בטון ופתיחת פתחים לדלתות, חלונות ומזגנים — חיתוך מדויק ביהלום, נקי ובטוח.
עבודה נקייה ושקטה בבניין מאוכלס. חייגו 055-6601006.
```

Rules:

- Only claim what [business-facts.md](business-facts.md) confirms. "+1,000 פרויקטים" and
  ביטוח צד ג׳ are 🔶 — keep them out of metadata.
- Include the phone. This is a call-first business and the SERP snippet is a conversion surface.
- Don't restate a price in a description unless it is `services[].priceFrom` verbatim.

---

## 6. The service × location matrix

5 services × 14 areas = 70 possible cells. **Do not build them.** Order of operations:

1. The 5 **service** pages reach the 450-word bar in [content-standards.md](content-standards.md) §1.
2. Resolve the coverage contradiction in [business-facts.md](business-facts.md) §E — ירושלים and
   מודיעין are in the visible list but outside `areaServed`.
3. Build a **first tier of location pages** for the areas with real substance — realistically תל אביב,
   רמת גן, גבעתיים, בני ברק, פתח תקווה, ראשון לציון, חולון, בת ים. Each must pass the doorway test.
4. Only then consider service × location cells, and only for the two heads (ניסור קירות, קידוח יהלום)
   where local intent genuinely exists. Nobody searches "ניסור בכבל יהלום בגבעתיים".

Scaling a thin pattern multiplies risk, not reach.

---

## 7. Route → primary keyword

| Route                             | Primary keyword                 |
| --------------------------------- | ------------------------------- |
| `/`                               | ניסור בטון                      |
| `/services/`                      | שירותי ניסור וקידוח בטון        |
| `/services/wall-sawing/`          | ניסור קירות בטון / פתיחת פתח    |
| `/services/core-drilling/`        | קידוח יהלום                     |
| `/services/floor-ceiling-sawing/` | ניסור רצפות ותקרות              |
| `/services/wire-saw/`             | ניסור בכבל יהלום                |
| `/services/demolition/`           | הריסה מבוקרת                    |
| `/pricing/`                       | מחירון ניסור בטון               |
| `/service-areas/`                 | ניסור בטון גוש דן               |
| `/faq/`                           | Tier-3 questions (interim host) |
| `/about/` `/reviews/` `/contact/` | brand / navigational            |

`/faq/` is currently the only page carrying Tier-3 intent, and it does so with six short answers. Until
`/מדריכים/` exists it is the single highest-leverage page to deepen.
