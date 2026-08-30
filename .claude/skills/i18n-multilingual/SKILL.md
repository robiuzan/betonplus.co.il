---
name: i18n-multilingual
description: Adding a second language to betonplus without breaking the Hebrew site — why the answer is usually "don't", and the exact architecture if the answer is yes: Hebrew stays at the root with no /he/ prefix, English lives under /en/ with its own layout setting lang and dir, reciprocal hreflang with x-default emitted from pageMetadata(), a locale-keyed content mirror of lib/site.ts, and the rules that keep business facts single-sourced. Use before touching lang, dir, hreflang, alternates, or any locale routing. Triggers: "add English", "multilingual", "hreflang", "i18n", "second language", "translate the site", "locale routing".
---

# Multilingual architecture (he-IL RTL + en LTR)

**Current state:** the site is Hebrew-only by construction. `<html lang="he-IL" dir="rtl">` is
hardcoded in `app/layout.tsx`, `lib/site.ts` holds Hebrew strings directly, and no route carries a
locale segment. That is correct for today. This skill exists so the shape we grow into is decided
before the first English page, not after.

Full doctrine: `docs/accessibility-and-i18n.md` §6.

---

## Step 0 — should we add English at all?

Ask this first and be willing to say no. The buyers are Israeli contractors, engineers and homeowners
searching in Hebrew. A second tree doubles the maintenance surface, and a thin or machine-translated
one is a quality liability that dilutes the entity.

**Legitimate triggers:** real English demand visible in Search Console · international clients,
embassies or foreign-owned PM firms · English engineering documentation the business actually wants to
publish.

**Not a trigger:** "for SEO". A language tree with no audience ranks for nothing.

If the answer is no, say so and stop. That is a complete, correct outcome for this skill.

---

## The architecture

Hebrew stays at the root. **Never introduce a `/he/` prefix** — it would change every existing URL,
throw away the accumulated signals, and require a redirect map for no gain.

```
app/
  layout.tsx            lang="he-IL" dir="rtl"     <- unchanged, Hebrew is the default
  page.tsx  services/  pricing/  ...
  en/
    layout.tsx          lang="en"    dir="ltr"
    page.tsx  services/  ...
lib/
  site.ts               Hebrew content (unchanged)
  site.en.ts            English mirror, identical exported shape
  i18n.ts               Locale type, dictionary map, he<->en route mapping
```

### Why a nested `en/` tree rather than `app/[locale]/`

`output: "export"` with `trailingSlash: true` builds everything statically anyway, so a dynamic locale
segment buys nothing but a required `generateStaticParams` and a `Promise` param to await in every
page. A literal `en/` directory keeps the Hebrew routes untouched — which is the whole point.

---

## The rules

1. **`dir` is set per locale on `<html>`, in that locale's layout.** Never toggle direction from a
   client effect — that is a guaranteed layout shift and it breaks first paint.
2. **The CSS needs no changes.** Every horizontal utility in `components/` and `app/` is already
   logical (`ps-*`, `me-*`, `start-*`, `text-start`) — see `/rtl-hebrew`. A single `pl-4` becomes a
   visible bug the moment an LTR locale exists, which is why the ban is enforced now.
3. **`hreflang` is mandatory and reciprocal.** Emit it from `pageMetadata()` in `lib/seo.ts`:

   ```ts
   alternates: {
     canonical: `${site.url}${path}`,
     languages: {
       "he-IL": `${site.url}${path}`,
       en: `${site.url}/en${path}`,
       "x-default": `${site.url}${path}`, // Hebrew is the default for this market
     },
   }
   ```

   A one-way `hreflang` is ignored. Every page points at its counterpart **and** is pointed back at.

4. **Only pages that exist in both languages get an alternate.** A partial English tree links only its
   own pages. Never point an English `hreflang` at a Hebrew page.
5. **Canonicals stay self-referencing within the locale.** `/en/pricing/` canonicalises to itself, not
   to `/pricing/`.
6. **Business facts stay single-sourced.** Phone, email, hours and `areaServed` come from the manifest
   in both trees. Translate labels; never translate or restate a value.
7. **No machine translation shipped as-is.** ניסור, קידוח יהלום, קונסטרוקטור do not survive it, and the
   result fails `docs/content-standards.md` §1 on substance even at the right word count.
8. **The switcher is a real `<a>`** to the counterpart URL, labelled in the target language
   (`English` / `עברית`). **Never auto-redirect on `Accept-Language` or IP** — it breaks crawling and
   traps users in the wrong tree.
9. **JSON-LD gets `inLanguage` per locale.** The organisation stays **one entity with one `@id`** — do
   not mint a second business.
10. **The sitemap covers both trees**, derived from the data as it is today, with `xhtml:link`
    alternates or per-locale entries. Never hand-maintain a second list.

---

## Content ownership

`lib/site.en.ts` mirrors the **shape** of `lib/site.ts`, not its prose. English service copy is written
for the English buyer — usually shorter, more spec-led — and still has to clear the depth bar and the
doorway test in `docs/content-standards.md`. An English page that is a translated shell of a Hebrew page
is a doorway page in a second language.

---

## Checklist before shipping any locale work

- [ ] Hebrew URLs unchanged; no `/he/` prefix anywhere.
- [ ] Each locale layout sets both `lang` and `dir` server-side.
- [ ] `hreflang` reciprocal on every pair, with `x-default` → Hebrew.
- [ ] Canonical self-referencing within the locale, trailing slash.
- [ ] No banned directional utility introduced:
      `grep -rE "\b(pl|pr|ml|mr)-[0-9]|left-|right-|text-left|text-right" components app`
- [ ] Business facts read from the manifest in both trees.
- [ ] Switcher is a plain link; no auto-redirect, no IP detection.
- [ ] Sitemap and `robots.txt` cover both trees.
- [ ] `npm run lint && npm run typecheck && npm run format:check && npm run build` clean.
