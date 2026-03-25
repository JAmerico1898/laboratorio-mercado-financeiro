"use client";
import { forwardRef } from "react";
import GlobalComparison from "@/components/modulo4/charts/GlobalComparison";

const BRAZIL_METRICS = [
  { value: "150M+", label: "usuários", sublabel: "Pix", color: "#10b981" },
  { value: "45M+", label: "consentimentos", sublabel: "Open Finance", color: "#0ea5e9" },
  { value: "1.500+", label: "ativas", sublabel: "Fintechs", color: "#8b5cf6" },
];

const CenarioGlobalSection = forwardRef<HTMLElement>(function CenarioGlobalSection(_, ref) {
  return (
    <section ref={ref} id="cenario-global" className="scroll-mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "1.75rem" }}>
          public
        </span>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Cenário Global</h2>
      </div>
      <p className="text-on-surface-variant mb-8">Comparativo Internacional de Modelos BaaS</p>

      {/* Global comparison chart */}
      <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 mb-6">
        <GlobalComparison />
      </div>

      <div className="border-t border-outline-variant/10 my-8" />

      {/* Brazil highlight */}
      <h3 className="text-lg font-semibold text-on-surface mb-4">
        Brasil: Pioneiro em Infraestrutura
      </h3>

      <div className="glass-panel p-6 rounded-xl border border-secondary/20 mb-6">
        <div className="flex items-start gap-4">
          <span style={{ fontSize: "2rem", lineHeight: 1 }}>🇧🇷</span>
          <div>
            <p className="font-bold text-on-surface text-lg mb-2">Posição de Destaque Global</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              O Brasil possui uma das infraestruturas de pagamentos mais avançadas do mundo.{" "}
              <span className="text-secondary font-semibold">Pix</span>,{" "}
              <span className="text-primary-container font-semibold">Open Finance</span> e{" "}
              <span className="text-[#8b5cf6] font-semibold">Open Banking</span> posicionam o país
              na vanguarda.
            </p>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BRAZIL_METRICS.map((metric) => (
          <div
            key={metric.sublabel}
            className="glass-panel p-6 rounded-xl border border-outline-variant/10 text-center"
          >
            <p className="text-3xl font-bold mb-1" style={{ color: metric.color }}>
              {metric.value}
            </p>
            <p className="text-sm font-semibold text-on-surface mb-1">{metric.label}</p>
            <p className="text-xs text-on-surface-variant">{metric.sublabel}</p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default CenarioGlobalSection;
