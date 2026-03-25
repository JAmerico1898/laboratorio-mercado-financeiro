import HeroSection from "@/components/HeroSection";
import ModuleCard from "@/components/ModuleCard";
import { modules } from "@/data/modules";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl font-bold text-on-surface mb-4">
              Módulos de Análise
            </h2>
            <div className="h-1 w-24 bg-primary-container rounded-full" />
          </div>
          <p className="font-label text-xs uppercase tracking-widest text-outline-variant">
            Nexus Acadêmico &copy; 2024
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <ModuleCard key={mod.id} {...mod} />
          ))}
        </div>
      </section>
    </>
  );
}
