---
slot: service-figure-core-drilling
ratio: 3:2
rendered: ~660px in the main column at lg · 320px at a 360px viewport
alt: "Diamond core drill rig anchored to a concrete slab, the barrel part-way into the hole, with an extracted concrete core standing on the floor beside it"
altHe: "מעמד קידוח יהלום מעוגן לרצפת בטון, מקדח הכוס בתוך החור וליבת הבטון שהוצאה עומדת לידו"
caption: "בטון [עובי] ס״מ · קידוח יהלום [רטוב/יבש] · קוטר [קוטר] מ״מ"
consent: client permission required if the room or building is identifiable — otherwise shoot tight on the rig, the hole and the core, where nothing identifies the site
---

**Before this ships:** no `srcset` exists in this export (`images: { unoptimized: true }` +
`output: "export"`). Sprint 6 of `docs/implementation-roadmap.md` first.

**Caption warning:** `[קוטר] מ״מ` and `[עובי] ס״מ` are Latin-digit runs inside Hebrew — they need the
**`.ltr` helper** when rendered, or bidi will reorder anything that has a neutral between two numbers.

## The picture this page needs

The page argues one thing: a core drill gives **exactly the diameter you asked for, in exactly the
place you asked for, with a smooth wall a sleeve slides into** — where a breaker gives a ragged hole
that has to be filled again. So the photograph must show the hole's edge and the core that came out of
it. The core is the proof: a whole cylinder of concrete means the barrel went through cleanly.

## What is in frame

The drill stand **anchored to the slab or bolted to the wall**, the rig standing square, the barrel
part-way down a hole. Beside it on the floor, **the extracted core standing on its end or lying with
its face to camera** — reinforcement bar ends visible in it if the element was reinforced, which is
the detail a contractor will zoom in on.

If the frame allows, a **second, already finished hole** in shot: clean circular edge, smooth wall
inside, no spalling at the rim. Two holes read as work; one reads as a picture of a machine.

Everything that is really there stays: the water feed to the barrel, the collection ring or the wet
vacuum, the sheet on the floor, the marked cross where the point was set out. The wet slurry ring
around the hole is honest and it says "wet drilling" faster than any caption.

If the job is a **dry drill** in a sensitive occupied space, that is a different and equally good
frame: the vacuum hose clamped to the shroud, no water anywhere, a clean dry floor. Change `[רטוב/יבש]`
in the caption and change `altHe` to `מקדח יהלום עם שאיבת אבק צמודה בקידוח יבש בקיר בטון`.

## Where the camera stands

**About 1.5 metres back, slightly to the side of the rig** so the stand does not hide the hole, phone
**landscape and level**. Get down to roughly the height of the drill motor rather than shooting from
standing height down at the floor — a top-down frame flattens the hole into a grey circle and loses
the depth.

Second frame, closer: **straight down the axis of a finished hole**, close enough that the smooth inner
wall and the sharp rim fill most of the frame, with the core standing next to it for scale. This is
the strongest single image this service has.

Light: site light. If the hole is in shadow, have someone hold the phone light **off to one side and
above** so the rim casts a small shadow into the hole — a light straight down the axis flattens it.

## What must survive the cover crop

- **The rim of the hole and the core belong in the middle band**, side by side, not at the edges.
- Do not compose so the interesting part sits in a corner — the crop takes corners first and there is
  no focal-point mechanism in this codebase to save it.
- At 320px a 50mm hole photographed from three metres away is a dot. Get close. Fill the frame with
  the hole, the barrel and the core, and let the room be a background.
- Keep the horizon of the floor roughly level; a tilted floor line reads as a snapshot.

## What must stay out of frame

- Anyone's face other than אור שוורץ. Hands on the rig, yes — faces, no.
- Licence plates, apartment numbers, nameplates, buzzer panels, street views through a window that
  identify the address, a client's plan with a name in the title block, delivery notes, invoices.
- Any certificate, licence, insurance paper, badge, rating or review.
- The inside of an occupied home in a way that identifies the household — furniture, photographs,
  post, children's things.
- Unsafe practice: an unanchored stand, someone holding a large rig by hand, no eye protection where
  eye protection belongs.

## How to send it

Original file, largest size, **no crop, no filter, no blur effect**. In the message tell us the three
caption facts — **element and thickness, wet or dry, hole diameter** — plus whether the client agreed
to publication. If it was a prestressed slab, say so; that photograph needs extra care and probably
should not be published at all.

**EXIF:** strip before the file enters the repo (roadmap 6.4). It carries the client's coordinates.
