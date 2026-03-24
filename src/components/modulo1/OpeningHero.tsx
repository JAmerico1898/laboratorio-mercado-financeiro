import Link from "next/link";
import KineticVisual from "./KineticVisual";

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

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="border border-outline-variant/30 text-on-surface px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-surface-container transition-colors active:scale-95 flex items-center gap-2">
              Escolha o Método de Interpolação
              <span className="material-symbols-outlined">
                settings_input_component
              </span>
            </button>
            <Link
              href="/modulo/1/ettj"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-transform flex items-center gap-2"
            >
              Iniciar Modelagem
              <span className="material-symbols-outlined">trending_up</span>
            </Link>
          </div>
        </div>

        {/* Decorative Kinetic Visual */}
        <KineticVisual />
      </div>
    </section>
  );
}
