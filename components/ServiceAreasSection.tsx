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
      <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
        {serviceAreas.map((city) => (
          <li
            key={city}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink/80"
          >
            <Icon name="mapPin" className="h-4 w-4 text-steel" />
            {city}
          </li>
        ))}
      </ul>
    </Section>
  );
}
