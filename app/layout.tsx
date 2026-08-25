import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { ogImageMeta } from "@ishub/site-kit";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { site, manifest } from "@/lib/site";
import { localBusinessJsonLd } from "@/lib/seo";
import { gtmHeadSnippet, gtmNoScriptSrc } from "@ishub/site-kit/analytics";

export const viewport: Viewport = { themeColor: "#1f2a37" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ניסור בטון וקידוח יהלום מדויק`,
    template: `%s | ${site.name}`,
  },
  description: site.shortPitch,
  openGraph: {
    images: ogImageMeta(manifest.images),
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
  },
  // Search Console token comes from the roster manifest (analytics.googleSiteVerification),
  // so a roster sync manages it and cloned sites don't inherit betonplus's token.
  ...(manifest.analytics?.googleSiteVerification
    ? { verification: { google: manifest.analytics.googleSiteVerification } }
    : {}),
};

/** Shared GTM loader — inert (renders nothing) until analytics.gtmId is set in the manifest. */
const gtmHead = gtmHeadSnippet(manifest.analytics?.gtmId);
const gtmNoScript = gtmNoScriptSrc(manifest.analytics?.gtmId);

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&family=Heebo:wght@400;500;700;800;900&display=swap";

/**
 * The **Hebrew subset** of each family — one variable file per family, covering every
 * weight we request. Preloading these removes a full round trip from the font critical
 * path: without it the browser only discovers them after fetching and parsing the Google
 * stylesheet. The page's LCP element is the Hebrew `<h1>`, so this is the LCP path.
 *
 * ⚠️ These URLs are version-pinned by Google (`/v28/`, `/v24/`) and will eventually go
 * stale. A stale preload is harmless — the stylesheet still loads the correct file, we
 * just waste one request — but it stops helping. `/qa-build-gate` §12 re-checks them
 * against the live stylesheet; refresh when it reports a miss.
 * Verified 200 on 2026-08-25: 12,036 B (Heebo) + 7,312 B (Assistant).
 */
const HEBREW_FONT_FILES = [
  "https://fonts.gstatic.com/s/heebo/v28/NGS6v5_NC0k9P9H0TbFzsQ.woff2",
  "https://fonts.gstatic.com/s/assistant/v24/2sDcZGJYnIjSi6H75xkzamW5O7w.woff2",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c");

  // React 19's resource API rather than a <link rel="preload"> in JSX: React hoists such a
  // link into <head> but ALSO leaves the original where it was rendered, emitting every
  // tag twice (observed here — 4 tags for 2 fonts). preload() registers each resource once.
  HEBREW_FONT_FILES.forEach((href) =>
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" }),
  );

  return (
    <html lang="he-IL" dir="rtl">
      {/*
        Explicit <head> so the GTM loader lands there rather than as the first child of
        <body> (backlog §13.1). React 19 auto-hoists <link> and <meta>, but NOT an inline
        <script dangerouslySetInnerHTML> — that one has to be placed here by hand, and
        Google's own install requires it in <head> so the container is ready before the
        first events. The <noscript> iframe stays in <body>, where it belongs.
      */}
      <head>
        {gtmHead && <script id="gtm-init" dangerouslySetInnerHTML={{ __html: gtmHead }} />}
      </head>
      <body>
        {gtmNoScript && (
          <noscript>
            <iframe
              src={gtmNoScript}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        )}
        {/*
          Fonts via <link> rather than next/font: React 19 hoists these to <head>, and the
          static build never depends on a build-time network fetch (keeps the build gate
          reproducible offline / in CI). The no-page-custom-font lint rule is a Pages-Router
          heuristic and a false positive for an App-Router root layout.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Fleet convention (deploy gate asserts it): preconnect to the manifest's media host. */}
        {manifest.images?.mediaHost && (
          <link rel="preconnect" href={`https://${manifest.images.mediaHost}`} />
        )}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONT_CSS} precedence="default" />
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
