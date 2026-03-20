import type { ProductImage } from './product.types';

// ─── API response shapes (matches your backend's cart item transform) ──────────

export interface CartApiProduct {
  _id: string;
  title: string;
  images?: ProductImage[];
  brand?: string;
}

export interface CartApiVariant {
  _id: string;
  attributes: Record<string, string>; // Map<string, string> e.g. { color: 'Red', size: 'M' }
  price: number;
  discountedPrice?: number;
  discountedPercentage?: number;
  stock: number;
  images?: ProductImage[];
}

// Shape of each item returned by GET /cart (after backend's transform)
export interface CartApiItem {
  variantId: string;
  quantity: number;
  unavailable: boolean;
  product: CartApiProduct;
  variant: CartApiVariant;
}

export interface CartApiResponse {
  items: CartApiItem[];
  pricing: {
    originalTotal: number;
    payableAmount: number;
    totalSavings: number;
  };
}

// ─── Redux store shape ────────────────────────────────────────────────────────
// Mirrors CartApiItem closely so we can hydrate directly from the API response.

export interface CartItem {
  variantId: string;
  quantity: number;
  product: CartApiProduct;
  variant: CartApiVariant;
  unavailable: boolean;
}

export interface CartState {
  items: CartItem[];
  pricing: {
    originalTotal: number;
    payableAmount: number;
    totalSavings: number;
  };
  isLoading: boolean; // true while GET /cart is in-flight on app load
  error: string | null;
  isOpen: boolean;
}
