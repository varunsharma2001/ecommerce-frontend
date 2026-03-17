'use client';

/**
 * useMemo is used in two places here:
 *
 * 1. attributeOptions — builds the map of { size: ['S','M','L'], color: ['Red','Blue'] }
 *    from all variants. This only needs to recompute when the variants array changes
 *    (which never happens on PDP). Without memo, it runs on every keystroke/state change.
 *
 * 2. selectedVariant — finds the variant that matches all currently selected attributes.
 *    Runs only when selectedAttributes or variants change — not on every render.
 */

import { useState, useMemo } from 'react';
import type { CartApiVariant } from '@/types/cart.types';

interface VariantSelectorProps {
  variants: CartApiVariant[];
  onVariantChange: (variant: CartApiVariant) => void;
}

export default function VariantSelector({
  variants,
  onVariantChange,
}: VariantSelectorProps) {
  // Initialize with first variant's attributes
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(() => ({ ...variants[0]?.attributes }));

  // useMemo: compute available attribute keys + their unique values once
  const attributeOptions = useMemo(() => {
    const map = new Map<string, Set<string>>();
    variants.forEach((v) => {
      Object.entries(v.attributes).forEach(([key, val]) => {
        if (!map.has(key)) map.set(key, new Set());
        map.get(key)!.add(val);
      });
    });
    return Array.from(map.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [variants]);

  // useMemo: find matching variant whenever selection changes
  const selectedVariant = useMemo(
    () =>
      variants.find((v) =>
        Object.entries(selectedAttributes).every(
          ([key, val]) => v.attributes[key] === val
        )
      ),
    [variants, selectedAttributes]
  );

  const handleSelect = (attrName: string, value: string) => {
    const updated = { ...selectedAttributes, [attrName]: value };
    setSelectedAttributes(updated);
    const matched = variants.find((v) =>
      Object.entries(updated).every(([k, val]) => v.attributes[k] === val)
    );
    if (matched) onVariantChange(matched);
  };

  return (
    <div className="space-y-4">
      {attributeOptions.map(({ name, values }) => (
        <div key={name}>
          <p className="mb-2 text-sm font-medium text-gray-900 capitalize">
            {name}:{' '}
            <span className="font-normal text-gray-500">
              {selectedAttributes[name]}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedAttributes[name] === value;
              const isAvailable = variants.some(
                (v) => v.attributes[name] === value && v.stock > 0
              );
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(name, value)}
                  disabled={!isAvailable}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : isAvailable
                        ? 'border-gray-200 text-gray-700 hover:border-gray-400'
                        : 'cursor-not-allowed border-gray-100 text-gray-300 line-through'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {selectedVariant && (
        <p className="text-xs text-gray-400">SKU: {selectedVariant?.sku}</p>
      )}
    </div>
  );
}
