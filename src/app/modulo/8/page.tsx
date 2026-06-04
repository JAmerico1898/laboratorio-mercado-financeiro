import type { Metadata } from "next";
import { scenarios } from "@/data/regulacao-cenarios/scenarios";
import ScenarioGrid from "@/components/modulo8/ScenarioGrid";

export const metadata: Metadata = {
  title: "Regulação Bancária | Laboratório de Mercado Financeiro",
  description:
    "Quatro casos aplicados sobre o Índice de Basileia: crescimento orgânico, perda na carteira, estratégia de risco (RAROC) e migração de rating.",
};

export default function ModuloOitoPage() {
  return <ScenarioGrid scenarios={scenarios} />;
}
