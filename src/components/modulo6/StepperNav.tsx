"use client";

import { STEPS } from "@/lib/financial-regulation/constants";

interface StepperNavProps {
  activeStep: number;
  onStepChange: (step: number) => void;
}

export default function StepperNav({ activeStep, onStepChange }: StepperNavProps) {
  return (
    <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-outline-variant/15">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Desktop stepper */}
        <div className="hidden md:flex items-center justify-center py-4" role="tablist" aria-label="Etapas da jornada de Regulação Bancária">
          {STEPS.map((step, i) => (
            <div key={step.index} className="flex items-center">
              <button
                role="tab"
                aria-selected={activeStep === i}
                aria-controls={`panel-${i}`}
                onClick={() => onStepChange(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  activeStep === i
                    ? "bg-primary-container/15 text-primary-container"
                    : "text-outline-variant hover:text-on-surface-variant hover:bg-surface-container/50"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    activeStep === i
                      ? "bg-primary-container text-surface"
                      : activeStep > i
                      ? "bg-primary-container/30 text-primary-container"
                      : "bg-surface-container-highest text-outline-variant"
                  }`}
                >
                  {activeStep > i ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-8 h-[2px] mx-1 transition-colors ${
                    activeStep > i ? "bg-primary-container/40" : "bg-outline-variant/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile stepper */}
        <div className="md:hidden flex items-center justify-between py-3">
          <button
            onClick={() => onStepChange(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="p-2 text-outline-variant disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-container text-surface flex items-center justify-center text-xs font-bold">
              {activeStep + 1}
            </div>
            <span className="text-sm font-semibold text-on-surface">
              {STEPS[activeStep].label}
            </span>
            <span className="text-xs text-outline-variant">
              de {STEPS.length}
            </span>
          </div>
          <button
            onClick={() => onStepChange(Math.min(STEPS.length - 1, activeStep + 1))}
            disabled={activeStep === STEPS.length - 1}
            className="p-2 text-outline-variant disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
