---
slot: work-gallery-3
ratio: 3:2
rendered: ~355px at lg · ~544px at sm · 320px at a 360px viewport
alt: "Diamond cutting kit laid out on a dust sheet on a concrete floor mid-job — saw head and rail section, diamond blade, core barrels and the water hose"
altHe: "ציוד הניסור והקידוח מונח על יריעת הגנה על רצפת בטון באמצע עבודה — ראש המסור וקטע מסילה, דיסק יהלום, מקדחי כוס וצינור המים"
caption: "ציוד ניסור וקידוח יהלום · [דיסק/מקדחים] בקטרים [טווח] · באתר בזמן עבודה"
consent: none needed — no client, no person and no identifiable site in frame, provided the background stays anonymous
---

**The slot does not exist yet** (roadmap 5.1, blocked on 1.2) and cannot be built before Sprint 6
lands the variant pipeline: `images: { unoptimized: true }` under `output: "export"` means **no
`srcset`** in the export.

**Part of a set with `work-gallery-1.md` and `work-gallery-2.md`.** Same phone, same treatment, all
landscape, all available light, none filtered.

**Shoot this one first.** It is the only frame in the set that needs nobody's permission — no client,
no face, no address. It can be taken on the next job, today, and it unblocks the gallery being built
at all.

**Caption warning:** `[טווח]` will be a numeric range (e.g. `52–200 מ״מ`); rendered inside Hebrew it
needs the **`.ltr` helper**, or bidi reorders the range and the numbers read backwards.

## What is in frame — the kit, on a real floor, mid-job

Your own equipment as it actually sits during a job, on the protection sheet on a concrete floor: the
**saw head and a section of rail**, a **diamond blade** with its segments visible and its wear honest,
**two or three core barrels of different diameters** standing or lying, the **water hose** running in,
the tin of bolts, the marking crayon, the level. Wet floor, slurry on the blade, dust on the case —
all of it stays. This is not a product shot and it must not look like one.

What makes it convincing to a contractor is exactly what a stock photo never has: **used kit in a
working arrangement**. Do not lay the tools out in a neat row on a clean floor at home. Photograph the
patch of floor where they already are, move one thing so nothing important is hidden, and shoot.

If the moment is better with the kit **in use** rather than at rest — the rail bolted up and the head
on it, the barrels racked on the stand — take that instead and change `altHe` to describe what is
actually there.

## Where the camera stands

**Standing over the kit, phone landscape, about 1.2 metres above it, tipped down at roughly 45–60°**
— not straight down, which flattens everything into a pattern, and not from standing height across the
room, which turns the kit into clutter. Close enough that the blade's segments and the teeth on a core
barrel are distinguishable.

One frame from that angle; one frame lower, almost at floor level, looking along the kit with a
barrel large in the foreground and the rail and saw head behind it — that second one gives depth and
is often the better picture.

Light: daylight from a window or an opening, from the side. No flash: it bounces straight back off wet
metal as a white star.

## What must survive the cover crop

- **The blade and at least one core barrel in the middle band.** Those two objects are what identify
  the trade at 320px; everything else is texture.
- Keep 10% clear all round; `object-fit: cover` takes the edges and there is no focal-point mechanism
  in this codebase.
- At 320px this frame reads as **shapes and materials** — a big circle, cylinders, the grey of wet
  concrete. Compose those large and keep the background quiet.
- Landscape only.

## What must stay out of frame

- **Any face** — including your own reflection in a window, a screen or the wet floor. אור שוורץ is
  the only person who may appear anywhere on this site, and in this frame nobody needs to.
- Anything that identifies the site or the client: apartment numbers, nameplates, letterboxes, a
  street view through a window, a site board with the developer's name, delivery notes, a plan with a
  title block, a screen with an address on it.
- Licence plates — including the van's, if the tailgate is in shot.
- Any certificate, licence, insurance paper, badge, rating or review propped against the kit.
- Another company's branding on borrowed or hired equipment. The kit in this frame must be the kit you
  work with.
- A tidied, staged flat-lay on a clean surface. It reads as stock, and a contractor discounts it
  instantly.

## How to send it

Original file, largest size, **no crop, no filter, no blur effect, no watermark**. With it, one line
for the caption: **what is in the picture and the diameter range of the barrels shown**. No claim about
how many jobs, how many years or how fast — the caption describes the objects in the frame and nothing
else.

**EXIF:** even with no client in frame the file still carries GPS coordinates and a device id. Strip
it before the file enters the repo (roadmap 6.4).
