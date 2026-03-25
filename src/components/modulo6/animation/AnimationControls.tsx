"use client";

interface AnimationControlsProps {
  currentStage: number;
  totalStages: number;
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onGoToStage: (index: number) => void;
}

export default function AnimationControls({
  currentStage,
  totalStages,
  isPlaying,
  onPrev,
  onNext,
  onTogglePlay,
  onGoToStage,
}: AnimationControlsProps) {
  return (
    <div className="space-y-4">
      {/* Button row */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onPrev}
          disabled={currentStage <= 0}
          className="flex items-center gap-1 rounded-lg bg-surface-container px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
          Anterior
        </button>

        <button
          onClick={onTogglePlay}
          className="flex items-center gap-1.5 rounded-lg px-5 py-2 text-sm font-bold text-white transition-all"
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, #00f2ff, #4edea3)",
            color: isPlaying ? "#fff" : "#111417",
          }}
        >
          <span className="material-symbols-outlined text-base">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
          {isPlaying ? "Pausar" : "Reproduzir"}
        </button>

        <button
          onClick={onNext}
          disabled={currentStage >= totalStages - 1}
          className="flex items-center gap-1 rounded-lg bg-surface-container px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Próximo
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

      {/* Dot navigation */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalStages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onGoToStage(i)}
            aria-label={`Ir para etapa ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentStage ? 24 : 8,
              height: 8,
              backgroundColor: i === currentStage ? "#00f2ff" : "rgba(225,226,231,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
