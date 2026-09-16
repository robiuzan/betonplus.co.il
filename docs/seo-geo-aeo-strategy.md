# SEO · GEO · AEO strategy — בטון פלוס

The **strategy layer**. It answers _what we are trying to rank for, where, and how an answer engine
should reach us_. It deliberately does **not** restate mechanics that already have an owner:

| For…                                                              | Read instead                                                                                                               |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| The keyword→route table, title/H1/description formulas            | [keyword-map.md](keyword-map.md)                                                                                           |
| The depth bar, doorway test, answer-block spec                    | [content-standards.md](content-standards.md)                                                                               |
| The target JSON-LD graph                                          | [schema-graph.md](schema-graph.md)                                                                                         |
| What may be stated as fact                                        | [business-facts.md](business-facts.md)                                                                                     |
| The ranked defect register                                        | [optimization-backlog.md](optimization-backlog.md)                                                                         |
| Mechanics (how to write metadata, emit schema, build a city page) | the `/seo-metadata`, `/schema-structured-data`, `/local-seo-il`, `/aeo-answer-content`, `/new-city`, `/new-article` skills |

---

## 1. The demand model

A diamond-cutting contractor is bought on **three axes simultaneously**, and a page can only win one
of them well:

1. **Job axis** — _what needs cutting_ (ניסור קירות, קידוח יהלום, ניסור רצפות, כבל יהלום, הריסה
   מבוקרת). Owned by `/services/[slug]/`.
2. **Place axis** — _who is near me_ (`<service> ב<city>`). **Owned by nothing today.**
3. **Question axis** — _can this even be done / what will it cost / is it safe_ (Tier 3 in
   [keyword-map.md](keyword-map.md) §2). Short answers on `/faq/`; long-form on the `/guides/` hub
   (four articles since 2026-09-06).

The current site covers axis 1 well (5 pages, 456–574 unique words each, answer blocks, per-service
`FAQPage`), covers axis 3 at one page, and covers axis 2 **not at all**. That imbalance — not any
technical defect — is the ranking ceiling.

### Buyer segments, in the order the copy must serve them

| Segment                                | Enters via              | Decides on                                        |
| -------------------------------------- | ----------------------- | ------------------------------------------------- |
| Renovation contractor / קבלן שיפוצים   | job axis, repeat search | availability, tolerance, mess, schedule adherence |
| Builder / project manager              | job + place             | insurance, method statement, coordination         |
| Plumber / electrician / HVAC installer | קידוח יהלום             | speed, small-job willingness, callout minimum     |
| Engineer / קונסטרוקטור                 | question axis           | method competence, structural judgement           |
| Homeowner / ועד בית                    | question → job          | noise, dust, price, trust                         |

B2B first is not a style preference — it is why specificity (thickness, reinforcement, access,
tolerance) outranks adjectives everywhere in this repo.

---

## 2. Cluster architecture

Three silos, one hub each, cross-linked in both directions.

```
                    /  (homepage — head terms, entity, routes into all three silos)
                    |
   +----------------+-------------------------+--------------------------+
   |                |                         |                          |
/services/     /service-areas/           /guides/                  /faq/  /pricing/
(hub, 377w)    (hub, 428w)               (hub - DOES NOT EXIST)     (conversion + AEO
   |                |                         |                      support pages)
5 x /services/  14 chips -> nowhere       N x /guides/[slug]/
   [slug]/      => must become            (Tier-3 questions,
   BUILT        /locations/[city]/         900w floor)
                 NOT BUILT                 NOT BUILT
```

**Rules that hold the architecture together:**

