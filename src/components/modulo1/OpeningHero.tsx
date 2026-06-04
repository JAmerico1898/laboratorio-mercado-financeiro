import BackToModulesLink from "@/components/BackToModulesLink";

export default function OpeningHero() {
  return (
    <section className="relative bg-surface px-6 pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="z-10 lg:col-span-2">
          <BackToModulesLink />

          {/* Pre-título (categoria) */}
          <p className="mt-6 mb-6 text-xs font-bold uppercase tracking-[0.16em] text-secondary">
            Curva de juros
          </p>

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
