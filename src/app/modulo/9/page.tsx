import type { Metadata } from "next";
import { scenarios } from "@/data/baas-tokenizacao-cenarios/scenarios";
import ScenarioGrid from "@/components/modulo9/ScenarioGrid";

export const metadata: Metadata = {
  title: "BaaS e Tokenização | Laboratório de Mercado Financeiro",
  description:
    "Quatro casos sobre infraestrutura financeira moderna: revenue sharing de BaaS, ganhos de embedded finance, custo de funding tokenizado e liquidação atômica (DvP, T+0).",
};

export default function ModuloNovePage() {
  return <ScenarioGrid scenarios={scenarios} />;
}
