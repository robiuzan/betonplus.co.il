# UX · CRO · Security

Navigation, the conversion funnel, form integrity, and the security posture of a static export behind
Cloudflare Pages. Accessibility has its own file
([accessibility-and-i18n.md](accessibility-and-i18n.md)); mobile-specific behaviour has its own
([mobile-ux-and-personalization.md](mobile-ux-and-personalization.md)). Mechanics live in the
`/conversion-cro`, `/internal-linking` and `/web-security-headers` skills.

---

## 1. The conversion model

**Ordered goals, and they are not equal:**

1. **Phone call** — `055-6601006`. This trade is bought by voice: the buyer has a wall, a deadline and
   a question only a person can answer.
2. **WhatsApp** — the same number. Preferred by contractors mid-job who can send a photo of the wall.
3. **Lead form** — asynchronous, for out-of-hours and considered enquiries.

Every page must keep **at least one of #1/#2 in reach at all times**. That is what `FloatingCTA`
guarantees on mobile (a fixed two-up bar) and the header call button plus the desktop WhatsApp bubble
guarantee above `lg`.

### The funnel, and where it leaks

```
SERP / assistant answer
        |
        v
   Landing page  --- 60-70% mobile, thumb on the screen
        |
        +--> tel: tap            -> call  (goal 1)  [no confirmation event possible]
        +--> WhatsApp deep link  -> chat  (goal 2)  [no confirmation event possible]
        +--> /contact/ form      -> submit -> /thank-you/  (goal 3)  [lead_submit + URL conversion]
```

**Structural leak:** a `tel:` tap and a WhatsApp hand-off leave the page. We can count the _tap_
(`data-cta`) but never the _outcome_. Treat call-tap as the primary optimisation metric and accept it
is an upper bound — see [data-tracking-infrastructure.md](data-tracking-infrastructure.md) §5.

---

## 2. Navigation principles

- **Every service reachable in one hop from the header.** ✅ Satisfied 2026-08-31: a services
  disclosure in `Header.tsx` (desktop dropdown, inline nested list on mobile). It is **always rendered
  and toggled with `hidden`** — a conditionally mounted menu is invisible to crawlers, and the first
  version silently omitted all five links from the static export. Verify by grepping `out/`.
- **≤3 clicks from home to any indexable route.** Currently satisfied.
- **Zero orphans, zero dead ends.** The 14 area chips on `/service-areas/` are **deliberately**
  unlinked until the location silo ships (linking them to pages that do not exist is the doorway trap);
  the page itself links onward to every service, `/faq/` and `/pricing/`, so it is not a dead end.
- **Breadcrumbs must match `BreadcrumbList`.** Visible trail and JSON-LD are one source, never two.
- **Descriptive Hebrew anchors.** `ניסור קירות בטון` — never "לחצו כאן", never a bare URL.
- **Footer is a sitemap, not a decoration** — every silo hub and every service.

---

## 3. Page-level conversion checklist

Every content page:

- [ ] A call action **above the fold**, without scrolling, on a 360×640 viewport.
- [ ] A second action within the first two scroll-depths (WhatsApp or form).
- [ ] A closing `CtaBanner` before the footer.
- [ ] Every action carries a **unique `data-cta`** (see the inventory in §4).
- [ ] The value proposition — what we cut, where, how fast — is legible without scrolling.
- [ ] No claim in the CTA that [business-facts.md](business-facts.md) has not confirmed. "הצעת מחיר
      תוך 24 שעות" is a promise; do not make it until the owner commits to it.

**Friction to remove, in order of cost:** an extra required field · a form that asks for an email when
a phone is what gets called back · a price the visitor cannot find · an unanswered "what does this
cost" question · a CTA that scrolls out of reach on mobile.

---

## 4. The `data-cta` inventory

Every conversion element is instrumented today. Keep this table true — a new CTA without a
`data-cta` is invisible to GTM.

| Surface              | `data-cta` values                                                                |
| -------------------- | -------------------------------------------------------------------------------- |
| Header               | `header-call`                                                                    |
| Hero                 | `hero-call`, `hero-form`                                                         |
| Sticky mobile bar    | `sticky-call`, `sticky-whatsapp`                                                 |
| Desktop bubble       | `bubble-whatsapp` (renamed from `sticky-whatsapp` 2026-08-31 so the two differ)  |
| Closing banner       | `finalcta-call`, `finalcta-whatsapp`                                             |
| Footer               | `footer-call`, `footer-whatsapp`, `footer-email`                                 |
| Service page sidebar | `sidebar-call`, `sidebar-whatsapp`, `sidebar-form`                               |
| Pricing              | `pricing-call`, `pricing-whatsapp`, `pricing-form`                               |
| Form                 | `form-submit`, `form-whatsapp-fallback`                                          |
| Thank-you            | `thankyou-call`, `thankyou-whatsapp`                                             |
| 404                  | `notfound-call`, `notfound-whatsapp`, `notfound-home`                            |
| Articles             | `article-call`, `article-whatsapp` (the closing `cta` block)                     |
| Contact section      | `contact-call`, `contact-whatsapp`, `contact-email` — per-channel, from the data |

26 unique values, each used exactly once in source (`grep -rhoE 'data-cta="[^"]+"' app components \| sort -u`).

