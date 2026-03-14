/**
 * React Server Component — fetches products on the server.
 *
 * Why RSC here?
 * The data-fetching code (axios call, async/await) never reaches the browser.
 * The browser only receives the rendered HTML of the product grid.
 * This means:
 *  - Zero client JS for fetching/loading state in this component
 *  - The product data is never exposed in the network waterfall
 *  - Works great with Suspense: the PLP page streams this component
 *    independently while the rest of the page (filters, header) loads instantly
 */

import Link from 'next/link';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { fetchProducts } from '@/services/products/productService';
import ProductCard from './ProductCard';
import type {
  ProductListItem,
  ProductQueryParams,
} from '@/types/product.types';

interface ProductGridProps {
  searchParams: Record<string, string | undefined>;
}

export default async function ProductGrid({ searchParams }: ProductGridProps) {
  const queryParams: ProductQueryParams = {
    page: Number(searchParams.page ?? 1),
    limit: 12,
    category: searchParams.category,
    search: searchParams.search,
    sortBy: searchParams.sortBy as ProductQueryParams['sortBy'],
    brand: searchParams.brand,
  };

  let products: ProductListItem[] = [];
  let pagination;
  try {
    const result = await fetchProducts(queryParams);
    products = result.data.products;
    pagination = result.data.pagination;
  } catch {
    return (
      <div className="mt-16 flex flex-col items-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-red-400" />
        <p className="font-medium text-gray-800">Failed to load products</p>
        <p className="text-sm text-gray-500">
          Something went wrong while fetching products. Please try again.
        </p>
        <Link
          href="/products"
          className="mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
        >
          Retry
        </Link>
      </div>
    );
  }
  const { totalPages = 1, totalElements = 0, page = 1 } = pagination;
  if (!products?.length) {
    return (
      <div className="mt-16 text-center">
        <p className="text-gray-500">
          No products found. Try a different filter.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm text-gray-700 underline"
        >
          Clear all filters
        </Link>
      </div>
    );
  }
  return (
    <div>
      <p className="text-sm text-gray-500">{totalElements} products found</p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {page > 1 && (
            <PaginationLink
              searchParams={searchParams}
              page={page - 1}
              label={<ChevronLeft className="h-4 w-4" />}
            />
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationLink
              key={p}
              searchParams={searchParams}
              page={p}
              label={String(p)}
              isActive={p === page}
            />
          ))}
          {page < totalPages && (
            <PaginationLink
              searchParams={searchParams}
              page={page + 1}
              label={<ChevronRight className="h-4 w-4" />}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pagination Link ──────────────────────────────────────────────────────────
function PaginationLink({
  searchParams,
  page,
  label,
  isActive = false,
}: {
  searchParams: Record<string, string | undefined>;
  page: number;
  label: React.ReactNode;
  isActive?: boolean;
}) {
  const params = new URLSearchParams(
    Object.entries(searchParams).filter(([, v]) => v !== undefined) as [
      string,
      string,
    ][]
  );
  params.set('page', String(page));

  return (
    <Link
      href={`/products?${params.toString()}`}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm transition ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'border border-gray-200 text-gray-600 hover:border-gray-400'
      }`}
    >
      {label}
    </Link>
  );
}
