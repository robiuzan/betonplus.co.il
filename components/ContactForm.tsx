"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { services, site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Lead/quote form. Posts to FormSubmit's AJAX endpoint so leads arrive by email with no
 * backend (static export). 🔶 site.email must be confirmed & activated in FormSubmit once
 * before submissions are delivered. Includes a honeypot field for spam protection.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get("_honey") as string)?.length) return; // bot
    setStatus("submitting");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: "פנייה חדשה מאתר בטון פלוס",
          _template: "table",
          שם: data.get("name"),
          טלפון: data.get("phone"),
          "עיר/אזור": data.get("city"),
          "סוג העבודה": data.get("service"),
          הודעה: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
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
