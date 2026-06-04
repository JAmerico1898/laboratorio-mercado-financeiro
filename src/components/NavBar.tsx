"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/data/nav-links";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const filteredLinks = NAV_LINKS.filter((link) => {
    if (link.href === "/") return pathname !== "/";
    return !pathname.startsWith(link.href);
  });

  return (
    <nav className="relative w-full flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
      <Link
        href="/"
        className="flex items-center gap-3 text-xl font-bold tracking-tighter text-primary font-headline"
      >
        <Image
          src="/logo/finlab-logo-white.jpg"
          alt="FinLab"
          width={250}
          height={212}
          priority
          className="h-9 w-auto rounded-md"
        />
        Laboratório de Mercado Financeiro
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-6">
        {filteredLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-slate-600"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        <span className="material-symbols-outlined">
          {open ? "close" : "menu"}
        </span>
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-t border-outline-variant/10 md:hidden z-50">
          <ul className="flex flex-col px-6 py-4 gap-3">
            {filteredLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-slate-600 hover:text-primary transition-colors block py-1"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
