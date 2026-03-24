import CreditRiskKinetic from "./CreditRiskKinetic";

export default function OpeningHero() {
  return (
    <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          {/* Module badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-sm bg-surface-container-highest text-secondary text-[10px] font-bold tracking-widest uppercase">
              Módulo 2
            </span>
            <div className="h-[1px] w-12 bg-outline-variant/30" />
            <span className="text-on-surface-variant text-sm font-medium tracking-tight">
              Análise Quantitativa de Crédito
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[1.1] text-glow">
            Modelagem de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-container">
              Risco de Crédito
            </span>
          </h1>

          {/* Description with terminal accent */}
          <p className="text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-3xl border-l-2 border-primary-container pl-6">
            Desenvolvimento de frameworks estatísticos para avaliação de
            probabilidade de default (PD) e perda dado o descumprimento (LGD).
          </p>
        </div>

        {/* Decorative Kinetic Visual */}
        <CreditRiskKinetic />
      </div>
    </section>
  );
}
