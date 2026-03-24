"use client";

import { Suspense, useState, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OpeningHero from "@/components/modulo3/OpeningHero";
import StepperNav from "@/components/modulo3/StepperNav";
import ViabilidadeModule from "@/components/modulo3/ViabilidadeModule";
import ClassesModule from "@/components/modulo3/ClassesModule";
import { STEPS } from "@/lib/fidc/constants";

// Wrap in Suspense because useSearchParams requires it in Next.js 14+
export default function Module3Page() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Module3Content />
    </Suspense>
  );
}

function Module3Content() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStep = Number(searchParams.get("step") ?? -1);
  const [activeStep, setActiveStep] = useState(initialStep >= 0 ? initialStep : -1);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleStepChange = useCallback(
    (step: number) => {
      setActiveStep(step);
      router.replace(`/modulo/3?step=${step}`, { scroll: false });
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
            {activeStep === 0 && <ViabilidadeModule />}
            {activeStep === 1 && <ClassesModule />}
            {activeStep === 2 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">shield</span>
                <p>Subordinação e Risco — em breve</p>
              </div>
            )}
            {activeStep === 3 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">checklist</span>
                <p>Checklist Regulatório — em breve</p>
              </div>
            )}
            {activeStep === 4 && (
              <div className="text-on-surface-variant text-center py-20">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">animation</span>
                <p>Animação — em breve</p>
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
