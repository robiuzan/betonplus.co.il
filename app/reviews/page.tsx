import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reviews from "@/components/Reviews";
import CtaBanner from "@/components/CtaBanner";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "המלצות לקוחות",
  description:
    "מה לקוחות בטון פלוס אומרים על שירותי ניסור וקידוח הבטון שלנו — קבלנים, מהנדסים ובעלי בתים. חייגו 055-6601006.",
  path: "/reviews/",
});

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "המלצות", path: "/reviews/" }])} />
      <PageHero
        title="המלצות לקוחות"
        lead="קבלנים, מהנדסים ובעלי בתים שסומכים עלינו לחיתוך מדויק, נקי ובזמן."
        crumbs={[{ name: "המלצות", href: "/reviews/" }]}
      />
      <Reviews />
      <CtaBanner title="רוצים להצטרף ללקוחות המרוצים?" text="קבלו הצעת מחיר ללא התחייבות עוד היום." />
    </>
  );
}
