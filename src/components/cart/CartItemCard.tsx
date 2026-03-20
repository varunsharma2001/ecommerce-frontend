'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { CartItem } from '@/types/cart.types';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/format';
import { Badge } from '@/components/ui/Badge';
import QuantityControl from './QuantityControl';

interface CartItemCardProps {
  item: CartItem;
}

function CartItemCard({ item }: CartItemCardProps) {
  const { removeFromCart, updateQuantity } = useCart();
  const { variantId, quantity, product, variant, unavailable } = item;

  const imageSrc =
    variant?.images?.[0]?.url ??
    product?.images?.[0]?.url ??
    '/placeholder-product.png';

  const hasDiscount =
    variant?.discountedPrice !== undefined &&
    variant?.discountedPrice < variant.price;

  return (
    <div className="flex gap-3 py-4">
      {/* Product image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <Image
          src={imageSrc}
          alt={product?.title ?? ''}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 overflow-hidden">
        {/* Title + remove */}
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm leading-snug font-medium text-gray-900">
            {product?.title ?? ''}
          </p>
          <button
            onClick={() => removeFromCart(variantId)}
            aria-label="Remove item"
            className="flex-shrink-0 rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Brand */}
        {product?.brand && (
          <p className="text-xs text-gray-500">{product.brand}</p>
        )}

        {/* Variant attributes */}
        {Object.keys(variant?.attributes ?? {}).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.entries(variant?.attributes ?? {}).map(([key, value]) => (
              <span
                key={key}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}

        {/* Unavailable badge */}
        {unavailable && (
          <Badge variant="danger" className="w-fit">
            Unavailable
          </Badge>
        )}

        {/* Price + quantity controls */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(
                hasDiscount
                  ? (variant.discountedPrice ?? variant.price)
                  : (variant.price ?? 0)
              )}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(variant.price ?? 0)}
              </span>
            )}
          </div>

          <QuantityControl
            quantity={quantity ?? 1}
            stock={variant?.stock ?? 0}
            disabled={unavailable}
            onDecrease={() => updateQuantity(variantId, quantity - 1)}
            onIncrease={() => updateQuantity(variantId, quantity + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(CartItemCard);
