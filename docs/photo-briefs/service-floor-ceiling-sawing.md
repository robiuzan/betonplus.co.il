---
slot: service-figure-floor-ceiling-sawing
ratio: 3:2
rendered: ~660px in the main column at lg · 320px at a 360px viewport
alt: "Floor saw part-way along a marked cut line in a concrete slab, the straight kerf running away from the camera with water on the surface"
altHe: "מסור רצפה באמצע חיתוך לאורך קו מסומן בפלטת בטון, החתך הישר ממשיך קדימה והמים על פני הרצפה"
caption: "פלטת בטון [עובי] ס״מ · מסור רצפה יהלום בעומק מבוקר · פתח [רוחב]×[אורך] ס״מ"
consent: client permission required if the site is identifiable — on an active construction site, the main contractor's permission too
---

**Before this ships:** the export contains **no `srcset`** (`images: { unoptimized: true }` +
`output: "export"`). Sprint 6 of `docs/implementation-roadmap.md` first.

**Caption warning:** `[רוחב]×[אורך]` and `[עובי] ס״מ` are digit runs inside Hebrew. Without the
**`.ltr` helper** the bidi algorithm flips the pair and the caption states the wrong dimensions —
exactly the bug that reversed the opening hours on this site until 2026-08-31.

## The picture this page needs

This page is about the most sensitive work in the trade: a slab is always a load-bearing element, the
cut is at controlled depth through its whole thickness, and **the piece that is cut out is supported
and lowered, never dropped**. The photograph has to show a straight cut in a slab and a job under
control.

## Primary frame — the floor saw on a slab

The **floor saw standing on the slab, part-way along its cut**, the blade down in the concrete, the
kerf running away from the camera in a dead-straight line. The **chalk or crayon line marking the rest
of the run** still visible ahead of the machine — that one detail says "set out, then cut" better than
any sentence. Water on the surface and the slurry pushed to the side of the kerf. The rest of the
opening's outline marked on the slab around it.

If the opening is already through, a second good frame: the finished rectangular opening in the slab
seen from above, straight edges, the floor below visible through it, the area barriered off.

## Fallback frame — if the job that comes up is a ceiling

Shoot it from the floor below: the **rail saw fixed to the soffit** and the section being cut, with
the **props or the supporting frame under it** clearly in the picture. The props are the point. A
ceiling cut photographed without visible support contradicts the copy on this very page and must not
be published.

If you shoot that instead, change the front matter to:
`altHe: "מסור על מסילה מקובע לתקרת בטון מלמטה, החלק המנוסר נתמך מלמטה לפני ההורדה"` and
`caption: "תקרת בטון [עובי] ס״מ · ניסור יהלום על מסילה עם תמיכה זמנית · פתח [רוחב]×[אורך] ס״מ"`.

## Where the camera stands

**Behind and slightly to the side of the saw, phone landscape, held at waist height**, so the kerf
runs diagonally from near the bottom of the frame towards the top — a line going into the picture
reads as depth and length. Straight down from standing height flattens everything to grey.

For the ceiling frame: stand back far enough that a whole prop is in shot from floor to soffit,
camera at chest height, not tipped so far up that the verticals splay.

Light: site light and daylight. Wet grey concrete under a flash is a white blur. If it is dark under
the slab, light from the side.

## What must survive the cover crop

- **The kerf, the blade and the marked line stay in the middle band.** Not the machine's branding, not
  the far wall.
- The cover crop takes the edges: whatever explains the picture must not be sitting in the last 10% of
  the frame on any side. There is no focal-point mechanism here to rescue it.
- Landscape only. A vertical phone photo of a floor cut loses the length of the run, which is the
  whole subject.
- At 320px wide the barriers and props read as shapes, so keep them uncluttered — one clean prop
  visible beats four props tangled with scaffolding.

## What must stay out of frame

- Any face other than אור שוורץ's. On an active site there are other trades about — wait until the
  frame is clear of them or shoot tighter.
- Licence plates, site hoarding with the developer's or client's name, project boards, apartment
  numbers, a plan with a name in the title block, a delivery note on a pallet.
- Any certificate, licence, insurance paper, badge, rating or review.
- **Unsafe practice, which matters more on this page than any other**: nobody under an unsupported
  cut section, nobody in the drop zone below a ceiling cut, no unbarriered opening in a floor with
  people walking beside it, no cutting without eye and ear protection. The page sells stopping for a
  signed engineer's plan; a photo that contradicts it costs more than it earns.

## How to send it

Original file, largest size, no crop, no filter. Send the caption facts with it: **slab type and
thickness, method, finished opening size**, and whether client and main contractor agreed to
publication.

**EXIF:** strip before it enters the repo (roadmap 6.4).
