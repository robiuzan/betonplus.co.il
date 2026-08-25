---
name: performance-web-vitals
description: Core Web Vitals for the betonplus static export on Cloudflare Pages — the render-blocking Google Fonts link with no preload, the image pipeline that images.unoptimized disables and which becomes urgent the moment real photos ship, the CSS-gradient hero and what the LCP element actually is, the INP client-JS budget, and keeping out/ clean. Use before shipping or when LCP, CLS or INP regress. Triggers: "perf pass", "Core Web Vitals", "LCP slow", "image optimization", "bundle size", "srcset".
---

# Core Web Vitals

Static HTML on Cloudflare's edge — TTFB and caching are already good. `out/` is 3.9 MB with **no `.js`
over 1 MB**, so this repo has none of the dev-chunk pollution the fleet has hit elsewhere. The real
issues are fonts, and an image pipeline that isn't a problem yet but will be.

## Fonts — the live cost today

`app/layout.tsx:58-65` loads Heebo + Assistant from Google Fonts via a `<link rel="stylesheet">`, with
`preconnect` to both origins and `display=swap`. **There is no `rel="preload"`**, so both families FOUT
on first paint on every page, and the stylesheet is a render-blocking third-party request on the
critical path (backlog §10.2).

The `<link>` approach is deliberate — the comment in the layout explains it keeps the build gate
reproducible offline and avoids the App-Router `no-page-custom-font` false positive. That reasoning
holds; the fix is not to switch to `next/font` but to preload the two subsets actually used above the
fold, or to self-host the two families and drop the third-party round trip entirely.

Since the hero is a CSS gradient, **the fonts are almost certainly on the LCP path** — the `<h1>` is
the LCP element on most routes. That makes this the highest-value performance item on the site.

## Images — half-installed, and dormant

`next.config.ts` sets `images: { unoptimized: true }`, so any `next/image` renders a bare `<img>` with
**no srcset**. Verified: `grep -c srcset out/index.html` → **0**.

This costs nothing today because the site ships almost no imagery — `public/` holds brand assets and
the hero is `.hero-grad`, a pure CSS gradient. **It becomes the top item the moment `docs/business-facts.md`
§D photos land** (backlog §7.2, §10.1). Plan the pipeline before shipping photos, not after.

`@ishub/site-kit` already ships a complete Cloudflare-backed pipeline that is entirely unused here:

```ts
import { SiteImage } from "@ishub/site-kit/components";
import { mediaUrl, srcsetFor, preloadPropsFor } from "@ishub/site-kit/media";
```

`SiteImage` emits a real `srcset` against Cloudflare `/cdn-cgi/image` transforms and **requires a
non-empty `alt` at compile time**. `preloadPropsFor()` generates the LCP preload. The zone is
Cloudflare-proxied (`public/cdn-cgi/` exists), so the transform path is available.

Two viable routes — pick one deliberately, don't mix:

1. **Adopt `SiteImage`** for content imagery. This is what the kit exists for and what the manifest's
   `images.mediaHost` (`imgquarry.com`) is already configured for.
2. **Pre-generate width variants** and hand-write `srcset`. More files to manage, no host dependency.

Either way, **never pass a `sizes` prop to an unoptimized image** — it looks correct in review and does
nothing.

## LCP

- The hero is `.hero-grad`, a radial + linear gradient in `app/globals.css`. No image download, no
  decode. That is a genuinely good starting position.
- **Confirm what the LCP element actually is per route type** before optimizing anything — on this site
  it is most likely the `<h1>`, which makes it a font problem, not an image problem.
- At most one `priority`/preloaded image per page, ever.

## JS budget (INP)

- `components/Header.tsx` is `"use client"` for **one boolean** (the mobile menu), shipping the whole
  nav and button tree to the client on every page (backlog §10.3). Small here, but it is the pattern
  to avoid repeating.
- `components/ContactForm.tsx` genuinely needs client — state, fetch, form handling.
- `components/ThemeScripts.tsx` is `"use client"` and part of the **dead snapshot layer**. Its only
  consumer is `components/SiteFrame.tsx:11`, which **nothing under `app/` imports** — so the whole
  chain ships nothing. Don't "optimize" it; it isn't running.
- `components/Faq.tsx` renders all answers unconditionally with no client JS. Keep that — it is both
  fast and what makes the `FAQPage` schema valid (`/schema-structured-data`).

## CLS

Currently sound: the sticky `FloatingCTA` has its `pb-16 lg:pb-0` spacer on `<main>`, and there is
essentially no imagery to shift. Preserve both properties when adding sections — any new
above-the-fold image needs its box reserved with explicit `width`/`height` or an `aspect-ratio` parent.

## Build hygiene

Keep release builds clean:

```bash
rm -rf .next out && npm run build
```

The fleet has repeatedly shipped multi-MB dev-only chunks (`main.js`, `fallback/*`) from a polluted
`.next/` surviving into an export. betonplus is currently clean — the `rm -rf` is what keeps it that
way, and the deploy script does it for a second reason (the vendored tarball cache trap).

## Measuring

Reading the artifact is not measuring a browser. For real numbers run Lighthouse or PSI against the
**live** URL on the mobile profile, and check field data in Search Console where available. Test the
homepage **and** a service page — they have different LCP elements.

## Checklist

- [ ] Fonts preloaded (or self-hosted); no unnecessary render-blocking third-party CSS.
- [ ] The LCP element per route type is identified and sized for the viewport.
- [ ] Content images emit a real `srcset` (or `sizes` has been removed as misleading).
- [ ] At most one `priority` image per page.
- [ ] `out/` contains no unreferenced file over 1 MB.
- [ ] No `"use client"` without a stated reason.
- [ ] CLS reserves intact for every new block.

```bash
find out -name '*.js' -size +1M -exec ls -lh {} \;   # expect nothing
grep -c 'srcset' out/index.html
du -sh out                                           # ~3.9 MB baseline
```
