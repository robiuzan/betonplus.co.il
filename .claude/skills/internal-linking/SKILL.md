---
name: internal-linking
description: Build the link mesh on betonplus — relevance-based related services instead of array order, the dead-end service-area chips, service↔location cross-links once the silo exists, contextual in-copy links (currently zero), a header that reaches every service in one hop, breadcrumbs matched to BreadcrumbList, and a zero-orphan check. Use when wiring related links, fixing orphans, or auditing navigation. Triggers: "internal linking", "orphan pages", "navigation", "related links", "footer links", "breadcrumbs".
---

# Internal linking

Fifteen content pages with a healthy skeleton and almost no connective tissue. Nothing is orphaned —
but nothing is _contextually_ linked either.

## Current state (backlog §9)

| Item                               | Detail                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| ✅ Zero orphans                    | every emitted content route has an inbound internal link                                                     |
| ✅ Breadcrumbs                     | render **and** emit `BreadcrumbList` from the same crumb data on every nested route                          |
| ✅ Header + footer                 | 8 nav items reach every static page; the footer also lists all 5 services                                    |
| ⚠️ Related services by array order | `services.filter(≠self).slice(0, 3)` (`app/services/[slug]/page.tsx:40`) — the first three absorb the equity |
| ⚠️ Service-area chips              | 14 chips linking **nowhere** — a dead-end page                                                               |
| ❌ Contextual in-copy links        | **zero**. Every internal link is a nav item, a card or a chip                                                |
| ❌ Service ↔ location              | no silo exists yet                                                                                           |

## 1. Relevance-based related services

`slice(0, 3)` always yields the same three services in array order, so wall-sawing and core-drilling
hoard the internal equity and wire-saw/demolition get almost none. Replace it with an explicit
adjacency map in `lib/site.ts`:

```ts
const relatedServices: Record<string, readonly string[]> = {
  "wall-sawing": ["core-drilling", "demolition", "floor-ceiling-sawing"],
  "core-drilling": ["wall-sawing", "floor-ceiling-sawing"],
  "floor-ceiling-sawing": ["wall-sawing", "wire-saw"],
  "wire-saw": ["demolition", "floor-ceiling-sawing"],
  demolition: ["wire-saw", "wall-sawing"],
};
```

With five services the difference in reach is small; the difference in _relevance_ is not. A visitor on
the wire-saw page is far likelier to want הריסה מבוקרת than a generic next card.

## 2. The service-area chips

`/service-areas/` renders 16 area names that link nowhere. Two honest options:

- **Build the silo** (`/new-city`) and link each chip to its page — but only after the service pages
  clear the depth bar — both now done (depth in wave 2, coverage 2026-08-30). See `/local-seo-il` §5–§6.
- **Until then**, keep them as plain text and give the page a real introduction (250-word index floor,
  `docs/content-standards.md` §1) that links contextually into the service pages instead.

What you must not do is link 14 chips to 14 thin pages generated from a template. That is the doorway
pattern, and the penalty lands on the domain.

## 3. Service ↔ location cross-links (when the silo lands)

The single biggest missing edge once locations exist. On each **service** page, link 4–6 areas chosen
by proximity to the core service area, not by array order. On each **location** page, render the full
service list plus 2–4 **nearby locations** driven by a `nearby?: readonly string[]` field chosen by
real geographic adjacency. The edge is bidirectional — a one-way `nearby` link is a modelling error.

## 4. Contextual in-copy links

Zero exist today, which means the site emits no descriptive anchor text at all — only nav labels and
card titles. As the service pages gain depth (`/new-service`), each should carry 2–3 links **inside the
prose**:

- ✅ `<Link href="/services/core-drilling/">קידוח ליבות למעבר צנרת</Link>`
- ❌ "לחצו כאן", "למידע נוסף", a bare URL

Anchor text is a ranking signal, and it is the cheapest one on this list.

## 5. Header reach

The header's 8 nav items reach every static page but **not the individual services** — those are one
hop further, via `/services/`. With only five services, a simple dropdown on the שירותים item closes
that gap.

Constraints if you build it: `Header.tsx` is already `"use client"` for the mobile toggle — keep any
new state in the same leaf. Make it keyboard-operable (`aria-expanded`, `aria-controls`, Escape closes,
focus returns to the trigger). The current mobile menu has **none** of those (backlog §11.1) — fix that
in the same pass rather than copying it.

## 6. Breadcrumbs

`components/PageHero.tsx` renders the visible trail and the page feeds **the same crumb array** to
`breadcrumbJsonLd()`. That coupling is why the markup and the graph can't drift here. Preserve it in
every new page — see `/schema-structured-data`.

## 7. Hub pages

`/services/` and `/service-areas/` are the natural hubs. `/services/` is a grid; `/service-areas/` is a
chip list. Give each a real intro that links contextually into its children — for `/services/`, help
the reader choose between ניסור and קידוח; for `/service-areas/`, say something true about working
across גוש דן.

## Zero-orphan check

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/routes.txt
grep -rho 'href="/[^"]*"' out --include=index.html | sed 's|href="||; s|"$||' | sort -u > /tmp/linked.txt
comm -23 /tmp/routes.txt /tmp/linked.txt
```

Currently prints only `/404/`, `/_not-found/` and `/thank-you/` (form-navigation only, by design),
which is correct. **Target: nothing else ever.**

## Checklist

- [ ] Related services come from an adjacency map, not `slice()`.
- [ ] Every chip or card either links somewhere real or is honestly plain text.
- [ ] Every new content block carries 2–3 contextual in-copy links with descriptive anchors.
- [ ] Breadcrumbs render **and** emit `BreadcrumbList` from the same array.
- [ ] The orphan check returns nothing beyond `/404/` and `/_not-found/`.

## Gotchas

- All internal links need the trailing slash (`trailingSlash: true`), or they 301 and waste a hop.
- Adding links to a thin page doesn't fix the thin page. Depth first (`/new-service`), then the mesh.
- Use `next/link` for internal routes; a bare `<a href="/…">` costs a full page load.
