import Link from "next/link";
import CompareTable from "@/components/CompareTable";
import Icon from "@/components/Icon";
import { Button } from "@/components/ui";
import { site, telHref, whatsappHref } from "@/lib/site";
import type { Block } from "@/lib/articles/types";

/**
 * Renders an article's typed blocks (`lib/articles/types.ts`). Server component — the whole
 * article is static HTML at first paint, which is the AEO rendering rule in
 * content-standards §5 (no tabs, no client fetch).
 *
 * `faq` blocks are deliberately skipped here: the page renders them through `<Faq>` after
 * the body so the visible FAQ and the `FAQPage` markup come from the same block.
 */
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="max-w-3xl">
      {blocks.map((b, i) => {
        const key = `${b.kind}-${i}`;
        switch (b.kind) {
          case "answer":
            return (
              <div key={key}>
                {/* Answer block — question-form h2, the complete answer first (AEO). */}
                <h2 className="text-2xl">{b.q}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink/90">{b.a}</p>
              </div>
            );
          case "heading":
            return b.level === 2 ? (
              <h2 key={key} className="mt-10 text-2xl">
                {b.text}
              </h2>
            ) : (
              <h3 key={key} className="mt-8 text-xl">
                {b.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={key} className="mt-4 leading-relaxed text-muted">
                {b.text}
              </p>
            );
          case "paragraphLinks":
            return (
              <p key={key} className="mt-4 leading-relaxed text-muted">
                {b.parts.map((p, j) =>
                  typeof p === "string" ? (
                    p
                  ) : (
                    <Link
                      key={`${key}-${j}`}
                      href={p.href}
                      className="font-semibold text-steel underline hover:text-brand"
                    >
                      {p.text}
                    </Link>
                  ),
                )}
              </p>
            );
          case "list": {
            const cls = "mt-4 space-y-2 ps-6 leading-relaxed text-muted";
            return b.ordered ? (
              <ol key={key} className={`${cls} list-decimal`}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ol>
            ) : (
              <ul key={key} className={`${cls} list-disc`}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          }
          case "table":
            return <CompareTable key={key} caption={b.caption} head={b.head} rows={b.rows} />;
          case "callout":
            return (
              <div
                key={key}
                className={
                  b.tone === "warn"
                    ? "mt-8 rounded-xl border border-cta/40 bg-cta/10 p-5 leading-relaxed text-ink/90"
                    : "mt-8 rounded-xl border border-line bg-mist p-5 leading-relaxed text-ink/90"
                }
              >
                {b.text}
              </div>
            );
          case "image":
            // Owner-supplied photographs only (eeat-and-trust §6). width/height reserve the box.
            // Plain <img>: images.unoptimized + output:"export" means next/image would add no
            // optimisation here; the variant pipeline is roadmap 6.1 (SiteImage), not next/image.
            return (
              <figure key={key} className="mt-8">
                {/* eslint-disable-next-line @next/next/no-img-element -- see the comment above */}
                <img
                  src={b.src}
                  alt={b.alt}
                  width={b.width}
                  height={b.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-2xl"
                />
                {b.caption && (
                  <figcaption className="mt-2 text-sm text-muted">{b.caption}</figcaption>
                )}
              </figure>
            );
          case "cta":
            return (
              <div key={key} className="mt-10 rounded-2xl border border-line bg-mist p-6">
                <p className="font-heading text-lg font-bold text-brand">{b.text}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button href={telHref} data-cta="article-call" variant="cta">
                    <Icon name="phone" className="h-5 w-5" />
                    התקשרו <span className="ltr">{site.phoneDisplay}</span>
                  </Button>
                  <Button href={whatsappHref} data-cta="article-whatsapp" variant="whatsapp">
                    <Icon name="whatsapp" className="h-5 w-5" />
                    שלחו וואטסאפ
                  </Button>
                </div>
              </div>
            );
          case "faq":
            return null;
        }
      })}
    </div>
  );
}
