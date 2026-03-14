/**
 * PLP — Product Listing Page
 *
 * Architecture:
 * • This page is an RSC (React Server Component) — it runs on the server.
 * • ProductFilters is a Client Component ('use client') — imported directly.
 * • ProductGrid is an async RSC wrapped in <Suspense> — this enables STREAMING.
 *
 * What is Streaming?
 * Without Suspense: the entire page waits for ProductGrid to finish fetching
 * before sending ANY HTML to the browser → slow TTFB (Time To First Byte).
 *
 * With Suspense + Streaming:
 * 1. Browser receives the page shell (header, filter bar, skeleton) INSTANTLY
 * 2. Server fetches products in the background
 * 3. When ready, Next.js streams the ProductGrid HTML and swaps it in
 *
 * The `key={JSON.stringify(searchParams)}` on Suspense is important:
 * When filters change, it forces React to unmount/remount the Suspense boundary,
 * which shows the skeleton again while the new page data loads.
 */

import { Suspense } from 'react';
import ProductGrid from '@/components/plp/ProductGrid';
import ProductFilters from '@/components/plp/ProductFilters';
import { ProductGridSkeleton } from '@/components/plp/ProductGridSkeleton';

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export const metadata = {
  title: 'Products | ShopEase',
  description: 'Browse our full product catalog',
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const pageTitle = params.category ?? 'All Products';

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
          {params.search && (
            <p className="mt-1 text-sm text-gray-500">
              Results for &quot;{params.search}&quot;
            </p>
          )}
        </div>

        {/* Client component island — only this part hydrates in the browser */}
        <ProductFilters />
      </div>

      {/*
        Suspense boundary with key:
        - key changes whenever filters/sort/page changes
        - React unmounts old Suspense, mounts new one → shows skeleton
        - ProductGrid (async RSC) fetches fresh data for the new params
        - When ready, streams the grid HTML to replace the skeleton
      */}
      <Suspense key={JSON.stringify(params)} fallback={<ProductGridSkeleton />}>
        <ProductGrid searchParams={params} />
      </Suspense>
    </div>
  );
}
