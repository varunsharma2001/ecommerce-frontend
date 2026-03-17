'use client';

/**
 * useOptimistic — React 19 hook for instant UI feedback.
 *
 * The problem without it:
 *   User clicks "Add to Cart" → waits for API → badge updates → button resets
 *   On slow connections this feels broken.
 *
 * With useOptimistic:
 *   User clicks → button shows "Added ✓" and badge updates IMMEDIATELY
 *   → API runs in background (dispatch(addItemToCart))
 *   → If API succeeds: fulfilled reducer syncs real state
 *   → If API fails: React automatically reverts optimisticCount to real state
 *
 * useOptimistic(realValue, updater):
 *   - realValue: the actual cart count for this variant (from Redux)
 *   - updater: how to compute the optimistic value given an action
 */

import { useOptimistic, useCallback, useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatCurrency, getDiscountPercent } from '@/utils/format';
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

  // Real cart quantity for this specific variant (from Redux)
  const currentQty =
    items.find((i) => i.variantId === variant._id)?.quantity ?? 0;

  // useOptimistic: shows updated count before API confirms
  const [optimisticQty, addOptimistic] = useOptimistic(
    currentQty,
    (state: number, added: number) => state + added
  );

  const handleAddToCart = useCallback(() => {
    // 1. Optimistic: update the displayed count instantly
    addOptimistic(quantity);

    // 2. Real: optimisticAdd + API call (inside useCart.addToCart)
    addToCart(
      variant._id,
      quantity,
      product,
      variant,
      variant.discountedPrice ?? variant.price
    );
  }, [addOptimistic, addToCart, variant, product, quantity]);

  const isOutOfStock = variant.stock === 0;
  const maxQty = Math.min(variant.stock, 10);
  const displayPrice = variant.discountedPrice ?? variant.price;
  const discount = variant.discountedPrice
    ? getDiscountPercent(variant.price, variant.discountedPrice)
    : 0;

  return (
    <div className="space-y-5">
      {/* Price block */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          {formatCurrency(displayPrice)}
        </span>
        {variant.discountedPrice && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatCurrency(variant.price)}
            </span>
            <span className="text-sm font-semibold text-green-600">
              {discount}% off
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

          {/* Add to Cart button — shows optimistic cart count instantly */}
          <button
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-4 text-base font-medium text-white transition hover:bg-gray-700"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
            {optimisticQty > 0 && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {optimisticQty} in cart
              </span>
            )}
          </button>
        </>
      )}
    </div>
  );
}
