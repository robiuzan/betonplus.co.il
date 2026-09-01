import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import { Section, SectionHeading, Button } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import {
  services,
  pricingAnswer,
  pricingFactors,
  pricingIncluded,
  pricingExtra,
  priceLabel,
  site,
  telHref,
  whatsappHref,
} from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "מחירון ניסור וקידוח בטון",
  description:
    "איך נקבע מחיר ניסור וקידוח בטון, מה כלול ומה מתומחר בנפרד, ומה משפיע על העלות — עובי הבטון, זיון, גישה לאתר והיקף. הצעת מחיר ללא התחייבות. חייגו 055-6601006.",
  path: "/pricing/",
});

export default function PricingPage() {
  return (
    <>
      {/* FAQPage qualifies here: the full faqs array is rendered visibly below. */}
      {/*
        No FAQPage here either — see the note on app/page.tsx. This page was the worst of
        the three: it emitted the general FAQ array under a "שאלות נפוצות על מחירים"
        heading, so four of the six questions marked up as pricing FAQs were not about
        price at all. /faq/ owns the entity.
      */}
      <JsonLd data={[breadcrumbJsonLd([{ name: "מחירון", path: "/pricing/" }])]} />
      <PageHero
        title="מחירון ניסור וקידוח בטון"
        lead="מחירי פתיחה שקופים, והצעת מחיר מדויקת לאחר בדיקת היקף העבודה — תמיד ללא התחייבות."
        crumbs={[{ name: "מחירון", href: "/pricing/" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {/* Answer block — question-form h2, complete answer in the first sentence (AEO). */}
          <h2 className="text-2xl">{pricingAnswer.q}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/90">{pricingAnswer.a}</p>
        </div>

        {/* overflow-x-auto: the table scrolls inside its own container on narrow screens,
            never the page body (responsive-accessibility skill). */}
        <div className="mt-10 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-start">
            <thead>
              <tr className="bg-brand text-white">
                <th
                  scope="col"
                  className="p-4 text-start font-heading text-sm font-bold sm:text-base"
                >
                  שירות
                </th>
                <th
                  scope="col"
                  className="p-4 text-start font-heading text-sm font-bold sm:text-base"
                >
                  מחיר התחלתי
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {services.map((s) => (
                <tr key={s.slug} className="bg-white">
                  <td className="p-4">
                    <Link
                      href={`/services/${s.slug}/`}
                      className="font-semibold text-brand underline decoration-line hover:decoration-steel"
                    >
                      {s.title}
                    </Link>
                    <span className="mt-0.5 block text-sm text-muted">{s.teaser}</span>
                  </td>
                  <td className="p-4 font-heading font-bold whitespace-nowrap text-steel">
                    {priceLabel(s.priceFrom)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted">
          * המחירים הם מחירי התחלה להמחשה בלבד ואינם מהווים הצעת מחיר מחייבת. המחיר הסופי נקבע לאחר
          בדיקת העבודה.
        </p>

        <div className="mt-12">
          <SectionHeading
            align="start"
            eyebrow="מה משפיע על המחיר"
            title="ששת הגורמים שקובעים את העלות"
            lead="לפי סדר ההשפעה, מהמשמעותי ביותר."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {pricingFactors.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-cta">
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tint="mist">
        <SectionHeading
          eyebrow="שקיפות"
          title="מה כלול במחיר ומה מתומחר בנפרד"
          lead="השאלה הנפוצה ביותר לפני שמזמינים — עדיף לדעת מראש."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg">כלול במחיר</h3>
            <ul className="mt-4 space-y-2.5">
              {pricingIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/90">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-lg">מתומחר בנפרד</h3>
            <ul className="mt-4 space-y-2.5">
              {pricingExtra.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/90">
                  <Icon name="arrow" className="mt-0.5 h-4 w-4 shrink-0 rotate-180 text-muted" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-cta/40 bg-cta/10 p-6">
          <h3 className="text-lg">איך מקבלים הצעה מדויקת בשיחה אחת</h3>
          <p className="mt-3 leading-relaxed text-ink/90">
            ארבעה פרטים מספיקים לרוב: מה צריך לפתוח או לקדוח, עובי הקיר או הרצפה וסוג הבנייה, הקומה
            ומצב הגישה, והאם יש תכנית או אישור מהנדס. תמונה של האזור בוואטסאפ חוסכת בדרך כלל ביקור
            מקדים.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={whatsappHref} data-cta="pricing-whatsapp" variant="whatsapp">
              <Icon name="whatsapp" className="h-5 w-5" />
              שלחו תמונה בוואטסאפ
            </Button>
            <Button href="/contact/" data-cta="pricing-form" variant="outline">
              טופס הצעת מחיר
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">
            או פשוט להתקשר:{" "}
            {/* Was a bare <span> — the highest-intent moment on the page printed the
                number as untappable text. It is a click-to-call link now. */}
            <a
              href={telHref}
              data-cta="pricing-call"
              className="ltr font-semibold text-steel underline hover:text-brand"
            >
              {site.phoneDisplay}
            </a>
          </p>
        </div>
      </Section>

      <Faq tint={undefined} title="שאלות נפוצות על מחירים" lead="כל מה שחשוב לדעת לפני שמתחילים." />
      <CtaBanner
        title="רוצים מחיר מדויק לעבודה שלכם?"
        text="שלחו פרטים ונחזור עם הצעת מחיר ללא התחייבות."
      />
    </>
  );
}
