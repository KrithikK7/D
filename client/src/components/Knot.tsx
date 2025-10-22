import { Heart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface KnotProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  tone?: "primary" | "gold" | "muted";
  className?: string;
}

const sizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-6 h-6",
};

const toneClasses = {
  primary: "fill-kdrama-thread text-kdrama-thread",
  gold: "fill-kdrama-lavender text-kdrama-lavender",
  muted: "fill-kdrama-sakura/50 text-kdrama-sakura/50",
};

export function Knot({ size = "md", label, tone = "primary", className = "" }: KnotProps) {
  const heart = (
    <Heart
      className={`${sizeClasses[size]} ${toneClasses[tone]} transition-all duration-180 hover:scale-105 ${className}`}
      aria-label={label || "Knot marker"}
      tabIndex={label ? 0 : undefined}
    />
  );

  if (label) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block cursor-help">{heart}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-noto text-sm">{label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return heart;
}
