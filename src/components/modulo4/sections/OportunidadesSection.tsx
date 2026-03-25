"use client";
import { forwardRef } from "react";
import { OPPORTUNITIES } from "@/lib/baas/constants";

const OportunidadesSection = forwardRef<HTMLElement>(function OportunidadesSection(_, ref) {
  return (
    <section ref={ref} id="oportunidades" className="scroll-mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-primary-container" style={{ fontSize: "1.75rem" }}>
          rocket_launch
        </span>
        <h2 className="text-2xl font-bold font-headline text-on-surface">Oportunidades do BaaS</h2>
      </div>
      <p className="text-on-surface-variant mb-8">Benefícios para o Sistema Financeiro e a Sociedade</p>

      {/* Opportunity cards — 3-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {OPPORTUNITIES.map((opportunity) => (
          <div
            key={opportunity.title}
            className="glass-panel p-6 rounded-xl border"
            style={{ borderColor: opportunity.color + "30" }}
          >
            <div style={{ fontSize: "2.5rem", lineHeight: 1 }} className="mb-3">
              {opportunity.icon}
            </div>
            <p className="font-bold mb-2" style={{ color: opportunity.color }}>
              {opportunity.title}
            </p>
            <p className="text-sm text-on-surface-variant">{opportunity.description}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-outline-variant/10 my-8" />

      {/* Embedded Finance highlight */}
      <div className="glass-panel p-6 rounded-xl border border-primary-container/20">
        <div className="flex items-start gap-4">
          <span style={{ fontSize: "2rem", lineHeight: 1 }}>🔮</span>
          <div>
            <p className="font-bold text-on-surface text-lg mb-2">Embedded Finance - O Futuro</p>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Serviços financeiros integrados de forma invisível em plataformas não-financeiras.
              E-commerce, mobilidade, SaaS B2B e Gig Economy oferecendo conta, pagamentos, crédito
              e seguros na jornada do usuário.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default OportunidadesSection;
