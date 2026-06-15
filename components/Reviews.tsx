import { Section, SectionHeading, Stars } from "@/components/ui";
import { reviews } from "@/lib/site";

export default function Reviews() {
  return (
    <Section>
      <SectionHeading
        eyebrow="לקוחות ממליצים"
        title="מה הלקוחות שלנו אומרים"
        lead="קבלנים, מהנדסים ובעלי בתים שסומכים עלינו לחיתוך מדויק ובזמן."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="card flex flex-col p-6">
            <Stars count={r.rating} />
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/90">
              ״{r.text}״
            </blockquote>
            <figcaption className="mt-5 border-t border-line pt-4">
              <span className="block font-heading font-bold text-brand">{r.name}</span>
              <span className="block text-sm text-muted">{r.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
