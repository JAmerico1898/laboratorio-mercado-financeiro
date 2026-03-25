"use client";
import { forwardRef, useState, useMemo } from "react";
import {
  TIPO_TOMADOR_OPTIONS,
  ESTRUTURA_OPTIONS,
  SERVICOS_OPTIONS,
  DEFAULT_SERVICOS,
  VOLUME_MIN,
  VOLUME_MAX,
  VOLUME_STEP,
  VOLUME_DEFAULT,
  TICKET_MIN,
  TICKET_MAX,
  TICKET_STEP,
  TICKET_DEFAULT,
} from "@/lib/baas/constants";
import {
  computeInvestment,
  computeTTM,
  computeMonthlyRevenue,
  getRiskScore,
  generateRecommendations,
} from "@/lib/baas/simulator";
import RevenueBreakdown from "@/components/modulo4/charts/RevenueBreakdown";

const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const SimuladorSection = forwardRef<HTMLElement>(function SimuladorSection(_, ref) {
  const [tipoTomador, setTipoTomador] = useState<string>(TIPO_TOMADOR_OPTIONS[0]);
  const [estrutura, setEstrutura] = useState<string>(ESTRUTURA_OPTIONS[0]);
  const [selectedServices, setSelectedServices] = useState<string[]>([...DEFAULT_SERVICOS]);
  const [volume, setVolume] = useState<number>(VOLUME_DEFAULT);
  const [ticketMedio, setTicketMedio] = useState<number>(TICKET_DEFAULT);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const results = useMemo(() => {
    const clientCount = volume * 1000; // CRITICAL: multiply by 1000
    const investment = computeInvestment(estrutura, selectedServices.length);
    const ttm = computeTTM(estrutura, selectedServices.length);
    const revenue = computeMonthlyRevenue(selectedServices, clientCount, ticketMedio);
    const riskScore = getRiskScore(estrutura);
    const recommendations = generateRecommendations(estrutura, selectedServices, volume);
    return { investment, ttm, revenue, riskScore, recommendations };
  }, [estrutura, selectedServices, volume, ticketMedio]);

  const selectClass =
    "bg-surface-container border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface w-full focus:outline-none focus:border-primary-container/40";

  return (
    <section ref={ref} id="simulador" className="scroll-mt-16">
      {/* Section title */}
      <h2 className="text-2xl font-bold font-headline text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-container">tune</span>
        Simulador BaaS
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/10 space-y-6">
            <h3 className="text-lg font-bold text-on-surface">Parâmetros</h3>

            {/* Tipo de Tomador */}
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Tipo de Tomador
              </label>
              <select
                value={tipoTomador}
                onChange={(e) => setTipoTomador(e.target.value)}
                className={selectClass}
              >
                {TIPO_TOMADOR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Estrutura de Parceria */}
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Estrutura de Parceria
              </label>
              <select
                value={estrutura}
                onChange={(e) => setEstrutura(e.target.value)}
                className={selectClass}
              >
                {ESTRUTURA_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Serviços Desejados */}
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Serviços Desejados
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICOS_OPTIONS.map((service) => {
                  const checked = selectedServices.includes(service);
                  return (
                    <label
                      key={service}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                        checked
                          ? "bg-primary-container/15 text-primary-container border border-primary-container/30"
                          : "bg-surface-container text-on-surface-variant border border-outline-variant/20"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(service)}
                        className="hidden"
                      />
                      {service}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Volume de Clientes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-on-surface-variant">
                  Volume de Clientes
                </label>
                <span className="text-sm font-bold text-primary-container">{volume}k clientes</span>
              </div>
              <input
                type="range"
                min={VOLUME_MIN}
                max={VOLUME_MAX}
                step={VOLUME_STEP}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full accent-primary-container cursor-pointer"
              />
              <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                <span>{VOLUME_MIN}k</span>
                <span>{VOLUME_MAX}k</span>
              </div>
            </div>

            {/* Ticket Médio Mensal */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-on-surface-variant">
                  Ticket Médio Mensal
                </label>
                <span className="text-sm font-bold text-primary-container">R$ {ticketMedio}</span>
              </div>
              <input
                type="range"
                min={TICKET_MIN}
                max={TICKET_MAX}
                step={TICKET_STEP}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full accent-primary-container cursor-pointer"
              />
              <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                <span>R$ {TICKET_MIN}</span>
                <span>R$ {TICKET_MAX}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4 metric cards in 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Investimento Inicial */}
            <div className="glass-panel p-5 rounded-xl border border-outline-variant/10">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-xs text-on-surface-variant mb-1">Investimento Inicial</p>
              <p className="text-xl font-bold text-on-surface">{formatBRL(results.investment)}</p>
            </div>

            {/* Time to Market */}
            <div className="glass-panel p-5 rounded-xl border border-outline-variant/10">
              <div className="text-2xl mb-2">⏱️</div>
              <p className="text-xs text-on-surface-variant mb-1">Time to Market</p>
              <p className="text-xl font-bold text-on-surface">{results.ttm} meses</p>
            </div>

            {/* Receita Mensal Est. */}
            <div className="glass-panel p-5 rounded-xl border border-outline-variant/10">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-xs text-on-surface-variant mb-1">Receita Mensal Est.</p>
              <p className="text-xl font-bold text-on-surface">
                {formatBRL(results.revenue.total)}
              </p>
            </div>

            {/* Score de Risco */}
            <div className="glass-panel p-5 rounded-xl border border-outline-variant/10">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="text-xs text-on-surface-variant mb-1">Score de Risco</p>
              <p className="text-xl font-bold text-on-surface">{results.riskScore}/5</p>
            </div>
          </div>

          {/* RevenueBreakdown donut chart */}
          <div className="glass-panel p-6 rounded-xl border border-outline-variant/10">
            <h4 className="text-sm font-semibold text-on-surface-variant mb-4">
              Composição da Receita Mensal
            </h4>
            <RevenueBreakdown
              interchange={results.revenue.interchange}
              float={results.revenue.float}
              credit={results.revenue.credit}
            />
            {results.revenue.total <= 0 && (
              <p className="text-center text-on-surface-variant text-sm py-8">
                Selecione serviços geradores de receita para visualizar a composição.
              </p>
            )}
          </div>

          {/* Recommendations */}
          {results.recommendations.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-on-surface flex items-center gap-2">
                💡 Recomendações
              </h4>
              {results.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="glass-panel px-4 py-3 rounded-xl border border-outline-variant/10 text-sm text-on-surface-variant"
                >
                  {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default SimuladorSection;
