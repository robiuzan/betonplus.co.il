import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "צור קשר",
  description:
    "צרו קשר עם בטון פלוס לקבלת הצעת מחיר לניסור או קידוח בטון — טלפון, וואטסאפ וטופס פנייה. מענה מהיר. חייגו 055-6601006.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "צור קשר", path: "/contact/" }])} />
      <PageHero
        title="צור קשר"
        lead="קבלו הצעת מחיר ללא התחייבות. מלאו טופס, חייגו או שלחו וואטסאפ — נחזור אליכם במהירות."
        crumbs={[{ name: "צור קשר", href: "/contact/" }]}
      />
      <ContactSection />
    </>
  );
}
