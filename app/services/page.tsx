import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ProcessSteps from "@/components/ProcessSteps";
import CtaBanner from "@/components/CtaBanner";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { services, servicesAnswer, serviceChooser, getService } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "שירותי ניסור וקידוח בטון",
  description:
    "ניסור קירות, קידוח ליבות, ניסור רצפות ותקרות, כבל יהלום והריסה מבוקרת — ואיך לדעת איזו שיטה מתאימה לעבודה שלכם. חייגו 055-6601006.",
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
        <div className="mx-auto max-w-3xl">
          {/* Answer block — question-form h2, complete answer in the first sentence (AEO). */}
          <h2 className="text-2xl">{servicesAnswer.q}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/90">{servicesAnswer.a}</p>
          <p className="mt-4 leading-relaxed text-muted">
            כל חמשת השירותים משתמשים באותה טכנולוגיה — להב או כבל משובץ יהלום שחותך בטון וזיון
            בשחיקה מבוקרת, בלי הלימות ובלי רעידות. מה שמשתנה הוא הכלי, וההתאמה שלו לצורת הפתח ולעובי
            האלמנט.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <SectionHeading
            align="start"
            eyebrow="בחירה מהירה"
            title="מה אתם צריכים לפתוח?"
            lead="החל מהצורך, לא מהשיטה."
          />
          <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {serviceChooser.map((row) => {
              const svc = getService(row.slug);
              if (!svc) return null;
              return (
                <li key={row.slug}>
                  <Link
                    href={`/services/${row.slug}/`}
                    className="flex items-start gap-4 p-5 transition-colors hover:bg-mist"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand text-cta">
                      <Icon name={svc.icon} className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-heading font-bold text-brand">{row.need}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted">
                        {row.answer}
                      </span>
                    </span>
                    <Icon name="arrow" className="mt-2 h-4 w-4 shrink-0 text-steel" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-sm text-muted">
            עדיין לא בטוחים? ההשוואה המלאה בין השיטות, כולל המגבלה של כל אחת, נמצאת ב
            <Link href="/faq/" className="font-semibold text-steel underline hover:text-brand">
              שאלות הנפוצות
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section tint="mist">
        <SectionHeading
          eyebrow="השירותים"
          title="מה אנחנו מבצעים"
          lead="לחצו על שירות לפרטים מלאים — ציוד, מה כלול, ומתי נדרש אישור קונסטרוקטור."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <article key={s.slug} className="card flex flex-col p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand text-cta">
                  <Icon name={s.icon} className="h-8 w-8" />
                </span>
                <div>
                  <h3 className="text-xl">{s.title}</h3>
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
              <Link href={`/services/${s.slug}/`} className="btn btn-outline mt-6 w-full">
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
