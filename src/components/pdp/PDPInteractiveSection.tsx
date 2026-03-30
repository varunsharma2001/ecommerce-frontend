'use client';

/**
 * PDPInteractiveSection — the single client-side island for the entire PDP.
 *
 * Single state: selectedVariant drives everything — UI highlighting, gallery,
 * price, stock, and cart.
 *
 * Availability is enforced in VariantSelector (disabled buttons), so every
 * user interaction always resolves to a valid in-stock variant. selectedVariant
 * is never undefined after mount.
 *
 * galleryImages + galleryKey are derived (useMemo) — never useState.
 *  galleryKey is based on the first image's public_id, NOT the variant _id.
 *  Same images across size variants → same key → no gallery flicker.
 *  Different color → different images → key changes → gallery resets to index 0.
 */

import { useState, useMemo, useCallback } from 'react';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import ProductGallery from './ProductGallery';
import VariantSelector from './VariantSelector';
import AddToCartSection from './AddToCartSection';
import { getCategoryName, type Product } from '@/types/product.types';
import type { CartApiVariant } from '@/types/cart.types';

interface PDPInteractiveSectionProps {
  product: Product;
  variants: CartApiVariant[]; // active variants only, mapped from ProductVariant in RSC
}

export default function PDPInteractiveSection({
  product,
  variants,
}: PDPInteractiveSectionProps) {
  const category = getCategoryName(product);
  const cartProduct = {
    _id: product._id,
    title: product.title,
    images: product.images,
  };

  const [selectedVariant, setSelectedVariant] = useState<CartApiVariant>(
    variants[0]
  );

  // Gallery images: selected variant's images if it has them, else product-level fallback.
  const galleryImages = useMemo(
    () =>
      selectedVariant.images.length ? selectedVariant.images : product.images,
    [selectedVariant, product.images]
  );

  // Key drives gallery reset. Based on first image public_id — NOT variant _id.
  // Same color + different size → same images → same key → no reset, no flicker.
  // Different color → different first image → key changes → gallery resets to index 0.
  const galleryKey = galleryImages[0]?.public_id ?? 'product-default';

  const handleAttributeChange = useCallback(
    (attrName: string, value: string) => {
      const updatedAttributes = {
        ...selectedVariant.attributes,
        [attrName]: value,
      };

      // Try exact match: the user picked a combination that exists.
      const exactMatch = variants.find((v) =>
        Object.entries(updatedAttributes).every(
          ([key, val]) => v.attributes[key] === val
        )
      );

      if (exactMatch) {
        setSelectedVariant(exactMatch);
        return;
      }

      // No exact match (e.g. switching to Blue when Blue+XL doesn't exist).
      // Auto-correct: pick the best in-stock variant that has the changed attribute.
      const bestMatch = variants.find(
        (v) => v.attributes[attrName] === value && v.stock > 0
      );

      if (bestMatch) {
        setSelectedVariant(bestMatch);
      }
      // Neither found: VariantSelector disables unavailable options before render,
      // so a click that reaches here is not possible in practice.
    },
    [selectedVariant.attributes, variants]
  );

  return (
    <div className="mt-6 grid gap-10 lg:grid-cols-2">
      {/* Left — Gallery. key resets only when images actually change. */}
      <ProductGallery
        key={galleryKey}
        images={galleryImages}
        title={product.title}
      />

      {/* Right — Static info + interactive selectors */}
      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap gap-2">
            {category && <Badge variant="outline">{category}</Badge>}
            {product.brand && <Badge variant="outline">{product.brand}</Badge>}
          </div>

          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            {product.title}
          </h1>

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

        <VariantSelector
          attributeDefinitions={product.attributeDefinitions}
          variants={variants}
          selectedAttributes={selectedVariant.attributes}
          onAttributeChange={handleAttributeChange}
        />

        <AddToCartSection product={cartProduct} variant={selectedVariant} />
      </div>
    </div>
  );
}
