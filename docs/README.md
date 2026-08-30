# docs/ — the acceptance bars

Every agent working in this repo cites these files. They are the standard; the code is judged against
them, not the other way round. When a doc and the code disagree, fix the code. When a doc and
`Israeli services sites/roster/sites/betonplus.json` disagree about a business fact, **the roster wins**.

---

## The register layer — what is true right now

| File                                                   | Owns                                                                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [business-facts.md](business-facts.md)                 | Every claim the site makes, its source, and whether it is ✅ confirmed or 🔶 unconfirmed. **The gate for all copy.** |
| [optimization-backlog.md](optimization-backlog.md)     | The ranked register of everything known to be wrong, thin or missing, by section number.                             |
| [implementation-roadmap.md](implementation-roadmap.md) | The sequenced plan — which sprint ships what, in what order, and which items are owner-blocked.                      |

## The standards layer — what "good" means

| File                                                                 | Owns                                                                                                                 |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [content-standards.md](content-standards.md)                         | Depth floors, the doorway test, required blocks, brand voice, the answer-block spec, claim rules                     |
| [keyword-map.md](keyword-map.md)                                     | Keyword tiers, route→keyword mapping, title/H1/description formulas                                                  |
| [schema-graph.md](schema-graph.md)                                   | The target JSON-LD graph                                                                                             |
| [seo-geo-aeo-strategy.md](seo-geo-aeo-strategy.md)                   | The strategy above all of the above — demand model, silo architecture, local SEO, AEO doctrine, technical invariants |
| [eeat-and-trust.md](eeat-and-trust.md)                               | Author bios, case studies, galleries, the review policy, trust badges, the honesty gate                              |
| [ux-cro-security.md](ux-cro-security.md)                             | Navigation, the conversion funnel, the `data-cta` inventory, form integrity, headers and CSP                         |
| [performance-guidelines.md](performance-guidelines.md)               | Core Web Vitals budgets, the critical path, the JS budget, the image pipeline, caching                               |
| [accessibility-and-i18n.md](accessibility-and-i18n.md)               | WCAG 2.1 AA + ת״י 5568, ARIA policy, RTL discipline, the multilingual architecture                                   |
| [mobile-ux-and-personalization.md](mobile-ux-and-personalization.md) | Thumb-zone layout, sticky conversion, and what personalization a static export may attempt                           |
| [data-tracking-infrastructure.md](data-tracking-infrastructure.md)   | GTM/GA4, the dataLayer contract, server-side analytics options, CRM integration, consent                             |

## Elsewhere in the repo

- [CLAUDE.md](../CLAUDE.md) — the project rulebook: golden rules, stack, layout, data flow, deploy.
- [brief.md](../brief.md) — the original client brief the designed site was built from.
- [SEO-ROADMAP.md](../SEO-ROADMAP.md) — the Hebrew sitemap expansion plan (service/city page inventory).

---

## Which agent or skill enforces which doc

| Domain                  | Read-only auditor        | Skill (mechanics)                                           |
| ----------------------- | ------------------------ | ----------------------------------------------------------- |
| Technical / on-page SEO | `seo-auditor`            | `/seo-metadata`, `/betonplus-architecture`                  |
| Structured data         | `schema-auditor`         | `/schema-structured-data`                                   |
| Local SEO               | `local-seo-strategist`   | `/local-seo-il`, `/new-city`                                |
| AEO / GEO               | `aeo-geo-strategist`     | `/aeo-answer-content`, `/new-article`                       |
| E-E-A-T & trust         | `eeat-trust-auditor`     | —                                                           |
| Conversion              | `cro-conversion-auditor` | `/conversion-cro`, `/internal-linking`                      |
| Performance & a11y      | `perf-a11y-auditor`      | `/performance-web-vitals`, `/responsive-accessibility`      |
| Security                | `security-auditor`       | `/web-security-headers`                                     |
| Code correctness        | `ts-react-reviewer`      | `/react-components`, `/nextjs-app-router`, `/web-design-ui` |
| Hebrew / RTL copy       | —                        | `/rtl-hebrew`, `hebrew-copywriter` (writes)                 |
| Multilingual            | —                        | `/i18n-multilingual`                                        |
| Tracking                | —                        | `/tracking-analytics`                                       |
| Release                 | —                        | `/qa-build-gate`, `/deploy-betonplus`                       |

Building UI is `rtl-frontend-engineer`; writing Hebrew copy is `hebrew-copywriter`. Every other agent
listed above is **read-only by design** — an auditor that edits its own findings cannot be trusted to
report them.

---

## The two rules that override everything else

1. **Never fabricate a business fact.** If it is not in the roster manifest or `lib/site.ts`, it is not
   a fact — mark it `// 🔶 confirm` and add a row to [business-facts.md](business-facts.md). No
   testimonial, no rating, no project count, no certification, ever.
2. **No page ships under the bar in [content-standards.md](content-standards.md).** A service or
   location page that a find-and-replace could regenerate is a doorway page.
