# docs/photo-briefs/ — shot lists for the owner's camera

This site ships **zero photographs** (`business-facts.md` §D, `optimization-backlog.md` §7.2). The
work photography is an owner-supply item: real openings, real core holes, the diamond kit on a real
floor. **Never stock, never generated, never a competitor's image** —
[eeat-and-trust.md](../eeat-and-trust.md) §6.

A brief here is what the owner reads before he puts his phone in front of a job: which slot the
picture fills, what has to be in frame, what must survive a `cover` crop, what must stay out of frame,
and the Hebrew `alt` and technical caption that will ship with it.

**Written by** the `image-art-director` agent. **Slot widths and ratios** come from
`.claude/skills/page-imagery/SKILL.md` — never guessed. **Generated assets that depict nothing
readable as our work** (the share card, an abstract texture) are not briefed here; they are Media
Studio prompt files under `Media Studio/prompts/betonplus/`.

Format:

```markdown
---
slot: work-gallery-3
ratio: 3:2
rendered: ~355px at lg · 320px at a 360px viewport
alt: "Finished door opening cut in a concrete wall, the rail saw still at the edge of frame"
altHe: "פתח לדלת שנוסר בקיר בטון בעובי 20 ס״מ"
caption: "קיר בטון 20 ס״מ · מסור דיסק על מסילה · פתח 90×210 ס״מ"
consent: none needed | owner (business-facts §A) | client permission required
---

Plain physical prose: what is in frame, where the camera stands, what the hands are doing,
what light there is.
```

**A brief is not evidence.** It describes a picture that does not exist yet. Nothing in it may be
quoted on the site, and no caption here becomes a claim until the photograph it describes has actually
been taken on a real job.

## The briefs

Written 2026-09-06 for the owner's first shoot. Every caption carries `[…]` placeholders that are
filled only from the real job the photo was taken on.

| Brief                                                                                    | Slot                                                  |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [about-owner-portrait.md](about-owner-portrait.md)                                       | `/about/` avatar (renders an initial today)           |
| [service-wall-sawing.md](service-wall-sawing.md)                                         | `/services/wall-sawing/` figure                       |
| [service-core-drilling.md](service-core-drilling.md)                                     | `/services/core-drilling/` figure                     |
| [service-floor-ceiling-sawing.md](service-floor-ceiling-sawing.md)                       | `/services/floor-ceiling-sawing/` figure              |
| [service-wire-saw.md](service-wire-saw.md)                                               | `/services/wire-saw/` figure                          |
| [service-demolition.md](service-demolition.md)                                           | `/services/demolition/` figure                        |
| [work-gallery-1.md](work-gallery-1.md) · [2](work-gallery-2.md) · [3](work-gallery-3.md) | the future work gallery (roadmap 5.1, after Sprint 6) |

Before any of these ships: strip EXIF (roadmap 6.4), adopt the image pipeline (6.1–6.3), and confirm
the caption facts with the owner — a brief is not evidence.
