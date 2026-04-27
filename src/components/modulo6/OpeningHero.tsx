"use client";

interface OpeningHeroProps {
  onStartJourney: () => void;
}

export default function OpeningHero({ onStartJourney }: OpeningHeroProps) {
  return (
    <section className="relative px-6 md:px-8 pt-24 pb-16 overflow-hidden">
      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
        <div className="lg:col-span-2">
          {/* badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-secondary text-[10px] font-bold tracking-widest uppercase">
              Módulo 6
            </span>
            <div className="h-[1px] w-12 bg-outline-variant/30" />
            <span className="text-on-surface-variant text-sm font-medium tracking-tight">
              Regulação Bancária
            </span>
          </div>
          {/* title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary mb-6 leading-[1.1]">
            Regulação{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">
              Bancária
            </span>
          </h1>
          {/* description */}
          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl border-l-2 border-primary-container/30 pl-4 mb-8">
            Explore os fundamentos da regulação bancária — dos Acordos de Basileia I ao IV, passando por
            análises de capital regulatório, alavancagem, provisões e uma simulação completa de gestão
            bancária. Aprenda na prática como os requisitos de capital protegem depositantes e a
            estabilidade do sistema financeiro.
          </p>
          {/* CTA button */}
          <button
            onClick={onStartJourney}
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,231,0.15)]"
          >
            Iniciar Jornada
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </button>
        </div>

        <div className="hidden lg:block lg:col-span-3 relative w-full aspect-video rounded-2xl overflow-hidden border border-outline-variant/10">
          <video
            src="/videos/hero-regulacao-bancaria.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
