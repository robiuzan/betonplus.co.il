import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";
import WhyUs from "@/components/WhyUs";
import ServiceAreasSection from "@/components/ServiceAreasSection";
import Faq from "@/components/Faq";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, webSiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} | ניסור בטון וקידוח יהלום מדויק`,
  // Its own description rather than `site.shortPitch`. The pitch is written to sit on the
  // page, so it ran 110 chars and — alone among every route — carried no phone number, on
  // the one URL that ranks for the brand. keyword-map §5: 150–160 chars, name the area, one
  // CONFIRMED differentiator, close with the number. No 🔶 claim goes in a SERP snippet.
  description:
    "ניסור בטון, קידוח יהלום והריסה מבוקרת בגוש דן והמרכז — פתיחת פתחים לדלתות, לחלונות ולממ״דים בחיתוך מדויק, במינימום רעש ואבק ובלי לפגוע במבנה. חייגו 055-6601006.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      {/*
        No FAQPage here. The same six Q&A pairs render on /, /faq/ and /pricing/, and all
        three used to emit their own FAQPage — three competing entities for identical
        content. /faq/ is the canonical home (it carries all 16 questions); the visible
        accordion stays on this page for readers, just without duplicate markup.
      */}
      <JsonLd data={[webSiteJsonLd()]} />
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <ProcessSteps />
      <WhyUs />
      <ServiceAreasSection />
      <Faq />
      <ContactSection tint="mist" />
    </>
  );
}
