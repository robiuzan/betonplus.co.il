import { Section, SectionHeading } from "@/components/ui";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import { site, telHref, whatsappHref } from "@/lib/site";

const details = [
  { icon: "phone" as const, label: "טלפון", value: site.phoneDisplay, href: telHref },
  { icon: "whatsapp" as const, label: "וואטסאפ", value: site.phoneDisplay, href: whatsappHref },
  { icon: "mail" as const, label: "אימייל", value: site.email, href: `mailto:${site.email}` },
];

export default function ContactSection({ tint = "mist" as const }: { tint?: "mist" }) {
  return (
    <Section tint={tint} id="contact">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="start"
            eyebrow="צרו קשר"
            title="קבלו הצעת מחיר ללא התחייבות"
            lead="מלאו פרטים ונחזור אליכם במהירות, או חייגו / שלחו וואטסאפ עכשיו."
          />
          <ul className="mt-8 space-y-4">
            {details.map((d) => (
              <li key={d.label}>
                <a
                  href={d.href}
                  target={d.icon === "whatsapp" ? "_blank" : undefined}
                  rel={d.icon === "whatsapp" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 text-ink hover:text-steel"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-cta">
                    <Icon name={d.icon} className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-xs text-muted">{d.label}</span>
                    <span className="font-heading font-bold" dir="ltr">
                      {d.value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-center gap-3 text-ink">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand text-cta">
                <Icon name="clock" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-xs text-muted">שעות פעילות</span>
                <span className="font-heading font-bold">{site.hours}</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
