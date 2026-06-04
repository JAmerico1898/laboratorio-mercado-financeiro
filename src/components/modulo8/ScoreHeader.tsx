interface ScoreHeaderProps {
  score: number;
  maxScore: number;
}

export default function ScoreHeader({ score, maxScore }: ScoreHeaderProps) {
  const pct = maxScore > 0 ? Math.min((score / maxScore) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
        Pontuação
      </span>
      <div className="h-2 w-32 overflow-hidden rounded-full bg-surface-container-high sm:w-44">
        <div
          className="h-full rounded-full bg-gradient-to-r from-secondary to-emerald-500 transition-all duration-500 motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-[64px] text-right font-mono text-sm font-bold text-[#c2592e]">
        {score} / {maxScore}
      </span>
    </div>
  );
}
