import { site, telHref, whatsappHref } from "@/lib/site";
import Icon from "@/components/Icon";

/**
 * Sticky mobile call + WhatsApp bar (and floating WhatsApp bubble on desktop).
 * The site's #1 conversion action is a phone call (brief B3).
 */
export default function FloatingCTA() {
  return (
    <>
      {/* Mobile: fixed bottom action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-white shadow-[0_-4px_20px_-8px_rgba(17,24,39,0.25)] lg:hidden">
        <a
          href={telHref}
          className="flex items-center justify-center gap-2 bg-cta py-3.5 font-heading font-bold text-brand"
          aria-label={`התקשרו ${site.phoneDisplay}`}
        >
          <Icon name="phone" className="h-5 w-5" />
          התקשרו
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25d366] py-3.5 font-heading font-bold text-[#062e16]"
          aria-label="שליחת הודעת וואטסאפ"
        >
          <Icon name="whatsapp" className="h-5 w-5" />
          וואטסאפ
        </a>
      </div>

      {/* Desktop: floating WhatsApp bubble */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform hover:scale-105 lg:flex"
        aria-label="שליחת הודעת וואטסאפ"
      >
        <Icon name="whatsapp" className="h-7 w-7" />
      </a>
    </>
  );
}
