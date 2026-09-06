/**
 * The knowledge hub registry (`/guides/`). One file per article under lib/articles/, all
 * registered here so `generateStaticParams`, the hub index, the sitemap, the service-page
 * cross-links and the schema derive from a single list — the same discipline as
 * `services` and `staticRoutes` in lib/site.ts.
 */
import type { Article } from "./types";
import { sawingVsDemolition } from "./sawing-vs-demolition";
import { openingAndStability } from "./opening-and-stability";
import { engineerApproval } from "./engineer-approval";
import { wetVsDryDrilling } from "./wet-vs-dry-drilling";

export type { Article, Block } from "./types";

/**
 * ASCII hub path, ASCII slugs — deliberately. Next 16.2.9's static export base64-encodes
 * dynamic param values with `btoa` (Latin-1 only) while writing the segment cache, so a Hebrew
 * slug fails the build with `InvalidCharacterError: Invalid character` (seen 2026-09-06 on
 * `/מדריכים/פתיחת-פתח-ויציבות-המבנה`). The visible label, the `<h1>`, the breadcrumbs and the
 * copy stay Hebrew; only the URL is Latin. The same constraint applies to the location silo:
 * use `tel-aviv`, not `תל-אביב`, in any dynamic segment.
 */
export const HUB_PATH = "/guides/";
export const HUB_TITLE = "מדריכים";

export const articles: Article[] = [
  sawingVsDemolition,
  openingAndStability,
  engineerApproval,
  wetVsDryDrilling,
];

export function articlePath(a: Article): string {
  return `${HUB_PATH}${a.slug}/`;
}

/** Slugs are ASCII; the decode + NFC normalisation is kept so a future non-ASCII slug still resolves. */
export function getArticle(slug: string): Article | null {
  const target = decodeURIComponent(slug).normalize("NFC");
  return articles.find((a) => a.slug.normalize("NFC") === target) ?? null;
}

/** The article's own FAQ items — the only source for its `FAQPage` markup. */
export function articleFaq(a: Article): { q: string; a: string }[] {
  return a.blocks.flatMap((b) => (b.kind === "faq" ? b.items : []));
}

/** Articles that support a given service, for the service page's "מדריכים בנושא" block. */
export function articlesForService(serviceSlug: string): Article[] {
  return articles.filter((a) => a.relatedServices.includes(serviceSlug));
}

/** Body word count (all visible text blocks) — the 900-word floor in content-standards §1. */
export function articleWordCount(a: Article): number {
  const text: string[] = [a.title];
  for (const b of a.blocks) {
    switch (b.kind) {
      case "paragraph":
      case "callout":
      case "cta":
        text.push(b.text);
        break;
      case "paragraphLinks":
        text.push(...b.parts.map((p) => (typeof p === "string" ? p : p.text)));
        break;
      case "heading":
        text.push(b.text);
        break;
      case "list":
        text.push(...b.items);
        break;
      case "table":
        text.push(b.caption, ...b.head, ...b.rows.flat());
        break;
      case "answer":
        text.push(b.q, b.a);
        break;
      case "faq":
        text.push(...b.items.flatMap((i) => [i.q, i.a]));
        break;
      case "image":
        text.push(b.caption ?? "");
        break;
    }
  }
  return text
    .join(" ")
    .split(/\s+/)
    .filter((w) => /[֐-׿A-Za-z0-9]/.test(w)).length;
}
