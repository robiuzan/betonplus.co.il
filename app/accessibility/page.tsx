import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "הצהרת נגישות",
  description: "הצהרת הנגישות של אתר בטון פלוס — מחויבות לנגישות לפי תקן ישראלי 5568 ו-WCAG 2.0 ברמה AA.",
  path: "/accessibility/",
});

const prose =
  "max-w-3xl mx-auto [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:mb-2 [&_p]:text-muted [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:text-muted [&_li]:mb-1";

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "הצהרת נגישות", path: "/accessibility/" }])} />
      <PageHero title="הצהרת נגישות" crumbs={[{ name: "הצהרת נגישות", href: "/accessibility/" }]} />
      <Section>
        <article className={prose}>
          <p>
            {site.name} רואה חשיבות רבה במתן שירות שוויוני לכלל הלקוחות, ופועלת להנגשת אתר האינטרנט שלה
            בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), ולתקן הישראלי 5568 המבוסס
            על הנחיות WCAG 2.0 ברמת AA.
          </p>

          <h2>מה הונגש באתר</h2>
          <ul>
            <li>מבנה כותרות סמנטי והיררכי לניווט בעזרת קורא מסך.</li>
            <li>ניווט מלא באמצעות מקלדת וסימון מיקוד (focus) ברור.</li>
            <li>טקסט חלופי לתמונות ולסמלים, וניגודיות צבעים מספקת.</li>
            <li>קישור ״דלגו לתוכן״ ותמיכה בכיווניות עברית (RTL).</li>
            <li>טפסים עם תוויות (labels) ברורות.</li>
          </ul>

          <h2>הסתייגויות</h2>
          <p>
            ייתכן שחלקים מסוימים באתר טרם הונגשו במלואם. אנו ממשיכים לשפר את הנגישות באופן שוטף, ונשמח לקבל
            פניות במקרה של תקלה.
          </p>

          <h2>פנייה בנושא נגישות</h2>
          <p>
            נתקלתם בבעיית נגישות? נשמח שתעדכנו אותנו ונטפל בהקדם. ניתן לפנות לרכז הנגישות שלנו בטלפון{" "}
            {site.phoneDisplay} או בדוא״ל {site.email}. {/* 🔶 confirm accessibility coordinator details */}
          </p>

          <h2>תאריך עדכון</h2>
          <p>הצהרת נגישות זו עודכנה בשנת 2026.</p>
        </article>
      </Section>
    </>
  );
}
