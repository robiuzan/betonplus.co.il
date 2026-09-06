---
name: new-article
description: Publish a Hebrew knowledge-hub article under /guides/[slug]/ — the typed block model, author attribution and dates, Article + BreadcrumbList + FAQPage schema derived from the blocks, the answer-block opening, and internal links into services and areas. Use when adding editorial content for topical authority and AEO. Triggers: "write an article", "blog post", "knowledge hub", "מדריך", "topical authority", "guide".
---

# Publish an article

The guides hub **exists since 2026-09-06** (backlog §6.7): `app/guides/page.tsx` (index) and
`app/guides/[slug]/page.tsx`, the typed block model in `lib/articles/types.ts`, the registry and
helpers in `lib/articles/index.ts`, one file per article (`lib/articles/<name>.ts`), the renderer
`components/ArticleBody.tsx`, and `articleJsonLd()` in `lib/seo.ts`. Four articles ship; the remaining
Tier-3 questions in `docs/keyword-map.md` §2 are the next ones. Adding an article = one new file +
one line in the registry; the route, sitemap, schema, hub card and service-page cross-links follow.

## Route

`/guides/` (index) and `/guides/[slug]/` (detail). Fully static-export compatible:
`export const dynamic = "force-static"`, `dynamicParams = false`, `generateStaticParams`.

Betonplus's emitted routes are ASCII, but the location slugs reserved in `serviceAreas` are Hebrew
(`תל-אביב`), so `/guides/` would match the silo's convention rather than depart from it. Either way,
Hebrew params arrive **percent-encoded** during static export:

```ts
const { slug } = await params; // Next 16: params is a Promise
const target = decodeURIComponent(slug).normalize("NFC");
return articles.find((a) => a.slug.normalize("NFC") === target);
```

The decision was forced to **ASCII** (`/guides/<ascii-slug>/`): the static export of Next 16.2.9
base64-encodes dynamic param values with `btoa` (Latin-1 only) while writing the segment cache, so a
Hebrew slug fails the build with `InvalidCharacterError: Invalid character` (hit 2026-09-06). Hebrew
lives in the `<h1>`, the breadcrumbs and the copy; the URL is Latin. `getArticle()` keeps the
decode+NFC and `lib/seo.ts`/`app/sitemap.ts` keep `encodeURI` as a no-op safety net.

## Typed blocks, not MDX

Articles live in `lib/articles/<name>.ts` as typed data and are registered in `lib/articles/index.ts`.
The canonical `Block`/`Article` types are in `lib/articles/types.ts` — this is the shape (keep it in
sync with that file):

```ts
export type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "answer"; q: string; a: string } // → the AEO block
  | { kind: "faq"; items: { q: string; a: string }[] } // → FAQPage
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "callout"; tone: "note" | "warn"; text: string }
  | { kind: "cta"; text: string };

export interface Article {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string; // ISO
  authorId: string; // "owner" today — resolves to `owner` in lib/site.ts
  heroImage?: { src: string; alt: string };
  blocks: Block[];
  relatedServices: readonly string[];
  relatedAreas?: readonly string[];
}
```

Why typed blocks rather than MDX: no new dependency and no second build step in a repo whose build is
already the release gate; strict TS stays meaningful; and — the real reason — **`FAQPage` and the
answer block are derived from the `faq` and `answer` blocks**, so the schema cannot drift from the copy
as it is edited.

There is no `content/` directory any more — the WordPress snapshot that lived there was deleted
2026-08-31 (`58d0749`, `/legacy-wordpress-layer`). Don't recreate it; typed data lives in `lib/`
next to `site.ts` and `seo.ts`, and the hub route reads it at build time like every other route.

## Structure

1. `<h1>` = the question, verbatim.
2. **An `answer` block within the first 60 words** — the complete answer before any preamble
   (`docs/content-standards.md` §5).
3. Body with **question-form `<h2>`s**. Each section answerable on its own.
4. At least one `table` or `list` a reader would screenshot. For this trade that means a real
   comparison — ניסור מול הריסה (עלות, שעות, רעש, אבק, סיכון מבני), or a thickness→method table. This
   is what makes the page citable rather than merely correct.
