import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import { differentiators } from "@/lib/site";

export default function WhyUs() {
  return (
    <Section tint="mist">
      <SectionHeading
        eyebrow="למה בטון פלוס"
        title="מקצועיות שמרגישים בכל פרט"
        lead="לא רק מנסרים בטון — מבצעים נקי, בזמן ובראש שקט."
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {differentiators.map((d) => (
          <div key={d.title} className="card p-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-steel/10 text-steel">
              <Icon name={d.icon} className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-lg">{d.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{d.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
