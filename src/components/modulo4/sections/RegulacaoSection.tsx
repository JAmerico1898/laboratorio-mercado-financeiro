"use client";
import { forwardRef } from "react";

const RegulacaoSection = forwardRef<HTMLElement>(function RegulacaoSection(_, ref) {
  return (
    <section ref={ref} id="regulacao" className="scroll-mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "1.75rem" }}>
          gavel
        </span>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Regulação BCB</h2>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
        <p className="text-on-surface leading-relaxed">
          Resolução Conjunta nº 16, de 28.11.2025 — Banco Central do Brasil | Conselho Monetário Nacional
        </p>
      </div>
    </section>
  );
});

export default RegulacaoSection;
