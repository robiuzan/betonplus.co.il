import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import Byline from "@/components/Byline";
import { Section, Button } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import {
  services,
  getService,
  getServiceDepth,
  relatedServices,
  site,
  telHref,
  whatsappHref,
  updatedFor,
  priceLabel,
} from "@/lib/site";
import {
  pageMetadata,
  serviceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  webPageJsonLd,
  personJsonLd,
} from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) return {};
  return pageMetadata({
    title: svc.metaTitle,
    description: svc.metaDescription,
    path: `/services/${svc.slug}/`,
    absoluteTitle: true,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) notFound();
  const depth = getServiceDepth(svc.slug);
  const updated = updatedFor(`/services/${svc.slug}/`);

  // Relevance-based related services (adjacency map), falling back to array order.
  const relatedSlugs = relatedServices[svc.slug] ?? [];
  const related = relatedSlugs
    .map((s) => services.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(svc.slug) ?? {},
          // Carries dateModified — `Service` has no date property, so the freshness
          // signal needs a page node alongside it. `author` points at the owner's Person
          // node below and matches the visible <Byline> (roadmap 5.3).
          webPageJsonLd(`/services/${svc.slug}/`, svc.metaTitle, svc.metaDescription, {
            author: true,
          }),
          personJsonLd(),
          breadcrumbJsonLd([
            { name: "שירותים", path: "/services/" },
            { name: svc.title, path: `/services/${svc.slug}/` },
          ]),
          // FAQPage qualifies: the same items render visibly below via <Faq items>.
          ...(depth ? [faqJsonLd(depth.faqs)] : []),
        ]}
      />
      <PageHero
        title={svc.title}
        lead={svc.description}
        crumbs={[
          { name: "שירותים", href: "/services/" },
          { name: svc.title, href: `/services/${svc.slug}/` },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {/* Main content */}
          <div className="max-w-3xl">
            {/* Byline + visible freshness signal, matching `author` and `dateModified` in the schema. */}
            <Byline updated={updated} />

            {depth && (
              <>
                {/* Answer block — question-form h2, self-contained answer first (AEO). */}
                <h2 className="text-2xl">{depth.answer.q}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink/90">{depth.answer.a}</p>

                <div className="mt-6 space-y-4 leading-relaxed text-muted">
                  {depth.intro.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </>
            )}

            <h2 className="mt-10 text-2xl">מה כולל השירות</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {(depth?.included ?? svc.bullets).map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-ink/90">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                  {b}
                </li>
              ))}
            </ul>

            {depth && depth.excluded.length > 0 && (
              <>
                <h3 className="mt-8 text-xl">מה לא כלול — ומי אחראי לזה</h3>
                <ul className="mt-4 space-y-2 text-ink/90">
                  {depth.excluded.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <Icon name="arrow" className="mt-1 h-4 w-4 shrink-0 rotate-180 text-muted" />
                      {b}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {depth && (
              <>
                <h2 className="mt-10 text-2xl">ציוד ושיטת העבודה</h2>
                <p className="mt-4 leading-relaxed text-muted">{depth.method}</p>

                <h2 className="mt-10 text-2xl">רעש, אבק, מים — מה קורה באתר</h2>
                <p className="mt-4 leading-relaxed text-muted">{depth.siteImpact}</p>

                <div className="mt-8 rounded-xl border border-cta/40 bg-cta/10 p-5">
                  <h2 className="text-xl">מתי צריך אישור קונסטרוקטור</h2>
                  <p className="mt-3 leading-relaxed text-ink/90">{depth.structural}</p>
                </div>
              </>
            )}

            <h2 className="mt-10 text-2xl">איך אנחנו עובדים</h2>
            <ol className="mt-5 space-y-4">
              {svc.process.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cta font-heading font-extrabold text-brand">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-ink/90">{step}</p>
                </li>
              ))}
            </ol>

            <div className="mt-8 rounded-xl border border-line bg-mist p-5">
              <p className="text-sm text-muted">
                <span className="font-bold text-brand">למי זה מתאים: </span>
                {svc.audience}
              </p>
            </div>

            {depth && depth.links.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg">קשור לנושא</h3>
                <ul className="mt-3 space-y-1.5">
                  {depth.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="font-semibold text-steel underline hover:text-brand"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sticky CTA card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              {svc.priceFrom && (
                <>
                  <p className="text-sm text-muted">מחיר</p>
                  <p className="font-heading text-2xl font-extrabold text-brand">
                    {priceLabel(svc.priceFrom)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    המחיר הסופי לפי היקף העבודה — הצעת מחיר ללא התחייבות.
                  </p>
                  <hr className="my-5 border-line" />
                </>
              )}
              <p className="font-heading font-bold text-brand">רוצים הצעת מחיר?</p>
              <p className="mt-1 text-sm text-muted">מענה מהיר בטלפון ובוואטסאפ.</p>
              <div className="mt-4 grid gap-3">
                <Button href={telHref} data-cta="sidebar-call" variant="cta">
                  <Icon name="phone" className="h-5 w-5" />
                  התקשרו <span className="ltr">{site.phoneDisplay}</span>
                </Button>
                <Button href={whatsappHref} data-cta="sidebar-whatsapp" variant="whatsapp">
                  <Icon name="whatsapp" className="h-5 w-5" />
                  שלחו וואטסאפ
                </Button>
                <Button href="/contact/" data-cta="sidebar-form" variant="outline">
                  טופס הצעת מחיר
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {depth && (
        <Faq
          items={depth.faqs}
          tint="mist"
          title={`שאלות נפוצות — ${svc.title}`}
          lead="התשובות הקצרות לשאלות שמגיעות אלינו לפני כל עבודה מסוג זה."
        />
      )}

      {/* Related services */}
      <Section>
        <h2 className="text-2xl">שירותים נוספים</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/services/${r.slug}/`}
              className="card card-hover flex flex-col p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-cta">
                <Icon name={r.icon} className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-lg">{r.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{r.teaser}</p>
              <span className="mt-3 inline-flex items-center gap-1 font-heading text-sm font-bold text-steel">
                פרטים
                <Icon name="arrow" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}
