---
name: aeo-answer-content
description: Answer-engine and LLM-citability layer for betonplus — question-form H2s with a 40–60 word extractable answer first, the comparison and spec tables on /faq/, llms.txt, verifying the live Cloudflare-managed robots.txt (which can prepend an AI-crawler block no repo change overrides), and freshness/authorship signals. Use when optimizing a page to be quoted by AI Overviews, ChatGPT or Perplexity. Triggers: "AEO", "GEO", "AI Overviews", "llms.txt", "will an LLM cite this", "answer block", "AI crawlers".
---

# Answer-engine optimization

The question is not "does this rank" but **"can an assistant reach this page, parse it, and prefer to
quote it?"** Three separate gates, in that order.

## Gate 1 — reachability. Check this first.

`app/robots.ts` is **not necessarily what serves** — Cloudflare can prepend a managed block at the edge,
and did until 2026-08-25. Verified live on betonplus.co.il 2026-09-06: the file byte-matches the export. **As of 2026-08-25 this gate is OPEN** — the managed block is gone and the live
file is byte-identical to the export, allowing every AI crawler. `app/robots.ts` now states the allow
list explicitly so the stance is documented rather than implied.

It was closed as recently as 2026-08-17, when Cloudflare prepended:

```
User-agent: *
Content-Signal: search=yes, ai-train=no, use=reference
Allow: /

Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot,
CloudflareBrowserRenderingCrawler, Google-Extended, GPTBot,
meta-externalagent          →  Disallow: /
```

**No repo change overrides an edge block** — it is prepended by Cloudflare (dashboard → the zone → AI
Crawl Control / managed robots.txt) and is the owner's setting. It can come back without warning, so
**never infer the live policy from `app/robots.ts`**. Check every time, cache-busted:

```bash
curl -sS -H 'Cache-Control: no-cache' "https://betonplus.co.il/robots.txt?cb=$RANDOM"
```

If the output is longer than the ~250-byte export, the edge is injecting rules again.

Understand the three permissions separately, because they have different consequences:

- **`ai-train`** — may the content train a model.
- **Retrieval bots** (OAI-SearchBot, PerplexityBot, ClaudeBot) — may an assistant fetch the page to
  answer a live question. **This is the one that produces citations.**
- **`use=reference`** — may the content be referenced with attribution.

Blocking training while allowing retrieval is a coherent position. Blocking everything, which is the
current state, means the site cannot be cited at all.

## Gate 2 — extractability

An answer engine lifts a **contiguous, self-contained span**. Structure for that.

**The answer block** — every service page, location page and article opens with one. ✅ Every content
page, the guides hub and every article carries one today (backlog §6.2 resolved); the spec:

- Directly under a **question-form heading** (`<h2>כמה עולה ניסור בטון?`).
- **40–60 words.** Shorter reads thin; longer stops being liftable.
- **Complete in the first sentence.** No "יש כמה גורמים שמשפיעים" preamble.
- Self-contained — no pronouns pointing outside the block, because that is how it gets quoted.
- Contains the concrete number, range or duration where one exists **and is confirmed**.

```
## כמה זמן לוקח לפתוח פתח בקיר בטון?
פתח סטנדרטי לדלת בקיר בטון בעובי 20 ס״מ נפתח בדרך כלל תוך 2–4 שעות עבודה, כולל סימון,
ניסור, הוצאת האלמנט ופינוי. עובי גדול יותר, זיון צפוף או גישה מוגבלת מאריכים את הזמן,
ואת ההערכה המדויקת נותנים בבדיקה בשטח.
```

Other liftable shapes worth using here: a **definition** ("ניסור יהלום הוא…"), a **comparison table**
(ניסור מול הריסה — עלות, זמן, רעש, נזק למבנה), and a **spec list** (איזה עובי בטון כל שיטה מתאימה לו).

**Rendering rules:** the answer must be in the HTML at first paint — not behind a tab, not
client-fetched. `components/Faq.tsx` renders every answer unconditionally today, which is exactly
right. Keep that property in any new accordion.

## Gate 3 — worth citing

An assistant picks the source that answers most precisely. Generic reassurance loses to a competitor
with a number. **This site currently has nothing an assistant would prefer** (backlog §6.5). What's
missing, and what would be genuinely useful:

- A real cost breakdown — by wall thickness, by reinforcement, by access, not one "from ₪150 למ״ר".
- **ניסור מול הריסה**: cost, hours, noise, dust, structural risk, when each is right.
- **דיסק מול כבל יהלום** — the thickness threshold where a disc saw stops being an option.
- **קידוח יבש מול רטוב** — when each is used and what the customer has to prepare.
- **מתי צריך אישור קונסטרוקטור** — the question every homeowner actually has, and the one competitors
  answer worst.
- What goes wrong: cutting into rebar, hitting a live conduit, cracking at the corner of an opening.

These are also the Tier-3 keyword targets in `docs/keyword-map.md` §2 and the natural spine of a
`/guides/` hub. **One honest comparison table earns more citations than ten reassuring pages** — and
the ניסור-מול-הריסה comparison is the one where saying "sometimes demolition is the right answer" is
both true and disproportionately trusted.

## Freshness and authorship

Assistants discount undated, unattributed content. ✅ Every page node carries `dateModified` with a
visible `עודכן:` line (2026-08-31); service pages and articles carry a visible byline (`components/Byline.tsx`)
with `author: {@id #owner}` and the owner's `Person` node (2026-09-06); articles carry `datePublished`
too. The named person is **אור שוורץ, בעלים** — `owner` in `lib/site.ts`, consented (business-facts §A).
No second person exists; **never invent an author**; a fabricated byline is a worse trust signal than
an absent one — and this repo shipped three fabricated customers once (removed 2026-08-17).

## Entity consistency

An assistant resolves "בטון פלוס" to an entity by cross-referencing sources. With `sameAs` empty and no
published address, there are no other sources. Name, phone and description must be identical across the
schema, the visible copy, and every off-site profile once they exist. See `/local-seo-il` §3.

## llms.txt

✅ Shipped 2026-08-31, live as `text/plain`. A plain-language map at `public/llms.txt` — who the business is, what it does, the service and area
lists, canonical URLs for the key answers, and contact. Keep it short and factual; it is a pointer
file, not a second website. Gate 1 is currently open, so this is now worth shipping (backlog §6.4).

## Checklist

- [ ] Live `robots.txt` fetched and the AI-crawler stance recorded (not assumed).
- [ ] Every service page, location page and article opens with a 40–60 word answer block.
- [ ] Answers ship in the HTML at first paint.
- [ ] Each answer is comprehensible with zero surrounding context.
- [ ] At least one comparison or spec table exists that a competitor doesn't have.
- [ ] Articles carry `datePublished`, `dateModified` and a real named author.
- [ ] `public/llms.txt` published and accurate.

## Gotchas

- Never fabricate dates, authors, prices or data to look authoritative.
- Never mark up an answer in `FAQPage` that isn't rendered on the page.
- A blocked crawler makes perfect on-page AEO worth nothing. Gate 1 first, always.
