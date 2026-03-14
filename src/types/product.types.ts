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

// ─── PLP Product (lightweight — NO variants) ──────────────────────────────────
// Returned by GET /products.
// Backend pre-computes all price fields internally from active variants.
// Variants are intentionally excluded to keep the listing payload small.
export interface ProductListItem {
  _id: string;
  title: string;
  brand?: string;
  image: string; // primary image URL (first image only)
  rating: number;
  totalSold: number;
  minPrice: number; // lowest discountedPrice (or price) across active variants
  originalPrice: number; // lowest base price across active variants
  discountPercent: number; // pre-calculated on backend
}

// ─── PDP Product (full — includes variants) ───────────────────────────────────
// Returned by GET /products/:id.
// Variants are required here — they are the sellable unit for add-to-cart.
export interface Product {
  _id: string;
  title: string;
  description: string;
  brand?: string;
  categoryId: string | PopulatedCategory;
  images: ProductImage[];
  rating: number;
  totalSold: number;
  variants: ProductVariant[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalElements?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ProductsApiResponse {
  products: ProductListItem[];
  pagination: Pagination;
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

/** Returns unique attribute keys across all variants (e.g. ['color', 'size']) */
export function getVariantAttributeKeys(variants: ProductVariant[]): string[] {
  const keys = new Set<string>();
  variants.forEach((v) =>
    Object.keys(v.attributes).forEach((k) => keys.add(k))
  );
  return Array.from(keys);
}
