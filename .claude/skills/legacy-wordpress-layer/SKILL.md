---
name: legacy-wordpress-layer
description: History only — the retired WordPress 1:1 snapshot and enrichment pipeline (scripts/*.mjs, content/site.json, lib/content.ts, lib/wp.ts, lib/enrich/, app/enrich.css, SiteFrame/SiteAssets/ThemeScripts) was deleted from this repo on 2026-08-31 in commit 58d0749. Explains what it was, where the old content can be recovered from git history, and why nothing should be rebuilt on it. Use when a stale doc, comment or memory mentions the snapshot/enrich scripts or any of those files. Triggers: "what is content/site.json", "npm run snapshot", "scrape.mjs", "SiteFrame", "enrich", "why is this file here".
---

# The retired WordPress layer (deleted)

**Status: gone.** Deleted 2026-08-31 in `58d0749` ("Sprint 2: typed areas, header one-hop, llms.txt,
date signal, title guard") and deployed the same day. Nothing of it remains in the working tree; this
skill exists only so a stale reference somewhere doesn't send you looking for files that no longer
exist.

## What it was

This repo began as a strict 1:1 WordPress→Next port of the old betonplus.co.il (`zapo` theme). That
approach was abandoned for the brief-driven designed site (`brief.md`, commit _"Build brief-driven
betonplus marketing site"_), but the migration machinery lingered for months, imported by nothing
under `app/`:

| Deleted in `58d0749`                                                   | What it did                                                                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `scripts/scrape.mjs` `transform.mjs` `build-manifest.mjs` `enrich.mjs` | fetched the live WP pages into a snapshot, rewrote CF7 forms, classified pages, injected HTML  |
| `content/site.json` (1.1 MB)                                           | the snapshot — the old build-time source of truth                                              |
| `lib/content.ts` `lib/wp.ts` `lib/enrich/`                             | typed snapshot reader, WordPress REST types, the `EnrichedPage` schema and its block renderers |
| `app/enrich.css`                                                       | styling for the authored blocks (with `.text-left` overrides that broke the RTL rules)         |
| `components/SiteFrame.tsx` `SiteAssets.tsx` `ThemeScripts.tsx`         | `dangerouslySetInnerHTML` of captured markup and sequential theme-script replay                |
| `npm run snapshot` · `npm run enrich`                                  | the two pipeline entry points                                                                  |
| `he` `html-react-parser` `node-html-parser` `@types/he` `lucide-react` | dependencies only it (or nothing) used                                                         |

The matching ignore entries in `.prettierignore` and `eslint.config.mjs`, and the
`npm run snapshot:*`/`enrich:*` allowances in `.claude/settings.json`, are gone too. `scripts/` now
holds only `check-titles.mjs` (the `postbuild` doubled-brand title gate), which is linted and
formatted like any other source. There is no `content/` directory.

## If the old content is ever needed

`content/site.json` is recoverable from git history — `git show 58d0749^:content/site.json`. That is
the only record of the original WordPress copy. It is reference material for a human, never an input:
the live site's content source is `lib/site.ts`, and its acceptance bars are
`docs/content-standards.md` and `docs/optimization-backlog.md`.

## Rules

1. **Don't rebuild on it.** No snapshot step, no HTML-injection renderer, no `SiteFrame` pattern.
   Content is typed data in `lib/site.ts` rendered by components (`/react-components`).
2. **Don't resurrect the fidelity discipline.** "Does this match the live WordPress source exactly?"
   is circular now — the live source _is_ this site.
3. **Don't trust a doc, comment or memory that still names these files.** Fix the reference.

## Where the live site is documented

`/betonplus-architecture` — the real data flow, file map and routes.
