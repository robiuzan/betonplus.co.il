---
name: react-components
description: React 19 + strict-TypeScript component patterns used in betonplus — server vs client components, "use client" and the ThemeScripts replay pattern, safe dangerouslySetInnerHTML, no any, @/* imports, and keeping /components modular. Use when adding or changing a component.
---

# React 19 components (this project)

Components here exist to **frame captured WordPress HTML**, not to rebuild the UI. The page chrome
(header/nav/footer/forms) is inside `page.bodyHtml`; components wrap it, inject schema, and replay theme
scripts. See `/betonplus-architecture`.

## Server vs client
- **Default to Server Components.** [components/SiteFrame.tsx](components/SiteFrame.tsx) and
  [components/SiteAssets.tsx](components/SiteAssets.tsx) are server components — they render strings/markup,
  no browser APIs.
- Add `"use client"` **only** when you need the browser (events, effects, `window`).
  [components/ThemeScripts.tsx](components/ThemeScripts.tsx) is the lone client component: it replays the
  theme's captured `<script>`s sequentially (`async:false` to preserve order; guarded by
  `window.__siteScriptsStarted` so it is safe under React StrictMode).

## Rendering captured HTML safely
```tsx
<div className={page.bodyClass} dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
```
- This is intentional and load-bearing for the 1:1 port. The HTML comes from **our own scraper**
  ([scripts/scrape.mjs](scripts/scrape.mjs)) over a site we control — not user input — so it's trusted.
- Don't interpolate untrusted/runtime data into `__html`. JSON-LD is emitted the same way from
  `page.jsonLd` (already serialized strings).

## Strict TypeScript
- **No `any` in committed code.** Model WordPress shapes with the explicit interfaces in
  [lib/wp.ts](lib/wp.ts) (`WP_Page`, `WP_Post`, `WP_Rendered`) and content shapes in
  [lib/content.ts](lib/content.ts) (`SiteData`, `SitePage`, `SeoData`). Authored content uses
  `EnrichedPage` ([lib/enrich/types.ts](lib/enrich/types.ts)).
- Type component props explicitly (`{ page }: { page: SitePage }`). Prefer `unknown` + narrowing over `any`
  at boundaries.
- Import via the `@/*` alias (`@/lib/content`, `@/components/SiteFrame`), not deep relative paths.

## Conventions
- Keep `/components` modular and small; one component per file, PascalCase filenames matching the export.
- Match existing code style; don't introduce a new state/data-fetching pattern — page data is read at build
  time through `lib/content.ts`, not fetched in components.
- RTL-aware classes only (`/rtl-hebrew`); styling rules in `/web-design-ui`.

## Checklist
- [ ] Server component unless it truly needs the browser.
- [ ] No `any`; props and data typed against `lib/` interfaces.
- [ ] `dangerouslySetInnerHTML` only for trusted scraper/enrich output.
- [ ] `@/*` imports; PascalCase file = export.
- [ ] `npm run build` + `npm run lint` clean (`/qa-build-gate`).
