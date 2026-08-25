@AGENTS.md

# CLAUDE.md — בטון פלוס (betonplus.co.il) project rulebook

> The operating manual for any AI agent (and human) working in this repo. Project rules here
> **override** global defaults. When this file and the code disagree, fix the code. When this file and
> `Israeli services sites/roster/sites/betonplus.json` disagree about a business fact, **the roster
> wins**.

---

## 1. Business context

- **Business:** בטון פלוס — diamond concrete **cutting, coring and controlled demolition**
  (ניסור בטון / קידוח יהלום). No street address is published; the manifest carries region only
  (`addressRegion: מרכז`, `addressCountry: IL`).
- **Phone (click-to-call):** `055-6601006` · WhatsApp same number · `info@betonplus.co.il`.
- **Hours:** ראשון–חמישי 07:00–18:00, שישי 07:00–13:00.
- **Service area:** גוש דן והמרכז. 5 services, 16 named areas — **no location pages exist yet**.
- **Audience:** renovation contractors, builders, engineers and project managers first; homeowners and
  ועדי בתים second. That order shapes the copy — B2B buyers want tolerances, access and scheduling.
- **Core promise:** precise diamond cutting — open the opening without harming the structure, with
  minimal noise and dust, on schedule, insured.
- **Conversion goals, in order:** (1) phone call, (2) WhatsApp, (3) lead form. Every page keeps a
  call/WhatsApp action within reach; `FloatingCTA` is sticky on mobile.

> ⚠️ Several claims on this site are **not substantiated**. Pricing (`₪150 למ״ר`, `₪190 למ׳`), the
> `+1,000 פרויקטים` counter and the ביטוח צד ג׳ claim are all marked `// 🔶 confirm`. See
> [docs/business-facts.md](docs/business-facts.md). The three **fabricated testimonials** that used to
> ship on `/reviews/` and the homepage were **removed 2026-08-17** along with the route
> (`public/_redirects` 301s the old URL). **Never present an unconfirmed value as fact, and never
> write a fake review — reviews return only as real, attributed quotes.**

---

## 2. Golden rules

1. **Never fabricate a business fact.** Years in business, prices, project counts, insurance, licences,
   ratings, reviews, certifications, customer names. If it is not in the roster manifest or
   `lib/site.ts`, mark it `// 🔶 confirm` and add a row to
   [docs/business-facts.md](docs/business-facts.md). Fabricated reviews or ratings are a Google policy
   violation, not merely a style problem — this repo shipped three invented testimonials once
   (removed 2026-08-17) and must never do it again.
2. **Never edit `site.config.json` directly.** It is synced downstream from
   `Israeli services sites/roster/sites/betonplus.json`. Edit the roster, then sync.
3. **The snapshot/enrich pipeline is vestigial — do not build on it.** `scripts/*.mjs`,
   `content/site.json` (1.1 MB), `lib/content.ts`, `lib/wp.ts`, `lib/enrich/`, `app/enrich.css` and
   `components/{SiteFrame,SiteAssets,ThemeScripts}.tsx` are leftovers from the abandoned WordPress 1:1
   port. **Nothing under `app/` imports them.** The live site is the brief-driven build described in §4.
4. **Pushing to `main` does not deploy.** Deploys are `wrangler` direct-upload to Cloudflare Pages —
   see §10. `.github/workflows/deploy.yml` is **build-gate CI only** (the GitHub Pages publish steps
   were removed 2026-08-17).
5. **No page ships under the content bar in [docs/content-standards.md](docs/content-standards.md).**
   A service or location page a find-and-replace could regenerate is a doorway page.
6. **Business facts come from `lib/site.ts`, never hardcoded in components.** Import `site`,
   `services`, `serviceAreas`, `telHref`, `whatsappHref`.
7. **A GTM snippet in the HTML proves nothing.** Whenever a container id changes, assert
   `https://www.googletagmanager.com/gtm.js?id=<ID>` returns **200**. Two fabricated ids cost the IL
   fleet 18 days of zero analytics across every site. `GTM-KWGGH438` is verified and live here.
8. **Never edit generated or vendored output** — `node_modules/`, `vendor/`, `.next/`, `out/`,
   `out.prev/`, `content/site.json`.

---

## 3. Stack

Next.js **16.2.9** App Router · React **19** · TypeScript strict (`noUncheckedIndexedAccess` is **not**
on — don't assume it) · Tailwind **v4** (CSS-first `@theme` in `app/globals.css` — there is no
`tailwind.config.ts`; the **full** framework including preflight is imported) · a hand-rolled inline-SVG set in
`components/Icon.tsx` (**`lucide-react` is a declared but entirely unused dependency**) · `@ishub/site-kit` (vendored tarball). Flat layout (no `src/`), path alias
`@/* -> ./*`.

**`next.config.ts` — the constraints that shape everything:**

