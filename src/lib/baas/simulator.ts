import { BASE_COST, BASE_TTM, RISK_SCORE } from "./constants";
import type { RevenueBreakdown } from "./types";

export function computeInvestment(structure: string, serviceCount: number): number {
  return (BASE_COST[structure] ?? 0) + serviceCount * 50_000;
}

export function computeTTM(structure: string, serviceCount: number): number {
  return (BASE_TTM[structure] ?? 0) + serviceCount;
}

export function computeMonthlyRevenue(
  services: string[],
  clientCount: number,
  ticketMedio: number
): RevenueBreakdown {
  const interchange = services.includes("Cartão de Débito")
    ? clientCount * 0.015 * ticketMedio * 0.5
    : 0;
  const float = services.includes("Conta de Pagamento")
    ? clientCount * ticketMedio * 0.3 * 0.01
    : 0;
  const credit = services.includes("Crédito/Empréstimo")
    ? clientCount * 0.1 * 2000 * 0.03
    : 0;
  return { interchange, float, credit, total: interchange + float + credit };
}

export function getRiskScore(structure: string): number {
  return RISK_SCORE[structure] ?? 0;
}

export function generateRecommendations(
  structure: string,
  services: string[],
  volumeSlider: number
): string[] {
  const recs: string[] = [];
  if (structure === "Via Middleware" && services.length > 4) {
    recs.push("⚠️ Com muitos serviços, considere uma parceria direta para maior controle.");
  }
  if (services.includes("Crédito/Empréstimo")) {
    recs.push("📋 Operações de crédito exigem atenção à regulação de correspondente bancário.");
  }
  if (volumeSlider > 500) {
    recs.push("✅ Volume alto justifica investimento em infraestrutura própria.");
  }
  return recs;
}
