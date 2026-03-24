import type { InvestorType, AssetType, RegistrationType, RegistrationTimeline, ComplianceStatus } from "./types";
import { REGISTRATION_CONFIGS } from "./constants";

export function isForbiddenCombination(
  investorType: InvestorType,
  assetType: AssetType
): boolean {
  return investorType === "varejo" && assetType === "dcnp";
}

export function determineRegistrationType(
  investorType: InvestorType,
  anbimaConvenant: boolean
): RegistrationType {
  if (investorType === "profissional") return "simplified";
  return anbimaConvenant ? "automatic" : "ordinary";
}

function addCalendarDays(startDate: string, days: number): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function calculateTimeline(
  registrationType: RegistrationType,
  startDate: string
): RegistrationTimeline {
  const config = REGISTRATION_CONFIGS[registrationType];
  const typeLabels: Record<RegistrationType, string> = {
    automatic: "Registro Automático",
    ordinary: "Registro Ordinário com Análise CVM",
    simplified: "Registro Simplificado",
  };
  const descriptions: Record<RegistrationType, string> = {
    automatic: "Registro automático após protocolo CVMWeb — sem análise prévia",
    ordinary: "Análise detalhada pela CVM com possíveis rodadas de perguntas",
    simplified: "Revisão acelerada pela CVM com menos requisitos",
  };

  return {
    type: typeLabels[registrationType],
    description: descriptions[registrationType],
    totalDays: config.totalDays,
    milestones: config.milestones.map((m) => ({
      ...m,
      date: addCalendarDays(startDate, m.daysFromStart),
    })),
  };
}

export function getComplianceStatus(
  items: Record<string, boolean>
): ComplianceStatus {
  const total = 6;
  const completed = Object.values(items).filter(Boolean).length;
  const percentage = (completed / total) * 100;

  let level: ComplianceStatus["level"];
  if (completed === total) {
    level = "approved";
  } else if (completed >= 4) {
    level = "almost";
  } else {
    level = "pending";
  }

  return { completed, total, percentage, level };
}
