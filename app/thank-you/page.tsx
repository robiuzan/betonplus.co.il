import type { Metadata } from "next";
import Link from "next/link";
import { Section, Button } from "@/components/ui";
import Icon from "@/components/Icon";
import { site, telHref, whatsappHref } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * Post-submit conversion page. noindex (thin by design, and a stray SERP entry would
 * inflate conversion counts) and deliberately absent from staticRoutes/sitemap. Its URL
 * is the clean conversion target for GA4 / Google Ads.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    title: "תודה על הפנייה",
    description: "הפנייה נשלחה בהצלחה — נחזור אליכם בהקדם. בטון פלוס, ניסור וקידוח בטון.",
    path: "/thank-you/",
  }),
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <Section tint="mist">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600">
          <Icon name="check" className="h-9 w-9" />
        </span>
        <h1 className="mt-6 text-3xl">תודה, הפנייה נשלחה בהצלחה!</h1>
        <p className="mt-3 text-lg text-muted">
          נחזור אליכם בהקדם בשעות הפעילות ({site.hours}). לעניין דחוף — אנחנו זמינים כבר עכשיו
          בטלפון ובוואטסאפ:
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href={telHref} data-cta="thankyou-call" variant="cta">
            <Icon name="phone" className="h-5 w-5" />
            התקשרו <span className="ltr">{site.phoneDisplay}</span>
          </Button>
          <Button href={whatsappHref} data-cta="thankyou-whatsapp" variant="whatsapp">
            <Icon name="whatsapp" className="h-5 w-5" />
            שלחו וואטסאפ
          </Button>
        </div>
        <p className="mt-8 text-sm text-muted">
          בינתיים אפשר להמשיך לעיין{" "}
          <Link href="/services/" className="font-semibold text-steel underline">
            בשירותים שלנו
          </Link>{" "}
          או{" "}
          <Link href="/faq/" className="font-semibold text-steel underline">
            בשאלות הנפוצות
          </Link>
          .
        </p>
      </div>
    </Section>
  );
}
