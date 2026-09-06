---
slot: service-figure-wall-sawing
ratio: 3:2
rendered: ~660px in the main column at lg · ~1112px is the widest the container ever gets · 320px at a 360px viewport
alt: "Rectangular door opening cut through a concrete wall, the rail-mounted diamond saw still fixed to the wall at the edge of the opening"
altHe: "פתח מלבני שנוסר בקיר בטון, מסור הדיסק עדיין מקובע על המסילה בצד הפתח"
caption: "קיר בטון [עובי] ס״מ · מסור דיסק יהלום על מסילה · פתח [רוחב]×[גובה] ס״מ"
consent: client permission required (the room and the building are identifiable) — or shoot tight enough that nothing identifies the site, and no client name, number or document appears
---

**Before this ships:** `images: { unoptimized: true }` + `output: "export"` means the export has **no
`srcset`** — a full-size phone JPEG here is a full-size download on 4G. Sprint 6 of
`docs/implementation-roadmap.md` lands the variant pipeline; photos go in after it, not before.

**Caption warning for whoever renders it:** `[רוחב]×[גובה]` is a Latin-digit run with a neutral
between two numbers. In an RTL paragraph the bidi algorithm reorders it and `90×210` displays as
`210×90` — the same bug that showed every visitor the opening hours backwards until 2026-08-31. Wrap
the dimension run in the **`.ltr` helper** (`app/globals.css`). Same for the thickness figure.

## The picture this page needs

The page says an opening is _sawn along a marked line, not broken_: a rail-mounted diamond disc cuts
concrete and reinforcement together in a straight line at controlled depth, and the wall around it
stays whole. The photograph has to show exactly that and nothing else — **a straight kerf and an
intact wall.**

## What is in frame

A finished or nearly finished rectangular opening in a concrete wall — a door between rooms, a widened
opening, a window in an external wall. The **rail is still bolted to the wall** down one side, with
the saw head on it, at the edge of the frame. Daylight or the next room shows through the opening, so
the eye reads "hole" immediately at thumbnail size.

The two things that carry the argument, and both must be legible:

1. **The cut edge** — dead straight, top to bottom, the sawn face of the concrete visible in the
   reveal, cut ends of reinforcement bars showing in the edge if there are any.
2. **The wall beside the cut** — plaster, paint or bare concrete, unbroken, no spalling, no crack
   running away from the corner.

The floor is protected the way it actually is on the job: a sheet, the water hose running to the
opening, water collected rather than spreading. Leave that in. It is the difference between a real
site and a set.

## Where the camera stands

**Square-on to the wall, about two metres back**, phone held level in **landscape** and at the height
of your chest — not tipped up, not tipped down. Tipping makes the vertical edges lean and the whole
frame reads as amateur.

Take one wide frame with the whole opening plus a hand's breadth of wall on each side, and one closer
frame of the top corner where the two cuts meet at ninety degrees, which is the single most persuasive
detail in this trade. Send both.

Light: whatever the job has. Do not use flash straight at a wet concrete wall — it comes back as a
white blob. If the room is dark, open the door, put the phone's light off to one side, or shoot from
the lit side towards the darker one.

## What must survive the cover crop

The slot is 3:2 and crops to `cover` into a fixed box; at a 360px viewport the whole thing is 320px
wide, about the size of a credit card.

- **The opening sits in the middle band of the frame**, not at an edge. Centre the _meaning_ — the cut
  edge and the light coming through — not the geometry of the room.
- Keep at least 10% clear margin all round the opening; the crop eats it.
- The rail and saw head belong just inside the frame edge, not half out of it.
- At 320px a person's expression, a small label or a fine chalk line will not read. Do not build the
  picture on anything smaller than a fist.

## What must stay out of frame

- **Anyone's face** other than אור שוורץ, who consented (business-facts §A). Hands and forearms at
  work are fine and are better than faces anyway.
- **Licence plates, apartment numbers, door nameplates, letterboxes, buzzer panels, street signs, mail
  on a table, a plan with the client's name in the title block.** Excluded at the shutter — you cannot
  fix this in post, and you should not have to.
- **Any certificate, licence, insurance paper, badge, rating or review.**
- Family photos, personal belongings and anything recognisable in a client's home.
- **Unsafe practice.** Nobody cutting without eye protection, no unsupported element left hanging, no
  one standing under a suspended slab. If the frame would show it, do not take the frame.

## How to send it

Original file, largest resolution, **no crop, no filter, no portrait blur, no text overlay**. Tell us
in a message the three facts the caption needs — **wall thickness, method, finished opening size** —
and whether the client agreed to the photo being published. Nothing goes in the caption that you did
not measure on that job.

**EXIF:** the file carries GPS coordinates of a client's building and your device id. Strip it before
the file enters the repo (roadmap 6.4).
