/**
 * PDP — Product Detail Page
 *
 * Architecture:
 * • RSC fetches product data on the server — no client JS for data fetching.
 * • PDPInteractiveSection is a single client component island that owns all
 *   interactive state: selected variant, gallery images, variant selector, cart.
 * • Loaded via dynamic import so it is code-split into its own JS chunk.
 * • Wrapped in <Suspense> so the breadcrumb renders instantly while the
 *   interactive island hydrates.
 *
 * generateMetadata: runs on the server before the page renders.
 * Returns SEO-optimized <title> and <meta> tags from real product data.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { fetchProductById } from '@/services/products/productService';
import { Skeleton } from '@/components/ui/Skeleton';
import { Product } from '@/types/product.types';
import type { CartApiVariant } from '@/types/cart.types';
import { ApiResponse } from '@/types/apiResponse.types';

const PDPInteractiveSection = dynamic(
  () => import('@/components/pdp/PDPInteractiveSection')
);

interface PDPProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PDPProps) {
  const { id } = await params;
  try {
    const data: ApiResponse<Product> = await fetchProductById(id);
    const product = data.data;
    return {
      title: `${product.title} | ShopEase`,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: 'Product Not Found | ShopEase' };
  }
}

export default async function ProductDetailPage({ params }: PDPProps) {
  const { id } = await params;

  let product: Product;
  try {
    const res = await fetchProductById(id);
    product = res.data;
  } catch {
    notFound();
  }

  // Map active variants to CartApiVariant shape.
  // images included — first image is used as cart thumbnail.
  const cartVariants: CartApiVariant[] = product.variants
    .filter((v) => v.isActive)
    .map((v) => ({
      _id: v._id,
      price: v.price,
      discountPercent: v.discountPercent,
      discountedPrice: v.discountedPrice,
      stock: v.stock,
      attributes: v.attributes,
      images: v.images,
    }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </Link>

      {cartVariants.length > 0 ? (
        <Suspense fallback={<Skeleton className="mt-6 h-[600px] w-full" />}>
          <PDPInteractiveSection product={product} variants={cartVariants} />
        </Suspense>
      ) : (
        <p className="mt-10 text-sm text-red-500">No variants available.</p>
      )}
    </div>
  );
}
