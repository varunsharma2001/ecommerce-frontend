interface SkeletonProps {
  className?: string;
}

// Pulse animation is pure CSS — zero JS cost.
// Used as Suspense fallbacks so the user sees structure immediately
// while server components are still streaming data.
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
  );
}
