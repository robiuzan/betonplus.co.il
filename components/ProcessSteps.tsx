import { Section, SectionHeading } from "@/components/ui";
import { processSteps } from "@/lib/site";

export default function ProcessSteps() {
  return (
    <Section>
      <SectionHeading
        eyebrow="איך זה עובד"
        title="חמישה צעדים פשוטים לעבודה מושלמת"
        lead="משיחת הטלפון ועד מסירת שטח עבודה נקי — תהליך ברור, בלי הפתעות."
      />
      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {processSteps.map((step, i) => (
          <li key={step.title} className="relative rounded-xl border border-line bg-white p-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-cta font-heading text-lg font-extrabold text-brand">
              {i + 1}
            </span>
            <h3 className="mt-4 text-lg">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
