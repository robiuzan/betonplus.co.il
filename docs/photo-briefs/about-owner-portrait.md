---
slot: about-owner-portrait
ratio: 1:1
rendered: 56px (`h-14 w-14`, `rounded-full`) at every breakpoint — supply 112px minimum for @2x, deliver a square master of 1200px+
alt: "Or Schwartz, owner of Beton Plus, photographed on a job site in his work clothes"
altHe: "אור שוורץ, בעלים של בטון פלוס, בבגדי עבודה באתר"
caption: none — the layout renders no caption in this position (name and role already sit beside the avatar)
consent: owner (business-facts §A — אור שוורץ consented to publishing his name and photographs, 2026-08-30). No other person may appear.
---

**Before this ships:** `next.config.ts` sets `images: { unoptimized: true }` under `output: "export"`,
so the export contains **no `srcset`** and the file delivered is the file every device downloads —
Sprint 6 of `docs/implementation-roadmap.md` must land first. This is the one slot where that barely
bites (a 112px avatar is tiny), but the rule is the rule.

**This slot needs a code change before a photo can go in it.** `app/about/page.tsx:82` currently
renders `owner.name.charAt(0)` inside a `<span aria-hidden="true">`, and `Owner` in `lib/site.ts` has
**no `photo` field**. Replacing the initial with a real `<img>` — and dropping the `aria-hidden` so the
Hebrew `alt` above is actually announced — is `rtl-frontend-engineer` work, not art direction.

## What is in frame

Head and shoulders of אור, square-on to the camera, on a real job — a site he is actually working
that day, not a studio and not a driveway staged to look like one. He wears what he wears: work
trousers, a work shirt or hi-vis, dust on it if there is dust on it. Nothing borrowed, nothing new out
of the packet.

Behind him, at a distance, something that says concrete work without competing for attention: a bare
concrete wall, a marked-up wall before a cut, the tail of the rail saw, the back of the van's open
doors. It should be soft and secondary — at 56px it is a colour field, nothing more.

## Where the camera stands

Someone else holds the phone, roughly **1.5 metres away, at אור's eye level**, landscape or portrait
does not matter because the crop is square. Not from below (looks aggressive) and not from above
(looks apologetic). He looks into the lens. One frame with a slight smile, one neutral — send both and
let the owner choose.

Light: **open shade or an open doorway**, or an overcast sky. Avoid direct midday sun overhead, which
puts his eyes in two black pits, and avoid standing him in front of a bright window or a bright sky —
the phone will expose for the background and hand back a silhouette. If there is one bright side, turn
him so the light comes across his face at an angle rather than from behind.

No flash. No portrait mode, no beauty filter, no background blur effect — the phone's fake blur eats
ear edges and hard-hat brims and it looks like what it is.

## What must survive the crop

The crop here is brutal and unusual: `object-fit: cover` into a **square, then a circle** at 56px. The
corners of your frame are thrown away and everything outside the inscribed circle with them.

- His **head fills roughly the middle 55–65%** of the square, eyes about a third of the way down.
- **Generous air all round the head** — do not fill the frame with the face, and do not let the top of
  his head or a hard-hat brim touch the frame edge.
- Nothing that matters lives near a corner. There is no focal-point mechanism in this codebase;
  a subject framed off-centre is simply lost.
- Shoot it wide enough that a square can be cut out of it in either orientation without recomposing.

## What must stay out of frame

- **Any other person.** אור is the only human being who has consented to appear on this site
  (business-facts §A). A colleague, a client, a passer-by in the background — all out. A photo that
  implies a crew also implies a headcount the roster does not support.
- **Faces, licence plates, apartment numbers, door nameplates, letterbox labels, client documents,
  plans with a client's name in the title block.** Kept out at the shutter, not blurred afterwards.
- **Any certificate, licence, insurance document, badge, star rating or review** — on the wall behind
  him, in his hand, on the van. Never in frame, never as the frame.
- Anything that reads as a claim: a wall of logos, a "20 years" sticker, an award.
- Unsafe practice: a saw running in the background with nobody's eyes protected, someone standing
  under a suspended element. The site's own copy sells stopping for a signed engineering plan; a
  photograph contradicting that costs more than it earns.

## How to send it

Original file straight off the phone, largest size, **no crop applied in the phone**, no filter, no
sticker, no text overlay. Send two or three frames, not twenty.

**EXIF:** phone photos carry GPS coordinates and a device identifier. This one is taken on a client's
site, so the coordinates are a client's address. It must be **stripped before the file enters the
repo** — roadmap 6.4, `docs/performance-guidelines.md` §4.
