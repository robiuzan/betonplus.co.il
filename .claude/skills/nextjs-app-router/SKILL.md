---
name: nextjs-app-router
description: Next.js 16 App Router specifics for this static-export project — read the bundled docs first, then Promise params, force-static and dynamicParams, generateStaticParams/generateMetadata, output:"export" and what it forbids, trailingSlash, MetadataRoute sitemap/robots, the ImageResponse OG route, and unoptimized images. Use before touching routing, metadata, or image APIs. Triggers: "add a route", "generateMetadata", "params", "static export", "sitemap.ts", "dynamic route".
---

# Next.js 16 App Router (this project)

⚠️ **This is NOT the Next.js in your training data.** Next 16 has breaking changes. **Before writing any
routing/metadata/image code, read the relevant guide in `node_modules/next/dist/docs/`** and heed
deprecation notices (see [AGENTS.md](AGENTS.md)).

## Rendering model: static export (SSG)

[next.config.ts](next.config.ts):

```ts
output: "export",                              // emits static out/
trailingSlash: true,                           // every URL ends in /
images: { unoptimized: true, remotePatterns: [...] },
transpilePackages: ["@ishub/site-kit"],        // the kit ships raw .ts
```

No server at runtime. `output: "export"` **forbids** `headers()`, `redirects()`, `rewrites()`,
middleware, route handlers that need a server, server actions, dynamic SSR and ISR. If a task seems to
need one of those, the answer is at the Cloudflare edge (`public/_headers`, `public/_redirects`) — see
`/web-security-headers`.

## Route shape

Every route in this repo sets:

```ts
export const dynamic = "force-static";
```

Dynamic routes add `dynamicParams = false` so anything not pre-generated 404s.

There is **one dynamic route**: [app/services/[slug]/page.tsx](app/services/[slug]/page.tsx). Everything
else is a static directory under `app/`. Copy that file's shape when adding another:

```tsx
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // ⚠️ params is a Promise in Next 16
  const svc = getService(slug);
  if (!svc) return {};
  return pageMetadata({ ... });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = getService(slug);
  if (!svc) notFound();
  ...
}
```

## Gotchas that bite

- **`params` is a `Promise`.** `await params` in _both_ `generateMetadata` and the component.
  Destructuring it directly is the most likely regression when copying older App Router code.
- **Route data is build-time.** It comes from [lib/site.ts](lib/site.ts) — never `fetch` at request
  time. (`lib/content.ts` is the dead snapshot reader, not this — see `/legacy-wordpress-layer`.)
- **Metadata goes through `pageMetadata()`** in [lib/seo.ts](lib/seo.ts), never hand-assembled. The root
  [app/layout.tsx](app/layout.tsx) owns `metadataBase`, the `title.template`, the GTM snippet, the fonts
  and the `<html lang="he-IL" dir="rtl">` shell. Details in `/seo-metadata`.
- **`app/sitemap.ts` / `app/robots.ts`** use the `MetadataRoute` APIs, not hand-written XML. Both set
  `dynamic = "force-static"`. Note `sitemap.ts` has a **hand-maintained `staticPaths` array** — a new
  static route must be added there or it silently misses the sitemap.
- **`app/opengraph-image.tsx`** generates the 1200×630 share card at build time via `ImageResponse`.
  It is a real emitted route (`/opengraph-image`) — `lib/seo.ts` points every page's OG/Twitter at it.
- **Images are unoptimized.** `next/image` emits a bare `<img>` with no `srcset`, so a `sizes` prop is
  inert and misleading. See `/performance-web-vitals` before adding photography.
- **Adding a static route** means creating `app/<name>/page.tsx` _and_ adding it to `staticPaths` in
  `app/sitemap.ts`. The build won't warn you.

## Where the routes are

14 content routes: `/`, `/services/` + 5 service pages, `/pricing/`, `/service-areas/`, `/about/`,
`/faq/`, `/contact/`, `/privacy/`, `/accessibility/`. Plus `/thank-you/` (noindex, not in the
sitemap), `/404/`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon.svg`. `/reviews/` was
removed 2026-08-17 and 301s via `public/_redirects`.

All slugs are **ASCII**. If you ever add a Hebrew dynamic route, params arrive percent-encoded during
export and must be matched with `decodeURIComponent(slug).normalize("NFC")` — skipping that works in
dev and 404s in production — and `app/sitemap.ts` then needs `encodeURI`. See `/rtl-hebrew`.

## Checklist before committing routing/metadata changes

- [ ] Read the matching doc under `node_modules/next/dist/docs/`.
- [ ] `await params` everywhere it's used.
- [ ] `dynamic = "force-static"` set; `dynamicParams = false` on dynamic routes.
- [ ] `generateStaticParams` still returns every route; `npm run build` generates all pages.
- [ ] Metadata via `pageMetadata()`; canonical has both slashes.
- [ ] New route added to `app/sitemap.ts` and present in `out/sitemap.xml`.
- [ ] Output stays static-export-compatible (no server-only features).
- [ ] Gate through `/qa-build-gate`.
