"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OpeningHero from "@/components/modulo5/OpeningHero";
import StepperNav from "@/components/modulo5/StepperNav";
import FundamentosStep from "@/components/modulo5/FundamentosStep";
import MecanicaStep from "@/components/modulo5/MecanicaStep";
import BlockchainSandboxStep from "@/components/modulo5/BlockchainSandboxStep";
import { STEPS } from "@/lib/tokenization/constants";

// Wrap in Suspense because useSearchParams requires it in Next.js 14+
export default function Module5Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Module5Content />
    </Suspense>
  );
}

function Module5Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStep = Number(searchParams.get("step") ?? -1);
  const [activeStep, setActiveStep] = useState(initialStep >= 0 ? initialStep : -1);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleStepChange = useCallback(
    (step: number) => {
      setActiveStep(step);
      router.replace(`/modulo/5?step=${step}`, { scroll: false });
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [router]
  );

  const handleStartJourney = useCallback(() => {
    handleStepChange(0);
  }, [handleStepChange]);

  return (
    <div className="min-h-screen">
      <OpeningHero onStartJourney={handleStartJourney} />

      {activeStep >= 0 && (
        <>
          <div ref={contentRef}>
            <StepperNav activeStep={activeStep} onStepChange={handleStepChange} />
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8" role="tabpanel" id={`panel-${activeStep}`}>
            {activeStep === 0 && <FundamentosStep />}
            {activeStep === 1 && <MecanicaStep />}
            {activeStep === 2 && <BlockchainSandboxStep />}
            {activeStep === 3 && (
              <div className="text-on-surface-variant text-center py-20">
                Ciclo de Vida — em construção
              </div>
            )}
            {activeStep === 4 && (
              <div className="text-on-surface-variant text-center py-20">
                Riscos & Casos — em construção
              </div>
            )}
            {activeStep === 5 && (
              <div className="text-on-surface-variant text-center py-20">
                Contratos & Quiz — em construção
              </div>
            )}

            {/* Prev/Next buttons */}
            <div className="flex justify-between mt-12 pt-6 border-t border-outline-variant/15">
              <button
                onClick={() => handleStepChange(activeStep - 1)}
                disabled={activeStep === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                <span className="text-sm font-medium">
                  {activeStep > 0 ? STEPS[activeStep - 1].label : ""}
                </span>
              </button>
              <button
                onClick={() => handleStepChange(activeStep + 1)}
                disabled={activeStep === STEPS.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary-container hover:bg-primary-container/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-sm font-medium">
                  {activeStep < STEPS.length - 1 ? STEPS[activeStep + 1].label : ""}
                </span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
