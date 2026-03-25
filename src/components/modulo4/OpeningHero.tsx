"use client";

interface OpeningHeroProps {
  onStartJourney: () => void;
}

export default function OpeningHero({ onStartJourney }: OpeningHeroProps) {
  return (
    <section className="relative px-6 md:px-8 pt-24 pb-16 overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-secondary text-[10px] font-bold tracking-widest uppercase">
              Módulo 4: Banking as a Service
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
            <span className="gradient-text">Banking as a Service (BaaS)</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl border-l-2 border-primary-container/30 pl-4 mb-8">
            Inovação em infraestrutura bancária modular permitindo que empresas não
            financeiras ofereçam serviços bancários integrados via APIs de alta
            performance.
          </p>

          {/* CTA Button */}
          <button
            onClick={onStartJourney}
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold tracking-tight hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,231,0.15)]"
          >
            Iniciar Jornada
            <span className="material-symbols-outlined text-xl">rocket_launch</span>
          </button>
        </div>

        {/* Decorative right panel */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 rounded-full bg-primary-container/5 blur-2xl" />
            <div className="absolute inset-8 rounded-full bg-secondary/5 blur-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[120px] text-primary-container/30">
                account_balance
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
