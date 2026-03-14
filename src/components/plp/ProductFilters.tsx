'use client';

/**
 * useTransition: filter/sort changes are non-urgent state updates.
 * Clicking a sort option fires router.push inside startTransition.
 * Next.js starts fetching the new page in the background — the current
 * page stays fully interactive (no input freeze, no spinner blocking).
 * `isPending` dims the filter bar to signal a navigation is in progress.
 *
 * useMemo: currentFilters is read from URLSearchParams on every render.
 * Wrapping it in useMemo means the object is only re-computed when
 * searchParams actually changes, not on every unrelated re-render.
 */

import { useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SortOption } from '@/types/product.types';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // useMemo: only recompute when URL search params change
  const activeSort = useMemo(
    () => (searchParams.get('sortBy') as SortOption) ?? 'newest',
    [searchParams]
  );

  const handleSort = (value: SortOption) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sortBy', value);
      params.delete('page'); // reset to page 1 when sort changes
      router.push(`/products?${params.toString()}`);
    });
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-3 transition-opacity ${isPending ? 'opacity-50' : ''}`}
    >
      <span className="text-sm font-medium text-gray-600">Sort by:</span>
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSort(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              activeSort === opt.value
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
