"use client";

import { useState } from "react";
import Link from "next/link";
import { navItems, site, telHref } from "@/lib/site";
import { Logo, Button } from "@/components/ui";
import Icon from "@/components/Icon";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="ניווט ראשי" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-[15px] font-semibold text-ink/80 transition-colors hover:bg-mist hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={telHref} variant="cta" className="px-4 py-2.5 text-sm" ariaLabel={`התקשרו ${site.phoneDisplay}`}>
            <Icon name="phone" className="h-4 w-4" />
            <span className="hidden sm:inline">{site.phoneDisplay}</span>
            <span className="sm:hidden">חייגו</span>
          </Button>

          {/* Mobile menu toggle */}
          <button
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
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-ink/85 hover:bg-mist hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
