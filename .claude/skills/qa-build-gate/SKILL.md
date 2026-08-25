---
name: qa-build-gate
description: The release gate before any deploy — clean build, lint, typecheck and format:check, a route-count assertion, title/canonical/H1/JSON-LD greps on out/, sitemap parity with the emitted tree, the fabricated-review stop-ship check, orphans, output weight, and the auditor sweep. Use before every deploy or when asked whether the site is ready to ship. Triggers: "run the build gate", "is this ready to ship", "pre-deploy check", "QA the site", "verify the build".
---

# Build gate

Everything here runs against `out/` — the artifact that actually ships. A passing `npm run build` is
the start of this gate, not the end of it.

## 1. Clean build

```bash
rm -rf .next out
npm run lint && npm run typecheck && npm run format:check && npm run build
```

**The `rm -rf .next` matters.** The fleet has repeatedly shipped multi-MB dev-only chunks (`main.js`,
`fallback/main.js`, `fallback/amp.js`) from a polluted `.next/` — a `next dev` run's artifacts
surviving into the export. betonplus is currently clean (§9 below); the `rm -rf` is what keeps it that
way. Deleting files from `out/` afterwards is NOT the fix.

All four commands must pass. `format:check` is included because a Stop hook formats changed files — an
unformatted file means something bypassed it.

## 2. Route count

```bash
find out -name index.html | wc -l          # expect 17 (14 content + /thank-you/ + /404/ + /_not-found/)
grep -c '<url>' out/sitemap.xml            # expect 14
test -f out/robots.txt && echo ok
test -f out/_headers && test -f out/_redirects && echo ok   # edge files ship with the export
```

If the counts move, something was added or dropped. Reconcile before shipping. The sitemap derives
from `staticRoutes` in `lib/site.ts` plus `services` (since 2026-08-17) — a new static page must be
added to `staticRoutes` or it silently misses the sitemap; this parity check is what catches that.

## 3. Titles — uniqueness and the brand count

```bash
grep -rho '<title>[^<]*</title>' out --include=index.html | sort | uniq -c | sort -rn
grep -rl 'בטון פלוס | בטון פלוס' out --include=index.html
```

The second command must return **nothing** — the historical `/about/` doubled-brand case was fixed
2026-08-17 (backlog §2.1). Any hit is a regression. Also confirm no two content routes share a
`<title>` or a description.

Note the homepage title legitimately appears three times: `/`, `/404/` and `/_not-found/` inherit the
layout default.

## 4. Canonicals

```bash
grep -rL 'rel="canonical"' out --include=index.html      # expect only /404/ and /_not-found/
```

Every content route needs exactly one self-referencing canonical with a trailing slash.

## 5. One H1

```bash
for f in $(find out -name index.html); do
  n=$(grep -o '<h1' "$f" | wc -l); [ "$n" -ne 1 ] && echo "$f: $n";
done
```

Expect no output.

## 6. Structured data

```bash
grep -rL 'application/ld+json' out --include=index.html   # expect empty
grep -rl 'BreadcrumbList' out --include=index.html | wc -l  # expect 13 (all content but / and /thank-you/)
grep -rl 'aggregateRating\|"@type": *"Review"' out --include=index.html  # expect NONE
```

Any `Review` or `AggregateRating` without a verifiable public source is a **stop-ship**, not a warning
(`docs/schema-graph.md` §4).

## 7. The fabricated-review check — betonplus-specific

```bash
grep -rl 'אבי כהן\|מאיה לוי\|דניאל אזולאי' out --include=index.html
```

These are the three **invented** testimonials that were removed 2026-08-17 together with the
`/reviews/` route (backlog §7.1). The grep must return **nothing** — any hit means fabricated content
came back, which is a **stop-ship**, full stop. A fabricated review is a Google spam-policy violation
and a consumer-protection exposure; reviews may only return as real, attributed quotes.

## 8. Sitemap parity

```bash
find out -name index.html | sed 's|^out||; s|index.html$||' | sort > /tmp/emitted.txt
grep -o '<loc>[^<]*</loc>' out/sitemap.xml | sed 's|</\?loc>||g; s|https://betonplus.co.il||' \
  | sort > /tmp/sitemap.txt
diff /tmp/emitted.txt /tmp/sitemap.txt
```

`/404/`, `/_not-found/` and `/thank-you/` (noindex) are expected to differ — all three are correctly
excluded from the sitemap. Nothing else should.

## 9. Orphans

```bash
grep -rho 'href="/[^"]*"' out --include=index.html | sed 's|href="||; s|"$||' | sort -u > /tmp/linked.txt
comm -23 /tmp/emitted.txt /tmp/linked.txt
```

Currently prints only `/404/`, `/_not-found/` and `/thank-you/` (reached by form navigation, not
links — by design), which is correct. Anything else is a new orphan.

## 10. Output weight

```bash
find out -name '*.js' -size +1M -exec ls -lh {} \;    # expect nothing
du -sh out                                            # ~3.9 MB baseline
```

## 11. Content floors

Spot-check that no page regressed below `docs/content-standards.md` §1. Strip tags, subtract ~110 words
of chrome, and check the thinnest routes — the 5 service pages (~200 words today, floor 450) and
`/service-areas/`.

## 12. Live checks after deploy

```bash
curl -sSI https://betonplus.co.il/ | grep -iE 'strict-transport|content-security|x-frame|server'
curl -sS https://betonplus.co.il/robots.txt | head -40
curl -o /dev/null -w '%{http_code}\n' "https://www.googletagmanager.com/gtm.js?id=GTM-KWGGH438"
```

The GTM check must return **200**. The `robots.txt` will show Cloudflare's managed AI-crawler block —
that is expected and is a zone setting, not a repo bug (`/aeo-answer-content`).

## 13. Auditor sweep

For a substantive change, run the relevant agents against the fresh `out/`:

| Changed                     | Run                  |
| --------------------------- | -------------------- |
| metadata, routes, sitemap   | `seo-auditor`        |
| JSON-LD                     | `schema-auditor`     |
| copy, claims, imagery       | `eeat-trust-auditor` |
| components, images, colours | `perf-a11y-auditor`  |
| headers, form, deps         | `security-auditor`   |
| any TS/React                | `ts-react-reviewer`  |

## Stop-ship list

- A doubled brand suffix in any `<title>` (there are none — fixed 2026-08-17).
- A missing or non-self-referencing canonical on a content route.
- Zero or multiple `<h1>` on any page.
- `Review` / `AggregateRating` markup without a source.
- **A new fabricated testimonial, name or quote.**
- A route in `out/` missing from `sitemap.xml`.
- Any unreferenced file over 1 MB under `out/_next/`.
- `lint`, `typecheck`, `format:check` or `build` failing.
- A live claim that `docs/business-facts.md` marks 🔶.

## Then

`/deploy-betonplus` — dry run first. **Pushing to `main` does not deploy.**
