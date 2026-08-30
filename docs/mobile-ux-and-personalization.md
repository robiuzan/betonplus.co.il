# Mobile UX & personalization

Most of this site's traffic is a contractor or a homeowner holding a phone next to the wall they need
opened. This file governs how the mobile experience is built, and — more importantly — what
personalization a **static export** may and may not attempt.

---

## 1. Mobile-first is the default, not a breakpoint

- Author every component at the narrow width first; `sm:` / `lg:` are **additions**, never repairs.
- Reference viewport for design decisions: **360 × 640**, the small end of real Israeli Android traffic.
- Test at 320 px before shipping (SC 1.4.10 reflow).
- The desktop layout is a widening of the mobile one, not a separate design.

---

## 2. The thumb zone

On a phone held one-handed, the screen divides into three reach bands. In an **RTL** layout the
comfortable arc for a right thumb sits toward the **start** (right) edge — the mirror of the LTR case,
which is why `end-*`/`start-*` utilities matter physically and not just semantically.

| Band        | Location                 | What belongs there                          |
| ----------- | ------------------------ | ------------------------------------------- |
| **Easy**    | Bottom third, full width | Primary conversion actions                  |
| **Stretch** | Middle band              | Secondary CTAs, in-content links            |
| **Hard**    | Top corners              | Logo, menu toggle, low-frequency navigation |

**Current state, judged honestly:**

- ✅ `FloatingCTA` puts **התקשרו** and **וואטסאפ** in a two-up fixed bar at the very bottom — squarely
  in the easy band, full width, `py-3.5` (comfortably over 44 px).
- ✅ `<main>` carries `pb-16 lg:pb-0` so the bar never covers content.
- 🟡 The **header call button sits in the hard band** on a large phone. It is a duplicate of an action
  already in the easy band, so this is acceptable — but it means the header CTA should never be the
  _only_ call affordance on a page.
- ✅ Desktop gets a floating WhatsApp bubble at `end-6 bottom-6` — logical properties, so it mirrors
  correctly.

**Rules:**

- The primary action never requires a scroll to reach.
- Nothing tappable within 8 px of another tappable thing.
- Destructive or irreversible actions stay **out** of the easy band.
- The sticky bar is two actions. Adding a third shrinks each below comfortable width — if a third
  action is genuinely needed, it replaces one, it does not squeeze in.

---

## 3. Mobile conversion mechanics

| Element            | Requirement                                                                        |
| ------------------ | ---------------------------------------------------------------------------------- |
| Sticky bar         | Always visible below `lg`, never dismissible, never animated in on scroll (CLS)    |
| `tel:` link        | Built from `telHref` in `lib/site.ts`, never a hand-typed `href`                   |
| WhatsApp deep link | `whatsappHref`, `target="_blank"`, `rel="noopener noreferrer"`                     |
| Form fields        | Correct `inputMode` / `autoComplete` — `tel` for phone, `name` for name            |
| Tap targets        | 44 px floor, enforced by `.btn { min-height: 2.75rem }`                            |
| Above the fold     | On 360 × 640: the H1, one sentence of value, and a call action — with no scrolling |
| Font size          | 16 px minimum on inputs, so iOS does not zoom the viewport on focus                |

**Never** interrupt with a modal, an exit-intent overlay, or a "call us now" pop-up. This audience is
mid-job and hostile to interruption; the sticky bar already does the work.

---

## 4. What personalization is actually possible here

`next.config.ts` sets `output: "export"`. There is **no server, no middleware, no API route, no
`headers()`**. Every HTML file is identical for every visitor, cached at Cloudflare's edge.

That leaves exactly three mechanisms, and their costs are very different:

| Mechanism                                                                                                  | Feasible?      | Cost                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Client-side, from data already in the browser** (clock, `document.referrer`, URL params, `localStorage`) | ✅ Yes         | A few lines of JS after hydration. No network call                                                                                         |
| **Client-side IP geolocation via a third-party API**                                                       | ⚠️ Technically | A blocking network round trip, a privacy disclosure, a CSP entry, and a CLS risk                                                           |
| **Cloudflare Pages Function reading `request.cf.city` / `CF-IPCountry`**                                   | ⚠️ Yes, but    | Introduces a server surface into a deliberately static build, breaks full-page edge caching, and is an architecture decision for the owner |

**Recommendation: use mechanism 1 only.** Mechanisms 2 and 3 buy a marginal experience improvement at a
disproportionate cost in complexity, privacy exposure and Core Web Vitals.

