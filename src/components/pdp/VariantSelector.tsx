'use client';

/**
 * VariantSelector — renders one row per attribute.
 *
 * isVisual: true  → SwatchButton (image thumbnail — color, shade, material)
 * isVisual: false → OptionButton (plain text — size, storage, weight, ram)
 *
 * Availability rules:
 *   Visual (color): available if ANY variant with this value has stock > 0.
 *   Non-visual (size): available only if current-color + this-size variant has stock > 0.
 */

import { useMemo } from 'react';
import type { AttributeDefinition, ProductImage } from '@/types/product.types';
import type { CartApiVariant } from '@/types/cart.types';
import SwatchButton from './SwatchButton';
import OptionButton from './OptionButton';

interface VariantSelectorProps {
  attributeDefinitions: AttributeDefinition[];
  variants: CartApiVariant[];
  selectedAttributes: Record<string, string>;
  onAttributeChange: (attrName: string, value: string) => void;
}

export default function VariantSelector({
  attributeDefinitions,
  variants,
  selectedAttributes,
  onAttributeChange,
}: VariantSelectorProps) {
  // Derive unique values per attribute from variants.
  // attributeDefinitions has name/displayName/isVisual but no values —
  // values live inside each variant's attributes.
  const valueMap = useMemo(() => {
    const map = new Map<string, string[]>();
    variants.forEach((v) =>
      Object.entries(v.attributes).forEach(([key, val]) => {
        if (!map.has(key)) map.set(key, []);
        if (!map.get(key)!.includes(val)) map.get(key)!.push(val);
      })
    );
    return map;
  }, [variants]);

  const getSwatchImage = (
    attrName: string,
    value: string
  ): ProductImage | null => {
    const match = variants.find(
      (v) => v.attributes[attrName] === value && v.images?.length > 0
    );
    return match?.images[0] ?? null;
  };

  const isVisualAvailable = (attrName: string, value: string): boolean =>
    variants.some((v) => v.attributes[attrName] === value && v.stock > 0);

  const isNonVisualAvailable = (attrName: string, value: string): boolean => {
    const visualNames = attributeDefinitions
      .filter((d) => d.isVisual)
      .map((d) => d.name);

    return variants.some((v) => {
      const matchesThis = v.attributes[attrName] === value;
      const matchesVisuals = visualNames.every(
        (vName) => v.attributes[vName] === selectedAttributes[vName]
      );
      return matchesThis && matchesVisuals && v.stock > 0;
    });
  };

  const sortedDefinitions = [...attributeDefinitions].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
  return (
    <div className="space-y-5">
      {sortedDefinitions.map(({ name, displayName, isVisual }) => {
        const values = valueMap.get(name) ?? [];

        return (
          <div key={name}>
            {/* Row label: "Color: Red" */}
            <p className="mb-3 text-sm font-medium text-gray-900">
              {displayName}:{' '}
              <span className="font-normal text-gray-500">
                {selectedAttributes[name]}
              </span>
            </p>

            {isVisual ? (
              <div className="flex flex-wrap gap-3">
                {values.map((value) => (
                  <SwatchButton
                    key={value}
                    value={value}
                    displayName={displayName}
                    image={getSwatchImage(name, value)}
                    isSelected={selectedAttributes[name] === value}
                    isAvailable={isVisualAvailable(name, value)}
                    onClick={() => onAttributeChange(name, value)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <OptionButton
                    key={value}
                    value={value}
                    isSelected={selectedAttributes[name] === value}
                    isAvailable={isNonVisualAvailable(name, value)}
                    onClick={() => onAttributeChange(name, value)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
