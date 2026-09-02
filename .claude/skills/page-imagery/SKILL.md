---
name: page-imagery
description: Which image belongs in which slot on בטון פלוס — the measured inventory of every position that could hold a picture, its rendered width, ratio and crop behaviour, the variant pipeline that must exist before the first photo ships (images.unoptimized + output export = no srcset), Hebrew alt and caption rules, and the honesty gate that bans stock or generated imagery of this business's work. Use before writing an image brief, adding a photo to a page, or judging whether a picture fits. Triggers "what image goes here", "which aspect ratio", "add a photo", "gallery", "why is this image cropped", "srcset".
---

# Page imagery

**Start from the fact that nothing has shipped yet.** There is no `<img>` anywhere in `app/` or
`components/`, `public/` holds `brand/betonplus-logo.svg` and `brand/betonplus-mark.svg`, and every
hero is the CSS gradient `.hero-grad` (`app/globals.css:158`). So this file is not a description of
slots that exist — it is the measured spec for the positions that would hold one, taken from the live
layout. **Every number below is derived from the code, not chosen.**

The container is the constant: `.container-x` is `max-width: 72rem` (1152px) with `padding-inline:
1.25rem`, so the widest content column on the site is **1112px**, and at a 360px viewport it is
**320px**.

## The slot inventory

| Slot                    | Where                                                             | Widest rendered                       | Ratio                | What it does to your picture                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home hero visual**    | `components/Hero.tsx:64` — the `hidden lg:block` card             | ~482px (`lg:grid-cols-[1.1fr_0.9fr]`) | 4:3 or 1:1           | **Desktop only.** Hidden below `lg`, so a photo here is never the mobile LCP. Today it is an icon-and-stats card; replacing it is a layout decision, not just an art one. |
| **Page hero**           | `components/PageHero.tsx`                                         | full-bleed                            | **not fixed — stop** | Gradient only, no image. Adding one changes the LCP element on every inner route from the `<h1>` to a photograph — `docs/performance-guidelines.md` §3.                   |
| **Service card thumb**  | `components/ServicesGrid.tsx` — `sm:grid-cols-2 lg:grid-cols-3`   | ~355px at lg · 544px at sm · 320px    | 3:2                  | The card is `p-6`, so a full-bleed thumb needs the padding restructured first. Read the five as a **set**: vary the subject, hold the light constant.                     |
| **Service page figure** | `app/services/[slug]/page.tsx:87` — `lg:grid-cols-[1.6fr_1fr]`    | ~660px main · ~412px aside            | 3:2                  | The only genuinely wide in-body photo position. The aside is the sticky CTA column — a picture there competes with the conversion action.                                 |
| **Work gallery**        | does not exist — roadmap 5.1, blocked on owner photos (1.2)       | same grid as the service cards        | 3:2                  | The highest-value slot on the site and the reason this skill exists. `docs/eeat-and-trust.md` §6 governs it.                                                              |
| **Owner portrait**      | `app/about/page.tsx:82` — `h-14 w-14 rounded-full`                | 56px (needs 112px @2x)                | 1:1                  | Renders `owner.name.charAt(0)` until a photo exists. `Owner` in `lib/site.ts` has **no `photo` field** — adding one is a code change, not an art-direction change.        |
| **OG / share card**     | `app/opengraph-image.tsx`                                         | 1200×630                              | 1.91:1               | Generated at build from brand shapes, no external font. `manifest.images.og` (`betonplus/og.jpg`) exists in `site.config.json` but **nothing in the code reads it**.      |
| **Icons, brand mark**   | `components/Icon.tsx` (16–36px inline SVG) · `public/brand/*.svg` | —                                     | —                    | **Icon positions, not photo positions.** Never send a photograph.                                                                                                         |

Two consequences that are easy to get wrong:

- **There is no focal-point mechanism.** No catalog `focal`, no `gravity=` transform, no
  `object-position` convention. A subject framed at the edge is lost at the first `cover` crop.
