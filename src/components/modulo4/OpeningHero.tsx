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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative z-10">
        <div className="lg:col-span-2">
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

        <div className="hidden lg:block lg:col-span-3 relative w-full aspect-video rounded-2xl overflow-hidden border border-outline-variant/10">
          <video
            src="/videos/hero_baas.mp4"
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
