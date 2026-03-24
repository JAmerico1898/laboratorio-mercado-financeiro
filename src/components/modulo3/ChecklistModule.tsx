"use client";

import { useState, useMemo } from "react";
import {
  isForbiddenCombination,
  determineRegistrationType,
  calculateTimeline,
  getComplianceStatus,
} from "@/lib/fidc/checklist-logic";
import {
  RATING_AGENCIES,
  RATING_GRADES,
  MIN_RECOMMENDED_RATING_INDEX,
  STRUCTURING_COSTS,
  RETAIL_EXTRA_STRUCTURING_COSTS,
  RECURRING_COSTS,
  RETAIL_EXTRA_RECURRING_COSTS,
} from "@/lib/fidc/constants";
import type { InvestorType, AssetType } from "@/lib/fidc/types";
import TimelineChart from "./charts/TimelineChart";

// ─── Helpers ────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().split("T")[0];
}

// ─── Radio Card ─────────────────────────────────────────────────────────────

interface RadioCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
}

function RadioCard({ selected, onClick, title, description, icon, disabled }: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-start gap-3 w-full text-left rounded-xl p-4 border transition-all duration-200",
        selected
          ? "border-primary bg-primary/10"
          : "border-outline-variant/30 bg-surface-container hover:border-outline-variant/60",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "material-symbols-outlined text-2xl mt-0.5 shrink-0",
          selected ? "text-primary" : "text-on-surface-variant",
        ].join(" ")}
      >
        {icon}
      </span>
      <div>
        <p className={["font-semibold text-sm", selected ? "text-primary" : "text-on-surface"].join(" ")}>
          {title}
        </p>
        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{description}</p>
      </div>
      <span
        className={[
          "ml-auto mt-0.5 shrink-0 w-4 h-4 rounded-full border-2 transition-all",
          selected ? "border-primary bg-primary" : "border-outline-variant",
        ].join(" ")}
      />
    </button>
  );
}

// ─── Stage Shell ─────────────────────────────────────────────────────────────

interface StageProps {
  number: number;
  title: string;
  icon: string;
  active: boolean;
  children: React.ReactNode;
}