### The four rules that bound any personalization on this site

1. **Never personalise indexable content.** The `<h1>`, `<title>`, meta description, body copy and
   JSON-LD are identical for every visitor and for Googlebot. Serving a crawler something different
   from a user is **cloaking**, and it is the fastest way to lose the rankings this whole strategy is
   built for.
2. **Never cause a layout shift.** Anything that changes after hydration must occupy the same box
   before and after, or live in a fixed overlay. See
   [performance-guidelines.md](performance-guidelines.md) §5.
3. **Never block first paint on it.** No personalization may sit on the critical path. The static
   default must be complete and correct on its own.
4. **Never store or transmit personal data for it.** No PII in `dataLayer`, no visitor profile, no
   third-party identity call. See [ux-cro-security.md](ux-cro-security.md) §5.

---

## 5. Geolocation: what to do instead

The requirement behind "geolocation-based content swapping" is real — a visitor in רמת גן should see
that we work in רמת גן. The right answer is **URL-derived, not IP-derived**:

> **Build the location silo.** A visitor who searched `ניסור בטון ברמת גן` and landed on
> `/locations/רמת-גן/` has told us their location more reliably than any IP lookup, and the page they
> landed on is _indexable, cacheable, linkable and citable_. IP geolocation gives the same signal to
> exactly one visitor, once, and gives search engines nothing.

That is why [seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md) §2 ranks the silo above every
personalization idea in this file. It is the same feature, done in a way that compounds.

**Legitimate, low-cost refinements on top of it** (all mechanism 1):

- **Nearest-area hinting** — on a city page, surface the neighbouring cities from the same
  `AreaGroup`. Static, server-rendered, no detection required.
- **Remembered context** — if a visitor arrived on a city page, `localStorage` may pre-select that city
  in the contact form's dropdown. A convenience, never a content change, and the form must be fully
  usable if the value is absent (private windows, cleared storage).

**If IP geolocation is ever genuinely required**, the only acceptable shape is: a Cloudflare Function
that sets a _hint_ consumed after paint, affecting **only** a non-indexed UI affordance, with the
static default intact and correct. Take that decision to the owner explicitly — it changes the hosting
model.

---

## 6. Time-of-day: the personalization actually worth shipping

Business hours are known and single-sourced: **א׳–ה׳ 07:00–18:00, ו׳ 07:00–13:00**. The visitor's clock
is already in the browser. This is the one high-value, zero-cost adaptation available.

| Context       | Primary action           | Supporting message                                                |
| ------------- | ------------------------ | ----------------------------------------------------------------- |
| Inside hours  | **התקשרו** (call, amber) | "זמינים עכשיו" — only if the owner confirms the phone is answered |
| Outside hours | **וואטסאפ** or the form  | "מחוץ לשעות הפעילות — נחזור אליכם בבוקר"                          |
| שבת / חג      | WhatsApp or form         | No call prompt                                                    |

Implementation constraints:

- The **static default is the in-hours state**. If JS never runs, the visitor sees a working call
  button — the worst case must be the current behaviour, not a broken one.
- Both states occupy **identical dimensions**. Swap the label and the emphasis, never the layout.
- Compute from the visitor's local clock. Do not fetch a time API.
- **The message must be true.** "נחזור אליכם בבוקר" is a commitment; it needs the owner's confirmation
  before it ships ([business-facts.md](business-facts.md)).
- Hours come from `lib/site.ts`. Never hardcode `7` and `18` into a component.

Other honest mechanism-1 adaptations, in descending value:

- **Referrer/UTM** — a visitor from a paid ad can land on a page whose CTA matches the ad's promise.
  Requires paid traffic to exist first.
- **Returning visitor** — a second visit within a session may surface "המשיכו מאיפה שהפסקתם". Low value;
  build it last, if ever.

---

## 7. Pre-ship mobile checklist

- [ ] 360 × 640: H1, value sentence and a call action visible without scrolling.
- [ ] 320 px: no horizontal page scroll; the `/faq/` tables scroll inside their own container.
- [ ] Sticky bar visible on every route below `lg`, not covering content.
- [ ] Every tap target ≥ 44 px, with ≥ 8 px separation.
- [ ] `inputMode` / `autoComplete` correct on every form field; inputs ≥ 16 px.
- [ ] No personalization affects indexable content, and none shifts layout.
- [ ] The page is complete and correct with JavaScript disabled.
