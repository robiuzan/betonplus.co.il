import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import { serviceAreas, site } from "@/lib/site";

export default function ServiceAreasSection() {
  return (
    <Section tint="mist">
      <SectionHeading
        eyebrow="אזורי שירות"
        title="מגיעים אליכם — בכל גוש דן והמרכז"
        lead={`${site.areaLabel}. לא בטוחים אם אנחנו מגיעים אליכם? התקשרו ונבדוק.`}
      />
      {/*
        The chips are a list, not links — no location page exists yet, and a chip that
        looks clickable and isn't is worse than a plain label (`/local-seo-il` §9).
        The onward link below is what carries the reader forward; before it existed this
        section was a dead end with 14 city names and no next step.
      */}
      <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
        {serviceAreas.map((city) => (
          <li
            key={city.slug}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink/80"
          >
            <Icon name="mapPin" className="h-4 w-4 text-steel" />
            {city.name}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-center text-muted">
        <Link
          href="/service-areas/"
          className="font-semibold text-steel underline underline-offset-4 hover:text-brand"
        >
          מה משתנה בין אתר לאתר — גישה, סוג בנייה ושעות עבודה
        </Link>
      </p>
    </Section>
  );
}
