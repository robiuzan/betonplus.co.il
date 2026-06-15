import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ProcessSteps from "@/components/ProcessSteps";
import CtaBanner from "@/components/CtaBanner";
import { Section } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { services } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "שירותי ניסור וקידוח בטון",
  description:
    "מגוון שירותי ניסור, קידוח ופירוק בטון ביהלום: פתיחת פתחים, קידוח ליבות, ניסור רצפות ותקרות, כבל יהלום והריסה מבוקרת. חייגו 055-6601006.",
  path: "/services/",
});

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "שירותים", path: "/services/" }])} />
      <PageHero
        title="שירותי ניסור וקידוח בטון"
        lead="פתרון מלא לחיתוך, קידוח ופירוק בטון ביהלום — מדויק, נקי ובטוח, לכל סוגי הפרויקטים."
        crumbs={[{ name: "שירותים", href: "/services/" }]}
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <article key={s.slug} className="card flex flex-col p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand text-cta">
                  <Icon name={s.icon} className="h-8 w-8" />
                </span>
                <div>
                  <h2 className="text-xl">{s.title}</h2>
                  {s.priceFrom && (
                    <p className="mt-1 text-sm font-bold text-steel">החל מ-{s.priceFrom}</p>
                  )}
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{s.teaser}</p>
              <ul className="mt-4 grid flex-1 gap-2">
                {s.bullets.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink/85">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-steel" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${s.slug}/`}
                className="btn btn-outline mt-6 w-full"
              >
                פרטים נוספים
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      <ProcessSteps />
      <CtaBanner />
    </>
  );
}
