import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { scenarios, getScenarioById } from "@/data/baas-tokenizacao-cenarios/scenarios";
import ScenarioPlayer from "@/components/modulo9/ScenarioPlayer";

interface Props {
  params: Promise<{ scenarioId: string }>;
}

export function generateStaticParams() {
  return scenarios.map((s) => ({ scenarioId: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scenarioId } = await params;
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return { title: "Cenário não encontrado" };
  return {
    title: `${scenario.code} — ${scenario.title} | BaaS e Tokenização`,
    description: scenario.blurb,
  };
}

export default async function ScenarioPage({ params }: Props) {
  const { scenarioId } = await params;
  const scenario = getScenarioById(scenarioId);
  if (!scenario) notFound();
  return <ScenarioPlayer scenario={scenario} />;
}
