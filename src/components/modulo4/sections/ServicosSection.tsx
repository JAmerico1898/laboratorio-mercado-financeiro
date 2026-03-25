"use client";
import { forwardRef } from "react";
import { SERVICES_DATA, DISCUSSION_TOPICS } from "@/lib/baas/constants";

const BADGE_CLASSES: Record<string, string> = {
  emerald: "bg-secondary/20 text-secondary",
  amber: "bg-[#f59e0b]/20 text-[#f59e0b]",
  cyan: "bg-primary-container/20 text-primary-container",
  violet: "bg-[#8b5cf6]/20 text-[#8b5cf6]",
};

const ServicosSection = forwardRef<HTMLElement>(function ServicosSection(_, ref) {
  return (
    <section ref={ref} id="servicos" className="scroll-mt-16">
      {/* Section title */}
      <h2 className="text-2xl font-bold font-headline text-on-surface mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-container">settings</span>
        Serviços BaaS
      </h2>
      <p className="text-sm text-on-surface-variant mb-6">
        Escopo de Serviços conforme CP BCB 108/2024
      </p>

      {/* 9 service cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {SERVICES_DATA.map((service) => (
          <div
            key={service.name}
            className="glass-panel p-6 rounded-xl border border-outline-variant/10"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-2xl">{service.icon}</span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  BADGE_CLASSES[service.statusColor] ?? BADGE_CLASSES.cyan
                }`}
              >
                {service.status}
              </span>
            </div>
            <h4 className="font-bold text-on-surface mb-2">{service.name}</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant/10 my-8" />

      {/* Temas em Discussão */}
      <h3 className="text-lg font-bold text-on-surface mb-4">Temas em Discussão</h3>
      <div className="space-y-3">
        {DISCUSSION_TOPICS.map((topic) => (
          <details key={topic.title} className="group">
            <summary className="glass-panel flex items-center gap-3 p-4 rounded-xl border border-outline-variant/10 cursor-pointer hover:border-outline-variant/30 transition-colors list-none">
              <span className="text-xl">{topic.icon}</span>
              <span className="font-semibold text-on-surface flex-1">{topic.title}</span>
              <span className="material-symbols-outlined text-on-surface-variant text-base transition-transform duration-200 group-open:rotate-90">
                chevron_right
              </span>
            </summary>
            <div className="mt-2 px-4 pb-4 glass-panel rounded-b-xl border border-t-0 border-outline-variant/10">
              <p className="pt-3 text-sm text-on-surface-variant leading-relaxed">{topic.content}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
});

export default ServicosSection;
