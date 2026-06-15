import { Container, Button } from "@/components/ui";
import Icon from "@/components/Icon";
import { site, telHref } from "@/lib/site";

const chips = ["מעל 20 שנה ניסיון", "ביטוח צד ג׳", "עמידה בלוחות זמנים", "חיתוך נקי ושקט"];

export default function Hero() {
  return (
    <section className="hero-grad text-white">
      <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow text-cta">ניסור וקידוח בטון ביהלום</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
            ניסור בטון וקידוח יהלום — <span className="text-cta">מדויק, נקי ובטוח</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">{site.shortPitch}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={telHref} variant="cta" className="text-base">
              <Icon name="phone" className="h-5 w-5" />
              התקשרו {site.phoneDisplay}
            </Button>
            <Button href="/contact/" variant="outline" className="border-white/40 text-white hover:border-white">
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
              {[
                { v: "₪150", l: "ניסור מ-/מ״ר" },
                { v: "₪190", l: "קידוח מ-/מ׳" },
                { v: "2005", l: "פעילים משנת" },
                { v: "ארצי", l: "פריסת שירות" },
              ].map((s) => (
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