- **Every silo child links up to its hub and sideways to 2–3 siblings** — see the `/internal-linking`
  skill. A chip that links nowhere (today's `/service-areas/`) is a dead end that leaks crawl and
  intent.
- **A page belongs to exactly one silo.** `/pricing/` and `/faq/` are cross-silo support, not silo
  members; they link _into_ silos, never form a fourth one.
- **Cross-silo links are contextual, in-copy, and descriptive** — `ניסור קירות בטון ברמת גן`, never
  "לחצו כאן". Today: per-service "קשור לנושא" blocks, prose links on `/faq/`, `/service-areas/`,
  `/pricing/` and `/contact/`, and a header dropdown that puts every service one hop from every page.
  Still missing: links inside the `serviceDepth` body copy, and service ↔ city once the silo exists.

### Expansion order — do not reorder this

1. ✅ Service pages past the 450-word bar. _(Done — waves 2–4.)_
2. ✅ Support pages past their floors. _(Done — `/faq/` 852w, `/pricing/` 602w, `/about/` 525w.)_
3. ✅ **Coverage resolved 2026-08-30** ([business-facts.md](business-facts.md) §E) — the area is
   **גוש דן והמרכז**. ירושלים and מודיעין removed, the "פריסה ארצית" claim removed, the hero stat
   corrected. All four surfaces now agree with `schema.areaServed`. _(A location silo built on a
   contradiction would have been a liability, not an asset — this was the gate.)_
4. **Tier-1 location pages** — only cities where three or more of the
   [content-standards.md](content-standards.md) §2 local facts are genuinely true. Realistically
   תל אביב · רמת גן · גבעתיים · בני ברק · פתח תקווה · ראשון לציון · חולון · בת ים.
5. **Guides hub** `/guides/` — the Tier-3 spine. This is also the AEO engine (§4).
6. **Only then** service × location cells, and only for ניסור קירות and קידוח יהלום, where local
   intent actually exists. Nobody searches "ניסור בכבל יהלום בגבעתיים".

**The cap:** 5 services × 14 areas = 70 cells. Building them mechanically is the single fastest way to
convert this site into a doorway network. Scaling a thin pattern multiplies risk, not reach.

---

## 3. Local SEO (GEO in its literal sense)

### NAP — one source, four surfaces

```
roster/sites/betonplus.json  ->  site.config.json  ->  lib/site.ts  ->  { visible copy, JSON-LD, GBP }
```

The phone `055-6601006` and `info@betonplus.co.il` are consistent everywhere today (verified
2026-08-16). **Any new surface must read from `lib/site.ts`, never retype the value.** A hardcoded
phone in a component is a NAP-drift bug waiting for the next number change.

### The signals we have, and the ones we don't

| Signal              | State                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `areaServed`        | ✅ `גוש דן והמרכז, ישראל` in the manifest                                                                                                              |
| Region-only address | ✅ legitimate for a mobile trade — but it forfeits the strongest local signal, so confirm it is deliberate ([business-facts.md](business-facts.md) §A) |
| `geo` / `hasMap`    | ❌ absent                                                                                                                                              |
| Google עסק שלי      | 🔶 unknown whether one exists — **the single highest-leverage off-page asset for this trade**                                                          |
| `sameAs`            | ❌ `[]` — nothing off-site corroborates the entity                                                                                                     |
| Location pages      | ❌ none                                                                                                                                                |
| Local reviews       | ❌ none real; the three fabricated ones were removed 2026-08-17                                                                                        |

**Priority is unambiguous:** GBP → real reviews on it → `sameAs` pointing at it → location pages.
Pages built before the profile exists rank into a vacuum.

### Hebrew place grammar

`ב` + city is not uniform. Since 2026-08-31 `serviceAreas` is a typed `ServiceArea[]` with `kind` and
`prefixed` (and a Hebrew `slug` reserved for the silo), so a template must use `prefixed` — never
interpolate a bare `ב${name}`, which produces wrong Hebrew for regions. See the `/new-city` skill.

---

## 4. AEO / GEO — being the sentence an assistant quotes

An answer engine has to do four things in order. A failure at any step makes the next three moot.

| #   | Step          | Our state                                                                                                                                                                                                                                                                                                   |
| --- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Reach**     | ✅ `app/robots.ts` names 11 AI agents in an explicit allow list. ⚠️ Cloudflare's managed robots.txt can prepend an override at the edge — it blocked everything until at least 2026-08-17. **Verify with `curl https://betonplus.co.il/robots.txt`, never from source.**                                    |
| 2   | **Parse**     | ✅ Static HTML, answers in the DOM at first paint, no client-fetched content, valid JSON-LD.                                                                                                                                                                                                                |
| 3   | **Lift**      | 🟡 Answer blocks on all 5 service pages + `/faq/`'s two comparison tables. Missing: a cost table by thickness/reinforcement (blocked on confirmed pricing) and any article-length treatment.                                                                                                                |
| 4   | **Attribute** | 🟡 `dateModified` in every page node with a visible `עודכן:` line (2026-08-31); a named owner with a `Person` node and service-page bylines (`author` on the `WebPage` node, 2026-09-06); `public/llms.txt` live. Still missing: `sameAs` (needs the GBP) and any article an assistant could cite by title. |

### The extraction unit

Assistants quote **a heading plus the paragraph under it**, not a page. Therefore:

- Question-form `<h2>`, verbatim as searched (`כמה עולה ניסור בטון למ״ר?`).
- **40–60 words**, complete in the first sentence, no pronouns pointing outside the block, carrying the
  number/range/duration where one is confirmed. Full spec:
  [content-standards.md](content-standards.md) §5.
- **Never behind a tab or a fetch.** `components/Faq.tsx` renders every answer unconditionally — that
  property is load-bearing for AEO; keep it.

### Table-shaped answers win comparison queries

`/faq/` already carries two: **ניסור מול שבירה בפטישון** (8 criteria) and **method selection** (4
diamond methods with each method's limit). These are the most liftable assets on the site. Every new
comparison question should ship as a table, not prose. `components/CompareTable.tsx` exists for this.

### Entity clarity

An assistant must be able to state, from our HTML alone: _who this is, what it does, where, and how to
reach it._ `localBusinessJsonLd()` covers name, phone, hours, area and services. What it cannot supply
is **corroboration** — that requires `sameAs` (§3) and a named human
([eeat-and-trust.md](eeat-and-trust.md)).

### `llms.txt`

✅ Shipped 2026-08-31 at `public/llms.txt` (live, `text/plain`): what the business is, the service
list, the area, the phone, links to the highest-value pages, and an explicit statement that the site
carries no ratings. **It carries no claim that [business-facts.md](business-facts.md) has not
confirmed** — keep it that way when services or areas change.

---

## 5. Freshness & attribution

Assistants and Google both discount undated, unattributed content. Three moves, in order:

1. **`routeUpdated` already exists** in `lib/site.ts` and feeds real `lastModified` dates into the
   sitemap — deliberately _not_ `new Date()`, which would falsely stamp every URL fresh on every
   deploy. **Bump a route's date only when its content actually changes.** Keep that discipline.
2. Surface `dateModified` **visibly** on service pages and articles, and in the page-type schema.
3. Attribute to a named human once one exists (backlog §7.3, [eeat-and-trust.md](eeat-and-trust.md)).

---

## 6. Technical SEO invariants

Non-negotiable properties of the export. `/qa-build-gate` asserts each one:

- Exactly one `<h1>` per route, no skipped heading levels.
- Unique `<title>` per route, brand appearing **exactly once** — the layout template appends
  `| בטון פלוס`; service pages opt out with `absoluteTitle: true`. **Never combine both mechanisms.**
- Self-referencing canonical with trailing slash on every content route (only `/404/` and
  `/_not-found/` may lack one).
- `sitemap.xml` parity with the emitted route tree, derived from `staticRoutes` + `services`, never
  hand-maintained.
- `/thank-you/` is `noindex` and absent from the sitemap — it is a conversion target, not a page.
- No orphans: every indexable route reachable from the homepage in ≤3 clicks.

---

## 7. How this strategy is measured

| Question                        | Instrument                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Are we reachable by assistants? | `curl https://betonplus.co.il/robots.txt` + server-log agent sampling                                          |
| Are we being cited?             | Manual probe set — ask each assistant the eight Tier-3 questions monthly                                       |
| Are we ranking locally?         | Search Console queries filtered to `ב<city>` patterns; GBP insights once it exists                             |
| Is intent converting?           | `lead_submit` + `/thank-you/` conversions ([data-tracking-infrastructure.md](data-tracking-infrastructure.md)) |

✅ **GA4 measures intent as of 2026-09-16.** Container v5 tags `cta_click` (carrying the `data-cta`
id) and `lead_submit` / `lead_fallback` / `form_error`
([data-tracking-infrastructure.md](data-tracking-infrastructure.md) §2). `page_view` and `cta_click`
are confirmed arriving. Two caveats before trusting a report: the parameters are not yet registered as
custom dimensions, so they display nowhere; and `www` currently collects nothing because of two
settings on the container's hostname lookup table (roadmap 7.9).
