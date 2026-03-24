import Link from "next/link";
import type { ModuleInfo } from "@/data/modules";

export default function ModuleCard({ id, title, description, icon }: ModuleInfo) {
  return (
    <Link href={`/modulo/${id}`} className="block">
      <div className="glass-panel p-8 rounded-xl border border-outline-variant/10 hover:border-primary-container/30 transition-all duration-500 group flex flex-col justify-between h-[360px]">
        <div className="space-y-4">
          <span
            className="material-symbols-outlined text-primary-container text-4xl"
          >
            {icon}
          </span>
          <h3 className="font-headline text-2xl font-semibold text-primary leading-tight">
            {title}
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2 text-secondary opacity-0 group-hover:opacity-100 transition-opacity mt-4">
          <span className="text-xs font-bold uppercase tracking-tighter">
            Explorar Módulo
          </span>
          <span className="material-symbols-outlined text-sm">
            trending_flat
          </span>
        </div>
      </div>
    </Link>
  );
}
