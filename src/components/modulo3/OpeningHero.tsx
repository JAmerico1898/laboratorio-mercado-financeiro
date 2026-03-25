"use client";

import HeroImage from "@/components/HeroImage";

interface OpeningHeroProps {
  onStartJourney: () => void;
}

export default function OpeningHero({ onStartJourney }: OpeningHeroProps) {
  return (
    <section className="relative px-6 md:px-8 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-secondary text-[10px] font-bold tracking-widest uppercase">
              Módulo 3
            </span>
            <div className="h-[1px] w-12 bg-outline-variant/30" />
            <span className="text-on-surface-variant text-sm font-medium tracking-tight">
              Securitização
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary mb-6 leading-[1.1]">
            Fundos de Direitos Creditórios{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">
              (FIDC)
            </span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl border-l-2 border-primary-container/30 pl-4 mb-8">
            Explore a jornada completa de estruturação de um FIDC — da análise
            de viabilidade econômica ao registro na CVM, passando pela
            arquitetura de classes sob a Resolução CVM 175/2022 e os mecanismos
            de subordinação que protegem os investidores.
          </p>

          <button
            onClick={onStartJourney}
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,231,0.15)]"
          >
            Iniciar Jornada
            <span className="material-symbols-outlined text-xl">
              rocket_launch
            </span>
          </button>
        </div>

        <HeroImage
          src="https://images.unsplash.com/photo-1709626011485-6fe000ea2dbc?w=1200&q=80"
          alt="Blocos geométricos em camadas representando estrutura de tranches"
        />
      </div>
    </section>
  );
}
