import type { ProductImage } from './product.types';

// ─── API response shapes (matches your backend's cart item transform) ──────────

export interface CartApiProduct {
  _id: string;
  title: string;
  images: ProductImage[];
}

export interface CartApiVariant {
  _id: string;
  attributes: Record<string, string>; // Map<string, string> e.g. { color: 'Red', size: 'M' }
  price: number;
  discountedPrice?: number;
  stock: number;
  sku: string;
  totalSold?: number;
  isActive?: boolean;
}

// Shape of each item returned by GET /cart (after backend's transform)
export interface CartApiItem {
  _id: string; // cart item document id
  variantId: string; // raw ObjectId reference
  quantity: number;
  priceAtThatTime: number; // price snapshot at time of adding
  product: CartApiProduct;
  variant: CartApiVariant;
}

export interface CartApiResponse {
  _id: string;
  userId: string;
  items: CartApiItem[];
  totalPrice: number;
}

// ─── Redux store shape ────────────────────────────────────────────────────────
// Mirrors CartApiItem closely so we can hydrate directly from the API response.

export interface CartItem {
  cartItemId: string; // _id of the cart document item
  variantId: string;
  quantity: number;
  priceAtThatTime: number;
  product: CartApiProduct;
  variant: CartApiVariant;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  isLoading: boolean; // true while GET /cart is in-flight on app load
  error: string | null;
}
