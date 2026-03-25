"use client";
import { forwardRef } from "react";
import RegulatoryTimeline from "@/components/modulo4/charts/RegulatoryTimeline";
import { REGULATORY_PRINCIPLES } from "@/lib/baas/constants";

const RegulacaoSection = forwardRef<HTMLElement>(function RegulacaoSection(_, ref) {
  return (
    <section ref={ref} id="regulacao" className="scroll-mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "1.75rem" }}>
          gavel
        </span>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Regulação BCB</h2>
      </div>
      <p className="text-on-surface-variant mb-8">Consulta Pública 108/2024 e 115/2025</p>

      {/* Regulatory Timeline */}
      <h3 className="text-lg font-semibold text-on-surface mb-4">Cronograma Regulatório</h3>
      <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 mb-4">
        <RegulatoryTimeline />
      </div>

      {/* Info box */}
      <div className="glass-panel p-4 rounded-lg border-l-4 border-primary-container bg-primary-container/5 mb-8">
        <p className="text-on-surface text-sm leading-relaxed">
          📌 <strong>Status Atual:</strong> Consulta Pública prorrogada até{" "}
          <strong>28 de fevereiro de 2025</strong> (Edital 115/2025).
        </p>
      </div>

      <div className="border-t border-outline-variant/10 my-8" />

      {/* Regulatory Principles */}
      <h3 className="text-lg font-semibold text-on-surface mb-4">Princípios da Regulação</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REGULATORY_PRINCIPLES.map((principle) => (
          <div
            key={principle.title}
            className="glass-panel p-6 rounded-xl border border-outline-variant/10 flex items-start gap-4"
          >
            <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{principle.icon}</span>
            <div>
              <p className="font-bold text-on-surface mb-1">{principle.title}</p>
              <p className="text-sm text-on-surface-variant">{principle.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default RegulacaoSection;