5. A `faq` block, 3–5 questions.
6. Author byline, `datePublished`, `dateModified`.
7. 2–3 in-copy links to services and 1–2 to areas, with descriptive Hebrew anchors.
8. A `cta` block.

900-word floor. Depth is the point; a 900-word article that repeats the service page cannibalises it.

## Schema

`Article` with `headline`, `description`, `image`, `datePublished`, `dateModified`, `author`
(`{ "@id": "…/#owner" }`), `publisher` (`@id` → the site-wide business node), `mainEntityOfPage`.
Plus `BreadcrumbList` (`בית › מדריכים › {title}` — `breadcrumbJsonLd()` prepends בית itself) and
`FAQPage` derived from the `faq` blocks. See `docs/schema-graph.md` §6.

**`lib/seo.ts` has no `Article` builder yet** — add `articleJsonLd()` beside `webPageJsonLd()`,
reuse its `{ author: true }` pattern, and emit `personJsonLd()` on the same page so `#owner` resolves
without a cross-page lookup, exactly as `app/services/[slug]/page.tsx` does.

**The author is a real named person, and one exists:** אור שוורץ, בעלים — `owner` and
`ownerJobTitle` in `lib/site.ts`, the `Person` node `#owner` from `personJsonLd()`, and the visible
byline in `components/Byline.tsx` (`<Byline updated={…} />`, already on the service pages; the
visible surface and the markup must name the same person). Attribute articles to him. Any
biographical fact beyond what `owner` holds is 🔶 unconfirmed. **Never invent a second byline** —
this repo shipped three fabricated customers once, removed 2026-08-17 (backlog §7.1); don't add a
fictional person.

## Topic selection

Start from `docs/keyword-map.md` §2 Tier 3 — the questions people actually type. High-value openers:

- כמה עולה ניסור בטון למ״ר? (a real breakdown by thickness and reinforcement, not a range restatement)
- ניסור בטון או הריסה — מה מתאים לפתח שלי? (עלות, זמן, רעש, סיכון מבני)
- האם פתיחת פתח בקיר פוגעת ביציבות המבנה?
- מתי צריך אישור קונסטרוקטור לפתיחת פתח?
- מה ההבדל בין ניסור דיסק לניסור בכבל יהלום — ובאיזה עובי עוברים ביניהם?
- קידוח יבש או רטוב — מה ההבדל ומה צריך להכין?

Each should answer the question **better than the service page does**, then link to the service page
for the commercial action.

## Steps

1. Pick a Tier-3 question; confirm no existing page already targets it.
2. Create `lib/articles/<name>.ts` exporting an `Article` (ASCII `slug`), and add it to `articles` in `lib/articles/index.ts`.
3. Write to the structure above; every claim free or 🔶 (`docs/content-standards.md` §6).
4. Register the slug so `generateStaticParams` picks it up, and add the article URLs to
   `app/sitemap.ts` beside `staticRoutes` + `services` (`encodeURI` for a Hebrew slug); date each
   in `routeUpdated`.
5. Wire `Article` (new builder) + `BreadcrumbList` + `FAQPage`, plus `personJsonLd()` and `<Byline>`.
6. Add links from the related service pages back to the article.
7. `npm run lint && npm run typecheck && npm run format:check && npm run build`; verify the route and
   the sitemap entry.

## Checklist

- [ ] ≥900 unique words; answers the question better than any existing page.
- [ ] `answer` block in the first 60 words, complete in the first sentence.
- [ ] Question-form `<h2>`s; one `<h1>`.
- [ ] At least one table or comparison worth citing.
- [ ] Author is `#owner` (`personJsonLd()` + visible `<Byline>`); real dates, also in `routeUpdated`.
- [ ] `Article` + `BreadcrumbList` + `FAQPage` emitted, FAQ derived from the blocks.
- [ ] 3+ contextual internal links with descriptive anchors; inbound links added from related pages.
- [ ] Present in `out/` and `out/sitemap.xml`.
