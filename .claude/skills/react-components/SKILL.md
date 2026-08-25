---
name: react-components
description: React 19 + strict-TypeScript component patterns in betonplus — server-by-default with the two real client components, the ui.tsx primitives, sourcing every business fact from lib/site.ts, safe dangerouslySetInnerHTML for GTM and JSON-LD only, data-cta on every CTA, and the dead components not to imitate. Use when adding or changing a component. Triggers: "new component", "use client", "should this be a client component", "component conventions".
---

# React 19 components

Components render data from `lib/site.ts` into RTL Hebrew markup. There is no CMS, no fetching, and no
runtime data — everything is resolved at build time for a static export.

## Server by default

Only two components are genuinely client-side:

| Component                    | Why                                  |
| ---------------------------- | ------------------------------------ |
| `components/Header.tsx`      | one boolean for the mobile menu      |
| `components/ContactForm.tsx` | form state, `fetch`, submit handling |

Everything else is a Server Component. Add `"use client"` **only** for state, effects or browser APIs,
and keep it leaf-level — `Header` shipping its whole tree for one boolean is the pattern to avoid
repeating, not to copy.

`components/Faq.tsx` deliberately renders **every answer unconditionally with no client JS**. Keep that:
it is both free performance and the reason the `FAQPage` schema is valid (`/schema-structured-data`).
An accordion that conditionally renders would break the markup-matches-content rule.

## Use the primitives

`components/ui.tsx` exports:

- **`Section`** — page section wrapper, optional `tint="mist"`.
- **`SectionHeading`** — eyebrow + title + optional lead, with `align`.
- **`Button`** — variant (`cta` / `brand` / `outline` / `whatsapp`), `ariaLabel`, and **`data-cta`**.
  It picks `<a>` for external and `tel:`/`wa.me` hrefs and `next/link` for internal routes.

Reach for these first. A hand-rolled button misses the focus ring, the tap target, or the analytics
attribute. `components/Icon.tsx` is a **self-contained inline-SVG set with no external icon dependency** — every
glyph is hand-authored on a 24×24 viewBox inheriting `currentColor`. To add an icon, extend the
`IconName` union in `lib/site.ts` and add the matching paths to `PATHS` in `Icon.tsx`. (`lucide-react`
sits unused in `package.json`; don't start importing it without a decision to adopt it.)

## Single source of truth

```ts
import { site, services, serviceAreas, navItems, telHref, whatsappHref } from "@/lib/site";
import { pageMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";
```

**Never hardcode the phone, email, service names or slugs.** Never type Hebrew copy into JSX — it goes
in `lib/site.ts`. Never build a `Metadata` object by hand — use `pageMetadata()`.

⚠️ Naming trap: **`lib/site.ts` is the live content file. `lib/content.ts` is a dead WordPress snapshot
reader.** Check the import, not the filename.

## Strict TypeScript

- **No `any`.** Prefer `unknown` + narrowing at boundaries. No non-null `!` to silence the compiler.
- `noUncheckedIndexedAccess` is **not** enabled here — an indexed read is typed `T`, so the compiler
  will not catch an out-of-range access for you. Guard it yourself where it matters.
- Type props explicitly. Model data with the interfaces already in `lib/site.ts` (`Service`, `Faq`,
  `Review`, `TrustStat`, `ProcessStep`, `Differentiator`, `NavItem`, `IconName`).
- Import via the `@/*` alias, never deep relative paths.

## Next 16 route components

```tsx
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] { … }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // params is a Promise in Next 16
  …
}
```

Forgetting `await params` is the most likely regression when copying older App Router code.

## `dangerouslySetInnerHTML`

Two legitimate uses, both serializing **our own** build-time data:

- the GTM snippet in `app/layout.tsx`
- JSON-LD via `components/JsonLd.tsx` and the layout's business node

Both must escape `<` before injection — the layout does `.replace(/</g, "\\u003c")`. Any new JSON-LD
injection does the same. **Never let runtime or user data reach `__html`.**

## Every CTA needs `data-cta`

Convention `{location}-{action}` — `hero-call`, `sticky-whatsapp`, `footer-call`. GTM click triggers
match on these strings and no JS ships for them, so a missing attribute makes the click permanently
invisible. `Button` takes it as a prop. See `/tracking-analytics`.

## Do not imitate these

`components/SiteFrame.tsx`, `SiteAssets.tsx` and `ThemeScripts.tsx` are the **abandoned WordPress
snapshot layer** — imported by nothing under `app/`. They render captured `bodyHtml` through
`dangerouslySetInnerHTML` and replay theme scripts. That was correct for a 1:1 port and is wrong for
this build. Don't extend them, don't import them, don't take patterns from them
(`/betonplus-architecture`).

## Conventions

- One component per file, PascalCase filename matching the export.
- RTL-aware logical utilities only (`/rtl-hebrew`); styling rules in `/web-design-ui`.
- Accessibility is not optional — labels, focus, `aria-label` on icon-only controls
  (`/responsive-accessibility`).

## Checklist

- [ ] Server component unless it truly needs the browser, and then leaf-level.
- [ ] No `any`; props typed against the `lib/site.ts` interfaces.
- [ ] Business facts and copy imported, never hardcoded.
- [ ] `await params` in Next 16 route components; `force-static` set.
- [ ] `dangerouslySetInnerHTML` only for escaped, build-time data.
- [ ] Every CTA carries `data-cta`.
- [ ] `npm run lint && npm run typecheck` clean (`/qa-build-gate`).
