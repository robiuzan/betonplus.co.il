import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import JsonLd from "@/components/JsonLd";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import { services, formatDateIL } from "@/lib/site";
import { articles, articlePath, HUB_PATH, HUB_TITLE } from "@/lib/articles";
import { pageMetadata, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

// Bare subject — the layout template appends "| בטון פלוס".
export const metadata: Metadata = pageMetadata({
  title: "מדריכים לניסור וקידוח בטון",
  description:
    "מדריכים מקצועיים על ניסור וקידוח בטון: ניסור מול הריסה, יציבות המבנה בפתיחת פתח, מתי נדרש אישור קונסטרוקטור, וקידוח יבש מול רטוב. חייגו 055-6601006.",
  path: HUB_PATH,
});

const sorted = [...articles].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

export default function GuidesHubPage() {
  return (
    <>
      <JsonLd
        data={[
          collectionPageJsonLd(
            HUB_PATH,
            "מדריכים לניסור וקידוח בטון",
            "מדריכים מקצועיים של בטון פלוס על ניסור, קידוח והריסה מבוקרת של בטון.",
          ),
          breadcrumbJsonLd([{ name: HUB_TITLE, path: HUB_PATH }]),
        ]}
      />
      <PageHero
        title="מדריכים לניסור וקידוח בטון"
        lead="התשובות הארוכות לשאלות שמגיעות אלינו לפני כל עבודה — כתובות מהשטח, לא מקטלוג."
        crumbs={[{ name: HUB_TITLE, href: HUB_PATH }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {/* Answer block — question-form h2, complete answer in the first sentence (AEO). */}
          <h2 className="text-2xl">מה יש במדריכים האלה שאין בעמודי השירות?</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/90">
            עמוד שירות מסביר מה אנחנו עושים ומה זה כולל. מדריך עונה על השאלה שקודמת להזמנה: האם בכלל
            צריך לנסר או אפשר להרוס, מה קורה לקיר כשפותחים בו פתח, מתי חובה לערב קונסטרוקטור, ומה
            ההבדל בין קידוח יבש לרטוב — עם טבלאות השוואה שאפשר להראות למהנדס או לוועד הבית.
          </p>
          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <p>
              המדריכים נכתבים על ידי בעל העסק, מתוך העבודה היומיומית בבניינים מאוכלסים ובאתרי בנייה
              בגוש דן והמרכז. כל מדריך פותח בתשובה קצרה ומלאה, ממשיך בפירוט שנשען על עובי הבטון,
              הזיון, הגישה והסביבה, וכולל שאלות ותשובות ממוקדות. איפה שיש כלל אצבע — הוא מופיע; איפה
              שהתשובה תלויה בבדיקה בשטח — כתוב במפורש שצריך בדיקה, לא ניחוש.
            </p>
            <p>
              הקוראים הטיפוסיים הם קבלני שיפוצים, מנהלי פרויקטים ומהנדסים שצריכים להחליט מהר, ובעלי
              דירות וועדי בתים שרוצים להבין למה הפתח בקיר לא נעשה בפטיש. המדריכים לא מחליפים תוכנית
              הנדסית ולא הצעת מחיר: לכל אחד מהם יש בסוף דרך ישירה אלינו בטלפון או בוואטסאפ, ותמונה
              אחת של הקיר בדרך כלל מספיקה כדי לתת הערכה ראשונית.
            </p>
          </div>
        </div>
      </Section>

      <Section tint="mist">
        <SectionHeading eyebrow="המדריכים" title="כל המדריכים" lead="לפי סדר הפרסום, החדש ראשון." />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sorted.map((a) => (
            <Link key={a.slug} href={articlePath(a)} className="card card-hover flex flex-col p-6">
              <h3 className="text-lg">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.description}</p>
              <p className="mt-3 text-xs text-muted">
                עודכן:{" "}
                <time className="ltr" dateTime={a.dateModified}>
                  {formatDateIL(a.dateModified)}
                </time>
              </p>
              <span className="mt-3 inline-flex items-center gap-1 font-heading text-sm font-bold text-steel">
                לקריאה
                <Icon name="arrow" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="השירותים"
          title="מהמדריך לעבודה עצמה"
          lead="כל מדריך מקושר לשירות שהוא עוסק בו — ושם יש גם את המחיר ההתחלתי ואת מה שכלול."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}/`}
                className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 font-semibold text-brand hover:border-steel"
              >
                <Icon name={s.icon} className="h-6 w-6 shrink-0 text-steel" />
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBanner />
    </>
  );
}
