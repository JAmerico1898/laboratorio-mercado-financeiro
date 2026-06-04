interface StepProgressProps {
  steps: { label: string; done: boolean; active: boolean }[];
}

// Barra segmentada de fases; preenchimento rust (#c2592e) conforme avança.
export default function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="flex w-full items-center gap-2" aria-hidden="true">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-1 flex-col gap-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full transition-all duration-500 motion-reduce:transition-none"
              style={{
                width: s.done ? "100%" : s.active ? "45%" : "0%",
                background: "#c2592e",
              }}
            />
          </div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wider ${
              s.done || s.active ? "text-[#c2592e]" : "text-on-surface-variant/60"
            }`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
