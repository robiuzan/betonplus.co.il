import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { Section } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של אתר בטון פלוס — איזה מידע נאסף, כיצד נעשה בו שימוש וזכויותיכם.",
  path: "/privacy/",
});

const prose =
  "max-w-3xl mx-auto [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:mb-2 [&_p]:text-muted [&_p]:leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:text-muted [&_li]:mb-1";

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "מדיניות פרטיות", path: "/privacy/" }])} />
      <PageHero title="מדיניות פרטיות" crumbs={[{ name: "מדיניות פרטיות", href: "/privacy/" }]} />
      <Section>
        <article className={prose}>
          <p>
            פרטיותכם חשובה ל{site.name}. מדיניות זו מסבירה איזה מידע נאסף באתר {site.domain} וכיצד
            אנו עושים בו שימוש. {/* 🔶 confirm legal entity & DPO if applicable */}
          </p>

          <h2>איזה מידע נאסף</h2>
          <p>
            כאשר אתם פונים אלינו דרך טופס יצירת הקשר, אנו אוספים את הפרטים שאתם מוסרים מרצונכם: שם,
            מספר טלפון, עיר/אזור ותיאור העבודה. בנוסף עשוי להיאסף מידע טכני אנונימי על השימוש באתר
            (כגון סוג דפדפן ועמודים שנצפו) לצורכי שיפור השירות.
          </p>

          <h2>השימוש במידע</h2>
          <ul>
            <li>יצירת קשר ומתן מענה לפנייתכם והכנת הצעת מחיר.</li>
            <li>שיפור האתר והשירות.</li>
            <li>עמידה בדרישות חוקיות במידת הצורך.</li>
          </ul>

          <h2>העברת מידע לצדדים שלישיים</h2>
          <p>
            {/*
              The processor MUST match components/ContactForm.tsx. This said FormSubmit
              while the form posted to Web3Forms — naming the wrong processor in a privacy
              notice is a disclosure defect, not a typo. If the endpoint ever changes,
              change this sentence in the same commit.
            */}
            טופס הפנייה נשלח באמצעות שירות צד שלישי (Web3Forms) לכתובת הדוא״ל שלנו. איננו מוכרים או
            משכירים את המידע שלכם. ייתכן שימוש בכלי ניתוח תנועה (כגון Google Analytics) למטרות
            סטטיסטיות.
            {/* 🔶 confirm analytics provider / GA4 */}
          </p>

          <h2>עוגיות (Cookies)</h2>
          <p>
            האתר עשוי לעשות שימוש בעוגיות לצורך תפעול תקין ומדידה. ניתן לחסום עוגיות דרך הגדרות
            הדפדפן.
          </p>

          <h2>זכויותיכם</h2>
          <p>
            אתם רשאים לפנות אלינו בבקשה לעיין במידע שנאסף עליכם, לתקנו או למחקו, בכתובת{" "}
            <span className="ltr">{site.email}</span> או בטלפון{" "}
            <span className="ltr">{site.phoneDisplay}</span>.
          </p>

          <h2>יצירת קשר</h2>
          <p>
            בכל שאלה בנוגע למדיניות זו ניתן לפנות אל {site.name} בטלפון{" "}
            <span className="ltr">{site.phoneDisplay}</span> או בדוא״ל{" "}
            <span className="ltr">{site.email}</span>.
          </p>
        </article>
      </Section>
    </>
  );
}
