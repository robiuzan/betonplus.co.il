"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navItems, services, site, telHref } from "@/lib/site";
import { Logo, Button } from "@/components/ui";
import Icon from "@/components/Icon";

/** The nav entry the services disclosure replaces — every other item stays a plain link. */
const SERVICES_HREF = "/services/";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesToggleRef = useRef<HTMLButtonElement>(null);

  // Escape closes whichever menu is open and returns focus to the control that opened it.
  // The mobile menu is a non-modal disclosure (the page stays visible and scrollable), so
  // no focus trap / scroll lock.
  useEffect(() => {
    if (!open && !servicesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (servicesOpen) {
        setServicesOpen(false);
        servicesToggleRef.current?.focus();
      } else if (open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, servicesOpen]);

  // A click anywhere outside the desktop dropdown dismisses it. Focus is left where the
  // user put it — moving it back on an outside click would fight the pointer.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!servicesRef.current?.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [servicesOpen]);

  const closeAll = () => {
    setOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="ניווט ראשי" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.href === SERVICES_HREF ? (
              // Every service is one hop from any page — previously they sat a level
              // behind /services/, which cost both crawl depth and internal equity.
              <div key={item.href} ref={servicesRef} className="relative">
                <button
                  ref={servicesToggleRef}
                  type="button"
                  onClick={() => setServicesOpen((v) => !v)}
                  aria-expanded={servicesOpen}
                  aria-controls="services-menu"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-semibold text-ink/80 transition-colors hover:bg-mist hover:text-brand"
                >
                  {item.label}
                  <Icon
                    name="chevronDown"
                    className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/*
                  Always rendered, toggled with `hidden` rather than mounted on open.
                  The point of this menu is that every service is one hop from every page
                  — and a crawler only sees links that are in the static HTML. Behind
                  `{servicesOpen && …}` these five links were absent from the export
                  entirely, which is the SEO half of the task silently not happening.
                  `hidden` keeps them out of the a11y tree and off-screen until opened.
                */}
                <ul
                  id="services-menu"
                  hidden={!servicesOpen}
                  className="absolute start-0 top-full z-50 mt-1 w-80 rounded-xl border border-line bg-white p-2 shadow-lg"
                >
                  <li>
                    <Link
                      href={SERVICES_HREF}
                      onClick={closeAll}
                      className="block rounded-lg px-3 py-2.5 text-sm font-bold text-brand hover:bg-mist"
                    >
                      כל השירותים
                    </Link>
                  </li>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}/`}
                        onClick={closeAll}
                        className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/85 hover:bg-mist hover:text-brand"
                      >
                        <Icon name={s.icon} className="mt-0.5 h-4 w-4 shrink-0 text-steel" />
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-[15px] font-semibold text-ink/80 transition-colors hover:bg-mist hover:text-brand"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={telHref}
            data-cta="header-call"
            variant="cta"
            className="px-4 py-2.5 text-sm"
            ariaLabel={`התקשרו ${site.phoneDisplay}`}
          >
            <Icon name="phone" className="h-4 w-4" />
            <span className="ltr hidden sm:inline">{site.phoneDisplay}</span>
            <span className="sm:hidden">חייגו</span>
          </Button>

          {/* Mobile menu toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-brand hover:bg-mist lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
          >
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="ניווט נייד"
          className="border-t border-line bg-white lg:hidden"
        >
          <ul className="container-x flex flex-col py-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeAll}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-ink/85 hover:bg-mist hover:text-brand"
                >
                  {item.label}
                </Link>

                {/* The five services sit inline under שירותים rather than behind a second
                    tap — on mobile an extra disclosure is friction, not tidiness. */}
                {item.href === SERVICES_HREF && (
                  <ul className="ms-3 mb-1 border-s border-line ps-3">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}/`}
                          onClick={closeAll}
                          className="flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/75 hover:bg-mist hover:text-brand"
                        >
                          <Icon name={s.icon} className="mt-0.5 h-4 w-4 shrink-0 text-steel" />
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
