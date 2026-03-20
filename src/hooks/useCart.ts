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
  resetCartState,
  openCart,
  closeCart,
} from '@/app/redux/slices/cart.slice';
import { showError } from '@/utils/toast';
import type { CartApiVariant, CartApiProduct } from '@/types/cart.types';

export function useCart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, pricing, isLoading, error, isOpen } = useSelector(
    (state: RootState) => state.cart
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Called on cart open to fetch fresh data from server
  const hydrateCart = useCallback(() => {
    dispatch(loadCart());
  }, [dispatch]);

  // Optimistic add → API call → rollback on failure
  const addToCart = useCallback(
    async (
      variantId: string,
      quantity: number,
      product: CartApiProduct,
      variant: CartApiVariant
    ) => {
      // 1. Optimistic: update Redux immediately so UI reacts before API responds
      dispatch(
        optimisticAdd({
          variantId,
          quantity,
          unavailable: false,
          product,
          variant,
        })
      );

      // 2. Await real API — fulfilled overwrites optimistic state with server truth
      const result = await dispatch(addItemToCart({ variantId, quantity }));

      // 3. Rollback: if API failed, refetch server cart to remove the ghost item
      if (addItemToCart.rejected.match(result)) {
        dispatch(loadCart());
        showError(
          result.error.message ?? 'Failed to add item. Please try again.'
        );
      }
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

  // LOCAL reset — only call after checkout or on sign out
  const resetCart = useCallback(() => {
    dispatch(resetCartState());
  }, [dispatch]);

  const openDrawer = useCallback(() => {
    dispatch(openCart());
  }, [dispatch]);

  const closeDrawer = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  return {
    items,
    pricing,
    totalItems,
    isLoading,
    error,
    isOpen,
    hydrateCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    resetCart,
    openDrawer,
    closeDrawer,
  };
}
