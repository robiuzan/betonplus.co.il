---
name: seo-metadata
description: Per-route metadata for betonplus — pageMetadata() in lib/seo.ts, the two title mechanisms (layout template vs absoluteTitle) and how to avoid a doubled brand, self-referencing trailing-slash canonicals, OG/Twitter from the build-time share card, Search Console verification drift, and deriving sitemap.ts from the data arrays instead of a hand-maintained list. Use when writing metadata for a route, fixing duplicate or doubled titles, or auditing on-page SEO. Triggers: "set the metadata", "titles and descriptions", "canonical", "double brand suffix", "sitemap", "one H1".
---

# Per-route SEO metadata

Formulas live in `docs/keyword-map.md` §3–§5. This skill is the mechanics.

## Everything goes through `pageMetadata()`

`lib/seo.ts` is the only place that builds a `Metadata` object. It sets title, description, canonical,
Open Graph and Twitter in one call, and points OG/Twitter at the build-time share card
(`app/opengraph-image.tsx`) so every route emits one deterministic image.

```ts
export const metadata: Metadata = pageMetadata({
  title: "מחירון ניסור וקידוח בטון",
  description: "…150–160 chars…",
  path: "/pricing/", // leading AND trailing slash
});
```

Never hand-write `alternates`, `openGraph` or `twitter` on a page. If something is missing, add it to
`pageMetadata` so all 15 routes get it.

## The two title mechanisms — get this right

`app/layout.tsx` sets:

```ts
title: {
  default: `${site.name} | ניסור בטון וקידוח יהלום מדויק`,
  template: `%s | ${site.name}`,
}
```

So there are two valid patterns, and exactly one wrong one:

```ts
// ✅ static pages — bare subject, template appends the brand
pageMetadata({ title: "מחירון ניסור וקידוח בטון", … })
//    renders: מחירון ניסור וקידוח בטון | בטון פלוס

// ✅ service pages — metaTitle already carries the brand, so bypass the template
pageMetadata({ title: svc.metaTitle, absoluteTitle: true, … })
//    renders: ניסור קירות בטון ופתיחת פתחים | בטון פלוס

// ❌ brand in the subject AND the template appending it
pageMetadata({ title: `${svc.title} | ${site.name}`, … })
//    renders: … | בטון פלוס | בטון פלוס
```

Copying the wrong sibling is how the doubled suffix appears. Check which mechanism the page next door
uses before you copy it.

The historical case: `/about/` once rendered `אודות בטון פלוס | בטון פלוס` because its subject
contained the brand. Fixed 2026-08-17 — the subject is the bare `אודות`. Zero doubled-brand titles
exist in the export now; the gate greps for them on every build.

## Titles

| Route    | What you write                                      |
| -------- | --------------------------------------------------- |
| Home     | the absolute title, set once in `app/layout.tsx`    |
| Service  | `services[].metaTitle` + `absoluteTitle: true`      |
| Location | `ניסור בטון ב${city}` (silo doesn't exist yet)      |
| Static   | the page's own subject — `מחירון ניסור וקידוח בטון` |
| Article  | the question verbatim                               |

Keep the **rendered** title under ~60 chars. `/service-areas/` is currently over (backlog §2.2).

## Descriptions

150–160 chars, unique per route, following keyword-map §5: service + place, one **true**
differentiator, then an action with the phone. Include `055-6601006` — this is a call-first business
and the SERP snippet is a conversion surface.

Only claim what `docs/business-facts.md` confirms. `+1,000 פרויקטים` and ביטוח צד ג׳ are 🔶 and must
stay out of metadata.

## Canonicals

`pageMetadata()` sets `alternates.canonical` from `path`, absolute against `site.url`. Every route
passes its own; there is no inheritance. Both slashes are required — a missing trailing slash splits
signals against the exported directory URL.

Verified state: all 15 content routes carry exactly one self-referencing canonical. Only `/404/` and
`/_not-found/` lack one, which is correct.

## Sitemap

`app/sitemap.ts` derives everything (since 2026-08-17): service URLs from `services` and static
routes from the exported **`staticRoutes`** const in `lib/site.ts`. A new static page must be added to
`staticRoutes` — that is the single registry, and the build gate's parity check catches drift.
`/thank-you/` is noindex and deliberately absent from it.

It also emits no `lastModified` at all (§1.2). Adding build time would be worse than nothing — every
URL would look freshly changed on every deploy. Use a real per-route date or leave it out.

**Never hand-maintain a second URL list anywhere.**

## Robots

`app/robots.ts` emits a blanket allow plus the sitemap. **Be aware it is not what serves** —
Cloudflare prepends a managed block at the edge that blocks every major AI crawler. See
`/aeo-answer-content`. Changing `robots.ts` does not change the live policy.

## Verification and OG

- Search Console: the token lives in the **roster manifest** (`analytics.googleSiteVerification`,
  moved 2026-08-17), synced into `site.config.json`, and read from the manifest in `app/layout.tsx` —
  it renders nothing when the manifest value is null, so cloned sites don't inherit it. Change it in
  the roster, then sync; never edit `site.config.json` directly.
- OG/Twitter images come from `app/opengraph-image.tsx` via `lib/seo.ts`. The manifest also carries a
  hosted OG card (`images.og` on `imgquarry.com`) which `app/layout.tsx` uses for the root — two
  sources for one job, worth unifying.
- `brand.themeColor` is read (`viewport.themeColor`), but `brand.secondary` and `brand.accent` are
  `null` in the manifest while `app/globals.css` defines `--color-steel` and `--color-cta`. The tokens
  exist only in CSS — worth pushing upstream.

## One H1 per page

Exactly one `<h1>`, matching the title's intent. Everything else `<h2>`/`<h3>`, no skipped levels.
Currently correct on all 15 routes — keep it that way.

## Checklist

- [ ] Metadata built by `pageMetadata()`, not hand-assembled.
- [ ] The brand appears exactly once in the rendered `<title>`.
- [ ] Description unique, 150–160 chars, claims nothing 🔶, includes the phone.
- [ ] `path` has both slashes.
- [ ] The route is reachable from `app/sitemap.ts` without editing an array by hand.
- [ ] Exactly one `<h1>`; heading order unbroken.
- [ ] `npm run build`, then `grep -rho '<title>[^<]*</title>' out --include=index.html | sort | uniq -c`
      and confirm no brand appears twice and no title repeats.

## Gotchas

- Don't set `metadataBase` per page — it's set once in `app/layout.tsx`.
- `params` is a `Promise` in Next 16: `const { slug } = await params` inside `generateMetadata`.
- A page with no `export const dynamic = "force-static"` is the odd one out — every route here has it.
