'use client';

/**
 * useTransition: category filter navigations are non-urgent.
 * Clicking a category fires router.push inside startTransition — Next.js
 * starts fetching the new page in the background while the current page
 * stays interactive. `isPending` dims the bar to signal a navigation is happening.
 *
 * useQuery: categories are fetched once and cached for 10 minutes.
 * No re-fetch on every render — TanStack Query serves from cache after first load.
 */

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/categories/categoryService';
import type { Category } from '@/services/categories/categoryService';

const ALL_CATEGORY: Category = { _id: 'all', name: 'All', slug: '' };

export default function CategoryBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const active = searchParams.get('category') ?? '';

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes — categories rarely change
  });
  const allCategories = [ALL_CATEGORY, ...categories];

  const handleClick = (slug: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (slug) params.set('category', slug);
      router.push(`/products?${params.toString()}`);
    });
  };

  return (
    <div
      className={`h-11 bg-white transition-opacity ${isPending ? 'opacity-60' : ''}`}
    >
      <div className="scrollbar-hide mx-auto flex h-full max-w-7xl items-center gap-6 overflow-x-auto px-6">
        {allCategories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleClick(cat.slug)}
            className={`cursor-pointer text-sm font-medium whitespace-nowrap transition hover:text-black ${
              active === cat.slug
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
