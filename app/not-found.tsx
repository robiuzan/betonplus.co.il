import Link from "next/link";
import { Section, Button } from "@/components/ui";
import Icon from "@/components/Icon";
import { services, site, telHref, whatsappHref } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Hebrew 404.
 *
 * Without this file Next serves its built-in not-found page, which shipped two problems
 * into a `lang="he-IL" dir="rtl"` document: English body copy ("This page could not be
 * found."), and a **second `<title>` element** — Next injects its own on top of the one the
 * root layout already renders, so `/404/` and `/_not-found/` each had two.
 *
 * No `metadata` export here: the layout template supplies the title, and adding one back
 * would recreate the duplicate. These routes are correctly absent from the sitemap and
 * carry no canonical.
 */
export default function NotFound() {
  return (
    <Section tint="mist">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-heading text-5xl font-extrabold text-steel">404</p>
        <h1 className="mt-4 text-3xl">הדף שחיפשתם לא נמצא</h1>
        <p className="mt-3 text-lg text-muted">
          ייתכן שהקישור ישן או שהכתובת הוקלדה בטעות. אפשר לחזור לעמוד הבית, לעבור לאחד השירותים, או
          פשוט להתקשר — נשמח לעזור.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href={telHref} data-cta="notfound-call" variant="cta">
            <Icon name="phone" className="h-5 w-5" />
            התקשרו <span className="ltr">{site.phoneDisplay}</span>
          </Button>
          <Button href={whatsappHref} data-cta="notfound-whatsapp" variant="whatsapp">
            <Icon name="whatsapp" className="h-5 w-5" />
            שלחו וואטסאפ
          </Button>
          <Button href="/" data-cta="notfound-home" variant="outline">
            לעמוד הבית
          </Button>
        </div>

        <div className="mt-10 text-start">
          <h2 className="text-lg">אולי חיפשתם אחד מאלה</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/`}
                  className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-3 text-sm font-semibold text-ink/90 transition-colors hover:border-steel"
                >
                  <Icon name={s.icon} className="mt-0.5 h-5 w-5 shrink-0 text-steel" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
