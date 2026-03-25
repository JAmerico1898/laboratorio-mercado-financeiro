"use client";

import { useState, useEffect } from "react";
import { ANIMATION_STAGES, STAGE_METRICS_MAP } from "@/lib/financial-regulation/constants";
import StageCard from "./animation/StageCard";
import BankDashboard from "./animation/BankDashboard";
import AnimationControls from "./animation/AnimationControls";

export default function AnimacaoModule() {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stage = ANIMATION_STAGES[currentStage];
  const metrics = STAGE_METRICS_MAP[currentStage];

  // Auto-play
  useEffect(() => {
    if (!isPlaying || currentStage >= ANIMATION_STAGES.length - 1) return;
    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= ANIMATION_STAGES.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, currentStage]);

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant/10 overflow-hidden relative">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface">
          Acordos de Basileia
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">Regulação Prudencial</p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Left: Stage card */}
        <StageCard
          stage={stage}
          stageIndex={currentStage}
          totalStages={ANIMATION_STAGES.length}
        />

        {/* Right: Bank dashboard */}
        <BankDashboard metrics={metrics} />
      </div>

      {/* Controls */}
      <div className="mt-8">
        <AnimationControls
          currentStage={currentStage}
          totalStages={ANIMATION_STAGES.length}
          isPlaying={isPlaying}
          onPrev={() => setCurrentStage((p) => Math.max(0, p - 1))}
          onNext={() => setCurrentStage((p) => Math.min(ANIMATION_STAGES.length - 1, p + 1))}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          onGoToStage={(i) => {
            setCurrentStage(i);
            setIsPlaying(false);
          }}
        />
      </div>
    </div>
  );
}
