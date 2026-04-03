'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  /** Maximum allowed quantity — pass stock or canAddMore depending on context */
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  /** sm — compact pill (cart drawer), md — larger rectangle (PDP). Default: sm */
  size?: 'sm' | 'md';
  className?: string;
}

const QuantityControl = ({
  quantity,
  max,
  onIncrease,
  onDecrease,
  disabled = false,
  size = 'sm',
  className,
}: QuantityControlProps) => {
  const isLarge = size === 'md';
  const decreaseDisabled = disabled || quantity <= 1;
  const increaseDisabled = disabled || quantity >= max;

  return (
    <div
      className={[
        'flex items-center border border-gray-200',
        isLarge ? 'rounded-lg' : 'gap-1 rounded-full bg-white px-1 py-0.5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label="Decrease quantity"
        className={[
          'flex items-center justify-center text-gray-600 transition disabled:opacity-40',
          isLarge
            ? 'h-9 w-9 hover:bg-gray-50'
            : 'h-6 w-6 rounded-full hover:bg-gray-100 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        <Minus className={isLarge ? 'h-4 w-4' : 'h-3 w-3'} />
      </button>

      <span
        className={[
          'text-center text-sm font-medium',
          isLarge ? 'w-10' : 'min-w-[1.5rem] text-gray-900',
        ].join(' ')}
      >
        {quantity}
      </span>

      <button
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
        className={[
          'flex items-center justify-center text-gray-600 transition disabled:opacity-40',
          isLarge
            ? 'h-9 w-9 hover:bg-gray-50'
            : 'h-6 w-6 rounded-full hover:bg-gray-100 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        <Plus className={isLarge ? 'h-4 w-4' : 'h-3 w-3'} />
      </button>
    </div>
  );
}

export default QuantityControl;
