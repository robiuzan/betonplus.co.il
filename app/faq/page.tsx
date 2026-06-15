import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Faq from "@/components/Faq";
import CtaBanner from "@/components/CtaBanner";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "שאלות נפוצות",
  description:
    "תשובות לשאלות נפוצות על ניסור וקידוח בטון: מחירים, רעש ואבק, יציבות המבנה, משך העבודה, אזורי שירות וביטוח. חייגו 055-6601006.",
  path: "/faq/",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={[faqJsonLd(), breadcrumbJsonLd([{ name: "שאלות נפוצות", path: "/faq/" }])]} />
      <PageHero
        title="שאלות נפוצות"
        lead="כל מה שכדאי לדעת על ניסור וקידוח בטון לפני שמתחילים."
        crumbs={[{ name: "שאלות נפוצות", href: "/faq/" }]}
      />
      <Faq />
      <CtaBanner title="לא מצאתם תשובה?" text="התקשרו אלינו ונשמח לעזור ולתת הצעת מחיר." />
    </>
  );
}
