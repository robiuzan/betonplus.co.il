import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { serviceAreaGroups, areaLogistics, services } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "אזורי שירות — ניסור בטון בגוש דן והמרכז",
  description:
    "ניסור וקידוח בטון בתל אביב, רמת גן, פתח תקווה, חולון, ראשון לציון והשרון — ומה משתנה בין אתר לאתר בגישה, בסוג הבנייה ובשעות העבודה. חייגו 055-6601006.",
  path: "/service-areas/",
});

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "אזורי שירות", path: "/service-areas/" }]),
          collectionPageJsonLd(
            "/service-areas/",
            "אזורי שירות — ניסור בטון בגוש דן והמרכז",
            "הערים שאנחנו עובדים בהן, ומה משתנה בין אתר לאתר בגישה, בסוג הבנייה ובשעות העבודה.",
          ),
        ]}
      />
      <PageHero
        title="אזורי שירות"
        lead="פועלים בכל גוש דן והמרכז — ומגיעים עם כל הציוד לעבודה מדויקת במקום."
        crumbs={[{ name: "אזורי שירות", href: "/service-areas/" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {/* Answer block — question-form h2, complete answer in the first sentence (AEO). */}
          <h2 className="text-2xl">לאן אתם מגיעים לניסור וקידוח בטון?</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/90">
            אזור הפעילות השוטף שלנו הוא גוש דן והמרכז — מתל אביב, רמת גן, גבעתיים ובני ברק, דרך פתח
            תקווה, חולון, בת ים וראשון לציון, ועד ערי השרון. מחוץ לאזור הזה אנחנו מגיעים בתיאום
            מראש, לפי היקף העבודה. אם העיר שלכם לא מופיעה ברשימה עדיין שווה להתקשר — לרוב יש פתרון.
          </p>

          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <p>
              בפועל, מה שקובע אם עבודה מתאפשרת ובאיזה לוח זמנים הוא פחות המרחק ויותר התנאים באתר:
              האם יש גישה סבירה לרכב העבודה ולציוד הכבד, מה סוג הבנייה ועובי הבטון, ובאילו שעות מותר
              לעבוד באותו מקום. ארבעת הדברים האלה משתנים מרחוב לרחוב הרבה יותר מאשר מעיר לעיר.
            </p>
            <p>
              לכן כשאתם מתקשרים אנחנו שואלים על הקומה, על שנת הבנייה ועל הגישה — לא כדי לסבך, אלא
              כדי לתת הערכה שמחזיקה. ברוב המקרים תמונה אחת בוואטסאפ חוסכת ביקור מקדים.
            </p>
          </div>
        </div>
      </Section>

      <Section tint="mist">
        <SectionHeading
          eyebrow="פריסה"
          title="הערים שאנחנו עובדים בהן"
          lead="מקובץ לפי אזור, כדי שיהיה ברור מה שוטף ומה בתיאום מראש."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {serviceAreaGroups.map((group) => (
            <div key={group.title} className="card p-6">
              <h3 className="text-lg">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{group.note}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.areas.map((city) => (
                  <li
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink/80"
                  >
                    <Icon name="mapPin" className="h-4 w-4 text-steel" />
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="מה משתנה בין אתר לאתר"
          title="ארבעה דברים שקובעים איך העבודה תתנהל"
          lead="נכון לכל האזור — וכדאי לדעת עליהם לפני שמתאמים."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {areaLogistics.map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand text-cta">
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tint="mist">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl">מה אנחנו מבצעים בכל האזורים</h2>
          <p className="mt-4 leading-relaxed text-muted">
            כל השירותים זמינים בכל אזורי הפעילות — אותו ציוד, אותה שיטת עבודה ואותם כללי בטיחות:
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/`}
                  className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-4 text-ink/90 transition-colors hover:border-steel"
                >
                  <Icon name={s.icon} className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                  <span className="font-semibold">{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            לא בטוחים איזו שיטה מתאימה לעבודה שלכם? ההשוואה ב
            <Link href="/faq/" className="font-semibold text-steel underline hover:text-brand">
              שאלות הנפוצות
            </Link>{" "}
            עוזרת לבחור, ו
            <Link href="/pricing/" className="font-semibold text-steel underline hover:text-brand">
              במחירון
            </Link>{" "}
            מפורט מה משפיע על העלות.
          </p>
        </div>
      </Section>

      <CtaBanner title="מגיעים אליכם" text="התקשרו ובדקו זמינות מהירה לאזור שלכם." />
    </>
  );
}
