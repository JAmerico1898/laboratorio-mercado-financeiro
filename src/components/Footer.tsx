"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data/nav-links";

export default function Footer() {
  const pathname = usePathname();

  const filteredLinks = NAV_LINKS.filter((link) => {
    if (link.href === "/") return pathname !== "/";
    return !pathname.startsWith(link.href);
  });

  return (
    <footer className="w-full border-t border-slate-800/30 bg-slate-900/50 backdrop-blur-xl flex flex-col items-center px-8 py-12 mt-20">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        <p className="text-xs uppercase tracking-widest text-slate-500">
          &copy; 2026 Laboratório de Mercado Financeiro &mdash; Prof. José
          Américo &mdash; COPPEAD-FGV-UCAM
        </p>
        <p className="text-xs uppercase tracking-widest text-slate-500">
          Dúvidas? Sugestões? Entre em contato!
        </p>
      </div>
    </footer>
  );
}
