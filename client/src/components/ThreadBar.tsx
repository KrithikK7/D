import { useEffect, useState } from "react";
import { Knot } from "./Knot";

interface ThreadBarProps {
  progress: number;
  paused?: boolean;
  milestones?: number[];
  showLabels?: boolean;
  onMilestone?: (milestone: number) => void;
}

export function ThreadBar({
  progress,
  paused = false,
  milestones = [0.25, 0.5, 0.75, 1],
  showLabels = false,
  onMilestone,
}: ThreadBarProps) {
  const [hitMilestones, setHitMilestones] = useState<Set<number>>(new Set());

  useEffect(() => {
    milestones.forEach((m) => {
      if (progress >= m && !hitMilestones.has(m)) {
        setHitMilestones((prev) => new Set(prev).add(m));
        onMilestone?.(m);
      }
    });
  }, [progress, milestones, hitMilestones, onMilestone]);

  return (
    <div
      className="relative w-full h-1 bg-transparent overflow-visible"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-kdrama-sakura/30 to-kdrama-lavender/30 w-full"
      />
      
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-kdrama-thread transition-all duration-300 ${
          paused ? "opacity-60" : "opacity-100"
        }`}
        style={{ width: `${progress * 100}%` }}
      />
      
      {milestones.map((milestone) => {
        const isHit = progress >= milestone;
        return (
          <div
            key={milestone}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
            style={{ left: `${milestone * 100}%` }}
          >
            <Knot
              size="sm"
              tone={isHit ? "primary" : "muted"}
              className={`transition-all duration-180 ${
                isHit ? "animate-pulse-gentle" : ""
              }`}
            />
            {showLabels && (
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-noto whitespace-nowrap">
                {Math.round(milestone * 100)}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
