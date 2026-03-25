import type { AnimationStage } from "@/lib/financial-regulation/types";
import RwaVisualization from "./RwaVisualization";
import ThreePillars from "./ThreePillars";
import DualConstraint from "./DualConstraint";
import IFRS9Comparison from "./IFRS9Comparison";
import BaselTimeline from "./BaselTimeline";

interface StageCardProps {
  stage: AnimationStage;
  stageIndex: number;
  totalStages: number;
}

function StageVisualization({ stageId }: { stageId: string }) {
  switch (stageId) {
    case "rwa":
      return <RwaVisualization />;
    case "basel2":
      return <ThreePillars />;
    case "car":
    case "leverage":
      return <DualConstraint />;
    case "ifrs9":
      return <IFRS9Comparison />;
    case "intro":
    case "crisis":
    case "basel1":
    case "basel3":
    case "basel4":
      return <BaselTimeline currentStageId={stageId} />;
    default:
      return null;
  }
}

export default function StageCard({ stage, stageIndex, totalStages }: StageCardProps) {
  const progressPct = ((stageIndex + 1) / totalStages) * 100;

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="space-y-2">
        <span className="inline-block rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant">
          Módulo {stageIndex + 1} de {totalStages}
        </span>
        <div className="h-1 w-full rounded-full bg-surface-container-low overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #00f2ff, #4edea3)",
            }}
          />
        </div>
      </div>

      {/* Icon */}
      <div className="text-5xl animate-float" aria-hidden="true">
        {stage.icon}
      </div>

      {/* Text */}
      <h3 className="text-2xl font-bold text-on-surface">{stage.title}</h3>
      <p className="text-sm font-medium text-primary-container">{stage.subtitle}</p>
      <p className="text-sm leading-relaxed text-on-surface-variant">{stage.description}</p>

      {/* Conditional visualization */}
      <StageVisualization stageId={stage.id} />

      {/* Float animation keyframes */}
      <style jsx>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