```ts
output: "export",          // static HTML into out/
trailingSlash: true,       // every URL ends in /
images: { unoptimized: true },
transpilePackages: ["@ishub/site-kit"],
```

**Static export forbids** `headers()`, `redirects()`, `rewrites()`, middleware, API routes, server
actions and ISR. Response headers come from `public/_headers` at the Cloudflare edge (HSTS,
X-Frame-Options, Permissions-Policy, report-only CSP — shipped 2026-08-17, live after the next
deploy) and redirects from `public/_redirects` — see `/web-security-headers`.

Next 16 specifics that bite: `params` is a **`Promise`** in `generateMetadata` and page components
(`await params`), and routes opt in with `export const dynamic = "force-static"`. Read
`node_modules/next/dist/docs/` before touching routing, metadata or image APIs.

---

## 4. Layout

```
app/
  layout.tsx              # metadata template, fonts, GTM, LocalBusiness JSON-LD, <html lang="he-IL" dir="rtl">
  page.tsx                # homepage
  sitemap.ts robots.ts    # /sitemap.xml, /robots.txt
  opengraph-image.tsx     # build-time 1200x630 share card
  services/page.tsx       # services index
  services/[slug]/        # 5 pages — Service + BreadcrumbList JSON-LD
  pricing/ service-areas/ about/ faq/ contact/ privacy/ accessibility/
  thank-you/              # noindex conversion target — form navigates here; not in sitemap
components/
  ui.tsx                  # Section, SectionHeading, Button — the primitives
  Header Footer FloatingCTA PageHero CtaBanner ContactSection ContactForm
  Hero TrustBar ServicesGrid WhyUs ProcessSteps Faq ServiceAreasSection
  Icon JsonLd
  SiteFrame SiteAssets ThemeScripts   # ⚠️ vestigial, unused — see §2 rule 3
lib/
  site.ts        # ⭐ manifest facade + ALL Hebrew content: services[5], faqs, staticRoutes,
                 #   serviceAreas[16], navItems, trustStats, processSteps, differentiators
  seo.ts         # ⭐ pageMetadata() + JSON-LD builders over @ishub/site-kit/seo
  content.ts wp.ts enrich/   # ⚠️ vestigial WordPress snapshot layer
site.config.json # SiteManifest — SYNCED FROM THE ROSTER, do not edit here
docs/            # the acceptance bars every agent cites
```

Note the naming trap: **`lib/site.ts` is the live content source; `lib/content.ts` is the dead
snapshot reader.** The names are the wrong way round relative to the rest of the fleet.

Place by responsibility: reusable primitive → `components/ui.tsx`; page section → its own component in
`components/`; business fact or copy → `lib/site.ts`.

---

## 5. Data flow & source of truth

```
Israeli services sites/roster/sites/betonplus.json   ← EDIT HERE for NAP/brand/schema/analytics
        │  (ops sync)
        ▼
site.config.json  (SiteManifest)                     ← never edit directly
        │
        ▼
lib/site.ts    manifest · site · services · serviceAreas · navItems · telHref · whatsappHref
        │      + faqs · reviews · trustStats · processSteps · differentiators
        ├── lib/seo.ts     pageMetadata() · localBusinessJsonLd() · serviceJsonLd()
        │                  · faqJsonLd() · breadcrumbJsonLd()
        ▼
app/**/page.tsx  →  components/**
```

Rule of thumb: **identity and NAP go up the chain to the roster; wording goes in `lib/site.ts`;
layout goes in components.** Copy never gets typed directly into JSX.

---

## 6. RTL & localization — NON-NEGOTIABLE

- `<html lang="he-IL" dir="rtl">` is set in `app/layout.tsx`. Do not remove it.
- Israeli formats: phone as the manifest writes it — `055-6601006` (`0XX-XXXXXXX`) — currency `₪`,
  dates `dd/mm/yyyy`.
- **Logical Tailwind utilities ONLY** for horizontal spacing/positioning: `ps-*`/`pe-*`, `ms-*`/`me-*`,
  `start-*`/`end-*`, `text-start`/`text-end`, `space-x-reverse`.
  **BANNED:** `pl-* pr-* ml-* mr-* left-* right-* text-left text-right`. The only exception is a
  genuinely direction-agnostic case, which must carry an explanatory comment. `components/` and `app/`
  are currently **clean** of these — keep them that way.
- Let `dir="rtl"` mirror flex/grid — don't force `flex-row-reverse` except to wrap an LTR island.
- Latin/LTR snippets inside Hebrew (phone, email, URL, price) get isolated — use the **`.ltr` helper
  in `app/globals.css`** (`direction: ltr; unicode-bidi: isolate`) rather than repeating the
  attribute. The phone is isolated everywhere it renders as of 2026-08-17; keep any new occurrence
  isolated too.
