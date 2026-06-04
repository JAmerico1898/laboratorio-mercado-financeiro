import type { Metadata } from "next";
import { scenarios } from "@/data/fidc-v2/scenarios";
import ScenarioGrid from "@/components/modulo7/ScenarioGrid";

export const metadata: Metadata = {
  title: "FIDC | Laboratório de Mercado Financeiro",
  description:
    "Cinco casos aplicados de Fundos de Investimento em Direitos Creditórios: subordinação, concentração cedente × sacado e descasamento de indexador.",
};

export default function ModuloSetePage() {
  return <ScenarioGrid scenarios={scenarios} />;
}