- **`images.unoptimized` means the file you ship is the file every device downloads.** No variant,
  no format negotiation, no downscale. A 4 MB phone photo in the gallery is a 4 MB download on 4G.

## The pipeline that must exist before the first photo

`next.config.ts` sets `output: "export"` with `images: { unoptimized: true }`, so **Next's image
optimiser never runs** and the export contains zero `srcset`. Harmless today; the binding constraint
the day photos land. Sprint 6 of `docs/implementation-roadmap.md` and
`docs/performance-guidelines.md` §4 own it. Before any photo ships:

1. **Variants** at 400/800/1200/1600px, AVIF + WebP + JPEG fallback, at or before build time — or
   serve through Cloudflare Images / Image Resizing at the edge and keep binaries out of the repo.
2. **Real `srcset` + `sizes`**, with `sizes` reflecting the widths in the table above. Never a `sizes`
   without a `srcset`: it reviews clean and does nothing.
3. **`width` and `height` on every image** (or an aspect-ratio box). An unsized image is a CLS event.
4. **`loading="lazy"` + `decoding="async"`** below the fold; `fetchpriority="high"` and no lazy on the
   LCP image if one ever becomes the LCP element.
5. **Strip EXIF.** Job photos carry GPS coordinates and device identifiers.
6. **Budget: < 400 KB of images per page** (`docs/performance-guidelines.md` §1).

The first `<img>` on this site sets the pattern for every one after it. Build it with
`rtl-frontend-engineer` and the `performance-web-vitals` skill, not ad hoc inside a page.

## Alt text and captions

Hebrew is what ships — the document is `lang="he-IL" dir="rtl"` and the alt is read aloud in Hebrew.
Decorative images take `alt=""`; an empty alt is a decision, a missing alt is a defect
(`docs/accessibility-and-i18n.md`).

- Describe **what is visible**. Never `תמונה של`. Never a detail the camera cannot see.
- **Alt is copy.** Years in business, project counts, response times, ratings and coverage claims are
  gated in an `alt` exactly as in a heading — `docs/content-standards.md` §6.
- Hebrew punctuation: גרש `׳`, גרשיים `״` — `ס״מ`, `צד ג׳`. Ranges take an en dash: `90–210`.
- A numeric or Latin run rendered inside Hebrew needs the `.ltr` helper — see `rtl-hebrew`.
- **The caption is what makes a photograph evidence**: element, thickness, method, one line.
  `קיר בטון 20 ס״מ · מסור דיסק על מסילה · פתח 90×210 ס״מ`. Only on a real photo of a real job.

## Honesty — the gate this site is built around

- **Only genuine photographs of this business's own work. Never stock, never generated, never a
  competitor's image** — `docs/eeat-and-trust.md` §6, `docs/content-standards.md` §6,
  `docs/business-facts.md` §D. Same class of error as the three fabricated testimonials removed
  2026-08-17.
- Generated imagery is confined to assets that depict **nothing readable as our work** — the share
  card, an abstract texture, a schematic. A generated person in workwear is not one of those.
- Never a certificate, licence, rating, badge or review, in the frame or as the frame.
- Never a named or identifiable customer. Faces, plates, apartment numbers and client documents are
  kept out of frame at the shutter.
- Never imply a crew, a fleet or coverage beyond גוש דן והמרכז. **אור שוורץ** is the only person who
  has consented to appear (business-facts §A).
- Photos are an **owner-supply item** (backlog §7.2, roadmap 1.2). If they have not arrived, the
  honest answer is a slot that stays empty — not a picture bought or generated to fill it.

## Related

`.claude/agents/image-art-director` writes the briefs · `docs/eeat-and-trust.md` §6 the gallery rules
· `docs/performance-guidelines.md` §4 the pipeline · `.claude/skills/performance-web-vitals` and
`.claude/skills/responsive-accessibility` for the mechanics · `Media Studio/` for generated
non-evidentiary assets and the OG card.
