---
name: deploy-betonplus
description: Ship betonplus to production — ops/deploy-site.ps1 dry-run then -Confirm (wrangler direct upload to the Cloudflare Pages project), why pushing to main deploys nothing and why the GitHub Pages workflow is a dead second origin, the npm file: tarball and .next cache traps, the out.prev rollback, and post-deploy verification against the live site. Use when publishing. Triggers: "deploy", "ship it", "publish the site", "go live", "roll back", "why isn't my change live".
---

# Deploy

## The one thing to know

**Production is Cloudflare Pages via wrangler direct upload. Pushing to `main` deploys nothing.**

Verified from the live response: `Server: cloudflare`, `cf-cache-status: DYNAMIC`, and a Cloudflare
managed `robots.txt` — a proxy-only feature. The roster confirms it:
`hosting.target: cloudflare-pages`, `hosting.pagesProject: betonplus`.

✅ **Resolved 2026-08-17:** `.github/workflows/deploy.yml` is now build-gate CI only (lint /
typecheck / format:check / build) and `public/CNAME` is deleted — the GitHub Pages second origin no
longer receives pushes (backlog §1.3, §12.4). The old origin may still serve its last stale copy until
GitHub garbage-collects or Pages is disabled in the repo settings — worth confirming once in the
GitHub UI.

## The command

Deploying is a **production mutation**. It runs dry first, and it always asks.

```powershell
# preview - safe, changes nothing
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain betonplus.co.il -DryRun

# execute - only after the user asks
powershell -File "c:/Users/robiu/antigravity/Projects/Israeli services sites/ops/deploy-site.ps1" -Domain betonplus.co.il -Confirm
```

Other flags: `-BuildOnly` (build + output gate, no upload), `-DeployOnly` (ship the existing `out/`
as-is), `-SkipDriftCheck` (only when the roster is knowingly ahead of DNS).

## What the script does, and why each step exists

1. Resolves the Pages project name from the roster (`betonplus`).
2. **Drift check** — asks the Cloudflare API whether that Pages project actually serves this domain.
   This is the guard against wrangler-pushing into a project nothing resolves to, which reports
   success while changing nothing the public can see.
3. Installs dependencies, **busting two caches** (below).
4. `npm run build`.
5. **Output gate** on `out/` — refuses to ship a broken or stale export.
6. Preserves the previous `out/` as `out.prev/` so a rollback is one command.
7. `npx wrangler pages deploy .\out --project-name betonplus --branch main`.
8. Appends the result to `logs/deploys.csv`.

It refuses outright if `hosting.target` is anything other than `cloudflare-pages`.

## The two staleness traps

Both produce a **successful build of the wrong code**, with no error anywhere. This is why the script
force-reinstalls and clears caches instead of trusting a plain `npm install`:

- **npm caches `file:` tarball dependencies.** `@ishub/site-kit` is vendored as
  `vendor/ishub-site-kit-0.0.0.tgz`. A fresh tarball on disk plus a plain `npm install` will happily
  keep serving the **old** kit from cache.
- **Next caches compiled modules under `.next/`.** Even with correct `node_modules`, a rebuild can
  emit the previous kit's components. This has been observed on this fleet: the built HTML still
  carried pre-refactor markup until `.next` was removed.

If you ever build manually before deploying, `rm -rf .next out` first (`/qa-build-gate` §1).

## Before you deploy

Run `/qa-build-gate` end to end. Its stop-ship list applies — in particular, do not ship a missing
canonical, any doubled `<title>`, any `Review`/`AggregateRating` without a verifiable source, or
**any fabricated testimonial** (the three that once shipped were removed 2026-08-17 and the gate greps
for their names on every build — a hit is an unconditional stop).

Shipped 2026-09-16 (`5bb6943a.betonplus.pages.dev`, gate 205 files): the `/guides/` guides hub and its
first four articles (5 new routes, sitemap 14 → 19), the service-page bylines with `author` on the
`WebPage` node, the `lead_fallback`/`form_error` dataLayer events, the detached
`Access-Control-Allow-Origin` wildcard, the synced `site.config.json` (GA4 id present, internal notes
gone from the bundle), and the `/about/` meta description without the 🔶 founding claim. Everything
before that (Sprint 2, the audit tiers 1–4) went live 2026-08-31 / 2026-09-01.

## After you deploy

```bash
curl -sSI https://betonplus.co.il/ | head -20
curl -sS https://betonplus.co.il/services/wall-sawing/ | grep -o '<title>[^<]*</title>'
curl -sS https://betonplus.co.il/robots.txt | head -40
curl -sS https://betonplus.co.il/sitemap.xml | grep -c '<url>'
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

Check: the page is the new build; the title carries the brand exactly once; `robots.txt` matches the
intended AI-crawler stance (**Cloudflare prepends a managed block** — see `/aeo-answer-content`); the
sitemap lists 19 URLs (14 before the guides hub); GTM returns 200; and any new `public/_headers` entries actually appear in the
response (`/web-security-headers`).

## Rollback

`out.prev/` holds the previous export. Restore it over `out/`, then deploy with `-DeployOnly`.
Cloudflare Pages also keeps prior deployments in its dashboard and can roll back there, which is often
faster — offer both and let the user choose.

## Rules

- **Never deploy without being asked.** Not as the last step of a task, not "while I'm here".
- Never use `-SkipDriftCheck` to make a failing deploy pass. A drift failure means the deploy would
  have gone somewhere nobody can see.
- Never edit `site.config.json` as part of a deploy — it syncs from the roster.
- Never deploy with `/qa-build-gate` stop-ship items outstanding.
- Zone settings (AI crawler policy, cache rules, Scrape Shield) are the owner's to change; a deploy
  does not touch them.
