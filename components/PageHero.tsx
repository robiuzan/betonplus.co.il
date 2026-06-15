import Link from "next/link";
import { Container } from "@/components/ui";

export interface Crumb {
  name: string;
  href: string;
}

/** Compact page header with breadcrumb, H1 and optional lead — for inner pages. */
export default function PageHero({
  title,
  lead,
  crumbs = [],
}: {
  title: string;
  lead?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="hero-grad text-white">
      <Container className="py-12 sm:py-16">
        {crumbs.length > 0 && (
          <nav aria-label="פירורי לחם" className="mb-4 text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  בית
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1.5">
                  <span aria-hidden="true">/</span>
                  {i === crumbs.length - 1 ? (
                    <span className="text-white/90" aria-current="page">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.href} className="hover:text-white">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
        {lead && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{lead}</p>}
      </Container>
    </section>
  );
}
