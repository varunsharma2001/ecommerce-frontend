'use client';

// This wrapper is needed because VariantSelector and AddToCartSection
// share `selectedVariant` state — one sets it, the other reads it.
// Both must be client components, and they must share state through
// a common parent. This wrapper is that parent.

import { useState } from 'react';
import VariantSelector from './VariantSelector';
import AddToCartSection from './AddToCartSection';
import type { CartApiVariant, CartApiProduct } from '@/types/cart.types';

interface VariantSelectorWrapperProps {
  variants: CartApiVariant[];
  product: CartApiProduct;
}

export default function VariantSelectorWrapper({
  variants,
  product,
}: VariantSelectorWrapperProps) {
  const [selectedVariant, setSelectedVariant] = useState<CartApiVariant>(
    variants[0]
  );

  return (
    <div className="space-y-6">
      {variants.length > 1 && (
        <VariantSelector
          variants={variants}
          onVariantChange={setSelectedVariant}
        />
      )}
      <AddToCartSection product={product} variant={selectedVariant} />
    </div>
  );
}
