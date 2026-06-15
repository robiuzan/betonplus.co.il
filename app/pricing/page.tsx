import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { services } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "מחירון ניסור וקידוח בטון",
  description:
    "מחירון ניסור בטון החל מ-₪150 למ״ר וקידוח החל מ-₪190 למ׳. המחיר הסופי לפי עובי הבטון, נגישות והיקף העבודה. הצעת מחיר ללא התחייבות — 055-6601006.",
  path: "/pricing/",
});

const factors = [
  "עובי וסוג הבטון (רגיל / מזוין)",
  "נגישות לאתר ותנאי העבודה",
  "היקף העבודה וכמות הפתחים/קידוחים",
  "הציוד הנדרש (דיסק / כבל יהלום)",
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "מחירון", path: "/pricing/" }])} />
      <PageHero
        title="מחירון ניסור וקידוח בטון"
        lead="מחירי פתיחה שקופים, והצעת מחיר מדויקת לאחר בדיקת היקף העבודה — תמיד ללא התחייבות."
        crumbs={[{ name: "מחירון", href: "/pricing/" }]}
      />

      <Section>
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-start">
            <thead>
              <tr className="bg-brand text-white">
                <th className="p-4 text-start font-heading text-sm font-bold sm:text-base">שירות</th>
                <th className="p-4 text-start font-heading text-sm font-bold sm:text-base">מחיר התחלתי</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {services.map((s) => (
                <tr key={s.slug} className="bg-white">
                  <td className="p-4">
                    <span className="font-semibold text-brand">{s.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{s.teaser}</span>
                  </td>
                  <td className="whitespace-nowrap p-4 font-heading font-bold text-steel">
                    {s.priceFrom ? `החל מ-${s.priceFrom}` : "הצעת מחיר"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          * המחירים הם מחירי התחלה להמחשה בלבד ואינם מהווים הצעת מחיר מחייבת. המחיר הסופי נקבע לאחר בדיקת
          העבודה.
        </p>

        <div className="mt-10">
          <SectionHeading
            align="start"
            eyebrow="מה משפיע על המחיר"
            title="הגורמים שקובעים את העלות"
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {factors.map((f) => (
              <li key={f} className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-4 text-ink/90">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Faq tint="mist" title="שאלות נפוצות על מחירים" lead="כל מה שחשוב לדעת לפני שמתחילים." />
      <CtaBanner title="רוצים מחיר מדויק לעבודה שלכם?" text="שלחו פרטים ונחזור עם הצעת מחיר ללא התחייבות." />
    </>
  );
}
