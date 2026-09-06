---
slot: service-figure-demolition
ratio: 3:2
rendered: ~660px in the main column at lg · 320px at a 360px viewport
alt: "Concrete stair flight separated from the wall along a straight diamond-sawn line, the wall finish beside the cut left intact"
altHe: "גרם מדרגות בטון מופרד מהקיר בקו חתך ישר של ניסור יהלום, הגמר של הקיר לצד החתך נשאר שלם"
caption: "[אלמנט] בטון · הפרדה בחתכי יהלום ופירוק ל־[מספר] חלקים · [שיטה]"
consent: client permission required if the room or building is identifiable
---

**Before this ships:** no `srcset` in this export (`images: { unoptimized: true }` +
`output: "export"`). Sprint 6 of `docs/implementation-roadmap.md` first.

**Caption warning:** `ל־[מספר]` and any thickness or dimension you add are digit runs inside Hebrew
and need the **`.ltr` helper** when rendered.

## The picture this page needs

The claim on this page is unusually easy to photograph and unusually easy to fake, so read it
carefully: controlled demolition removes **one** element and leaves everything around it untouched —
"הקירות, הרצפה והגמרים מסביב נשארים שלמים". The photograph must therefore show **the cut line and the
undamaged surface beside it in the same frame**. A picture of rubble proves nothing; every breaker
operator in the country can produce rubble.

## What is in frame

The strongest subject is a **stair flight separated from the wall**: a straight sawn line where the
concrete met the plaster, the flight standing or part-removed, and **the wall finish beside the cut
still flat, still painted, no spalling, no crack running off the corner.** A balcony cut into strips,
a wall removed to a straight line, a beam stub cut flush — any of these work on the same principle.

Include, if they are there: the sawn faces of the pieces stacked ready to carry out, sized so a person
can move them; the protection sheeting on the floor and stairs; the barrier. A stack of neat sawn
blocks is itself an argument — it says the element left the building in planned pieces rather than
falling.

## Where the camera stands

**Three to four metres back, square to the cut line, landscape, phone level at chest height**, so both
the cut and the surviving surface are in one frame with nothing leaning. Then one close frame of the
junction — where sawn concrete meets intact plaster — filling most of the frame. That close frame is
the evidence; the wide frame is the context. Send both.

Light: available light. If the stairwell is dark, light from the side so the cut line casts a shadow
and reads as an edge. Flash from the camera position kills the edge and gives a flat grey wall.

## What must survive the cover crop

- **The cut line runs through the middle band of the frame**, with intact surface on one side of it
  and removed element on the other. Centre the meaning, not the room.
- Keep the ends of the cut line clear of the frame edges — `object-fit: cover` takes the edges first,
  and there is no focal-point mechanism in this codebase.
- At 320px the difference between a sawn edge and a broken one is the only thing the reader is
  looking for. If it is not obvious at arm's length on a phone, get closer and shoot it again.

## What must stay out of frame

- Any face other than אור שוורץ's, who is the only person who consented (business-facts §A).
- Licence plates, apartment numbers, nameplates on doors, buzzer panels, letterboxes, a street sign
  through a window, a plan with the client's name in the title block, post or paperwork on a surface.
- Any certificate, licence, insurance paper, badge, rating or review.
- The interior of an occupied home in a way that identifies the household — personal photographs,
  belongings, children's things.
- **A before/after pair.** Two frames presented as the same job are only publishable if both are your
  own photographs of that one job, shot from the same position, and the client agreed. If you have
  only the "after", send only the "after" — it is worth more than a mismatched pair.
- Unsafe practice: a partly separated element left hanging with someone beneath it, a stair flight cut
  free with no support, work without eye protection.

## How to send it

Original file, largest size, no crop, no filter. Send the caption facts: **what the element was, how
it was separated, how many pieces it left in**. Nothing goes in the caption that did not happen on
that job.

**EXIF:** strip before it enters the repo (roadmap 6.4).
