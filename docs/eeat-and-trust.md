# E-E-A-T & trust — the authority doctrine

[business-facts.md](business-facts.md) is the **register** — the list of what is confirmed and what is
🔶. This file is the **doctrine**: what each E-E-A-T letter means for a concrete-cutting contractor,
which trust assets are worth building in what order, and the honesty gate every one of them must pass.

> **The gate, stated once:** a trust signal that is not true is worse than no trust signal. This repo
> shipped three invented testimonials (removed 2026-08-17) and still carries three 🔶 claims in
> production copy. Every mechanism below is designed to add proof **without adding a single
> unverifiable sentence**.

---

## 1. Why this matters more here than on an average site

Google's own guidance escalates scrutiny for **YMYL** — content that can affect health, safety or
finances. Structural concrete cutting inside occupied buildings is a borderline YMYL trade: a bad cut
in a bearing wall is a safety event, and every job is a paid decision made by a stranger on the
strength of a website.

Two consequences:

1. **Anonymity is disqualifying.** A site that cuts structural elements and names no human, shows no
   work and holds no verifiable third-party trace gives a careful buyer nothing to check.
2. **Specificity substitutes for fame.** We cannot buy authority. We can demonstrate it: tolerances,
   reinforcement handling, when a קונסטרוקטור sign-off is mandatory, what the neighbours experience.
   That is the cheapest E-E-A-T available to us and the copy already leans on it.

---

## 2. The four letters, scored honestly

| Letter                      | What it means here                                                 | State                                                                                                                                                                                      |
| --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Experience** (first-hand) | Photos of our openings, our core holes, our sites; job specifics   | 🔴 **Zero.** `public/` holds brand assets only. No photograph of concrete being cut exists.                                                                                                |
| **Expertise**               | Method judgement, structural limits, substrate knowledge           | 🟢 **The one strong letter.** `serviceDepth` + `/faq/`'s comparison tables carry genuine trade substance.                                                                                  |
| **Authoritativeness**       | Off-site corroboration — GBP, directories, associations, citations | 🔴 `sameAs` is `[]`. Nothing anywhere confirms this business exists.                                                                                                                       |
| **Trustworthiness**         | Named humans, verifiable claims, real reviews, honest legal pages  | 🟠 Legal pages and NAP are clean; the owner **is** named (`/about/` bio + `Person` node since 2026-08-30, service-page bylines since 2026-09-06); three headline claims remain unverified. |

**The bottleneck is not Expertise.** Writing more expert copy will not move a site whose Experience and
Authoritativeness are literally zero. Effort belongs where the zeros are.

---

## 3. Trust assets, ranked by (value ÷ effort)

| #   | Asset                                | Owner-blocked? | Why it ranks here                                                                                                                           |
| --- | ------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Google עסק שלי profile**           | ✅ Yes         | The one asset that creates Authoritativeness, local ranking and a review surface at once                                                    |
| 2   | **Photos of real completed work**    | ✅ Yes         | The only source of Experience. Competitors all have it                                                                                      |
| 3   | **A named human** (owner/foreman)    | ✅ Shipped     | אור שוורץ, בעלים — bio on `/about/`, `Person` `#owner`, bylines on service pages. Still 🔶: his years-in-trade sentence (business-facts §A) |
| 4   | **Real reviews on the GBP**          | ✅ Yes         | Legitimises `Review`/`AggregateRating` schema — which stays **absent** until they exist                                                     |
| 5   | **`sameAs` populated**               | Partly         | Ten minutes of repo work once #1 exists                                                                                                     |
| 6   | **Case studies / project write-ups** | Partly         | Buildable from a single real job + permission; strongest B2B proof after photos                                                             |
| 7   | **Insurance / licence evidence**     | ✅ Yes         | Already claimed four times with nothing behind it — either substantiate or remove                                                           |
| 8   | **Visible dates + author on pages**  | ✅ Shipped     | `dateModified` + `עודכן:` (2026-08-31) and `components/Byline.tsx` + `author` on `WebPage` nodes (2026-09-06); articles inherit both        |

Items 1, 2, 4 and 7 need the owner. **Nothing in the repo can manufacture them, and no agent may try.**
Item 3 is done; item 8 is done; 5 and 6 wait on 1 and 2 respectively.

---

## 4. Author bios & attribution

### The rule

Attribution requires a **real, consenting, named person**. Not "צוות בטון פלוס", not an invented
foreman, not a role with no name behind it.

### When the owner supplies a name

```
lib/site.ts
  export interface Author {
    name: string;          // real full name, with consent to publish
    role: string;          // e.g. "מנהל עבודה" / "בעלים"
    yearsInTrade?: number; // 🔶 until the owner confirms
    bio: string;           // 60-120 words: what they actually do, on what kind of jobs
    photo?: string;        // a real photo, or none at all - never stock, never generated
  }
```

Bio content that earns trust, in order: years actually on the tools · the kinds of structures worked on
· the methods personally operated (disc / wire / core) · the safety judgement they own (when to stop
and call a קונסטרוקטור). **Not** adjectives.

Surfaces, once the author exists:

- `/about/` — the bio in full, with the photo.
- Service pages and articles — a byline plus a visible `dateModified`.
- JSON-LD — `author` on `Article`, and the person referenced from the organisation node.

