import type { Metadata, Viewport } from "next";
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

/*
 * Font preloads REMOVED 2026-09-01.
 *
 * Two hard-coded gstatic URLs used to be preloaded here. Google Fonts serves a **different
 * file per user-agent class**, so a hard-coded pair can only ever match one class: measured
 * live, the pair matched desktop Chrome and matched nothing on Android Chrome or iOS Safari.
 * On every mobile browser the preload therefore downloaded ~19.3 KB that was parsed, found
 * unreferenced, and discarded — pure waste on the majority of this site's traffic — while the
 * stylesheet went on to fetch the real files anyway.
 *
 * It also never protected what it claimed to. The doc premise was "the LCP element is the
 * Hebrew <h1>"; measurement says the LCP element is a **paragraph in Assistant** on every
 * route (see docs/performance-guidelines.md §2 and backlog §10.4).
 *
 * Deleting is strictly better than a stale preload, but it is not the fix. The durable fix
 * is self-hosting two Hebrew subset woff2 files, which removes the UA-splitting problem and a
 * third-party origin from the critical path — pending an owner decision on adding font
 * binaries to the repo. Do NOT reinstate a hard-coded gstatic preload in the meantime.
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = JSON.stringify(localBusinessJsonLd()).replace(/</g, "\\u003c");

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
        <link rel="stylesheet" href={FONT_CSS} precedence="default" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          דלגו לתוכן
        </a>
        <Header />
        {/*
          The mobile clearance for the fixed FloatingCTA bar must sit at the BOTTOM of the
          document, not on <main>. With pb-16 on <main> the padding landed above the
          footer, so the sticky bar covered the footer's bottom row — making the
          מדיניות פרטיות and הצהרת נגישות links unclickable on every route at mobile
          widths. Those two links in particular have to stay reachable.
        */}
        <main id="main">{children}</main>
        <div className="pb-16 lg:pb-0">
          <Footer />
        </div>
        <FloatingCTA />
      </body>
    </html>
  );
}
