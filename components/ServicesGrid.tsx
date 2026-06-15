import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import { services } from "@/lib/site";

export default function ServicesGrid({
  eyebrow = "מה אנחנו עושים",
  title = "שירותי ניסור וקידוח בטון",
  lead = "פתרון מלא לחיתוך, קידוח ופירוק בטון ביהלום — לקבלנים, מהנדסים ובעלי נכסים.",
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  return (
    <Section tint="mist">
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}/`}
            className="card card-hover group flex flex-col p-6"
          >
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand text-cta transition-colors group-hover:bg-steel group-hover:text-white">
              <Icon name={s.icon} className="h-8 w-8" />
            </span>
            <h3 className="mt-5 text-xl">{s.title}</h3>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{s.teaser}</p>
            <span className="mt-4 inline-flex items-center gap-1 font-heading text-sm font-bold text-steel">
              פרטים נוספים
              <Icon name="arrow" className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
