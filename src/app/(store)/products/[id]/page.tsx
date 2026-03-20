/**
 * PDP — Product Detail Page
 *
 * Architecture:
 * • RSC at the top — fetches product data on the server (no client JS for this)
 * • ProductGallery and VariantSelectorWrapper are Client Components loaded
 *   via dynamic import — they are code-split into separate JS chunks and
 *   only loaded when the user visits a PDP route.
 * • Each is wrapped in <Suspense> so the static product info (title, description,
 *   brand) renders instantly while the interactive islands hydrate.
 *
 * generateMetadata: runs on the server before the page renders.
 * It fetches the product and returns SEO-optimized <title> and <meta> tags.
 * This is crucial for social sharing and search engine indexing.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronLeft, Star } from 'lucide-react';
import { fetchProductById } from '@/services/products/productService';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { getCategoryName, Product } from '@/types/product.types';
import type { CartApiVariant } from '@/types/cart.types';
import { ApiResponse } from '@/types/apiResponse.types';

// dynamic imports: these client components are heavy (useState, image slider, cart hooks).
// They are only needed on PDP, so Next.js splits them into separate chunks.
const ProductGallery = dynamic(() => import('@/components/pdp/ProductGallery'));
const VariantSelectorWrapper = dynamic(
  () => import('@/components/pdp/VariantSelectorWrapper')
);

interface PDPProps {
  params: Promise<{ id: string }>;
}

// generateMetadata: SSR SEO — title/description built from real product data
export async function generateMetadata({ params }: PDPProps) {
  const { id } = await params;
  try {
    const data: ApiResponse<Product> = await fetchProductById(id);
    const product = data.data;
    console.log('#45', product);
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

  let product;
  try {
    const res = await fetchProductById(id);
    product = res.data;
  } catch {
    notFound();
  }
  console.log('#62', product);
  const category = getCategoryName(product);
  console.log('#68 category', category);

  // Map Product variants to CartApiVariant shape (same structure, just typed for cart use)
  const cartVariants: CartApiVariant[] = product.variants
    .filter((v) => v.isActive)
    .map((v) => ({
      _id: v._id,
      price: v.price,
      discountedPrice: v.discountedPrice,
      stock: v.stock,
      attributes: v.attributes,
    }));

  const cartProduct = {
    _id: product._id,
    title: product.title,
    images: product.images,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery — streams in independently */}
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <ProductGallery images={product.images} title={product.title} />
        </Suspense>

        {/* Product info (static — renders instantly from RSC) */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap gap-2">
              {category && <Badge variant="outline">{category}</Badge>}
              {product.brand && (
                <Badge variant="outline">{product.brand}</Badge>
              )}
            </div>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} · {product.totalSold} sold
              </span>
            </div>

            <p className="mt-4 leading-relaxed text-gray-600">
              {product.description}
            </p>
          </div>

          {/* Interactive section — client component island, streams in */}
          {cartVariants.length > 0 ? (
            <Suspense fallback={<Skeleton className="h-52 w-full" />}>
              <VariantSelectorWrapper
                variants={cartVariants}
                product={cartProduct}
              />
            </Suspense>
          ) : (
            <p className="text-sm text-red-500">No variants available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
