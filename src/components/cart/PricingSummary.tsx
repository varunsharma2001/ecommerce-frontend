'use client';

import { AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import type { CartState } from '@/types/cart.types';

interface PricingSummaryProps {
  pricing: CartState['pricing'];
  hasUnavailableItems: boolean;
  isEmpty: boolean;
}

export default function PricingSummary({
  pricing,
  hasUnavailableItems,
  isEmpty,
}: PricingSummaryProps) {
  const { originalTotal, payableAmount, totalSavings } = pricing;
  const isCheckoutDisabled = isEmpty || hasUnavailableItems;

  return (
    <div className="border-t border-gray-100 bg-white px-4 py-4">
      {/* Pricing rows */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Original Total</span>
          <span className="line-through">{formatCurrency(originalTotal)}</span>
        </div>

        {totalSavings > 0 && (
          <div className="flex items-center justify-between text-sm font-medium text-green-600">
            <span>Total Savings</span>
            <span>− {formatCurrency(totalSavings)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-base font-bold text-gray-900">
          <span>Payable Amount</span>
          <span>{formatCurrency(payableAmount)}</span>
        </div>
      </div>

      {/* Unavailable warning */}
      {hasUnavailableItems && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>Remove unavailable items to proceed</span>
        </div>
      )}

      {/* Checkout button */}
      <button
        disabled={isCheckoutDisabled}
        className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
