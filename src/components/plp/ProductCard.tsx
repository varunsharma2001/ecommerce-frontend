import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/format';
import type { ProductListItem } from '@/types/product.types';

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-4 transition hover:shadow-md">
      <Link href={`/products/${product._id}`} className="block">
        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gray-100">
          {product?.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}

          {product.discountPercent > 0 && (
            <Badge variant="danger" className="absolute top-2 left-2">
              -{product.discountPercent}%
            </Badge>
          )}
        </div>

        <div className="mt-3 space-y-1">
          {product.brand && (
            <p className="text-xs text-gray-400">{product.brand}</p>
          )}
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
            {product.title}
          </h3>

          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-500">{product.rating}</span>
          </div>

          {/* Price — pre-computed by backend, no variant math on the client */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(product.minPrice)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <Link
        href={`/products/${product._id}`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
      >
        <ShoppingCart className="h-4 w-4" />
        View Product
      </Link>
    </div>
  );
}
