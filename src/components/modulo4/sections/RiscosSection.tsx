"use client";
import { forwardRef } from "react";
import RiskRadar from "@/components/modulo4/charts/RiskRadar";

const RiscosSection = forwardRef<HTMLElement>(function RiscosSection(_, ref) {
  return (
    <section ref={ref} id="riscos" className="scroll-mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "1.75rem" }}>
          warning
        </span>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Riscos do BaaS</h2>
      </div>
      <p className="text-on-surface-variant mb-8">Mapeamento e Estratégias de Mitigação</p>

      {/* Radar + Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Chart — spans 2 cols on lg */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-outline-variant/10">
          <RiskRadar />
        </div>

        {/* Legend card */}
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex flex-col gap-4">
          <p className="font-bold text-on-surface">Legenda</p>

          <div className="flex items-center gap-3">
            <span
              className="inline-block w-4 h-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: "#ef4444" }}
            />
            <span className="text-sm text-on-surface-variant">Risco Inerente</span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="inline-block w-4 h-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: "#10b981" }}
            />
            <span className="text-sm text-on-surface-variant">Após Mitigação</span>
          </div>

          <div className="border-t border-outline-variant/10 my-1" />

          <p className="text-xs text-on-surface-variant">Escala de 1 (baixo) a 5 (crítico)</p>
        </div>
      </div>

      <div className="border-t border-outline-variant/10 my-8" />

      {/* Synapse case */}
      <h3 className="text-lg font-semibold text-on-surface mb-4">Caso Synapse (2024)</h3>
      <div className="glass-panel p-4 rounded-lg border-l-4 border-[#ef4444] bg-[#ef4444]/5">
        <p className="font-bold text-on-surface mb-2">A Falência que Abalou o Mercado BaaS</p>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
          A Synapse, middleware de BaaS nos EUA, deixou centenas de milhares de clientes sem acesso
          aos fundos. Problemas: falhas de reconciliação em contas FBO, supervisão inadequada,
          complexidade de resolução.
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          <strong className="text-on-surface">Lição:</strong> Dependência de middleware adiciona
          camada de risco que bancos parceiros precisam supervisionar.
        </p>
      </div>
    </section>
  );
});

export default RiscosSection;
