'use client';

/**
 * useCart — single interface for all cart operations.
 *
 * Pattern: optimistic update → API call → sync with server response
 *
 * Why optimistic updates?
 * When user clicks "Add to Cart", the Navbar badge and button state update
 * INSTANTLY (via optimisticAdd). The real API call runs in the background.
 * If it fails, the fulfilled/rejected reducer corrects the Redux state.
 * This gives Amazon/Flipkart-level responsiveness even on slow connections.
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/redux/store';
import {
  loadCart,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  optimisticAdd,
  clearCart,
} from '@/app/redux/slices/cart.slice';
import type { CartApiVariant, CartApiProduct } from '@/types/cart.types';

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalPrice, isLoading, error } = useSelector(
    (state: RootState) => state.cart
  );

  // Total item count for the Navbar badge
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Called on app/layout mount to hydrate Redux from the server
  const hydrateCart = useCallback(() => {
    dispatch(loadCart());
  }, [dispatch]);

  // Optimistic add → then sync with API response
  const addToCart = useCallback(
    (
      variantId: string,
      quantity: number,
      product: CartApiProduct,
      variant: CartApiVariant,
      priceAtThatTime: number
    ) => {
      // 1. Optimistic: update Redux immediately so UI reacts before API responds
      dispatch(
        optimisticAdd({
          cartItemId: `optimistic-${variantId}`,
          variantId,
          quantity,
          priceAtThatTime,
          product,
          variant,
        })
      );
      // 2. Real: sync with server; fulfilled handler overwrites optimistic state
      dispatch(addItemToCart({ variantId, quantity }));
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (variantId: string) => {
      dispatch(removeItemFromCart(variantId));
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) => {
      dispatch(updateItemQuantity({ variantId, quantity }));
    },
    [dispatch]
  );

  const emptyCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return {
    items,
    totalItems,
    totalPrice,
    isLoading,
    error,
    hydrateCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    emptyCart,
  };
}
