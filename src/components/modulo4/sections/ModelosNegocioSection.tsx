"use client";
import { forwardRef, useState } from "react";
import { STRUCTURE_MODELS, REVENUE_MODELS } from "@/lib/baas/constants";

const VARIANT_BORDER: Record<string, string> = {
  cyan: "border-primary-container/20",
  green: "border-secondary/20",
  amber: "border-[#f59e0b]/20",
  default: "border-outline-variant/10",
};

const ModelosNegocioSection = forwardRef<HTMLElement>(function ModelosNegocioSection(_, ref) {
  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  return (
    <section ref={ref} id="modelos" className="scroll-mt-16">
      {/* Section title */}
      <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-container">business</span>
        Modelos de Negócio
      </h2>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 glass-panel rounded-lg p-1 border border-outline-variant/10 w-fit">
        {(["Estruturas Operacionais", "Modelos de Receita"] as const).map((label, idx) => (
          <button
            key={label}
            onClick={() => setActiveTab(idx as 0 | 1)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
              activeTab === idx
                ? "bg-primary-container/15 text-primary-container"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Estruturas Operacionais */}
      {activeTab === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STRUCTURE_MODELS.map((model) => (
            <div
              key={model.name}
              className="glass-panel p-6 rounded-xl border border-outline-variant/10"
            >
              <div className="text-center mb-4">
                <span style={{ fontSize: "3rem", lineHeight: 1 }}>{model.icon}</span>
              </div>
              <h4 className="font-bold mb-2 text-center" style={{ color: model.color }}>
                {model.name}
              </h4>
              <p className="text-sm text-on-surface-variant mb-4 text-center leading-relaxed">
                {model.description}
              </p>
              <div className="space-y-2">
                {model.pros.map((pro) => (
                  <div key={pro} className="flex items-start gap-2 text-sm">
                    <span className="text-secondary font-bold mt-0.5">✓</span>
                    <span className="text-on-surface-variant">{pro}</span>
                  </div>
                ))}
                {model.cons.map((con) => (
                  <div key={con} className="flex items-start gap-2 text-sm">
                    <span className="text-[#f87171] font-bold mt-0.5">✗</span>
                    <span className="text-on-surface-variant">{con}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Modelos de Receita */}
      {activeTab === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REVENUE_MODELS.map((model) => (
            <div
              key={model.title}
              className={`glass-panel p-6 rounded-xl border ${VARIANT_BORDER[model.variant] ?? VARIANT_BORDER.default}`}
            >
              <h4 className="font-bold mb-3" style={{ color: model.color }}>
                {model.title}
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                {model.description}
              </p>
              {model.warning && (
                <p className="text-sm font-semibold text-[#f59e0b]">⚠️ {model.warning}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

export default ModelosNegocioSection;
