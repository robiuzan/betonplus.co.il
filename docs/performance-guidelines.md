# Performance guidelines — Core Web Vitals for a static export

Hard rules for `betonplus.co.il`: a Next 16 `output: "export"` static build served by Cloudflare Pages.
Mechanics and the current measured state live in the `/performance-web-vitals` skill and the
`perf-a11y-auditor` agent; this file is the **budget and the doctrine**.

---

## 1. Budgets — a build that exceeds one of these does not ship

| Metric                     | Budget                      | Notes                                                                           |
| -------------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| **LCP** (mobile, 4G)       | < 2.0 s (hard fail 2.5 s)   | The LCP element is the Hebrew `<h1>` — a **font** problem, not an image problem |
| **INP**                    | < 150 ms (hard fail 200 ms) | Only two interactive surfaces exist                                             |
| **CLS**                    | < 0.05 (hard fail 0.1)      | Every dynamic box must reserve its space                                        |
| **TTFB**                   | < 200 ms                    | Static asset from Cloudflare's edge; anything higher is a cache-config problem  |
| First-party JS, gzipped    | < 90 KB per route           | Today the client bundle is the two `"use client"` components                    |
| Third-party JS             | GTM only                    | Every addition needs a named owner and a budget review                          |
| Web font files             | ≤ 2 (Hebrew subset)         | Currently exactly 2 — Heebo 12 KB, Assistant 7.3 KB                             |
| Image weight per page      | < 400 KB                    | Currently ~0; becomes the binding constraint the day photos land                |
| Total page weight (mobile) | < 700 KB                    |                                                                                 |

Measure on a **throttled mobile profile**, not on the dev machine. Field data (CrUX / GA4) beats lab
data whenever the two disagree — but GA4 is not yet receiving anything
([data-tracking-infrastructure.md](data-tracking-infrastructure.md) §2), so lab is currently all we have.

---

## 2. The critical path, as it actually is

```
HTML (static, Cloudflare edge)
  |-- <head>: inline GTM snippet   -> async gtm.js (third party)
  |-- preconnect fonts.googleapis / fonts.gstatic / media host
  |-- preload  Heebo woff2 + Assistant woff2   (Hebrew subsets, React 19 preload())
  |-- stylesheet fonts.googleapis.com/css2 ... &display=swap   [RENDER BLOCKING]
  |-- app CSS (Tailwind v4, full framework incl. preflight)
  +-- LCP: the Hebrew <h1> over .hero-grad (pure CSS gradient, no image)
```

Three consequences that drive every decision below:

1. **There is no hero image.** The LCP element is text, so LCP is governed by **font delivery**, not by
   images. Confirm this per route type before "optimising images" for LCP.
2. **The Google Fonts stylesheet is render-blocking.** The two Hebrew-subset `woff2` files are
   preloaded to remove a round trip from the critical path — without the preload the browser only
   discovers them after fetching _and parsing_ the stylesheet.
3. **`display=swap` is deliberate.** Text paints immediately in the fallback and swaps. This trades a
   small CLS risk for a large LCP win; keep the fallback stack metrically close in `@theme`.

### Font rules

- **Never add a third family.** Two (Heebo headings, Assistant body) is the ceiling.
- **Never add a weight** without deleting one. The current request is Assistant 400/500/600/700 and
  Heebo 400/500/700/800/900 — already generous.
- The preload URLs are **version-pinned by Google** (`/v28/`, `/v24/`). A stale preload is harmless
  (the stylesheet still loads the right file, one request wasted) but stops helping.
  `/qa-build-gate` §12 re-checks them; refresh when it reports a miss.
- **Do not migrate to `next/font`** without deliberate cause: the `<link>` approach keeps the build
  free of a build-time network fetch, which keeps CI and offline builds reproducible.

---

## 3. JavaScript budget

**RSC by default.** `"use client"` is a cost, paid on every route that renders the component.

Current client components:

| Component      | Why client                    | Cost                                                     |
| -------------- | ----------------------------- | -------------------------------------------------------- |
| `Header`       | Mobile menu open/close state  | Ships the whole nav tree to the client on **every** page |
| `ContactForm`  | Form state, validation, fetch | Justified — it is genuinely interactive                  |
| `ThemeScripts` | —                             | **Vestigial, imported by nothing.** Do not revive it     |

**Rules:**

