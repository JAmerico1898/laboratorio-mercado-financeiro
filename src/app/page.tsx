import HeroSection from "@/components/HeroSection";
import ModuleCard from "@/components/ModuleCard";
import { modules } from "@/data/modules";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="font-headline text-4xl font-bold text-on-surface mb-4">
            Módulos de Análise
          </h2>
          <div className="h-1 w-24 bg-primary-container rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} {...mod} />
          ))}
        </div>

        <a
          href="https://laboratorio-dados-abertos-bcb.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 mx-auto max-w-md flex items-center gap-4 glass-panel px-6 py-4 rounded-xl border border-outline-variant/10 hover:border-primary-container/30 transition-all duration-300 group"
        >
          <span className="material-symbols-outlined text-primary-container text-3xl">
            account_balance
          </span>
          <div className="flex-1">
            <p className="font-headline text-sm font-semibold text-primary leading-tight">
              Laborat&oacute;rio de Dados Abertos do Banco Central
            </p>
            <p className="text-on-surface-variant text-xs mt-1 opacity-70">
              Acesse dados p&uacute;blicos do BCB
            </p>
          </div>
          <span className="material-symbols-outlined text-secondary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            open_in_new
          </span>
        </a>
      </section>
    </>
  );
}