- Hebrew punctuation: use גרש `׳` and גרשיים `״`, not straight quotes, in Hebrew abbreviations.
- Keep user-facing strings Hebrew. Don't mix languages mid-sentence.

See the `rtl-hebrew` skill for the full rule set.

---

## 7. Code style

- **TypeScript strict.** No `any` (use `unknown` + narrowing). No non-null `!` to silence the
  compiler — handle the null case.
- **RSC by default.** Add `"use client"` only for state, effects, or browser APIs. Keep client
  components small and leaf-level. Currently client: `Header`, `ContactForm`, `ThemeScripts` (unused).
- Imports use the `@/*` alias. No `../../..` chains.
- Tailwind utilities only, **mobile-first**. Use the `@theme` tokens (`brand`, `steel`, `cta`, `ink`,
  `muted`, `mist`, `line`, `font-heading`, `font-body`) — **never hardcode brand hex in components**.
  Repeated multi-utility patterns live as `.btn`, `.card`, `.section`, `.container-x` in the
  `@layer components` block of `app/globals.css`.
- Components PascalCase; utilities camelCase.
- Every route sets `export const dynamic = "force-static"`.

---

## 8. SEO, schema, images

- **One `<h1>` per page**, matched to search intent. Everything else `<h2>`/`<h3>`, no skipped levels.
  Currently correct on all content routes.
- **Titles:** the root `template` in `app/layout.tsx` appends `| בטון פלוס`. A page's own `title` must
  therefore **never append the brand again**. Service pages pass `absoluteTitle: true` with a
  `metaTitle` that already carries the brand — that is deliberate, and the two mechanisms must not be
  combined. Zero doubled-brand titles exist in the export (the historical `/about/` case was fixed
  2026-08-17 — its subject is now the bare `אודות`). See the `seo-metadata` skill.
- **Canonicals:** self-referencing, trailing slash, emitted by `pageMetadata()` in `lib/seo.ts`. Every
  content route has one; only `/404/` and `/_not-found/` do not, which is correct.
- **JSON-LD** is built with `@ishub/site-kit/seo` via `lib/seo.ts` — `localBusinessJsonLd`,
  `serviceJsonLd`, `faqJsonLd`, `breadcrumbJsonLd`. Target graph:
  [docs/schema-graph.md](docs/schema-graph.md). `Review`/`AggregateRating` ship **only** when sourced —
  currently absent from the graph, which is correct while the visible testimonials are fake.
- **Images:** the site ships almost none — `public/brand/` plus the CSS gradient hero. There is no
  photography of real work, which is the largest trust gap on the site. `images.unoptimized` is on, so
  any content imagery added needs a real `srcset` strategy (see `/performance-web-vitals`). Every
  meaningful image needs a Hebrew `alt`; decorative gets `alt=""`.

---

## 9. Build gate

```
npm run lint && npm run typecheck && npm run format:check && npm run build
```

All four must pass before any deploy. The `qa-build-gate` skill adds the output assertions on `out/`
(route count, unique titles, one H1, canonicals, JSON-LD presence, sitemap parity, no fabricated
reviews, no oversized chunks).

---

## 10. Deploy — read this before shipping

**Production is Cloudflare Pages, direct upload via wrangler. Pushing to `main` deploys nothing.**
Verified from live response headers (`Server: cloudflare`, `cf-cache-status: DYNAMIC`, Cloudflare's
managed `robots.txt`) and the fleet roster (`hosting.target: cloudflare-pages`,
`pagesProject: betonplus`).

```powershell
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain betonplus.co.il -DryRun
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain betonplus.co.il -Confirm
```

The script does the drift check, busts the two staleness traps (npm caches `file:` tarballs; Next
caches under `.next/`), gates the output, preserves `out.prev/` for rollback, and logs the deploy.
**Deploying is a production mutation — always ask first.** See the `deploy-betonplus` skill.

`.github/workflows/deploy.yml` and `public/CNAME` are artifacts of the previous GitHub Pages host.

---

## 11. Commands

| Task             | Command                                      |
| ---------------- | -------------------------------------------- |
| Dev server       | `npm run dev`                                |
| Production build | `npm run build`                              |
| Lint             | `npm run lint`                               |
| Type-check       | `npm run typecheck`                          |
| Format / check   | `npm run format` · `npm run format:check`    |
| Snapshot (dead)  | `npm run snapshot` · `npm run enrich` — §2.3 |

---

## 12. Scope guardrails

- Implement real UI, sections, or content only when asked. Don't opportunistically redesign.
- Don't build the location silo until the 5 service pages clear the depth bar in
  [docs/content-standards.md](docs/content-standards.md).
- Don't add dependencies without a reason that survives "can the platform already do this?"
- Don't put PII in `dataLayer`.
- Cloudflare zone settings (AI crawler policy, Scrape Shield, cache rules) are **the owner's to
  change**. Document the exact toggle; never assume it was done.
