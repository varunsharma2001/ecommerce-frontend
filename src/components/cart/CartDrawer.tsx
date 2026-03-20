'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import CartItemCard from './CartItemCard';
import PricingSummary from './PricingSummary';

export default function CartDrawer() {
  const { items, pricing, isLoading, isOpen, closeDrawer } = useCart();

  const isEmpty = items.length === 0;
  const hasUnavailableItems = items.some((item) => item.unavailable);

  // ESC key closes the drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDrawer]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  console.log('#39', items);
  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Your Cart{' '}
            {items.length > 0 && (
              <span className="font-normal text-gray-500">
                ({items.length})
              </span>
            )}
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Loading spinner — only when first-loading with no items yet */}
          {isLoading && isEmpty ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
            </div>
          ) : isEmpty ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  Your cart is empty
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Looks like you haven&apos;t added anything yet.
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            /* Items list */
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.variantId}>
                  <CartItemCard item={item} />
                </li>
              ))}
            </ul>
          )}

          {/* Pricing summary — always shown when cart has items */}
          {!isEmpty && (
            <PricingSummary
              pricing={pricing}
              hasUnavailableItems={hasUnavailableItems}
              isEmpty={isEmpty}
            />
          )}
        </div>
      </div>
    </>
  );
}
