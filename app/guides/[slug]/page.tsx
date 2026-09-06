import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import Faq from "@/components/Faq";
import Byline from "@/components/Byline";
import ArticleBody from "@/components/ArticleBody";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import { Section } from "@/components/ui";
import { services } from "@/lib/site";
import { articles, articlePath, articleFaq, getArticle, HUB_PATH, HUB_TITLE } from "@/lib/articles";
import { pageMetadata, articleJsonLd, breadcrumbJsonLd, faqJsonLd, personJsonLd } from "@/lib/seo";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // Next 16: params is a Promise
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.description, path: articlePath(a) });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const path = articlePath(a);
  const faq = articleFaq(a);
  const related = a.relatedServices
    .map((s) => services.find((x) => x.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd
        data={[
          // Article + the owner's Person node on the same page so `author` resolves in-page.
          articleJsonLd(a, path),
          personJsonLd(),
          breadcrumbJsonLd([
            { name: HUB_TITLE, path: HUB_PATH },
            { name: a.title, path },
          ]),
          // FAQPage derived from the article's own faq block — rendered visibly below.
          ...(faq.length ? [faqJsonLd(faq)] : []),
        ]}
      />
      <PageHero
        title={a.title}
        crumbs={[
          { name: HUB_TITLE, href: HUB_PATH },
          { name: a.title, href: path },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Byline published={a.datePublished} updated={a.dateModified} />
            <ArticleBody blocks={a.blocks} />
          </div>

          {/* Related services — the commercial action the guide leads to. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <p className="font-heading font-bold text-brand">השירותים שהמדריך עוסק בהם</p>
              <ul className="mt-4 space-y-3">
                {related.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}/`}
                      className="flex items-center gap-3 rounded-xl border border-line bg-white p-3 text-sm font-semibold text-brand hover:border-steel"
                    >
                      <Icon name={s.icon} className="h-5 w-5 shrink-0 text-steel" />
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={HUB_PATH}
                className="mt-5 inline-flex items-center gap-1 font-heading text-sm font-bold text-steel hover:text-brand"
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
                לכל המדריכים
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {faq.length > 0 && (
        <Faq
          items={faq}
          tint="mist"
          title="שאלות נפוצות בנושא"
          lead="התשובות הקצרות לשאלות שעולות סביב הנושא הזה."
        />
      )}

      <CtaBanner />
    </>
  );
}
