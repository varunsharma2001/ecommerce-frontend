'use client';

import { memo } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  stock: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
}

function QuantityControl({
  quantity,
  stock,
  onIncrease,
  onDecrease,
  disabled = false,
}: QuantityControlProps) {
  const decreaseDisabled = disabled || quantity <= 1;
  const increaseDisabled = disabled || quantity >= stock;

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-1 py-0.5">
      <button
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label="Decrease quantity"
        className="flex h-6 w-6 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </button>

      <span className="min-w-[1.5rem] text-center text-sm font-medium text-gray-900">
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
        className="flex h-6 w-6 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export default memo(QuantityControl);