- Adding `"use client"` requires a one-line justification in the component's doc comment.
- Keep client components **leaf-level**. Never mark a page or a layout.
- Prefer CSS over JS: the mobile menu could be a `<details>`/checkbox disclosure and drop `Header` back
  to a server component — a real ⚪ win, not urgent.
- No animation library, no carousel library, no icon package. `components/Icon.tsx` is a hand-rolled
  inline SVG set precisely so no icon font or package ships. **`lucide-react` is a declared but
  entirely unused dependency** — do not start importing from it.
- Every new dependency must survive: _can the platform already do this?_

---

## 4. Images — the pipeline that must exist before the first photo

**Today:** `images: { unoptimized: true }` and **zero `srcset` in the export**. Harmless while the site
ships only two brand SVGs and a CSS gradient. It becomes the site's worst performance problem the day
[eeat-and-trust.md](eeat-and-trust.md) §6 photography arrives.

`output: "export"` means **Next's image optimiser does not run**. Nothing generates responsive variants
for you. Therefore, before any photo ships:

1. **Generate variants at build time or ahead of it** — 400 / 800 / 1200 / 1600 px wide, AVIF with a
   WebP fallback, plus a JPEG of last resort.
2. **Author real `srcset` + `sizes`** on every content image. `sizes` must reflect the actual layout
   width, not `100vw` copied from an example.
3. **Always set `width` and `height`** (or an aspect-ratio box). An unsized image is a CLS event.
4. **`loading="lazy"` + `decoding="async"` everywhere below the fold**; the first in-viewport image (if
   one ever becomes the LCP element) gets `fetchpriority="high"` and **no** lazy attribute.
5. **Strip EXIF** — job photos carry GPS coordinates and device identifiers.
6. Compress to the §1 budget. A gallery is not exempt: paginate or lazy-load it.

Alternative worth considering when the volume justifies it: serve photos through **Cloudflare Images /
Image Resizing** at the edge and keep the repo free of binary variants. That is an infrastructure
decision for the owner, not a repo change.

**Brand SVGs:** keep them optimised and inline-able; never ship a raster logo.

---

## 5. CLS discipline

The layout is text and CSS today, so CLS is near-zero. It regresses through exactly four doors:

1. **Unsized media** — see §4.3.
2. **Font swap** — mitigated by `display=swap` plus a close fallback stack. Do not remove `system-ui`
   from `--font-heading` / `--font-body`.
3. **Late-injected UI** — a banner, a consent bar, a promo. Anything injected after paint must be
   **fixed/overlaid**, never inserted into flow. This is the rule that constrains the personalization
   ideas in [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md).
4. **The sticky mobile bar** — already accounted for: `<main>` carries `pb-16 lg:pb-0` so the fixed bar
   never covers content. Preserve that padding if the bar's height changes.

---

## 6. Caching & delivery

- **Static HTML + hashed assets on Cloudflare Pages.** Hashed build assets are immutable — long
  `max-age` is safe. HTML must stay short-lived so a deploy is visible immediately.
- The live site has been observed returning `cf-cache-status: DYNAMIC` for HTML. That is acceptable
  (TTFB is still edge-fast) but it means **HTML is not being served from cache** — worth a cache-rule
  review with the owner if TTFB ever exceeds budget.
- **Deploys are wrangler direct upload.** Pushing to `main` deploys nothing. Two staleness traps the
  deploy script busts: npm caches `file:` tarballs, and Next caches under `.next/`. A "perf fix that
  didn't take effect" is usually one of those.
- Keep `out/` clean: no `out.prev/`, no stray SVGs from the Next starter (`file.svg`, `globe.svg`,
  `next.svg`, `vercel.svg`, `window.svg` are still in `public/` and ship for no reason), no 1.1 MB
  `content/site.json` — that one lives outside the export, but it is dead weight in the repo.

---

## 7. Before every deploy

```
npm run lint && npm run typecheck && npm run format:check && npm run build
```

Then, on `out/`:

- [ ] No route's first-party JS exceeds the §1 budget.
- [ ] No new render-blocking resource in `<head>`.
- [ ] The two font preloads still return 200.
- [ ] Every `<img>` has `width`/`height` and a `srcset` when it is a photograph.
- [ ] Lighthouse mobile ≥ 90 Performance on `/`, one service page, and `/contact/`.
- [ ] No third-party script was added without a CSP entry
      ([ux-cro-security.md](ux-cro-security.md) §6).

After deploy, verify against the live origin — a local build proves nothing about the edge.
