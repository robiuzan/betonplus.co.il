/**
 * Typed block model for the knowledge hub (`/מדריכים/`), per the `new-article` skill.
 *
 * Why typed blocks rather than MDX: no new dependency, no second build step in a repo whose
 * build is already the release gate, strict TS stays meaningful — and, the real reason, the
 * `FAQPage` markup and the AEO answer block are **derived from the `faq` and `answer` blocks**,
 * so the schema cannot drift from the copy as it is edited.
 *
 * Keep this file dependency-free: article files import only the types, so a plain
 * `node --experimental-strip-types` script can count words without resolving the `@/` alias.
 */

export type Block =
  /** Body paragraph. Plain text; links are separate `link` runs inside `paragraphLinks`. */
  | { kind: "paragraph"; text: string }
  /**
   * Paragraph with inline links. `parts` alternate free text and `{ text, href }` links so the
   * page can render real `<Link>`s with descriptive Hebrew anchors (internal-linking skill).
   */
  | { kind: "paragraphLinks"; parts: (string | { text: string; href: string })[] }
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  /** Rendered through `components/CompareTable.tsx` — the citable asset. */
  | { kind: "table"; caption: string; head: string[]; rows: string[][] }
  /** The AEO block: question-form heading, complete 40–60-word answer first. Exactly one per article, first. */
  | { kind: "answer"; q: string; a: string }
  /** Rendered visibly as the closing FAQ and emitted as `FAQPage`. Exactly one per article, last before `cta`. */
  | { kind: "faq"; items: { q: string; a: string }[] }
  /** Owner-supplied photograph only (eeat-and-trust §6). `width`/`height` reserve the box (CLS). */
  | { kind: "image"; src: string; alt: string; width: number; height: number; caption?: string }
  | { kind: "callout"; tone: "note" | "warn"; text: string }
  /** Closing call to action — phone + WhatsApp buttons with `data-cta="article-*"`. */
  | { kind: "cta"; text: string };

export interface Article {
  /** ASCII slug, hyphen-separated — becomes `/guides/<slug>/`. Hebrew slugs break Next 16's static export (see lib/articles/index.ts). */
  slug: string;
  /** The question, verbatim — it is the `<h1>` and the `Article.headline`. */
  title: string;
  /** 150–160 chars, phone included, no unconfirmed claim (keyword-map §5). */
  description: string;
  /** ISO yyyy-mm-dd — real dates, never build time. */
  datePublished: string;
  dateModified: string;
  /** Only "owner" exists today → `owner` in lib/site.ts. Never a name that is not in lib/site.ts. */
  authorId: "owner";
  blocks: Block[];
  /** Service slugs this article supports; the service pages link back from these. */
  relatedServices: readonly string[];
}
