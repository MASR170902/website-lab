"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navigation = [
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Practicum", href: "#practicum" },
  { label: "Publications", href: "#publications" },
  { label: "Team", href: "#team" },
  { label: "News & Events", href: "#news" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = [...navigation.map((item) => item.href.slice(1)), "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-80px 0px -50% 0px",
        threshold: 0,
      }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white">
      <div className="mx-auto flex w-full max-w-[1160px] items-center justify-between px-4 min-[360px]:px-5 sm:px-6 md:px-8 min-h-[64px] py-2 sm:min-h-[72px] sm:py-2.5 xl:h-[78px] xl:min-h-[78px] xl:px-0 xl:py-0">
        <a
          href="#"
          className="flex min-w-0 items-center gap-1 min-[360px]:gap-1.5 sm:gap-2.5 md:gap-3"
          aria-label="Programming Labs and Network Security Labs home"
        >
          <Image
            src="/logo-programming.png"
            alt="Programming Labs"
            width={120}
            height={61}
            className="h-6 w-auto max-w-[48px] shrink-0 object-contain min-[360px]:h-7 min-[360px]:max-w-[56px] sm:h-9 sm:max-w-[76px] md:h-[46px] md:max-w-[88px] xl:h-[54px] xl:max-w-[104px]"
          />
          <span aria-hidden="true" className="h-5 w-px shrink-0 bg-slate-200 min-[360px]:h-6 sm:h-7 md:h-8" />
          <Image
            src="/logo-network-security.png"
            alt="Network Security Labs"
            width={120}
            height={74}
            className="h-6 w-auto max-w-[40px] shrink-0 object-contain min-[360px]:h-7 min-[360px]:max-w-[48px] sm:h-9 sm:max-w-[64px] md:h-[46px] md:max-w-[78px] xl:h-[54px] xl:max-w-[92px]"
          />
          <span
            aria-hidden="true"
            className="h-5 w-px shrink-0 bg-slate-200 min-[360px]:h-6 sm:h-7 md:h-8 xl:h-9"
          />
          <span className="flex min-w-0 flex-col text-[9.5px] font-semibold leading-[1.2] tracking-[0.01em] text-ink min-[360px]:text-[10px] min-[360px]:leading-[1.25] sm:text-xs sm:leading-tight md:text-sm md:leading-snug xl:max-w-[155px] xl:text-[11px] xl:leading-[1.35]">
            <span className="block whitespace-nowrap">Programming &amp; Network</span>
            <span className="block whitespace-nowrap">Security Lab</span>
            <span className="block whitespace-nowrap text-[8.5px] font-medium text-slate-500 min-[360px]:text-[9px] sm:text-[10px] md:text-xs xl:text-[10px]">
              Telkom University Purwokerto
            </span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-2 xl:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
              className={`rounded-full px-2.5 py-2 text-[13px] transition-colors ${
                item.href === "#contact"
                  ? `header-contact-button px-3 font-semibold ${
                      activeSection === "contact" ? "ring-2 ring-[#a8e5bd] ring-offset-2" : ""
                    }`
                  : activeSection === item.href.slice(1)
                    ? "bg-[#edf5f0] font-semibold text-ocean"
                    : "font-medium text-slate-600 hover:text-ocean"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-ink min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 xl:hidden"
        >
          {menuOpen ? <X size={16} className="min-[360px]:h-[18px] min-[360px]:w-[18px] sm:h-[19px] sm:w-[19px]" /> : <Menu size={16} className="min-[360px]:h-[18px] min-[360px]:w-[18px] sm:h-[19px] sm:w-[19px]" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full border-t border-slate-100 bg-white px-5 py-5 shadow-lg xl:hidden"
        >
          <div className="mx-auto flex max-w-[560px] flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={activeSection === item.href.slice(1) ? "location" : undefined}
                className={`rounded-lg px-3 py-3 text-sm ${
                  item.href === "#contact"
                    ? `mt-2 text-center font-semibold text-white ${
                        activeSection === "contact" ? "bg-ocean" : "bg-ink"
                      }`
                    : activeSection === item.href.slice(1)
                      ? "bg-[#edf5f0] font-semibold text-ocean"
                      : "font-medium text-slate-700 hover:bg-mist"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