### Until then

Pages ship **unattributed rather than falsely attributed**. An anonymous page is a gap; a fabricated
author is a violation.

---

## 5. Case studies

The highest-value content this business can produce, and buildable from one real job.

**Structure** (400–700 words, one per job):

1. **The constraint** — building type, element, thickness, reinforcement, access, occupancy.
2. **The requirement** — the opening/penetration, dimensions, tolerance, deadline.
3. **The decision** — which method and _why_, and what was ruled out.
4. **The execution** — dust/water/noise management, protection, working hours, coordination.
5. **The outcome** — measurable: dimensions achieved, duration, what was left behind.
6. **Photos** — before, during, after. Without them it is a story, not evidence.

**Rules:**

- **Permission first.** A named client, address or identifiable site needs the client's consent. Where
  consent is not given, anonymise the client and keep the technical detail — the technical detail is
  what proves competence anyway.
- **No composites.** A case study describing a job that did not happen as written is a fabricated
  business fact under [content-standards.md](content-standards.md) §6.
- Cross-link into the relevant service page and, once the silo exists, the city page.

---

## 6. Before/after galleries

The single strongest Experience signal for this trade.

**Content rules**

- Only genuine photographs of this business's own work. **Never stock, never generated, never a
  competitor's image.** This is the same class of error as the fake reviews.
- Hebrew `alt` describing the actual work: `פתח לדלת שנוסר בקיר בטון בעובי 20 ס״מ` — not `תמונה 1`.
- A one-line technical caption (element, thickness, method) turns a photo into evidence.
- Faces, licence plates, apartment numbers and client documents get cropped or blurred.

**Technical rules — read before the first photo ships**

`next.config.ts` sets `images: { unoptimized: true }`, so **Next will not generate a `srcset`** and the
export currently contains none. A gallery dropped in as-is means full-resolution JPEGs on mobile and a
destroyed LCP. See [performance-guidelines.md](performance-guidelines.md) §4 for the pipeline that must
exist **before** the photos land, not after.

---

## 7. Reviews — the permanent policy

1. **Never write a testimonial, a customer name, or a quote — not even as a placeholder.** Fabricated
   reviews are a Google spam-policy violation and, in Israel, a consumer-protection exposure.
2. Reviews return **only** as real, attributed quotes with a verifiable public source — realistically a
   Google Business Profile.
3. The order is fixed: **real reviews exist → a reviews section quoting them with a link to the source
   → only then `Review`/`AggregateRating` JSON-LD.** Never schema first.
4. `AggregateRating` must reflect the true count and average at build time, and must correspond to
   reviews visible on the page.
5. The build gate greps for the three removed names (אבי כהן, מאיה לוי, דניאל אזולאי). **Any
   reappearance is a stop-ship.**

**Acquisition, when the owner is ready:** ask at handover, on site, while the opening is visibly clean —
with a short link to the GBP review form. Never incentivise, never bulk-request, never write on a
customer's behalf.

---

## 8. Trust badges, certifications & security signals

**What legitimately builds trust on this site**

| Signal                                          | Status                                                                               |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| HTTPS + HSTS                                    | ✅ shipped in `public/_headers`                                                      |
| A real, reachable phone answered by a human     | ✅ the site's core promise                                                           |
| Honest hours, honest area                       | ✅ from the manifest                                                                 |
| A truthful accessibility statement              | ✅ `/accessibility/` — see [accessibility-and-i18n.md](accessibility-and-i18n.md) §7 |
| A real privacy policy matching actual data flow | 🟡 `/privacy/` exists; keep it matched to the Web3Forms flow                         |
| Insurance / licence / certification             | 🔶 **claimed but unevidenced** — see below                                           |

**Never display:**

- A badge, seal, logo or certification the business does not hold.
- A membership in an association it has not joined.
- A "100% מאובטח" / "מאושר" graphic that links to nothing.
- A star rating with no reviews behind it.

**The insurance claim is the live example.** ביטוח צד ג׳ appears three times in `lib/site.ts` with no
policy, insurer or cover amount recorded. Two acceptable resolutions: the owner supplies the policy
detail and it becomes a first-class trust asset (insurer, cover, validity — even without the number),
**or** the claim comes out of the copy. There is no third option where it stays as-is indefinitely.

Same treatment for `+1,000 פרויקטים` (displayed as a headline stat) and `foundedYear: 2005` (which
drives "מעל 20 שנה" in four places _and_ `foundingDate` in the JSON-LD).

---

## 9. Working procedure for any agent touching trust content

1. **Locate the claim's source** before writing. Manifest or `lib/site.ts` → free to state. Anywhere
   else → it is not a fact yet.
2. **If unsourced:** do not state it. Write around it, mark `// 🔶 confirm` at the code site, and add or
   update the row in [business-facts.md](business-facts.md).
3. **Never fill a 🔶 with an industry-typical number** because it sounds right.
4. **Never introduce a person, quote, photo or badge** that did not come from the owner.
5. When the owner supplies a value: update the business-facts row → update the **roster manifest** if it
   is identity/NAP/schema → sync → remove the marker → re-run `/qa-build-gate`.

The `eeat-trust-auditor` agent enforces this pass read-only. Run it before any deploy that touches
copy.
