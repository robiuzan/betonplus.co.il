import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import CompareTable from "@/components/CompareTable";
import JsonLd from "@/components/JsonLd";
import { Section, SectionHeading } from "@/components/ui";
import { faqs, faqGroups, sawingVsBreaking, methodSelection } from "@/lib/site";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "שאלות נפוצות על ניסור וקידוח בטון",
  description:
    "ניסור מול שבירה, מתי נדרש אישור קונסטרוקטור, כמה רעש ואבק נוצרים באתר, איזו שיטת חיתוך מתאימה לכל עבודה ומה בדיוק משפיע על המחיר הסופי. חייגו 055-6601006.",
  path: "/faq/",
});

// Every question marked up below is rendered visibly on this page — the FAQPage
// requirement (schema-structured-data skill, rule 2).
const allFaqItems = [...faqs, ...faqGroups.flatMap((g) => g.items)];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[faqJsonLd(allFaqItems), breadcrumbJsonLd([{ name: "שאלות נפוצות", path: "/faq/" }])]}
      />
      <PageHero
        title="שאלות נפוצות"
        lead="כל מה שכדאי לדעת על ניסור וקידוח בטון לפני שמתחילים."
        crumbs={[{ name: "שאלות נפוצות", href: "/faq/" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {/* Answer block — question-form h2, complete answer in the first sentence (AEO). */}
          <h2 className="text-2xl">מה ההבדל בין ניסור בטון לשבירה בפטישון?</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/90">
            ניסור יהלום חותך את הבטון והזיון בקו ישר ומדויק, בלי רעידות וכמעט בלי אבק, ומשאיר פתח עם
            קצוות חלקים. שבירה בפטישון מפוררת את הבטון בהלימות שמתפשטות במבנה, יוצרת קצוות משוננים
            ואבק רב, ועלולה לסדוק את הקיר סביב. לכן פתח מוגדר בקיר קיים כמעט תמיד מנוסר.
          </p>

          <div className="mt-10">
            <SectionHeading
              align="start"
              eyebrow="השוואה"
              title="ניסור יהלום מול שבירה בפטישון"
              lead="שתי הדרכים לפתוח בטון, ומה באמת ההבדל ביניהן בשטח."
            />
            <CompareTable
              caption="השוואה בין ניסור יהלום לשבירה בפטישון"
              head={["קריטריון", "ניסור יהלום", "שבירה בפטישון"]}
              rows={sawingVsBreaking.map((r) => [r.criterion, r.sawing, r.breaking])}
            />
            <p className="mt-4 text-sm text-muted">
              שבירה בפטישון אינה תמיד הבחירה הגרועה — לפירוק מלא של אלמנט שאינו נושא, כשאין דרישת
              דיוק ואין שכנים בסביבה, היא מהירה וזולה. ההבדל מתחיל כשצריך פתח במידה מדויקת, כשהקיר
              נושא, או כשעובדים בבניין מאוכלס.
            </p>
          </div>

          <div className="mt-12">
            <SectionHeading
              align="start"
              eyebrow="בחירת שיטה"
              title="איזו שיטת יהלום מתאימה לאיזו עבודה"
              lead="ארבע שיטות, כל אחת עם היתרון והמגבלה שלה."
            />
            <CompareTable
              caption="התאמת שיטת ניסור או קידוח לסוג העבודה"
              head={["שיטה", "מתאימה במיוחד ל", "המגבלה"]}
              rows={methodSelection.map((r) => [r.method, r.bestFor, r.limit])}
            />
            <p className="mt-4 text-sm text-muted">
              בפועל רוב העבודות משלבות כמה שיטות — למשל{" "}
              <Link
                href="/services/core-drilling/"
                className="font-semibold text-steel underline hover:text-brand"
              >
                קידוח ליבות
              </Link>{" "}
              בפינות הפתח ואחריו{" "}
              <Link
                href="/services/wall-sawing/"
                className="font-semibold text-steel underline hover:text-brand"
              >
                ניסור הקיר
              </Link>{" "}
              לאורך הקווים, או קידוחי מעבר לפני{" "}
              <Link
                href="/services/wire-saw/"
                className="font-semibold text-steel underline hover:text-brand"
              >
                ניסור בכבל יהלום
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Faq
        tint="mist"
        title="שאלות כלליות"
        lead="המחיר, משך העבודה, אזורי השירות והדברים שנשאלים הכי הרבה."
      />

      {faqGroups.map((group, i) => (
        <Faq
          key={group.title}
          items={group.items}
          tint={i % 2 === 0 ? undefined : "mist"}
          title={group.title}
          lead=""
        />
      ))}

      <CtaBanner title="לא מצאתם תשובה?" text="התקשרו אלינו ונשמח לעזור ולתת הצעת מחיר." />
    </>
  );
}
