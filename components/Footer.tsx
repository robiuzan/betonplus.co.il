import Link from "next/link";
import { navItems, services, site, telHref, whatsappHref } from "@/lib/site";
import { Logo } from "@/components/ui";
import Icon from "@/components/Icon";

export default function Footer() {
  const year = 2026; // static export — avoid runtime Date for stable output

  return (
    <footer className="border-t border-line bg-brand text-white/85">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand + pitch */}
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{site.shortPitch}</p>
        </div>

        {/* Services */}
        <nav aria-label="שירותים">
          <h3 className="text-white text-base font-bold">שירותים</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}/`} className="text-white/70 hover:text-white">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick links */}
        <nav aria-label="קישורים מהירים">
          <h3 className="text-white text-base font-bold">ניווט</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/70 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="text-white text-base font-bold">צור קשר</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={telHref} className="flex items-center gap-2 text-white/80 hover:text-white">
                <Icon name="phone" className="h-4 w-4 text-cta" />
                <span dir="ltr">{site.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={whatsappHref} className="flex items-center gap-2 text-white/80 hover:text-white" target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" className="h-4 w-4 text-cta" />
                וואטסאפ
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-white/80 hover:text-white">
                <Icon name="mail" className="h-4 w-4 text-cta" />
                <span dir="ltr">{site.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-2 text-white/70">
              <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
              {site.areaLabel}
            </li>
            <li className="flex items-start gap-2 text-white/70">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-cta" />
              {site.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {year} {site.name} · כל הזכויות שמורות
          </p>
          <div className="flex gap-4">
            <Link href="/privacy/" className="hover:text-white">
              מדיניות פרטיות
            </Link>
            <Link href="/accessibility/" className="hover:text-white">
              הצהרת נגישות
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
