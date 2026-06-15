import Link from "next/link";
import Icon from "@/components/Icon";

/** Centered max-width container. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`container-x ${className}`}>{children}</div>;
}

/** Vertical-rhythm section with optional background tint. */
export function Section({
  children,
  tint,
  className = "",
  id,
}: {
  children: React.ReactNode;
  tint?: "mist" | "brand";
  className?: string;
  id?: string;
}) {
  const bg = tint === "mist" ? "bg-mist" : tint === "brand" ? "hero-grad text-white" : "";
  return (
    <section id={id} className={`section ${bg} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Centered eyebrow + heading + optional lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "start";
  light?: boolean;
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-start";
  return (
    <div className={`${alignCls} max-w-2xl ${align === "center" ? "" : ""}`}>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className={`text-3xl sm:text-4xl ${light ? "text-white" : ""}`}>{title}</h2>
      {lead && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/80" : "text-muted"}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

type ButtonVariant = "cta" | "brand" | "outline" | "whatsapp";

const isExternal = (href: string) =>
  /^(tel:|mailto:|https?:)/.test(href) || href.startsWith("//");

/** Link styled as a button. Renders next/link for internal hrefs, <a> for external. */
export function Button({
  href,
  variant = "cta",
  className = "",
  children,
  ariaLabel,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const cls = `btn btn-${variant} ${className}`;
  if (isExternal(href)) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

/** The brand mark (disc + plus + diamond). Size via className (h-/w-). */
export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="54" fill="#1F2A37" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="#2563EB" strokeWidth="5" strokeDasharray="5 7" />
      <circle cx="60" cy="60" r="44" fill="#28333F" stroke="#3B4654" strokeWidth="1.5" />
      <rect x="53" y="24" width="14" height="72" rx="4" fill="#F59E0B" />
      <rect x="24" y="53" width="72" height="14" rx="4" fill="#F59E0B" />
      <rect x="49.5" y="49.5" width="21" height="21" rx="2" transform="rotate(45 60 60)" fill="#2563EB" />
      <rect x="54" y="54" width="12" height="12" rx="1" transform="rotate(45 60 60)" fill="#EAF1FF" />
    </svg>
  );
}

/** Logo lockup: mark + wordmark + tagline. Used in header/footer. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="בטון פלוס — דף הבית">
      <BrandMark className="h-11 w-11 shrink-0" />
      <span className="leading-tight">
        <span className={`block font-heading text-xl font-extrabold ${light ? "text-white" : "text-brand"}`}>
          בטון פלוס
        </span>
        <span className={`block text-[11px] font-semibold ${light ? "text-white/70" : "text-steel"}`}>
          דיוק של יהלום · ביצוע פלוס
        </span>
      </span>
    </Link>
  );
}

/** Small star-rating row. */
export function Stars({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <span className={`inline-flex text-cta ${className}`} aria-label={`${count} מתוך 5 כוכבים`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" className="h-4 w-4 fill-current" />
      ))}
    </span>
  );
}
