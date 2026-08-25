import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import TrustBar from "@/components/TrustBar";
import WhyUs from "@/components/WhyUs";
import CtaBanner from "@/components/CtaBanner";
import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { site, aboutAnswer, aboutSections, aboutPolicy } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

// Bare subject only — the layout template appends "| בטון פלוס". "אודות בטון פלוס"
// here produced the doubled-brand title (backlog §2.1, fixed 2026-08-17).
export const metadata: Metadata = pageMetadata({
  title: "אודות",
  description:
    "בטון פלוס — ניסור, קידוח והריסה מבוקרת של בטון ביהלום משנת 2005 בגוש דן והמרכז. איך אנחנו עובדים, עם מי, ומה אנחנו לא מוכנים לעשות. חייגו 055-6601006.",
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
          {/* Answer block — question-form h2, complete answer in the first sentence (AEO). */}
          <h2 className="text-2xl">{aboutAnswer.q}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/90">{aboutAnswer.a}</p>

          <div className="mt-6 space-y-4 leading-relaxed text-muted">
            <p>
              בטון פלוס פועלת משנת {site.foundedYear} ומתמחה בניסור וקידוח בטון ביהלום. לאורך{" "}
              {site.yearsLabel} צברנו ניסיון בכל סוגי העבודות — פתיחת פתחים בקירות בטון, קידוח ליבות
              לצנרת וחשמל, ניסור רצפות ותקרות, ניסור בכבל יהלום והריסה מבוקרת.
            </p>
            <p>
              אנחנו משרתים קבלנים, מהנדסים, מנהלי פרויקטים, ועדי בית ובעלי נכסים בכל גוש דן והמרכז.
              מה שמנחה אותנו לא השתנה: איכות הביצוע, עמידה בלוחות זמנים, שמירה קפדנית על כללי
              הבטיחות, ויחסי אמון והערכה עם הלקוח.
            </p>
          </div>

          {aboutSections.map((sec) => (
            <div key={sec.title} className="mt-10">
              <h2 className="text-2xl">{sec.title}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-muted">
                {sec.paras.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {values.map((v) => (
              <li
                key={v}
                className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-4 text-ink/90"
              >
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tint="mist">
        <SectionHeading
          eyebrow="הקווים האדומים שלנו"
          title="מה אנחנו לא מוכנים לעשות"
          lead="שלושה כללים שלא נעקוף, גם כשמבקשים — הם הסיבה שאפשר לסמוך על התוצאה."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
          {aboutPolicy.map((p) => (
            <div key={p.title} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-cta">
                <Icon name="shield" className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
          רוצים לראות איך זה מתורגם לעבודה בפועל? כל{" "}
          <Link href="/services/" className="font-semibold text-steel underline hover:text-brand">
            עמוד שירות
          </Link>{" "}
          מפרט מה כלול, איזה ציוד משמש ומתי נדרש אישור קונסטרוקטור.
        </p>
      </Section>

      <WhyUs />
      <CtaBanner />
    </>
  );
}
