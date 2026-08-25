---
name: legacy-wordpress-layer
description: Reference for the retired WordPress 1:1 snapshot and enrichment pipeline in this repo — scripts/*.mjs, content/site.json, lib/content.ts, lib/wp.ts, lib/enrich/, app/enrich.css and the SiteFrame/SiteAssets/ThemeScripts components. Explains what it was, that nothing under app/ imports it, and why not to build on or resurrect it. Use when you encounter one of those files, are asked about the snapshot/enrich npm scripts, or are deciding whether to delete them. Triggers: "what is content/site.json", "npm run snapshot", "scrape.mjs", "SiteFrame", "enrich", "why is this file here".
---

# The retired WordPress layer

**Status: dead code. Nothing under `app/` imports any of it. Do not build on it.**

This repo began as a strict 1:1 WordPress→Next port of the old betonplus.co.il (`zapo` theme). That
approach was abandoned in favour of the brief-driven designed site (`brief.md`, commit _"Build
brief-driven betonplus marketing site"_). The migration machinery was never removed.

This skill exists so that encountering one of these files doesn't send you down the wrong path.

## What's in it

| File / dir                                                     | What it did                                                                                                                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/scrape.mjs`                                           | fetched each live page's rendered HTML, vendored same-origin assets into `public/` at their original paths, rewrote links, extracted SEO → `content/site.json` |
| `scripts/transform.mjs`                                        | rewrote Contact Form 7 → FormSubmit (no backend in a static export)                                                                                            |
| `scripts/build-manifest.mjs`                                   | classified pages (service / brand-key / location / core), built a related-link index                                                                           |
| `scripts/enrich.mjs`                                           | injected authored `content/enriched/<id>.mjs` HTML + SEO + JSON-LD                                                                                             |
| `content/site.json` (1.1 MB)                                   | the snapshot — the old build-time source of truth                                                                                                              |
| `lib/content.ts`                                               | typed reader for that snapshot (`SiteData`, `SitePage`, `SeoData`, `buildMetadata`)                                                                            |
| `lib/wp.ts`                                                    | WordPress REST types                                                                                                                                           |
| `lib/enrich/types.ts`, `lib/enrich/render.mjs`                 | the `EnrichedPage` authoring schema and its HTML block renderers                                                                                               |
| `app/enrich.css`                                               | styling for the authored blocks                                                                                                                                |
| `components/SiteFrame.tsx` `SiteAssets.tsx` `ThemeScripts.tsx` | rendered `bodyHtml` via `dangerouslySetInnerHTML` and replayed theme scripts                                                                                   |
| `npm run snapshot` · `npm run enrich`                          | the two pipeline entry points                                                                                                                                  |

## Why it's still here

`content/site.json` is the only remaining record of the original WordPress content. That is the sole
argument for keeping any of it. Everything else is inert.

## Rules

1. **Don't run `npm run snapshot` or `npm run enrich`.** `scrape.mjs` fetches
   `https://betonplus.co.il` — which now serves the _new_ site — and would overwrite the snapshot with
   a copy of the current build, destroying the only record of the original content.
2. **Don't import from it.** `lib/content.ts` is not the content file; **`lib/site.ts` is.** The names
   are the wrong way round relative to the rest of the fleet — check the import, not the filename.
3. **Don't take patterns from it.** `SiteFrame`'s `dangerouslySetInnerHTML` of captured markup and
   `ThemeScripts`' sequential script replay were correct for a 1:1 port and are wrong here. `enrich.css`
   contains `.text-left` overrides that violate the RTL rules in `/rtl-hebrew`.
4. **Don't audit it.** It ships nothing — not weight, not JS, not markup. Excluded from `.prettierignore`
   and from `eslint.config.mjs` deliberately, so it never shows up in a diff or a lint report.
5. **Don't resurrect the fidelity discipline.** The old rule was "does this match the live WordPress
   source exactly?" The live source _is_ this site now, so that question is circular. The current
   acceptance bars are `docs/content-standards.md` and `docs/optimization-backlog.md`.

## If asked to delete it

Reasonable, and it would remove ~1.2 MB and a standing source of confusion. Before doing so:

- Confirm `content/site.json` is preserved somewhere (git history counts, but say so explicitly).
- Remove the `snapshot` and `enrich` scripts from `package.json` in the same pass.
- Drop `he`, `html-react-parser` and `node-html-parser` from dependencies if nothing else uses them.
- Remove the now-redundant ignore entries from `.prettierignore` and `eslint.config.mjs`.
- Then `npm run lint && npm run typecheck && npm run build` — the build must be byte-identical.

It is a deliberate cleanup, not a drive-by. Ask first.

## Where the live site is documented

`/betonplus-architecture` — the real data flow, file map and routes.
