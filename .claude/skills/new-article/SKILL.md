---
name: new-article
description: Publish a Hebrew knowledge-hub article under /מדריכים/[slug]/ — the typed block model, author attribution and dates, Article + BreadcrumbList + FAQPage schema derived from the blocks, the answer-block opening, and internal links into services and areas. Use when adding editorial content for topical authority and AEO. Triggers: "write an article", "blog post", "knowledge hub", "מדריך", "topical authority", "guide".
---

# Publish an article

The site has **no editorial surface at all** — no blog, no guides, no route. That is the whole
topical-authority and AEO gap in one line (backlog §6.5). `/faq/` is currently the only page holding
Tier-3 intent, with six short answers.

A `/מדריכים/` hub is where the Tier-3 questions in `docs/keyword-map.md` §2 get answered properly.

## Route

`/מדריכים/` (index) and `/מדריכים/[slug]/` (detail). Fully static-export compatible:
`export const dynamic = "force-static"`, `dynamicParams = false`, `generateStaticParams`.

Betonplus's existing routes are ASCII, so a Hebrew route is a deliberate departure. If you take it,
params arrive **percent-encoded** during static export:

```ts
const { slug } = await params; // Next 16: params is a Promise
const target = decodeURIComponent(slug).normalize("NFC");
return articles.find((a) => a.slug.normalize("NFC") === target);
```

Skipping the decode+normalize works in dev and 404s in production, and `app/sitemap.ts` then needs
`encodeURI` so the `<loc>` matches the canonical byte for byte. Staying ASCII (`/guides/…`) avoids all
of it — pick one deliberately.

## Typed blocks, not MDX

Articles live in `content/articles/<slug>.ts` as typed data:

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
  authorId: string; // → a real named person
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

Note `content/` currently holds the dead WordPress snapshot (`content/site.json`). Putting articles in
`content/articles/` is fine, but say so in the PR — that directory reads as legacy right now.

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
(a `Person` with a **real** name), `publisher` (`@id` → the site-wide business node),
`mainEntityOfPage`. Plus `BreadcrumbList` (`בית › מדריכים › {title}`) and `FAQPage` derived from the
`faq` blocks. See `docs/schema-graph.md` §6.

**The author must be a real named person** — blocked on `docs/business-facts.md` §A, which records that
**nobody is named anywhere on this site**. **Never invent a byline.** A fabricated author is a worse
trust signal than an absent one, and this repo shipped three fabricated customers once — removed
2026-08-17 (backlog §7.1) — don't add a fourth fictional person.

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
2. Create `content/articles/<slug>.ts`.
3. Write to the structure above; every claim free or 🔶 (`docs/content-standards.md` §6).
4. Register the slug so `generateStaticParams` and `app/sitemap.ts` pick it up.
5. Wire `Article` + `BreadcrumbList` + `FAQPage`.
6. Add links from the related service pages back to the article.
7. `npm run lint && npm run typecheck && npm run format:check && npm run build`; verify the route and
   the sitemap entry.

## Checklist

- [ ] ≥900 unique words; answers the question better than any existing page.
- [ ] `answer` block in the first 60 words, complete in the first sentence.
- [ ] Question-form `<h2>`s; one `<h1>`.
- [ ] At least one table or comparison worth citing.
- [ ] Real author, real dates.
- [ ] `Article` + `BreadcrumbList` + `FAQPage` emitted, FAQ derived from the blocks.
- [ ] 3+ contextual internal links with descriptive anchors; inbound links added from related pages.
- [ ] Present in `out/` and `out/sitemap.xml`.
