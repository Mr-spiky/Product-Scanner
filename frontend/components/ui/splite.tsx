"use client";

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <iframe
      src={scene}
      className={className}
      allow="xr-spatial-tracking; fullscreen; autoplay"
    />
  );
}
