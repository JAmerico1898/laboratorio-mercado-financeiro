import HeroImage from "@/components/HeroImage";

export default function OpeningHero() {
  return (
    <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10">
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
            brasileiras usando dados de contratos futuros DI1 da B3. Os
            contratos DI1 são derivativos da taxa DI (CDI) pós-fixada,
            essencialmente taxas zero-cupom com capitalização de 252 dias úteis.
          </p>

        </div>

        <HeroImage
          src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&q=80"
          alt="Monitor exibindo gráfico financeiro"
        />
      </div>
    </section>
  );
}
