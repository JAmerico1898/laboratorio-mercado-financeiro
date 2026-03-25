"use client";

import { useState, useMemo } from "react";
import { simulateRealEstate, simulateBond } from "@/lib/tokenization/lifecycle-sim";
import LifecycleChart from "@/components/modulo5/charts/LifecycleChart";
import CashFlowChart from "@/components/modulo5/charts/CashFlowChart";
import AnimacaoEmbed from "@/components/modulo5/AnimacaoEmbed";

function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

export default function CicloVidaStep() {
  const [scenario, setScenario] = useState<"imovel" | "debenture">("imovel");
  const [years, setYears] = useState(5);
  const [defaultProb, setDefaultProb] = useState(0.02);
  const [seed, setSeed] = useState(42);

  const realEstateResult = useMemo(
    () =>
      scenario === "imovel"
        ? simulateRealEstate(years, 100, 0.02, 0.005, seed)
        : null,
    [scenario, years, seed]
  );

  const bondResult = useMemo(
    () =>
      scenario === "debenture"
        ? simulateBond(years, 1000, 0.1, defaultProb, seed)
        : null,
    [scenario, years, defaultProb, seed]
  );

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl text-primary-container">autorenew</span>
        <div>
          <h2 className="text-xl font-bold text-on-surface">Simulador de Ciclo de Vida</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Simule a evolução de um ativo tokenizado ao longo do tempo — imóvel com aluguel ou debênture com risco de calote.
          </p>
        </div>
      </div>

      {/* Controls card */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/15 space-y-6">
        {/* Scenario toggle */}
        <div className="space-y-2">
          <span className="text-sm text-on-surface-variant font-medium uppercase tracking-wider">Cenário</span>
          <div className="flex gap-3">
            <button
              onClick={() => setScenario("imovel")}
              className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                scenario === "imovel"
                  ? "bg-primary-container/15 text-primary-container border-primary-container/30"
                  : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest/50"
              }`}
            >
              <span className="material-symbols-outlined text-base align-middle mr-1.5">home</span>
              Imóvel (Aluguel)
            </button>
            <button
              onClick={() => setScenario("debenture")}
              className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                scenario === "debenture"
                  ? "bg-primary-container/15 text-primary-container border-primary-container/30"
                  : "bg-surface-container text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-highest/50"
              }`}
            >
              <span className="material-symbols-outlined text-base align-middle mr-1.5">account_balance</span>
              Título de Dívida (Debênture)
            </button>
          </div>
        </div>

        {/* Years slider */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant font-medium">Prazo</span>
            <span className="text-sm font-semibold text-primary-container tabular-nums">{years} anos</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-surface-container-highest cursor-pointer accent-primary-container"
          />
          <div className="flex justify-between text-xs text-outline-variant">
            <span>1 ano</span>
            <span>10 anos</span>
          </div>
        </div>

        {/* Default probability slider (debênture only) */}
        {scenario === "debenture" && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-on-surface-variant font-medium">Probabilidade de Default (por ano)</span>
              <span className="text-sm font-semibold text-primary-container tabular-nums">
                {(defaultProb * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.2}
              step={0.01}
              value={defaultProb}
              onChange={(e) => setDefaultProb(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-container-highest cursor-pointer accent-primary-container"
            />
            <div className="flex justify-between text-xs text-outline-variant">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>
        )}

        {/* Re-simular button */}
        <button
          onClick={() => setSeed(Date.now())}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant/30 bg-surface-container-highest/40 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/60 transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-base">casino</span>
          Re-simular
        </button>
      </div>

      {/* Results — Imóvel */}
      {scenario === "imovel" && realEstateResult && (
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
            <LifecycleChart result={realEstateResult} />
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Total de Dividendos</p>
              <p className="text-xl font-semibold text-emerald-400 tabular-nums">
                {formatBRL(realEstateResult.totalDividends)}
              </p>
              <p className="text-xs text-outline-variant mt-0.5">soma dos aluguéis pagos</p>
            </div>
            <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Ganho de Capital</p>
              <p className={`text-xl font-semibold tabular-nums ${realEstateResult.capitalGain >= 0 ? "text-primary-container" : "text-red-400"}`}>
                {formatBRL(realEstateResult.capitalGain)}
              </p>
              <p className="text-xs text-outline-variant mt-0.5">variação de preço</p>
            </div>
            <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/15">
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">ROI Total</p>
              <p className={`text-xl font-semibold tabular-nums ${realEstateResult.roi >= 0 ? "text-primary-container" : "text-red-400"}`}>
                {formatPct(realEstateResult.roi)}
              </p>
              <p className="text-xs text-outline-variant mt-0.5">dividendos + valorização</p>
            </div>
          </div>

          {/* Educational text */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/15 text-sm text-on-surface-variant leading-relaxed space-y-2">
            <p className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary-container text-base mt-0.5 shrink-0">info</span>
              <span>
                Em um imóvel tokenizado, o <strong className="text-on-surface">smart contract</strong> distribui automaticamente
                os aluguéis proporcionalmente a cada detentor de token. Não há intermediários — o pagamento é executado
                na blockchain assim que o locatário realiza o depósito no endereço da SPV.
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Results — Debênture */}
      {scenario === "debenture" && bondResult && (
        <div className="space-y-6">
          {/* Chart */}
          <div className="bg-surface-container rounded-2xl border border-outline-variant/15 overflow-hidden">
            <CashFlowChart result={bondResult} />
          </div>

          {/* Status badge */}
          <div
            className={`flex items-center gap-3 rounded-2xl px-5 py-4 border ${
              bondResult.status === "Adimplente"
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${
                bondResult.status === "Adimplente" ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {bondResult.status === "Adimplente" ? "check_circle" : "cancel"}
            </span>
            <div>
              <p
                className={`font-bold text-base ${
                  bondResult.status === "Adimplente" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {bondResult.status}
              </p>
              <p className="text-sm text-on-surface-variant">
                {bondResult.status === "Adimplente"
                  ? "A debênture pagou todos os cupons e o principal no vencimento."
                  : `Default detectado no ano ${bondResult.defaultYear}.`}
              </p>
            </div>
          </div>

          {/* Default callout */}
          {bondResult.status === "Default (Calote)" && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-5 space-y-3">
              {bondResult.defaultYear === 1 ? (
                <>
                  <p className="font-bold text-red-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">warning</span>
                    Default no primeiro ano — investidor perde 100% do capital
                  </p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Quando o default ocorre no primeiro ano, o investidor não recebe nenhum cupom nem a devolução
                    do valor nominal. Em estruturas de dívida tokenizada, as cláusulas de <strong className="text-on-surface">cross-default</strong> podem
                    acionar automaticamente o vencimento antecipado de outras emissões do mesmo emissor, protegendo
                    demais credores. O smart contract registra o evento imutavelmente na blockchain.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-red-400 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">warning</span>
                    Default no ano {bondResult.defaultYear} — fluxo interrompido
                  </p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    O emissor não cumpriu sua obrigação de pagamento no ano {bondResult.defaultYear}. Os cupons recebidos
                    até então representam o retorno parcial do investimento. A cláusula de <strong className="text-on-surface">cross-default</strong> pode
                    ser acionada, e o smart contract registra o evento na blockchain, permitindo que detentores de
                    tokens acionem mecanismos de recuperação previstos no contrato.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Animation section */}
      <div className="space-y-6 pt-4">
        <div className="border-t border-outline-variant/15" />
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-primary-container">play_circle</span>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Jornada da Tokenização — Animação Interativa</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Navegue pelas 8 etapas que transformam um ativo do mundo real em um token digital na blockchain.
            </p>
          </div>
        </div>
        <AnimacaoEmbed />
      </div>
    </div>
  );
}
