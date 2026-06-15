import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServiceAreasSection from "@/components/ServiceAreasSection";
import CtaBanner from "@/components/CtaBanner";
import { Section } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "אזורי שירות — ניסור בטון בגוש דן והמרכז",
  description:
    "בטון פלוס מספקת שירותי ניסור וקידוח בטון בכל גוש דן והמרכז — תל אביב, רמת גן, פתח תקווה, חולון ועוד, עם פריסה ארצית בתיאום. חייגו 055-6601006.",
  path: "/service-areas/",
});

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "אזורי שירות", path: "/service-areas/" }])} />
      <PageHero
        title="אזורי שירות"
        lead={`אנחנו פועלים בכל ${site.areaLabel}. מגיעים אליכם עם כל הציוד לעבודה מדויקת במקום.`}
        crumbs={[{ name: "אזורי שירות", href: "/service-areas/" }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-muted">
            בין אם מדובר בדירה בשיפוץ בתל אביב, אתר בנייה ברמת גן או פרויקט תשתית במרכז — אנחנו מגיעים עם
            ציוד יהלום מקצועי ומבצעים את העבודה מדויק, נקי ובזמן. לא מצאתם את העיר שלכם ברשימה? התקשרו ונבדוק
            זמינות.
          </p>
        </div>
      </Section>

      <ServiceAreasSection />
      <CtaBanner title="מגיעים אליכם" text="התקשרו ובדקו זמינות מהירה לאזור שלכם." />
    </>
  );
}
