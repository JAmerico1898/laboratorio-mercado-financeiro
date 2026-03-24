"use client";

import { useState, useMemo } from "react";
import type { ClassConfig, DiagramNode, DiagramEdge } from "@/lib/fidc/types";
import { DEFAULT_ASSET_CLASSES, USE_CASE_PRESETS, SUB_INDEX_MIN, SUB_INDEX_MAX, SUB_INDEX_STEP } from "@/lib/fidc/constants";
import ClassHierarchyDiagram from "@/components/modulo3/charts/ClassHierarchyDiagram";

const SENIOR_COLOR = "#4edea3";
const MEZANINO_COLOR = "#ffb74d";
const SUBORDINADA_COLOR = "#ff4444";

export default function ClassesModule() {
  const [config, setConfig] = useState<ClassConfig>({
    fundName: "",
    fundCnpj: "",
    classes: DEFAULT_ASSET_CLASSES.map((c) => ({ ...c })),
    includeMezanino: false,
  });

  // Toggle a class on/off
  const handleClassToggle = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      classes: prev.classes.map((c) =>
        c.id === id ? { ...c, enabled: !c.enabled } : c
      ),
    }));
  };

  // Update subordination index for a class
  const handleSubIndexChange = (id: string, value: number) => {
    setConfig((prev) => ({
      ...prev,
      classes: prev.classes.map((c) =>
        c.id === id ? { ...c, subordinationIndex: value } : c
      ),
    }));
  };

  // Apply a preset
  const handlePreset = (presetId: string) => {
    const preset = USE_CASE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setConfig((prev) => ({
      ...prev,
      fundName: preset.fundName,
      includeMezanino: preset.includeMezanino,
      classes: prev.classes.map((c) => ({
        ...c,
        enabled: preset.activeClasses.includes(c.id),
      })),
    }));
  };

  const enabledClasses = config.classes.filter((c) => c.enabled);

  // Build diagram data
  const { nodes, edges } = useMemo<{ nodes: DiagramNode[]; edges: DiagramEdge[] }>(() => {
    if (enabledClasses.length === 0) {
      return { nodes: [], edges: [] };
    }

    const nodes: DiagramNode[] = [];
    const edges: DiagramEdge[] = [];

    // Root node
    const rootNode: DiagramNode = {
      id: "root",
      label: config.fundName || "FIDC",
      sublabel: config.fundCnpj || undefined,
      color: "#00f2ff",
      type: "root",
    };
    nodes.push(rootNode);

    for (const cls of enabledClasses) {
      // Class node
      const classNode: DiagramNode = {
        id: cls.id,
        label: cls.name,
        color: cls.color,
        type: "class",
      };
      nodes.push(classNode);
      edges.push({ source: "root", target: cls.id });

      // Senior subclass
      const seniorId = `${cls.id}_senior`;
      nodes.push({
        id: seniorId,
        label: "Sênior",
        color: SENIOR_COLOR,
        type: "subclass",
      });
      edges.push({ source: cls.id, target: seniorId });

      // Optional Mezanino subclass
      if (config.includeMezanino) {
        const mezaninoId = `${cls.id}_mezanino`;
        nodes.push({
          id: mezaninoId,
          label: "Mezanino",
          color: MEZANINO_COLOR,
          type: "subclass",
        });
        edges.push({ source: cls.id, target: mezaninoId });
      }

      // Subordinada subclass
      const subordinadaId = `${cls.id}_subordinada`;
      nodes.push({
        id: subordinadaId,
        label: "Subordinada",
        color: SUBORDINADA_COLOR,
        type: "subclass",
      });
      edges.push({ source: cls.id, target: subordinadaId });
    }

    return { nodes, edges };
  }, [enabledClasses, config.fundName, config.fundCnpj, config.includeMezanino]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-on-surface mb-1">Arquiteto de Classes</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Configure a estrutura de classes do seu FIDC conforme a Resolução CVM 175/2022. Cada classe de ativos
          é isolada patrimonialmente, protegendo as demais em caso de inadimplência.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column — Controls */}
        <div className="space-y-6">
          {/* Fund identification */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary-container">corporate_fare</span>
              Identificação do Fundo
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  Nome do Fundo
                </label>
                <input
                  type="text"
                  value={config.fundName}
                  onChange={(e) => setConfig((prev) => ({ ...prev, fundName: e.target.value }))}
                  placeholder="Ex: FIDC Premium Multiclasse"
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1 font-medium">
                  CNPJ (opcional)
                </label>
                <input
                  type="text"
                  value={config.fundCnpj}
                  onChange={(e) => setConfig((prev) => ({ ...prev, fundCnpj: e.target.value }))}
                  placeholder="00.000.000/0001-00"
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container/60 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Preset buttons */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary-container">auto_awesome</span>
              Casos de Uso Prontos
            </h3>
            <div className="space-y-2">
              {USE_CASE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePreset(preset.id)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-outline-variant/20 bg-surface-container hover:bg-surface-container-high hover:border-primary-container/40 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-on-surface group-hover:text-primary-container transition-colors">
                        {preset.label}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{preset.description}</p>
                    </div>
                    <span className="material-symbols-outlined text-sm text-outline-variant group-hover:text-primary-container transition-colors mt-0.5 shrink-0">
                      arrow_forward
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Asset classes */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary-container">layers</span>
              Classes de Ativos
              <span className="ml-auto text-xs font-normal text-on-surface-variant">
                {enabledClasses.length} selecionada{enabledClasses.length !== 1 ? "s" : ""}
              </span>
            </h3>

            <div className="space-y-2">
              {config.classes.map((cls) => (
                <div key={cls.id} className="space-y-2">
                  {/* Checkbox row */}
                  <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={cls.enabled}
                        onChange={() => handleClassToggle(cls.id)}
                        className="sr-only"
                      />
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all"
                        style={{
                          borderColor: cls.enabled ? cls.color : "rgba(255,255,255,0.2)",
                          backgroundColor: cls.enabled ? cls.color + "25" : "transparent",
                        }}
                      >
                        {cls.enabled && (
                          <span className="material-symbols-outlined text-xs" style={{ color: cls.color }}>
                            check
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-lg leading-none">{cls.icon}</span>
                    <span className="text-sm text-on-surface group-hover:text-on-surface font-medium flex-1">
                      {cls.name}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cls.color }}
                    />
                  </label>

                  {/* Subordination slider — shown only when enabled */}
                  {cls.enabled && (
                    <div className="ml-11 mr-3 pb-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-on-surface-variant">Índice de Subordinação</span>
                        <span className="text-xs font-semibold" style={{ color: cls.color }}>
                          {cls.subordinationIndex}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={SUB_INDEX_MIN}
                        max={SUB_INDEX_MAX}
                        step={SUB_INDEX_STEP}
                        value={cls.subordinationIndex}
                        onChange={(e) => handleSubIndexChange(cls.id, Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          accentColor: cls.color,
                        }}
                      />
                      <div className="flex justify-between text-xs text-on-surface-variant/50">
                        <span>{SUB_INDEX_MIN}%</span>
                        <span>{SUB_INDEX_MAX}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mezanino toggle */}
            <div className="pt-2 border-t border-outline-variant/10">
              <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={config.includeMezanino}
                    onChange={() => setConfig((prev) => ({ ...prev, includeMezanino: !prev.includeMezanino }))}
                    className="sr-only"
                  />
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center border-2 transition-all"
                    style={{
                      borderColor: config.includeMezanino ? MEZANINO_COLOR : "rgba(255,255,255,0.2)",
                      backgroundColor: config.includeMezanino ? MEZANINO_COLOR + "25" : "transparent",
                    }}
                  >
                    {config.includeMezanino && (
                      <span className="material-symbols-outlined text-xs" style={{ color: MEZANINO_COLOR }}>
                        check
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-lg leading-none">🔶</span>
                <div className="flex-1">
                  <p className="text-sm text-on-surface font-medium">Incluir Mezanino</p>
                  <p className="text-xs text-on-surface-variant">Cota intermediária entre Sênior e Subordinada</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column — Visualization */}
        <div className="space-y-6">
          {/* Diagram */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-5">
            <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-base text-primary-container">account_tree</span>
              Estrutura Hierárquica
            </h3>
            <ClassHierarchyDiagram nodes={nodes} edges={edges} />
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sem Segregação */}
            <div className="rounded-2xl border border-[#ff4444]/30 bg-[#ff4444]/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#ff4444]">warning</span>
                <h4 className="text-xs font-bold text-[#ff4444]">Sem Segregação</h4>
                <span className="text-xs text-[#ff4444]/70">(Risco)</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Inadimplência em um ativo <span className="text-[#ff4444] font-medium">contamina todo o fundo</span>.
                Investidores de classes distintas são afetados igualmente, sem isolamento patrimonial.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#ff4444]" />
                <span className="text-xs text-[#ff4444]/80">Risco de contaminação cruzada</span>
              </div>
            </div>

            {/* Com Segregação */}
            <div className="rounded-2xl border border-[#4edea3]/30 bg-[#4edea3]/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#4edea3]">shield</span>
                <h4 className="text-xs font-bold text-[#4edea3]">Com Segregação</h4>
                <span className="text-xs text-[#4edea3]/70">(Proteção)</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Cada classe tem <span className="text-[#4edea3] font-medium">patrimônio isolado</span> conforme CVM 175/2022.
                Perdas ficam contidas na classe afetada, protegendo as demais.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                <span className="text-xs text-[#4edea3]/80">Isolamento patrimonial garantido</span>
              </div>
            </div>
          </div>

          {/* Text-based accessibility table */}
          {enabledClasses.length > 0 && (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/30 p-5">
              <h3 className="text-sm font-semibold text-on-surface flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-base text-primary-container">table_view</span>
                Resumo das Classes
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs" role="table" aria-label="Resumo de classes configuradas">
                  <thead>
                    <tr className="border-b border-outline-variant/20">
                      <th className="text-left py-2 pr-3 text-on-surface-variant font-semibold">Classe</th>
                      <th className="text-right py-2 px-3 text-on-surface-variant font-semibold">Subordinação</th>
                      <th className="text-right py-2 pl-3 text-on-surface-variant font-semibold">Cotas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enabledClasses.map((cls) => {
                      const cotaCount = config.includeMezanino ? 3 : 2;
                      return (
                        <tr key={cls.id} className="border-b border-outline-variant/10 last:border-0">
                          <td className="py-2 pr-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: cls.color }}
                              />
                              <span className="text-on-surface font-medium">{cls.name}</span>
                            </div>
                          </td>
                          <td className="text-right py-2 px-3 font-semibold" style={{ color: cls.color }}>
                            {cls.subordinationIndex}%
                          </td>
                          <td className="text-right py-2 pl-3 text-on-surface-variant">
                            {cotaCount} cotas
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-outline-variant/20">
                      <td className="pt-2 pr-3 text-on-surface-variant font-semibold">Total</td>
                      <td className="text-right pt-2 px-3 text-on-surface font-bold">—</td>
                      <td className="text-right pt-2 pl-3 text-on-surface font-bold">
                        {enabledClasses.length} classe{enabledClasses.length !== 1 ? "s" : ""}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-outline-variant/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SENIOR_COLOR }} />
                  <span className="text-xs text-on-surface-variant">Sênior</span>
                </div>
                {config.includeMezanino && (
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: MEZANINO_COLOR }} />
                    <span className="text-xs text-on-surface-variant">Mezanino</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SUBORDINADA_COLOR }} />
                  <span className="text-xs text-on-surface-variant">Subordinada</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational sections */}
      <div className="space-y-3">
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors">
            <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
            Por que a segregação patrimonial é revolucionária?
          </summary>
          <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              Antes da CVM 175/2022, cada FIDC tinha um único CNPJ e um único pool de ativos. Se um tipo de recebível entrava em inadimplência, TODOS os investidores eram afetados — mesmo aqueles que acreditavam estar expostos apenas a uma classe diferente e mais segura de ativos.
            </p>
            <p>
              A CVM 175 introduziu a segregação patrimonial: um único FIDC pode agora ter múltiplas Classes, cada uma com ativos e passivos completamente independentes. Pense em um shopping center — cada loja opera de forma independente, e a falência de uma loja não afeta as demais.
            </p>
          </div>
        </details>

        <details className="group mt-2">
          <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors">
            <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
            Diferença entre Classe e Subclasse
          </summary>
          <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>
              <strong className="text-on-surface">Classes</strong> representam TIPOS DE ATIVOS diferentes (ex.: recebíveis de cartão de crédito vs. financiamento de veículos). São completamente segregadas — ativos distintos, riscos distintos, investidores distintos.
            </p>
            <p>
              <strong className="text-on-surface">Subclasses</strong> representam NÍVEIS DE RISCO diferentes dentro do mesmo ativo. A subclasse Sênior tem prioridade no pagamento (menor risco, menor retorno). A Subordinada absorve perdas primeiro (maior risco, maior retorno). O Mezanino fica entre as duas.
            </p>
          </div>
        </details>

        <details className="group mt-2">
          <summary className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-primary-container hover:text-primary-container/80 transition-colors">
            <span className="material-symbols-outlined text-lg group-open:rotate-90 transition-transform">chevron_right</span>
            Impacto da CVM 175 no Mercado
          </summary>
          <div className="mt-3 p-4 rounded-xl glass-panel border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-3">
            <p>A Resolução CVM 175 viabilizou uma série de avanços no mercado de FIDCs:</p>
            <p>
              <strong className="text-on-surface">(1)</strong> FIDCs multicedentes cresceram com maior eficiência operacional;{" "}
              <strong className="text-on-surface">(2)</strong> produtos de investimento mais sofisticados com melhor segmentação de risco;{" "}
              <strong className="text-on-surface">(3)</strong> redução de custos operacionais por meio de infraestrutura compartilhada;{" "}
              <strong className="text-on-surface">(4)</strong> maior acessibilidade para originadores menores;{" "}
              <strong className="text-on-surface">(5)</strong> melhor competição com instrumentos de renda fixa tradicionais.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
