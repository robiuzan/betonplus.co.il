import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { site } from "@/lib/site";
import { localBusinessJsonLd } from "@/lib/seo";

export const viewport: Viewport = { themeColor: "#1f2a37" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ניסור בטון וקידוח יהלום מדויק`,
    template: `%s | ${site.name}`,
  },
  description: site.shortPitch,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
  },
  verification: { google: "ozMzEyHFAfRd_siJREJ79bbkt-EPRpUTmn-Ln9XaBz0" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c");

  return (
    <html lang="he-IL" dir="rtl">
      <body>
        {/*
          Fonts via <link> rather than next/font: React 19 hoists these to <head>, and the
          static build never depends on a build-time network fetch (keeps the build gate
          reproducible offline / in CI). The no-page-custom-font lint rule is a Pages-Router
          heuristic and a false positive for an App-Router root layout.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&family=Heebo:wght@400;500;700;800;900&display=swap"
          precedence="default"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          דלגו לתוכן
        </a>
        <Header />
        <main id="main" className="pb-16 lg:pb-0">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
