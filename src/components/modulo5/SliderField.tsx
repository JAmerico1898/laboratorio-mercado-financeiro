"use client";

export interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
}

export default function SliderField({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-on-surface-variant font-medium">{label}</span>
        <span className="text-sm font-semibold text-primary-container tabular-nums">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-surface-container-highest cursor-pointer accent-primary-container"
      />
      <div className="flex justify-between text-xs text-outline-variant">
        <span>{min.toLocaleString("pt-BR")}</span>
        <span>{max.toLocaleString("pt-BR")}</span>
      </div>
    </div>
  );
}
