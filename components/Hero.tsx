import { Container, Button } from "@/components/ui";
import Icon from "@/components/Icon";
import { site, telHref, priceAmount } from "@/lib/site";

// 🔶 confirm — "מעל 20 שנה ניסיון" (foundedYear 2005) and "ביטוח צד ג׳" are both
// UNCONFIRMED (business-facts §A/§B, roadmap 1.6–1.8) and render above the fold on the
// highest-traffic page. Kept pending the owner's answer, but marked so the register and the
// copy agree; each either becomes a sourced trust asset or comes out.
const chips = ["מעל 20 שנה ניסיון", "ביטוח צד ג׳", "עמידה בלוחות זמנים", "חיתוך נקי ושקט"];

export default function Hero() {
  // Derived, never retyped — the hero used to hard-code ₪150/₪190 as string literals, which
  // is exactly the bug `priceOf()` was written to eliminate for the FAQ: a price edit in
  // lib/site.ts would silently leave the homepage contradicting /pricing/.
  const wallPrice = priceAmount("wall-sawing");
  const corePrice = priceAmount("core-drilling");

  const stats = [
    ...(wallPrice ? [{ v: wallPrice, l: "ניסור מ-/מ״ר" }] : []),
    ...(corePrice ? [{ v: corePrice, l: "קידוח מ-/מ׳" }] : []),
    { v: "2005", l: "פעילים משנת" }, // 🔶 confirm — see the chips note above
    { v: "גוש דן", l: "אזור הפעילות" },
  ];

  return (
    <section className="hero-grad text-white">
      <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow text-cta">ניסור וקידוח בטון ביהלום</p>
          <h1 className="mt-3 text-4xl leading-[1.1] font-extrabold text-white sm:text-5xl">
            ניסור בטון וקידוח יהלום — <span className="text-cta">מדויק, נקי ובטוח</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{site.shortPitch}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={telHref} data-cta="hero-call" variant="cta" className="text-base">
              <Icon name="phone" className="h-5 w-5" />
              התקשרו <span className="ltr">{site.phoneDisplay}</span>
            </Button>
            {/* The above-the-fold path to the form on the highest-traffic page, and the
                only lead route GTM could not see — it was the site's single CTA with no
                data-cta. */}
            <Button
              href="/contact/"
              data-cta="hero-form"
              variant="outline"
              className="border-white/40 text-white hover:border-white"
            >
              קבלו הצעת מחיר
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {chips.map((c) => (
              <li key={c} className="flex items-center gap-1.5 text-sm font-semibold text-white/85">
                <Icon name="check" className="h-4 w-4 text-cta" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual card */}
        <div className="relative hidden lg:block">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-cta/15 text-cta">
                <Icon name="diamond" className="h-9 w-9" />
              </div>
              <div>
                <p className="font-heading text-2xl font-extrabold text-white">להב יהלום</p>
                <p className="text-sm text-white/70">חיתוך מדויק בכל סוגי הבטון</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.l} className="rounded-xl bg-white/5 p-4">
                  <p className="font-heading text-2xl font-extrabold text-cta">{s.v}</p>
                  <p className="text-xs text-white/70">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
