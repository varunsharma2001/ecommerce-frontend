/**
 * React Server Component — runs on the server, fetches real products.
 * No client JS is sent to the browser for this data-fetching logic.
 * The page wraps this in <Suspense> so it streams in independently
 * while the rest of the home page renders instantly.
 */

import Link from 'next/link';
import { fetchProducts } from '@/services/products/productService';
import ProductCard from '@/components/plp/ProductCard';

export default async function FeaturedProducts() {
  const { data: products } = await fetchProducts({
    limit: 4,
    sortBy: 'rating',
  });

  if (!products?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Featured Products
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-gray-600 hover:text-black"
        >
          View All →
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
