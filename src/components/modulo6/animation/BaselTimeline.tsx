"use client";

interface BaselTimelineProps {
  currentStageId?: string;
}

const events = [
  { year: "1988", label: "Basileia I", color: "#00f2ff", id: "basel1" },
  { year: "2004", label: "Basileia II", color: "#8b5cf6", id: "basel2" },
  { year: "2008", label: "Crise", color: "#ef4444", id: "crisis" },
  { year: "2010", label: "Basileia III", color: "#4edea3", id: "basel3" },
  { year: "2018", label: "IFRS 9", color: "#f59e0b", id: "ifrs9" },
  { year: "2023", label: "Basileia IV", color: "#00f2ff", id: "basel4" },
];

export default function BaselTimeline({ currentStageId }: BaselTimelineProps) {
  return (
    <div className="mt-4 w-full overflow-x-auto">
      <div className="relative flex items-center justify-between min-w-[480px] px-4 py-6">
        {/* Horizontal line */}
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-outline-variant/30" />

        {events.map((event) => {
          const isActive = currentStageId === event.id;
          return (
            <div key={event.id} className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-on-surface-variant">
                {event.year}
              </span>
              <div
                className="rounded-full transition-all duration-500"
                style={{
                  width: isActive ? 20 : 12,
                  height: isActive ? 20 : 12,
                  backgroundColor: event.color,
                  boxShadow: isActive
                    ? `0 0 16px ${event.color}, 0 0 32px ${event.color}80`
                    : "none",
                }}
              />
              <span
                className="text-xs font-semibold transition-opacity duration-300"
                style={{
                  color: isActive ? event.color : "var(--on-surface-variant)",
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {event.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
