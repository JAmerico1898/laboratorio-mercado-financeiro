export default function OpeningHero() {
  return (
    <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="z-10 lg:col-span-2">
          {/* Module badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary-container">
              Módulo 01: ESTRUTURA A TERMO DE TAXAS DE JUROS
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-primary mb-6 leading-[1.1]">
            Modelagem da Estrutura a Termo -{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">
              Taxa DI (CDI)
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-2xl">
            Esta aplicação modela a estrutura a termo das taxas de juros
            brasileiras usando dados de contratos futuros DI1 da B3.
          </p>

        </div>

        <div className="hidden lg:block lg:col-span-3 relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant/10">
          <video
            src="/videos/estrutura-termo.mp4"
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
