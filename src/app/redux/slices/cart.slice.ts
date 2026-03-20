import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartApiResponse, CartItem } from '@/types/cart.types';
import {
  fetchCart,
  addToCartApi,
  removeFromCartApi,
  updateCartQuantityApi,
} from '@/services/cart/cartService';
import { ApiResponse } from '@/types/apiResponse.types';

// ─── Helper: map API response → Redux CartItem[] ──────────────────────────────
function mapApiItemsToCartItems(
  response: ApiResponse<CartApiResponse>
): CartItem[] {
  if (!response?.data) return [];
  const { items } = response.data;
  const validItems = response?.data?.items;
  return items.map((item) => ({
    unavailable: item?.unavailable ?? false,
    variantId: item.variantId,
    quantity: item.quantity,
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
  pricing: {
    payableAmount: 0,
    totalSavings: 0,
    originalTotal: 0,
  },
  isLoading: false,
  error: null,
  isOpen: false,
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

    // LOCAL reset only — does NOT call any API.
    // Valid use cases:
    //   1. After successful checkout — backend cleared the cart, sync Redux to match
    //   2. On sign out — session is gone, wipe client state
    resetCartState(state) {
      state.items = [];
      state.pricing = { originalTotal: 0, payableAmount: 0, totalSavings: 0 };
      state.error = null;
    },

    openCart(state) {
      state.isOpen = true;
    },

    closeCart(state) {
      state.isOpen = false;
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
        state.pricing = action.payload.data.pricing;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Failed to load cart';
      });

    // ── addItemToCart — sync Redux with confirmed server state ─────────────
    builder
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = mapApiItemsToCartItems(action.payload);
        state.pricing = action.payload.data.pricing;
        state.error = null;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to add item';
      });

    // ── removeItemFromCart ─────────────────────────────────────────────────
    builder
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.items = mapApiItemsToCartItems(action.payload);
        state.pricing = action.payload.data.pricing;
        state.error = null;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to remove item';
      });

    // ── updateItemQuantity ─────────────────────────────────────────────────
    builder
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        state.items = mapApiItemsToCartItems(action.payload);
        state.pricing = action.payload.data.pricing;
        state.error = null;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to update quantity';
      });
  },
});

export const { optimisticAdd, resetCartState, openCart, closeCart } =
  cartSlice.actions;
export default cartSlice.reducer;
