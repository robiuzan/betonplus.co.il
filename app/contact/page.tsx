import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { Section } from "@/components/ui";
import { pageMetadata, breadcrumbJsonLd, contactPageJsonLd } from "@/lib/seo";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: "צור קשר",
  description:
    "צרו קשר עם בטון פלוס לקבלת הצעת מחיר לניסור או קידוח בטון בגוש דן והמרכז — טלפון, וואטסאפ וטופס פנייה, עם מענה מהיר בשעות הפעילות. חייגו עכשיו 055-6601006.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "צור קשר", path: "/contact/" }]),
          contactPageJsonLd(
            "/contact/",
            "צור קשר — בטון פלוס",
            "טלפון, וואטסאפ וטופס פנייה לקבלת הצעת מחיר לניסור או קידוח בטון.",
          ),
        ]}
      />
      <PageHero
        title="צור קשר"
        lead="קבלו הצעת מחיר ללא התחייבות. מלאו טופס, חייגו או שלחו וואטסאפ — נחזור אליכם במהירות."
        crumbs={[{ name: "צור קשר", href: "/contact/" }]}
      />
      <ContactSection />

      {/*
        Deliberately BELOW the form. This is a conversion endpoint, so links here compete
        with the primary action — they exist for the visitor who arrived unsure what they
        actually need, not to distribute equity (`/internal-linking`, ux-cro-security §1).
      */}
      <Section tint="mist">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl">עוד לא בטוחים מה בדיוק צריך?</h2>
          <p className="mt-3 leading-relaxed text-muted">
            אפשר להתחיל מ
            <Link href="/services/" className="font-semibold text-steel underline hover:text-brand">
              רשימת השירותים
            </Link>{" "}
            כדי לזהות את סוג העבודה, לעבור על{" "}
            <Link href="/faq/" className="font-semibold text-steel underline hover:text-brand">
              ההשוואה בין שיטות החיתוך
            </Link>{" "}
            בשאלות הנפוצות, או לבדוק{" "}
            <Link href="/pricing/" className="font-semibold text-steel underline hover:text-brand">
              מה משפיע על המחיר
            </Link>{" "}
            לפני שמתקשרים.
          </p>
        </div>
      </Section>
    </>
  );
}
