---
name: nextjs-app-router
description: Next.js 16 App Router specifics for this static-export project — read the bundled docs first, then SSG with generateStaticParams/generateMetadata, force-static, output:"export", trailingSlash, and unoptimized images. Use before touching routing, metadata, or image APIs.
---

# Next.js 16 App Router (this project)

⚠️ **This is NOT the Next.js in your training data.** Next 16 has breaking changes. **Before writing any
routing/metadata/image code, read the relevant guide in `node_modules/next/dist/docs/`** and heed
deprecation notices (see [AGENTS.md](AGENTS.md)).

## Rendering model: static export (SSG)
- [next.config.ts](next.config.ts): `output: "export"` (emits static `out/`), `trailingSlash: true`
  (URLs end in `/`, matching WP permalinks), `images: { unoptimized: true, remotePatterns: [...] }`.
- No server at runtime — no route handlers that need a server, no dynamic SSR, no ISR. Everything must be
  statically generable.

## The two route entry points
- [app/page.tsx](app/page.tsx) — front page. `export const dynamic = "force-static"`.
  ```ts
  export function generateMetadata(): Metadata { return buildMetadata(getFrontPage().seo); }
  export default function HomePage() { return <SiteFrame page={getFrontPage()} />; }
  ```
- [app/[...slug]/page.tsx](app/[...slug]/page.tsx) — every other permalink. `dynamicParams = false`
  (404 anything not pre-generated).
  ```ts
  export function generateStaticParams(): { slug: string[] }[] {
    return getContentPages().map((p) => ({ slug: p.segments }));
  }
  export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;            // ⚠️ params is a Promise in Next 16 — await it
    const page = getPageBySegments(slug);
    return page ? buildMetadata(page.seo) : {};
  }
  ```

## Gotchas that bite
- **`params` is async** (a `Promise`) in Next 16 — always `await params` before using it.
- Route data comes from [lib/content.ts](lib/content.ts) (`getFrontPage`, `getContentPages`,
  `getPageBySegments`), which reads the build-time snapshot — not from `fetch` at request time.
- Metadata via `generateMetadata` only; the root [app/layout.tsx](app/layout.tsx) sets
  `metadataBase`/icons and the `<html lang="he" dir="rtl">` shell. Details in `/seo-metadata`.
- `app/sitemap.ts` / `app/robots.ts` use the `MetadataRoute` APIs (not hand-written XML).
- Adding a new URL means adding it to the **snapshot/segments**, not just creating a file — the catch-all
  enumerates pages from content.

## Checklist before committing routing/metadata changes
- [ ] Read the matching doc under `node_modules/next/dist/docs/`.
- [ ] `await params` everywhere it's used.
- [ ] `generateStaticParams` still returns every route; `npm run build` generates all pages.
- [ ] Output stays static-export-compatible (no server-only features).
- [ ] Permalinks/`trailingSlash` unchanged (`/migration-fidelity`).
