"use client";
import { forwardRef } from "react";

const IntroducaoSection = forwardRef<HTMLElement>(function IntroducaoSection(_, ref) {
  return (
    <section ref={ref} id="introducao" className="scroll-mt-16">
      {/* Section title */}
      <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-container">home</span>
        Introdução
      </h2>

      {/* Main highlight card — cyan border */}
      <div className="glass-panel p-6 rounded-xl border border-primary-container/20 mb-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-3">O que é Banking as a Service?</h3>
            <p className="text-on-surface-variant leading-relaxed">
              <strong className="text-primary-container">Banking as a Service (BaaS)</strong> é um modelo onde
              instituições financeiras autorizadas pelo BCB disponibilizam sua{" "}
              <strong className="text-[#8b5cf6]">infraestrutura regulamentada</strong> para que entidades terceiras
              (fintechs, varejistas, plataformas digitais) possam oferecer{" "}
              <strong className="text-secondary">produtos e serviços financeiros</strong> aos seus clientes.
            </p>
          </div>
        </div>
      </div>

      {/* 3 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
          <div className="text-3xl mb-3">🏛️</div>
          <h4 className="font-bold text-on-surface mb-1">Instituições Prestadoras</h4>
          <p className="text-sm text-primary-container font-semibold mb-2">Bancos, IPs, SCDs</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Entidades autorizadas pelo BCB que fornecem a infraestrutura regulamentada.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
          <div className="text-3xl mb-3">📱</div>
          <h4 className="font-bold text-on-surface mb-1">Tomadores de Serviços</h4>
          <p className="text-sm text-primary-container font-semibold mb-2">Fintechs, Varejo</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Entidades que utilizam a infraestrutura BaaS para oferecer serviços.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
          <div className="text-3xl mb-3">👤</div>
          <h4 className="font-bold text-on-surface mb-1">Clientes Finais</h4>
          <p className="text-sm text-primary-container font-semibold mb-2">PF e PJ</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Consumidores que acessam serviços financeiros através da experiência integrada.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant/10 my-8" />

      {/* Por que Regular o BaaS? */}
      <h3 className="text-lg font-bold text-on-surface mb-4">Por que Regular o BaaS?</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
          <h4 className="font-bold text-on-surface mb-3">Contexto</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Crescimento relevante no volume de serviços financeiros via BaaS, estruturados por contratos privados
            com diversidade de regras. O BCB identificou necessidade de disciplinar para mitigar riscos ao SFN e SPB.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
          <h4 className="font-bold text-on-surface mb-3">Objetivos</h4>
          <ul className="space-y-1.5">
            {[
              "Segurança e solidez do sistema",
              "Eficiência e competitividade",
              "Inovação e livre concorrência",
              "Inclusão financeira",
              "Proteção ao consumidor",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-on-surface-variant">
                <span className="text-secondary mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SaaS analogy card — green border */}
      <div className="glass-panel p-6 rounded-xl border border-secondary/20">
        <h4 className="font-bold text-secondary mb-3">BaaS é o &ldquo;SaaS&rdquo; do Setor Bancário</h4>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Assim como empresas de tecnologia consomem capacidades de computação em nuvem sob demanda (Software as a
          Service), o BaaS permite que empresas não-bancárias consumam capacidades bancárias via APIs, sem precisar
          construir ou licenciar toda a infraestrutura por conta própria.
        </p>
      </div>
    </section>
  );
});

export default IntroducaoSection;
