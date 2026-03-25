"use client";
import { forwardRef } from "react";
import FlowDiagram from "@/components/modulo4/charts/FlowDiagram";
import { PARTICIPANTS } from "@/lib/baas/constants";

const EcossistemaSection = forwardRef<HTMLElement>(function EcossistemaSection(_, ref) {
  return (
    <section ref={ref} id="ecossistema" className="scroll-mt-16">
      {/* Section title */}
      <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-container">hub</span>
        Ecossistema BaaS
      </h2>

      {/* Flow diagram */}
      <h3 className="text-lg font-bold text-on-surface mb-4">Fluxo do Ecossistema</h3>
      <div className="glass-panel p-4 rounded-xl border border-outline-variant/10 mb-6">
        <FlowDiagram />
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant/10 my-8" />

      {/* Participants */}
      <h3 className="text-lg font-bold text-on-surface mb-4">Participantes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {PARTICIPANTS.map((participant) => (
          <div
            key={participant.name}
            className="glass-panel p-6 rounded-xl border"
            style={{ borderColor: `${participant.color}33` }}
          >
            <div className="flex items-start gap-4">
              <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{participant.icon}</span>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface mb-1">{participant.name}</h4>
                <p className="text-sm font-semibold mb-3" style={{ color: participant.color }}>
                  {participant.subtitle}
                </p>
                <ul className="space-y-1">
                  {participant.responsibilities.map((resp) => (
                    <li key={resp} className="flex items-start gap-2 text-sm text-on-surface-variant">
                      <span style={{ color: participant.color }} className="mt-0.5">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warning box */}
      <div className="glass-panel p-4 rounded-lg border-l-4 border-[#f59e0b] bg-[#f59e0b]/5">
        <p className="text-sm text-on-surface-variant leading-relaxed">
          <strong className="text-[#f59e0b]">⚠️ Ponto Crítico:</strong> A instituição prestadora é a responsável
          final perante o BCB pela conformidade de toda a cadeia.
        </p>
      </div>
    </section>
  );
});

export default EcossistemaSection;
