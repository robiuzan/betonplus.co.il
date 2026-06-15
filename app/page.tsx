import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";
import WhyUs from "@/components/WhyUs";
import Reviews from "@/components/Reviews";
import ServiceAreasSection from "@/components/ServiceAreasSection";
import Faq from "@/components/Faq";
import ContactSection from "@/components/ContactSection";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} | ניסור בטון וקידוח יהלום מדויק`,
  description: site.shortPitch,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <ProcessSteps />
      <WhyUs />
      <Reviews />
      <ServiceAreasSection />
      <Faq />
      <ContactSection tint="mist" />
    </>
  );
}
