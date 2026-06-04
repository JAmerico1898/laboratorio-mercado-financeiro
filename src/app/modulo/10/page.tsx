import type { Metadata } from "next";
import { scenarios } from "@/data/gestao-credito-cenarios/scenarios";
import ScenarioGrid from "@/components/modulo10/ScenarioGrid";

export const metadata: Metadata = {
  title: "Gestão de Crédito | Laboratório de Mercado Financeiro",
  description:
    "Quatro lentes sobre a carteira de crédito num único motor (PE = PD × LGD × EAD): perda esperada por empréstimo, apetite de risco por cenário macro, recessão na carteira e risco de concentração.",
};

export default function ModuloDezPage() {
  return <ScenarioGrid scenarios={scenarios} />;
}
