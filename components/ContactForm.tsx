"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { services, site } from "@/lib/site";
import { trackEvent } from "@ishub/site-kit/analytics";

type Status = "idle" | "submitting" | "error";

interface FieldErrors {
  name?: string;
  phone?: string;
}

/**
 * Lead/quote form. Delivers via Web3Forms (https://api.web3forms.com/submit) so leads arrive
 * by email with no backend (static export). The PUBLIC access key comes from the manifest
 * (site.formAccessKey), with a NEXT_PUBLIC_WEB3FORMS_KEY env override for local dev; the delivery
 * inbox (site.email) is set in the Web3Forms dashboard. Includes a honeypot for spam protection.
 *
 * Conversion path: confirmed success → trackEvent("lead_submit") → navigate to /thank-you/
 * (the URL-based conversion GA4/Ads can count). Delivery failure → offer a WhatsApp deep link
 * prefilled with the user's own submission, so the lead is never simply lost.
 *
 * dataLayer contract (docs/data-tracking-infrastructure.md §3): `form_error` when validation
 * blocks a submit (which field, never its value), `lead_fallback` when delivery failed and the
 * WhatsApp fallback is shown, `lead_submit` only on confirmed delivery. No PII in any of them.
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = site.formAccessKey ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

/**
 * Normalize an Israeli phone number for delivery. Accepts everything a real customer
 * types — 055-6601006, 0556601006, +972556601006, 03-1234567, spaces/dashes/dots —
 * and returns bare digits (leading 0), or null only when it cannot be a phone number.
 */
function normalizeIsraeliPhone(raw: string): string | null {
  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+972")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("972")) digits = `0${digits.slice(3)}`;
  return /^0\d{8,9}$/.test(digits) ? digits : null;
}

export default function ContactForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get("_honey") as string)?.length) return; // bot

    // Per-field validation with Hebrew messages (noValidate keeps browser defaults out).
    const name = ((data.get("name") as string) ?? "").trim();
    const phoneRaw = ((data.get("phone") as string) ?? "").trim();
    const phone = normalizeIsraeliPhone(phoneRaw);
    const nextErrors: FieldErrors = {};
    if (name.length < 2) nextErrors.name = "נא להזין שם מלא.";
    if (!phoneRaw) nextErrors.phone = "נא להזין מספר טלפון לחזרה.";
    else if (!phone) nextErrors.phone = "נא להזין מספר טלפון ישראלי תקין, למשל 055-6601006.";
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.phone) {
      (nextErrors.name ? nameRef : phoneRef).current?.focus();
      trackEvent("form_error", { form: "lead", field: nextErrors.name ? "name" : "phone" });
      return;
    }

    const message = (data.get("message") as string) ?? "";
    const city = (data.get("city") as string) ?? "";
    const service = (data.get("service") as string) ?? "";

    // WhatsApp fallback carrying the user's OWN submission — shown only if delivery fails.
    const waText = [
      "היי, מילאתי את הטופס באתר ולא נשלח.",
      `שם: ${name}`,
      `טלפון: ${phone}`,
      city && `עיר: ${city}`,
      service && `שירות: ${service}`,
      message && `פרטים: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");
    setFallbackHref(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(waText)}`);

    setStatus("submitting");

    // No access key (local dev only): simulate so the form works without delivery. Production
    // builds always ship a provisioned key, so an empty key in production is a misconfig -> error.
    if (!WEB3FORMS_KEY) {
      if (process.env.NODE_ENV !== "production") {
        await new Promise((r) => setTimeout(r, 600));
        router.push("/thank-you/"); // dev simulation: no trackEvent — conversions stay real
        return;
      }
      setStatus("error");
      trackEvent("lead_fallback", { form: "lead", reason: "no_key" });
      return;
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "פנייה חדשה מאתר בטון פלוס",
          from_name: site.name,
          name,
          phone,
          city,
          service,
          message,
        }),
      });
      const result: { success?: boolean } = await res.json();
      if (!res.ok || !result.success) throw new Error("request failed");
      // GTM conversion hook: fires only on a CONFIRMED send. No PII in dataLayer.
      trackEvent("lead_submit", { form: "lead" });
      router.push("/thank-you/");
    } catch {
      // Delivery failed → the WhatsApp fallback renders below. Counted separately from
      // lead_submit so a delivery outage shows up as a spike here, not as silence.
      setStatus("error");
      trackEvent("lead_fallback", { form: "lead", reason: "delivery" });
    }
  }

  // No `outline-none`: it suppressed the global 3px :focus-visible ring from globals.css
  // on every field, leaving a border-colour change as the only focus cue (WCAG 2.4.7).
  const fieldCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink transition-colors focus:border-steel";
  const fieldErrCls = "border-red-400 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      {/* honeypot */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {/* The asterisk on required fields had no legend, so its meaning was conventional
          rather than stated — and a screen-reader user hears "כוכבית" with no explanation. */}
      <p className="mb-3 text-sm text-muted">
        <span aria-hidden="true">* </span>שדות המסומנים בכוכבית הם שדות חובה.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">שם מלא *</span>
          <input
            ref={nameRef}
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            onInput={() => errors.name && setErrors((p) => ({ ...p, name: undefined }))}
            className={`${fieldCls} ${errors.name ? fieldErrCls : ""}`}
          />
          {errors.name && (
            <span id="name-error" className="mt-1 block text-sm text-red-700">
              {errors.name}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">טלפון *</span>
          <input
            ref={phoneRef}
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            onInput={() => errors.phone && setErrors((p) => ({ ...p, phone: undefined }))}
            className={`${fieldCls} text-end ${errors.phone ? fieldErrCls : ""}`}
          />
          {errors.phone && (
            <span id="phone-error" className="mt-1 block text-sm text-red-700">
              {errors.phone}
            </span>
          )}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">עיר / אזור</span>
          <input name="city" type="text" className={fieldCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">סוג העבודה</span>
          <select name="service" defaultValue="" className={fieldCls}>
            <option value="" disabled>
              בחרו שירות…
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="אחר">אחר / לא בטוח/ה</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">תיאור העבודה</span>
        <textarea
          name="message"
          rows={4}
          className={fieldCls}
          placeholder="לדוגמה: פתח לדלת בקיר בטון בעובי 20 ס״מ בקומה 2"
        />
      </label>

      {status === "error" && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          <p>אירעה שגיאה בשליחה. נסו שוב, התקשרו אלינו, או שלחו את הפרטים ישירות בוואטסאפ:</p>
          {fallbackHref && (
            <a
              href={fallbackHref}
              data-cta="form-whatsapp-fallback"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-4 py-2 font-heading font-bold text-[#062e16]"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              שליחת הפרטים בוואטסאפ
            </a>
          )}
        </div>
      )}

      <button
        type="submit"
        data-cta="form-submit"
        disabled={status === "submitting"}
        className="btn btn-cta mt-1 w-full text-base disabled:opacity-60"
      >
        {status === "submitting" ? "שולח…" : "שליחה וקבלת הצעת מחיר"}
      </button>
      <p className="text-center text-xs text-muted">
        בלחיצה על שליחה אתם מאשרים שניצור איתכם קשר בנוגע לפנייה, בהתאם ל
        <Link href="/privacy/" className="underline hover:text-steel">
          מדיניות הפרטיות
        </Link>
        .
      </p>
    </form>
  );
}
