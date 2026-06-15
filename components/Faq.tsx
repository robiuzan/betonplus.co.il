import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import { faqs as allFaqs, type Faq as FaqItem } from "@/lib/site";

/** Zero-JS accordion via native <details>/<summary>. */
export default function Faq({
  items = allFaqs,
  tint,
  title = "שאלות נפוצות",
  lead = "כל מה שכדאי לדעת לפני שמתחילים. לא מצאתם תשובה? התקשרו אלינו.",
}: {
  items?: FaqItem[];
  tint?: "mist";
  title?: string;
  lead?: string;
}) {
  return (
    <Section tint={tint}>
      <SectionHeading eyebrow="שאלות ותשובות" title={title} lead={lead} />
      <div className="mx-auto mt-10 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {items.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-heading font-bold text-brand">
              {f.q}
              <Icon
                name="arrow"
                className="h-5 w-5 shrink-0 -rotate-90 text-steel transition-transform group-open:rotate-90"
              />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
