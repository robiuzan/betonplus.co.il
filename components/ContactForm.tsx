"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { services, site } from "@/lib/site";
import { trackEvent } from "@ishub/site-kit/analytics";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Lead/quote form. Delivers via Web3Forms (https://api.web3forms.com/submit) so leads arrive
 * by email with no backend (static export). The PUBLIC access key comes from the manifest
 * (site.formAccessKey), with a NEXT_PUBLIC_WEB3FORMS_KEY env override for local dev; the delivery
 * inbox (site.email) is set in the Web3Forms dashboard. Includes a honeypot for spam protection.
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = site.formAccessKey ?? process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get("_honey") as string)?.length) return; // bot
    setStatus("submitting");

    // No access key (local dev only): simulate so the form works without delivery. Production
    // builds always ship a provisioned key, so an empty key in production is a misconfig -> error.
    if (!WEB3FORMS_KEY) {
      if (process.env.NODE_ENV !== "production") {
        await new Promise((r) => setTimeout(r, 600));
        setStatus("success");
        form.reset();
        return;
      }
      setStatus("error");
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
          name: data.get("name"),
          phone: data.get("phone"),
          city: data.get("city"),
          service: data.get("service"),
          message: data.get("message"),
        }),
      });
      const result: { success?: boolean } = await res.json();
      if (!res.ok || !result.success) throw new Error("request failed");
      setStatus("success");
      // GTM conversion hook: fires only on a CONFIRMED send (the dev simulation above does not).
      trackEvent("lead_submit", { form: "lead" });
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-600">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h3 className="mt-4 text-xl">הפנייה נשלחה בהצלחה!</h3>
        <p className="mt-2 text-muted">נחזור אליכם בהקדם. לפנייה דחופה התקשרו {site.phoneDisplay}.</p>
      </div>
    );
  }

  const fieldCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-steel";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      {/* honeypot */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">שם מלא *</span>
          <input name="name" type="text" required autoComplete="name" className={fieldCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">טלפון *</span>
          <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" className={fieldCls} />
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
        <textarea name="message" rows={4} className={fieldCls} placeholder="לדוגמה: פתח לדלת בקיר בטון בעובי 20 ס״מ בקומה 2" />
      </label>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          אירעה שגיאה בשליחה. נסו שוב או התקשרו אלינו ל-{site.phoneDisplay}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn btn-cta mt-1 w-full text-base disabled:opacity-60"
      >
        {status === "submitting" ? "שולח…" : "שליחה וקבלת הצעת מחיר"}
      </button>
      <p className="text-center text-xs text-muted">
        בלחיצה על שליחה אתם מאשרים שניצור איתכם קשר בנוגע לפנייה.
      </p>
    </form>
  );
}
