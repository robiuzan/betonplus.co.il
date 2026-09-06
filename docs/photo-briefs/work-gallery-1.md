---
slot: work-gallery-1
ratio: 3:2
rendered: ~355px at lg · ~544px at sm · 320px at a 360px viewport
alt: "Finished door opening sawn through a concrete wall, a tape measure held across it showing the width, the next room visible through the opening"
altHe: "פתח לדלת שנוסר בקיר בטון, סרט מדידה מתוח לרוחב הפתח והחדר שמעבר נראה דרכו"
caption: "קיר בטון [עובי] ס״מ · מסור דיסק יהלום על מסילה · פתח [רוחב]×[גובה] ס״מ"
consent: client permission required if the room or building is identifiable
---

**The slot does not exist yet.** The work gallery is roadmap 5.1, blocked on the photos themselves
(1.2), and it cannot be built until Sprint 6 lands the variant pipeline — `images: { unoptimized:
true }` under `output: "export"` means the export has **no `srcset`** and a phone JPEG here is a phone
JPEG on 4G. Photos first, pipeline, then gallery.

**Read this brief together with `work-gallery-2.md` and `work-gallery-3.md`.** The three are a **set**
and will be seen side by side in one row on a desktop screen: vary the subject, hold the light and the
treatment constant. Same phone, all three landscape, all three available light, none of them filtered.
A row where one frame is warm indoor light, one is flash and one is sunset reads as three photographs
of nothing in particular.

**Caption warning:** `[רוחב]×[גובה]` is a digit pair with a neutral between the numbers. Rendered
inside RTL without the **`.ltr` helper** it flips — `90×210` displays as `210×90`. Same bug that
reversed the opening hours on this site until 2026-08-31.

## What is in frame — the finished opening, with scale

A **completed rectangular opening in a concrete wall**: door, window, air-conditioning penetration or
a widened opening. The work is done, the saw is gone, the floor is swept. Light comes through from the
other side so the opening reads as a hole at thumbnail size.

Across the opening, **a tape measure or folding rule held or clipped so its scale is readable** at the
width or the height. That is the whole point of this frame: it turns "a nice hole" into a measured
result, and it lets the caption state a dimension you can see. Hold it against one edge, straight, not
diagonally across the middle.

Then the detail the buyer is really checking: **the reveal**. The sawn face of the concrete inside the
opening, flat all the way through, cut ends of reinforcement bar flush in it, and **the wall beside the
opening unbroken** — no spalling at the corners, no crack running away from them.

## Where the camera stands

**Square-on, about two metres back, landscape, phone level at chest height.** Both vertical edges of
the opening in frame with a hand's breadth of wall each side. Do not tilt: leaning verticals are the
single clearest signal of a snapshot, and this row of three is where the site's credibility is decided.

Light: shoot with the light, not into it. If the room beyond is much brighter than the room you stand
in, tap the phone on the wall beside the opening so it exposes for the wall rather than blowing out to
a white rectangle.

## What must survive the cover crop

- **Opening centred in the middle band**, the tape's scale within it. The crop takes the frame edges
  and there is no focal-point mechanism in this codebase.
- Do not put the tape at the very bottom of the frame — that is the first band to go at some viewport
  widths.
- At 320px the reader sees: a rectangle of light, a straight edge, a tape. Nothing finer than that
  survives. Build the frame on those three things.
- Leave breathing room: about 10% clear on all four sides.

## What must stay out of frame

- **Any face other than אור שוורץ's** (business-facts §A — the only person who consented).
- Licence plates, apartment numbers, nameplates, buzzer panels, letterboxes, a street sign or a
  recognisable building through the new opening, post or paperwork on a surface, a plan with a client
  name in the title block.
- Any certificate, licence, insurance paper, badge, rating or review.
- Personal belongings and family photographs in an occupied home.
- **A before/after pair**, unless both frames are your own photographs of that same job from the same
  camera position and the client agreed to publication.
- Unsafe practice of any kind.

## How to send it

Original file, largest size, **no crop, no filter, no portrait blur, no watermark, no text on the
image**. With it, the three caption facts — **wall thickness, method, finished opening size** — and
whether the client agreed to publication.

**EXIF:** strip before the file enters the repo (roadmap 6.4). It carries a client's GPS coordinates.
