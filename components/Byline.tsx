import Link from "next/link";
import { owner, ownerJobTitle, formatDateIL } from "@/lib/site";

/**
 * Author byline plus the visible freshness line (roadmap 5.3, backlog §6.3).
 *
 * The byline is the visible half of attribution: the page's `WebPage`/`Article` node carries
 * `author: {@id #owner}` and the same page emits the `Person` node, so what a reader sees and
 * what a crawler parses name the same person. Only a real, consenting, named person may appear
 * here (eeat-and-trust §4) — today that is the owner, sourced from `lib/site.ts`.
 *
 * The date is the real content date from `routeUpdated`, never build time. `<time>` carries the
 * ISO value; the text carries the Israeli dd/mm/yyyy form, LTR-isolated so the digits do not
 * reorder inside the RTL paragraph.
 */
export default function Byline({ updated }: { updated?: string | null }) {
  return (
    <p className="mb-6 text-sm text-muted">
      מאת{" "}
      <Link href="/about/" className="font-semibold text-steel underline hover:text-brand">
        {owner.name}
      </Link>
      , {ownerJobTitle}
      {updated && (
        <>
          {" · "}עודכן:{" "}
          <time className="ltr" dateTime={updated}>
            {formatDateIL(updated)}
          </time>
        </>
      )}
    </p>
  );
}