`components/ui.tsx` `Button` accepts `data-cta` as a first-class prop. Use it; do not wrap a raw `<a>`.

---

## 5. Form integrity

`components/ContactForm.tsx` posts to **Web3Forms** (`https://api.web3forms.com/submit`) because a
static export has no backend. What is already correct and must not regress:

| Property             | Implementation                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------- |
| Per-field validation | `noValidate` + Hebrew messages, focus moved to the first invalid field                       |
| Phone normalisation  | `normalizeIsraeliPhone()` accepts `055-6601006`, `0556601006`, `+972…`, spaces/dashes/dots   |
| Spam control         | Honeypot `_honey` field, silently dropped                                                    |
| Failure recovery     | Delivery failure offers a **WhatsApp deep link prefilled with the user's own submission**    |
| Conversion event     | Confirmed success → `trackEvent("lead_submit")` → navigate to `/thank-you/`                  |
| Key handling         | Public access key from the manifest, `NEXT_PUBLIC_WEB3FORMS_KEY` override for local dev only |

**Rules for changing it:**

- **Required fields stay at two** — name and phone. Every additional required field costs leads.
- **Never put PII in `dataLayer`.** Fire `lead_submit` with a service/city category at most; never the
  name, phone, email or message body.
- The honeypot is not a CAPTCHA. If spam becomes a real problem, add a **timing check** or Cloudflare
  Turnstile before adding friction the human sees.
- Validate on **submit and blur**, never on every keystroke — keystroke validation reads as nagging in
  a Hebrew RTL field.
- Error messages name the fix (`נא להזין מספר טלפון ישראלי תקין, למשל 055-6601006`), never just "שגיאה".
- Errors must be **announced**, not only coloured — see
  [accessibility-and-i18n.md](accessibility-and-i18n.md) §4.

### Privacy obligations of the form

The form transmits a name, phone and free-text message to a third-party processor (Web3Forms) which
relays to `info@betonplus.co.il`. `/privacy/` must state that plainly: what is collected, who processes
it, why, and how to request deletion. **If the form changes, the privacy page changes in the same
commit.**

---

## 6. Security posture

### What ships today — `public/_headers`

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), serial=(), midi=(), display-capture=()
! Access-Control-Allow-Origin        # detaches the Pages default wildcard (2026-09-06)
Content-Security-Policy-Report-Only: ...   # no report-to yet — see roadmap 8.1
```

`public/_redirects` carries the `/reviews/` → `/` 301 from the testimonial removal.

⚠️ **A static export cannot set headers from code.** `next.config.ts` has `output: "export"`, which
forbids `headers()`, `redirects()`, `rewrites()`, middleware and API routes. `_headers` and `_redirects`
are applied by **Cloudflare Pages at the edge** — which means they are only live **after a deploy**, and
they are silently inert if the file is malformed. Verify with `curl -I https://betonplus.co.il/` after
every deploy that touches them.

### The CSP path

The policy is deliberately **report-only** because the GTM loader is an inline `<script>` in `<head>`
requiring `'unsafe-inline'` in `script-src`. Sequence for enforcement:

1. Keep report-only and collect violations for a full traffic cycle.
2. Confirm the only inline script is the GTM snippet.
3. Replace `'unsafe-inline'` with a **hash** of that snippet (a static export can compute it at build
   time; a nonce cannot work without a server).
4. Only then promote to `Content-Security-Policy`.

Promoting early breaks GTM silently and takes analytics down with it.

### Known open items

| Item                                                              | Sev | Note                                                                   |
| ----------------------------------------------------------------- | --- | ---------------------------------------------------------------------- |
| `Access-Control-Allow-Origin: *` on the live HTML                 | ⚪  | A Cloudflare-side default; looser than needed                          |
| CSP still report-only                                             | 🟡  | By design — see the sequence above                                     |
| Cloudflare zone settings (AI crawl control, Scrape Shield, cache) | —   | **Owner-only.** Document the exact toggle; never assume it was flipped |

### Non-negotiables

- **No secrets in the repo.** `.env.local` is gitignored; the Web3Forms access key is a _public_ key by
  design — treat anything else as a leak.
- **`dangerouslySetInnerHTML` is permitted for exactly two things:** the GTM snippet and JSON-LD, both
  from trusted build-time sources. JSON-LD is already `<`-escaped in `app/layout.tsx`. Never render
  user input through it.
- **All external links carry `rel="noopener noreferrer"`** when `target="_blank"` — the WhatsApp links
  already do.
- **Never add a third-party script without a CSP entry and a Core Web Vitals budget check.**

---

## 7. Known conversion gaps

| Gap                                                                                                                                                               | Sev |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| No B2B path — a contractor doing repeat volume has no dedicated route (retainer, framework pricing, scheduling)                                                   | 🟠  |
| `/pricing/` states two 🔶 numbers and three "הצעת מחיר" placeholders; a cost table by thickness would convert far better — **blocked on owner-confirmed pricing** | 🟠  |
| No photography — the strongest conversion asset for a visual trade is entirely absent ([eeat-and-trust.md](eeat-and-trust.md) §6)                                 | 🟠  |
| No visible response-time commitment (nothing confirmed to commit to)                                                                                              | 🟡  |
| The 14 area chips stay unlinked until the silo exists (deliberate — backlog §9.3); the page is not a dead end                                                     | ⚪  |