function Stage({ number, title, icon, active, children }: StageProps) {
  return (
    <div
      aria-live="polite"
      className={[
        "rounded-2xl border-l-4 p-6 transition-all duration-300",
        active
          ? "border-l-primary bg-surface-container"
          : "border-l-outline-variant/40 bg-surface-container/40 opacity-50 pointer-events-none select-none",
      ].join(" ")}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold shrink-0">
          {number}
        </span>
        <span className="material-symbols-outlined text-xl text-primary">{icon}</span>
        <h3 className="font-semibold text-on-surface text-base">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ChecklistModule() {
  // Stage 1 state
  const [investorType, setInvestorType] = useState<InvestorType | null>(null);
  const [assetType, setAssetType] = useState<AssetType | null>(null);

  // Stage 3 state
  const [complianceItems, setComplianceItems] = useState<Record<string, boolean>>({
    rating: false,
    seniorOnly: false,
    maturity: false,
    diversification: false,
    periodicInfo: false,
    distributor: false,
  });
  const [ratingAgency, setRatingAgency] = useState(RATING_AGENCIES[0]);
  const [ratingGradeIndex, setRatingGradeIndex] = useState(0);
  const [fundType, setFundType] = useState<"aberto" | "fechado">("fechado");
  const [distributorName, setDistributorName] = useState("");

  // Stage 4 state
  const [anbimaConvenant, setAnbimaConvenant] = useState<boolean | null>(null);

  // ── Derived ──

  const stage1Complete = investorType !== null && assetType !== null;
  const forbidden = stage1Complete ? isForbiddenCombination(investorType!, assetType!) : false;
  const stage2Passes = stage1Complete && !forbidden;

  const complianceStatus = useMemo(
    () => getComplianceStatus(complianceItems),
    [complianceItems]
  );
  const stage3Complete =
    investorType === "profissional" ||
    (stage2Passes && complianceStatus.level === "approved");

  const stage4Active = stage3Complete && stage2Passes;

  const registrationType = useMemo(() => {
    if (!stage4Active || anbimaConvenant === null || !investorType) return null;
    return determineRegistrationType(investorType, anbimaConvenant);
  }, [stage4Active, anbimaConvenant, investorType]);

  const timeline = useMemo(() => {
    if (!registrationType) return null;
    return calculateTimeline(registrationType, today());
  }, [registrationType]);

  // ── Helpers ──

  function toggleCompliance(key: string, value: boolean) {
    setComplianceItems((prev) => ({ ...prev, [key]: value }));
  }

  const ratingOk = ratingGradeIndex <= MIN_RECOMMENDED_RATING_INDEX;

  const REGISTRATION_LABELS: Record<string, string> = {
    automatic: "Registro Automático (ANBIMA)",
    ordinary: "Registro Ordinário com Análise CVM",
    simplified: "Registro Simplificado",
  };

  const REGISTRATION_DESCRIPTIONS: Record<string, string> = {
    automatic: "Protocolo via CVMWeb com validação ANBIMA. Sem análise prévia obrigatória.",
    ordinary: "Análise detalhada pela CVM com possíveis rodadas de perguntas e comentários.",
    simplified: "Revisão acelerada para FIDCs profissionais com menos exigências formais.",
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xl font-bold text-on-surface mb-1">Checklist Regulatório — CVM 175</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Verifique a elegibilidade do seu FIDC para oferta pública e determine o tipo de registro necessário junto à CVM.
        </p>
      </div>

      {/* ── Stage 1: Perfil do Investidor ── */}
      <Stage number={1} title="Perfil do Investidor &amp; Ativo" icon="person" active={true}>
        <div className="space-y-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Tipo de Investidor
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RadioCard
                selected={investorType === "profissional"}
                onClick={() => setInvestorType("profissional")}
                title="Investidor Profissional"
                description="Patrimônio financeiro ≥ R$ 10 milhões. Processo simplificado, menos exigências."
                icon="business_center"
              />
              <RadioCard
                selected={investorType === "varejo"}
                onClick={() => setInvestorType("varejo")}
                title="Investidor Varejo"
                description="Acesso ao público geral. Sujeito a requisitos adicionais de proteção ao investidor."
                icon="store"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Tipo de Ativo (Direito Creditório)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RadioCard
                selected={assetType === "dcp"}
                onClick={() => setAssetType("dcp")}
                title="DCP — Padronizado"
                description="Direito creditório padronizado. Fluxo de caixa previsível, originação estruturada."
                icon="verified"
              />
              <RadioCard
                selected={assetType === "dcnp"}
                onClick={() => setAssetType("dcnp")}
                title="DCNP — Não Padronizado"
                description="Direito creditório não padronizado. Maior complexidade e risco. Restrito a profissionais."
                icon="rule"
              />
            </div>
          </div>

        </div>
      </Stage>

      {/* ── Stage 2: Validation Gate ── */}
      <Stage number={2} title="Verificação de Elegibilidade" icon="shield_check" active={stage1Complete}>
        <div aria-live="polite">
          {!stage1Complete && (
            <p className="text-sm text-on-surface-variant">Complete a etapa anterior para verificar elegibilidade.</p>
          )}

          {stage1Complete && forbidden && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-400 text-2xl shrink-0">cancel</span>
                <div>
                  <p className="font-semibold text-red-400 text-sm mb-1">Combinação Vedada pela CVM 175</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    A combinação <strong className="text-on-surface">Varejo + DCNP</strong> não é permitida pela Resolução CVM 175/2022.
                    Direitos creditórios não padronizados (DCNP) só podem ser ofertados a <strong className="text-on-surface">investidores profissionais</strong>.
                    Altere o perfil do investidor ou o tipo de ativo para prosseguir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {stage1Complete && !forbidden && (
            <div className="rounded-xl border border-secondary/40 bg-secondary/10 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl shrink-0">check_circle</span>
                <div>
                  <p className="font-semibold text-secondary text-sm mb-1">Combinação Permitida</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    A combinação <strong className="text-on-surface">{investorType === "profissional" ? "Profissional" : "Varejo"} + {assetType === "dcp" ? "DCP" : "DCNP"}</strong> é elegível.
                    {investorType === "varejo"
                      ? " Complete o checklist de conformidade para oferta ao varejo."
                      : " Processo simplificado disponível para investidores profissionais."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Stage>

      {/* ── Stage 3: Checklist ── */}
      <Stage number={3} title="Requisitos de Conformidade" icon="checklist" active={stage2Passes}>
        {stage2Passes && (
          <div aria-live="polite">

            {/* Profissional: simplified message */}
            {investorType === "profissional" && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl shrink-0">info</span>
                  <div>
                    <p className="font-semibold text-primary text-sm mb-1">Menos Exigências para Profissionais</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      FIDCs destinados exclusivamente a investidores profissionais não estão sujeitos aos
                      requisitos de rating obrigatório, prazo mínimo e diversificação de carteira impostos
                      para ofertas ao varejo. O processo é simplificado e mais ágil.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Varejo: full checklist */}
            {investorType === "varejo" && (
              <div className="space-y-4">

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-on-surface-variant">Conformidade</span>
                    <span className={[
                      "text-xs font-semibold",
                      complianceStatus.level === "approved" ? "text-secondary" :
                      complianceStatus.level === "almost" ? "text-yellow-400" : "text-on-surface-variant",
                    ].join(" ")}>
                      {complianceStatus.completed}/{complianceStatus.total} itens
                    </span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-500",
                        complianceStatus.level === "approved" ? "bg-secondary" :
                        complianceStatus.level === "almost" ? "bg-yellow-400" : "bg-outline-variant",
                      ].join(" ")}
                      style={{ width: `${complianceStatus.percentage}%` }}
                    />
                  </div>
                </div>

                {/* 1. Rating */}
                <div className="rounded-xl border border-outline-variant/20 bg-surface p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="check-rating"
                      checked={complianceItems.rating}
                      onChange={(e) => toggleCompliance("rating", e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                    />
                    <label htmlFor="check-rating" className="cursor-pointer">
                      <p className="text-sm font-semibold text-on-surface">1. Rating Mínimo Obrigatório</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Cotas sênior devem ter classificação de risco por agência credenciada CVM, mínimo grau A.
                      </p>
                    </label>
                  </div>
                  {complianceItems.rating && (
                    <div className="ml-7 grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-on-surface-variant block mb-1">Agência</label>
                        <select
                          value={ratingAgency}
                          onChange={(e) => setRatingAgency(e.target.value)}
                          className="w-full bg-surface-container text-on-surface text-xs rounded-lg px-3 py-2 border border-outline-variant/30 focus:outline-none focus:border-primary"
                        >
                          {RATING_AGENCIES.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-on-surface-variant block mb-1">Nota</label>
                        <select
                          value={ratingGradeIndex}
                          onChange={(e) => setRatingGradeIndex(Number(e.target.value))}
                          className="w-full bg-surface-container text-on-surface text-xs rounded-lg px-3 py-2 border border-outline-variant/30 focus:outline-none focus:border-primary"
                        >
                          {RATING_GRADES.map((g, i) => (
                            <option key={g} value={i}>{g}</option>
                          ))}
                        </select>
                      </div>
                      {!ratingOk && (
                        <p className="col-span-2 text-xs text-yellow-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">warning</span>
                          Nota abaixo do mínimo recomendado (A). Verifique os requisitos.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Oferta Sênior */}
                <div className="rounded-xl border border-outline-variant/20 bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="check-senior"
                      checked={complianceItems.seniorOnly}
                      onChange={(e) => toggleCompliance("seniorOnly", e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                    />
                    <label htmlFor="check-senior" className="cursor-pointer">
                      <p className="text-sm font-semibold text-on-surface">2. Oferta Sênior com Subordinação</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        A oferta ao varejo deve ser de cotas sênior. Subordinação mínima de 20% do PL obrigatória para proteção do investidor.
                      </p>
                    </label>
                  </div>
                </div>

                {/* 3. Prazo Médio */}
                <div className="rounded-xl border border-outline-variant/20 bg-surface p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="check-maturity"
                      checked={complianceItems.maturity}
                      onChange={(e) => toggleCompliance("maturity", e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                    />
                    <label htmlFor="check-maturity" className="cursor-pointer">
                      <p className="text-sm font-semibold text-on-surface">3. Prazo Médio Ponderado</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Fundos abertos: liquidez mínima de D+30. Fundos fechados: prazo definido no regulamento.
                      </p>
                    </label>
                  </div>
                  {complianceItems.maturity && (
                    <div className="ml-7 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFundType("fechado")}
                        className={[
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                          fundType === "fechado"
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant",
                        ].join(" ")}
                      >
                        Fundo Fechado
                      </button>
                      <button
                        type="button"
                        onClick={() => setFundType("aberto")}
                        className={[
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                          fundType === "aberto"
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant",
                        ].join(" ")}
                      >
                        Fundo Aberto
                      </button>
                      <span className="text-xs text-on-surface-variant self-center">
                        {fundType === "aberto" ? "Liquidez: D+30 mínimo" : "Prazo: conforme regulamento"}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Diversificação */}
                <div className="rounded-xl border border-outline-variant/20 bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="check-diversification"
                      checked={complianceItems.diversification}
                      onChange={(e) => toggleCompliance("diversification", e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                    />
                    <label htmlFor="check-diversification" className="cursor-pointer">
                      <p className="text-sm font-semibold text-on-surface">4. Diversificação de Carteira</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Concentração máxima de 20% do PL em um único devedor ou coobrigado.
                        Carteira deve ter no mínimo 5 devedores distintos.
                      </p>
                    </label>
                  </div>
                </div>

                {/* 5. Informações Periódicas */}
                <div className="rounded-xl border border-outline-variant/20 bg-surface p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="check-periodic"
                      checked={complianceItems.periodicInfo}
                      onChange={(e) => toggleCompliance("periodicInfo", e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                    />
                    <label htmlFor="check-periodic" className="cursor-pointer">
                      <p className="text-sm font-semibold text-on-surface">5. Informações Periódicas (LAMIC)</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Envio mensal do Relatório LAMIC (Lâmina de Informações Mensais) à CVM via sistema CVMWeb.
                        Inclui carteira, inadimplência e rentabilidade.
                      </p>
                    </label>
                  </div>
                </div>

                {/* 6. Distribuidor Autorizado */}
                <div className="rounded-xl border border-outline-variant/20 bg-surface p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="check-distributor"
                      checked={complianceItems.distributor}
                      onChange={(e) => toggleCompliance("distributor", e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                    />
                    <label htmlFor="check-distributor" className="cursor-pointer">
                      <p className="text-sm font-semibold text-on-surface">6. Distribuidor Autorizado CVM</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Distribuição deve ser realizada por intermediário com autorização CVM (corretora, distribuidora ou banco de investimento).
                      </p>
                    </label>
                  </div>
                  {complianceItems.distributor && (
                    <div className="ml-7">
                      <label className="text-xs text-on-surface-variant block mb-1">Nome do Distribuidor (opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: XP Investimentos CCTVM"
                        value={distributorName}
                        onChange={(e) => setDistributorName(e.target.value)}
                        className="w-full bg-surface-container text-on-surface text-xs rounded-lg px-3 py-2 border border-outline-variant/30 focus:outline-none focus:border-primary placeholder:text-outline-variant"
                      />
                    </div>
                  )}
                </div>

                {/* Compliance summary */}
                {complianceStatus.level === "approved" && (
                  <div className="rounded-xl border border-secondary/40 bg-secondary/10 p-3 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl">verified</span>
                    <p className="text-sm text-secondary font-medium">
                      Todos os requisitos de conformidade atendidos. Prossiga para o registro.
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>
        )}
      </Stage>

      {/* ── Stage 4: Registro & Cronograma ── */}
      <Stage number={4} title="Registro &amp; Cronograma" icon="assignment_turned_in" active={stage4Active}>
        {stage4Active && (
          <div className="space-y-6" aria-live="polite">

            {/* ANBIMA Covenant */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                Convênio ANBIMA
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <RadioCard
                  selected={anbimaConvenant === true}
                  onClick={() => setAnbimaConvenant(true)}
                  title="Com Convênio ANBIMA"
                  description="Registro automático após protocolo CVMWeb. Mais rápido e sem análise prévia obrigatória."
                  icon="speed"
                />
                <RadioCard
                  selected={anbimaConvenant === false}
                  onClick={() => setAnbimaConvenant(false)}
                  title="Sem Convênio ANBIMA"
                  description={
                    investorType === "profissional"
                      ? "Registro simplificado com revisão acelerada pela CVM."
                      : "Registro ordinário com análise completa pela CVM. Processo mais longo."
                  }
                  icon="hourglass_empty"
                />
              </div>
            </div>

            {/* Registration type badge */}
            {anbimaConvenant !== null && registrationType && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0">badge</span>
                  <div>
                    <p className="text-xs text-on-surface-variant mb-0.5">Tipo de Registro Determinado</p>
                    <p className="font-semibold text-on-surface text-sm">{REGISTRATION_LABELS[registrationType]}</p>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      {REGISTRATION_DESCRIPTIONS[registrationType]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline chart */}
            {timeline && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                  Cronograma Estimado
                </p>
                <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
                  <TimelineChart timeline={timeline} />
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeline.milestones.map((m, i) => {
                    const colors = ["text-primary", "text-secondary", "text-yellow-400", "text-orange-400", "text-purple-400"];
                    return (
                      <div key={i} className="rounded-lg bg-surface p-2 border border-outline-variant/15">
                        <p className={["text-xs font-semibold", colors[i % colors.length]].join(" ")}>
                          {m.label}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">+{m.daysFromStart}d</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cost tables */}
            {anbimaConvenant !== null && (
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  Estimativa de Custos
                </p>

                {/* Structuring */}
                <div>
                  <p className="text-xs text-on-surface-variant mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">build</span>
                    Custos de Estruturação
                  </p>
                  <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody>
                        {STRUCTURING_COSTS.map((row) => (
                          <tr key={row.label} className="border-b border-outline-variant/10 last:border-0">
                            <td className="px-4 py-2.5 text-on-surface-variant">{row.label}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-on-surface">{row.value}</td>
                          </tr>
                        ))}
                        {investorType === "varejo" && RETAIL_EXTRA_STRUCTURING_COSTS.map((row) => (
                          <tr key={row.label} className="border-b border-outline-variant/10 last:border-0 bg-yellow-500/5">
                            <td className="px-4 py-2.5 text-on-surface-variant">
                              {row.label}
                              <span className="ml-1.5 text-yellow-400 text-xs">(varejo)</span>
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-on-surface">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recurring */}
                <div>
                  <p className="text-xs text-on-surface-variant mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">repeat</span>
                    Custos Recorrentes Anuais
                  </p>
                  <div className="rounded-xl border border-outline-variant/20 overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody>
                        {RECURRING_COSTS.map((row) => (
                          <tr key={row.label} className="border-b border-outline-variant/10 last:border-0">
                            <td className="px-4 py-2.5 text-on-surface-variant">{row.label}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-on-surface">{row.value}</td>
                          </tr>
                        ))}
                        {investorType === "varejo" && RETAIL_EXTRA_RECURRING_COSTS.map((row) => (
                          <tr key={row.label} className="border-b border-outline-variant/10 last:border-0 bg-yellow-500/5">
                            <td className="px-4 py-2.5 text-on-surface-variant">
                              {row.label}
                              <span className="ml-1.5 text-yellow-400 text-xs">(varejo)</span>
                            </td>
                            <td className="px-4 py-2.5 text-right font-medium text-on-surface">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </Stage>

    </div>
  );
}
