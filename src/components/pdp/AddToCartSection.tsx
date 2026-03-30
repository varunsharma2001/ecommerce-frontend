'use client';

import { useCallback, useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/format';
import type { CartApiVariant, CartApiProduct } from '@/types/cart.types';

interface AddToCartSectionProps {
  product: CartApiProduct;
  variant: CartApiVariant;
}

export default function AddToCartSection({
  product,
  variant,
}: AddToCartSectionProps) {
  const { items, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity to 1 whenever the user switches to a different variant.
  useEffect(() => {
    setQuantity(1);
  }, [variant._id]);

  // Redux state is already updated optimistically by optimisticAdd inside useCart.addToCart,
  // so currentQty reflects the latest count instantly — no separate useOptimistic needed.
  const currentQty =
    items.find((i) => i.variantId === variant._id)?.quantity ?? 0;

  const handleAddToCart = useCallback(() => {
    addToCart(variant._id, quantity, product, variant);
  }, [addToCart, variant, product, quantity]);

  const isOutOfStock = variant.stock === 0;
  const maxQty = Math.min(variant.stock, 10);

  // Backend sends both fields — only show discount UI when both are present and meaningful.
  const hasDiscount =
    variant.discountedPrice != null &&
    variant.discountPercent != null &&
    variant.discountPercent > 0;

  const displayPrice = hasDiscount ? variant.discountedPrice! : variant.price;

  return (
    <div className="space-y-5">
      {/* Price block */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatCurrency(displayPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatCurrency(variant.price)}
            </span>
            <span className="text-sm font-semibold text-green-600">
              {variant.discountPercent}% off
            </span>
          </>
        )}
      </div>

      {/* Stock status */}
      <p
        className={`text-sm font-medium ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}
      >
        {isOutOfStock ? 'Out of Stock' : `${variant.stock} units available`}
      </p>

      {!isOutOfStock && (
        <>
          {/* Quantity stepper */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center rounded-lg border border-gray-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
                className="flex h-9 w-9 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-base font-medium text-white transition hover:bg-gray-700"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
            {currentQty > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {currentQty} in cart
              </span>
            )}
          </button>
        </>
      )}
    </div>
  );
}
