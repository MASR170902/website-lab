"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Publications", href: "#publications" },
  { label: "Team", href: "#team" },
  { label: "News & Events", href: "#news" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-30 border-b border-slate-100 bg-white">
      <div className="container-wide flex h-[78px] items-center justify-between">
        <a
          href="#"
          className="flex shrink-0 items-center gap-2.5 sm:gap-3"
          aria-label="Programming Labs and Network Security Labs home"
        >
          <Image
            src="/logo-programming.png"
            alt="Programming Labs"
            width={120}
            height={61}
            priority
            className="h-[46px] w-auto max-w-[88px] object-contain sm:h-[54px] sm:max-w-[104px]"
          />
          <span aria-hidden="true" className="h-8 w-px bg-slate-200" />
          <Image
            src="/logo-network-security.png"
            alt="Network Security Labs"
            width={120}
            height={74}
            priority
            className="h-[46px] w-auto max-w-[78px] object-contain sm:h-[54px] sm:max-w-[92px]"
          />
          <span
            aria-hidden="true"
            className="hidden h-9 w-px bg-slate-200 lg:block"
          />
          <span className="hidden max-w-[155px] text-[11px] font-semibold leading-[1.35] tracking-[0.01em] text-ink lg:flex lg:flex-col">
            <span>Programming &amp; Network</span>
            <span>Security Lab</span>
            <span className="text-[10px] font-medium text-slate-500">
              Telkom University Purwokerto
            </span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 xl:gap-7 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium text-slate-600 transition-colors hover:text-ocean"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button
          asChild
          variant="primary"
          className="header-contact-button hidden md:inline-flex"
        >
          <a href="#contact">
            Get in Touch <ArrowUpRight size={15} />
          </a>
        </Button>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-ink md:hidden"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="absolute left-0 right-0 top-full border-t border-slate-100 bg-white px-5 py-5 shadow-lg md:hidden"
        >
          <div className="mx-auto flex max-w-[560px] flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-mist"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Get in Touch
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
