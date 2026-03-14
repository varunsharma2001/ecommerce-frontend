// ─── Product Image ────────────────────────────────────────────────────────────
export interface ProductImage {
  url: string;
  public_id: string;
}

// ─── Product Variant ─────────────────────────────────────────────────────────
// The purchasable unit. Products are for display; variants are what gets
// added to the cart. `attributes` is a key-value Map (e.g. { color: 'Red', size: 'M' }).
export interface ProductVariant {
  _id: string;
  sku: string;
  price: number;
  discountedPrice?: number; // sale price — must be <= price
  stock: number;
  attributes: Record<string, string>; // { "color": "Red", "size": "M" }
  isActive: boolean;
}

// ─── Category (populated or raw ref) ─────────────────────────────────────────
export interface PopulatedCategory {
  _id: string;
  name: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
// Display entity on PLP and PDP. Contains multiple purchasable variants.
export interface Product {
  _id: string;
  title: string;
  description: string;
  brand?: string;
  categoryId: string | PopulatedCategory; // populated in API responses
  images: ProductImage[];
  rating: number;
  totalSold: number;
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ProductsApiResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Query Params ─────────────────────────────────────────────────────────────
export type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface ProductQueryParams {
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: SortOption;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Returns the category name regardless of whether categoryId is populated */
export function getCategoryName(product: Product): string {
  if (typeof product.categoryId === 'object' && product.categoryId !== null) {
    return product.categoryId.name;
  }
  return '';
}

/** Returns the cheapest active variant (default for PLP card display) */
export function getDefaultVariant(
  product: Product
): ProductVariant | undefined {
  const active = product.variants.filter((v) => v.isActive && v.stock > 0);
  if (active.length === 0) return product.variants[0]; // fallback to first even if OOS
  return active.reduce((min, v) => (v.price < min.price ? v : min), active[0]);
}

/** Returns unique attribute keys across all variants (e.g. ['color', 'size']) */
export function getVariantAttributeKeys(variants: ProductVariant[]): string[] {
  const keys = new Set<string>();
  variants.forEach((v) =>
    Object.keys(v.attributes).forEach((k) => keys.add(k))
  );
  return Array.from(keys);
}
