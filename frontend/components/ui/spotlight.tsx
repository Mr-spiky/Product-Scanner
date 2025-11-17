"use client";

import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute h-[400px] w-[400px] rounded-full blur-[130px]",
        className
      )}
      style={{
        background: fill,
        opacity: 0.35,
      }}
    />
  );
}
