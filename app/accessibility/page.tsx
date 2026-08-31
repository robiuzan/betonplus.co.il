import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { site, formatDateIL } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

/** Date the claims on this page were last checked against the shipped site. */
const ACCESSIBILITY_UPDATED = "2026-08-31";

export const metadata: Metadata = pageMetadata({
  title: "הצהרת נגישות",
  description:
    "הצהרת הנגישות של אתר בטון פלוס — מחויבות לנגישות לפי תקן ישראלי 5568 ו-WCAG 2.0 ברמה AA.",
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
            {site.name} רואה חשיבות רבה במתן שירות שוויוני לכלל הלקוחות, ופועלת להנגשת אתר האינטרנט
            שלה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), ולתקן הישראלי
            5568 המבוסס על הנחיות WCAG 2.0 ברמת AA.
          </p>

          {/*
            Every line below must be TRUE of the shipped site. This list previously claimed
            "ניווט מלא באמצעות מקלדת" and blanket alt-text coverage, neither of which held —
            an accessibility statement that overstates is a compliance problem in itself, not
            just inaccurate copy. If a claim here stops being true, change the site or change
            the claim, in the same commit.
          */}
          <h2>מה הונגש באתר</h2>
          <ul>
            <li>מבנה כותרות סמנטי והיררכי, עם כותרת ראשית אחת בכל עמוד, לניווט בעזרת קורא מסך.</li>
            <li>ניווט במקלדת עם סימון מיקוד (focus) גלוי בכל רכיב אינטראקטיבי, כולל שדות הטופס.</li>
            <li>קישור ״דלגו לתוכן״ בראש כל עמוד, ותמיכה בכיווניות עברית (RTL).</li>
            <li>
              טפסים עם תוויות (labels) מקושרות, הודעות שגיאה מילוליות וקישור בין השדה לשגיאתו.
            </li>
            <li>ניגודיות צבעים בהתאם לרמה AA בטקסט הגוף, בכותרות ובכפתורי הפעולה.</li>
            <li>טקסט חלופי לסמלים ולנכסי המותג, ותיאור מילולי לקישורים ולכפתורים.</li>
          </ul>

          <h2>הסתייגויות — מה עדיין לא נגיש</h2>
          <p>אנחנו מעדיפים לפרט מה חסר במקום להסתפק בנוסח כללי. נכון למועד העדכון שלהלן:</p>
          <ul>
            <li>
              שתי טבלאות ההשוואה בעמוד השאלות הנפוצות נגללות לרוחב במסכים צרים, והגלילה שלהן אינה
              נגישה במלואה באמצעות מקלדת בכל הדפדפנים.
            </li>
            <li>
              בגלישה בנייד, סרגל הפעולה הקבוע בתחתית המסך עלול להסתיר רכיב שקיבל מיקוד בעת ניווט
              במקלדת.
            </li>
            <li>באתר אין כרגע צילומים של עבודות. כשיתווספו, כל תמונה תקבל טקסט חלופי בעברית.</li>
          </ul>
          <p>אנחנו ממשיכים לשפר את הנגישות באופן שוטף, ונשמח לקבל פנייה על כל תקלה שנתקלתם בה.</p>

          <h2>פנייה בנושא נגישות</h2>
          <p>
            נתקלתם בבעיית נגישות? נשמח שתעדכנו אותנו ונטפל בהקדם. ניתן לפנות לרכז הנגישות שלנו
            בטלפון <span className="ltr">{site.phoneDisplay}</span> או בדוא״ל{" "}
            <span className="ltr">{site.email}</span>.{" "}
            {/* 🔶 confirm accessibility coordinator details */}
          </p>

          <h2>תאריך עדכון</h2>
          {/*
            A specific date, not a year — the regulations expect one, and "בשנת 2026" tells a
            reader nothing about whether the statement predates the site they are looking at.
            Static export, so no runtime Date: bump this by hand whenever the claims above
            change.
          */}
          <p>
            הצהרת נגישות זו עודכנה בתאריך{" "}
            <time className="ltr" dateTime={ACCESSIBILITY_UPDATED}>
              {formatDateIL(ACCESSIBILITY_UPDATED)}
            </time>
            .
          </p>
        </article>
      </Section>
    </>
  );
}
