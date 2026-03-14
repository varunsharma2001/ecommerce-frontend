import { Skeleton } from '@/components/ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="mt-4 h-3 w-1/3" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/4" />
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  );
}
