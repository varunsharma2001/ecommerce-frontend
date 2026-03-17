import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartApiResponse, CartItem } from '@/types/cart.types';
import {
  fetchCart,
  addToCartApi,
  removeFromCartApi,
  updateCartQuantityApi,
} from '@/services/cart/cartService';

// ─── Helper: map API response → Redux CartItem[] ──────────────────────────────
function mapApiItemsToCartItems(response: CartApiResponse): CartItem[] {
  if (!response) return [];
  return response.items.map((item) => ({
    cartItemId: item._id,
    variantId: item.variantId,
    quantity: item.quantity,
    priceAtThatTime: item.priceAtThatTime,
    product: item.product,
    variant: item.variant,
  }));
}

// ─── Async Thunks ─────────────────────────────────────────────────────────────
// createAsyncThunk handles pending/fulfilled/rejected states automatically.
// Each thunk returns the updated CartApiResponse so we can sync Redux with server truth.

export const loadCart = createAsyncThunk('cart/load', fetchCart);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  ({ variantId, quantity }: { variantId: string; quantity: number }) =>
    addToCartApi(variantId, quantity)
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItem',
  (variantId: string) => removeFromCartApi(variantId)
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  ({ variantId, quantity }: { variantId: string; quantity: number }) =>
    updateCartQuantityApi(variantId, quantity)
);

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState: CartState = {
  items: [],
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Optimistic update: immediately reflect add in UI before API responds.
    // Why? User clicks "Add to Cart" → badge count jumps instantly (+1) without
    // waiting for the network. If API fails, the fulfilled/rejected handler corrects it.
    optimisticAdd(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) => i.variantId === action.payload.variantId
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    // ── loadCart ──────────────────────────────────────────────────────────────
    builder
      .addCase(loadCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = mapApiItemsToCartItems(action.payload);
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to load cart';
      });

    // ── addItemToCart — sync Redux with confirmed server state ─────────────
    builder
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = mapApiItemsToCartItems(action.payload);
        state.totalPrice = action.payload.totalPrice;
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to add item';
      });

    // ── removeItemFromCart ─────────────────────────────────────────────────
    builder
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = mapApiItemsToCartItems(action.payload);
        state.totalPrice = action.payload.totalPrice;
        state.error = null;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to remove item';
      });

    // ── updateItemQuantity ─────────────────────────────────────────────────
    builder
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.items = mapApiItemsToCartItems(action.payload);
        state.totalPrice = action.payload.totalPrice;
        state.error = null;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update quantity';
      });
  },
});

export const { optimisticAdd, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
