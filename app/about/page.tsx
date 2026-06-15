import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import TrustBar from "@/components/TrustBar";
import WhyUs from "@/components/WhyUs";
import CtaBanner from "@/components/CtaBanner";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "אודות בטון פלוס",
  description:
    "בטון פלוס — מעל 20 שנה (משנת 2005) בניסור וקידוח בטון ביהלום. איכות, עמידה בלוחות זמנים, בטיחות ויחס אישי. חייגו 055-6601006.",
  path: "/about/",
});

const values = [
  "דיוק ביהלום בכל חיתוך וקידוח",
  "עמידה בלוחות זמנים שסוכמו",
  "בטיחות ללא פשרות ועבודה מבוטחת",
  "אמינות, שקיפות ויחס אישי לכל לקוח",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "אודות", path: "/about/" }])} />
      <PageHero
        title="אודות בטון פלוס"
        lead="מעל 20 שנה מנסרים, קודחים ומפרקים בטון ביהלום — מדויק, נקי ובזמן."
        crumbs={[{ name: "אודות", href: "/about/" }]}
      />

      <TrustBar />

      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading align="start" eyebrow="הסיפור שלנו" title="מקצועיות שנבנתה משנת 2005" />
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              בטון פלוס פועלת משנת {site.foundedYear} ומתמחה בניסור וקידוח בטון ביהלום. לאורך {site.yearsLabel}
              צברנו ניסיון בכל סוגי העבודות — פתיחת פתחים בקירות בטון, קידוח ליבות לצנרת וחשמל, ניסור רצפות
              ותקרות, ניסור בכבל יהלום והריסה מבוקרת.
            </p>
            <p>
              אנחנו עובדים עם טכנולוגיית להב יהלום מתקדמת המאפשרת חיתוך נקי, מדויק ושקט — עם מינימום אבק ורעש,
              כך שאפשר לעבוד גם בבית מאוכלס, במשרד או בבניין פעיל. אנחנו משרתים קבלנים, מהנדסים, מנהלי
              פרויקטים, ועדי בית ובעלי נכסים בכל גוש דן והמרכז.
            </p>
            <p>
              מה שמנחה אותנו לא השתנה: איכות הביצוע, עמידה בלוחות זמנים, שמירה קפדנית על כללי הבטיחות, ויחסי
              אמון והערכה עם הלקוח. אלה המפתח להצלחה המקצועית שלנו — והסיבה שלקוחות חוזרים אלינו וממליצים.
            </p>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {values.map((v) => (
              <li key={v} className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-4 text-ink/90">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <WhyUs />
      <CtaBanner />
    </>
  );
}
