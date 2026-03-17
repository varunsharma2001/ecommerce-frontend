// Cart API is protected — axios interceptor attaches the Bearer token automatically
// (client-side only, which is correct since all cart actions require user interaction)

import api from '@/app/utils/api';
import type { CartApiResponse } from '@/types/cart.types';

export async function fetchCart(): Promise<CartApiResponse> {
  const { data } = await api.get<CartApiResponse>('/cart');
  return data;
}

export async function addToCartApi(
  variantId: string,
  quantity: number
): Promise<CartApiResponse> {
  const { data } = await api.post<CartApiResponse>('/cart/add', {
    variantId,
    quantity,
  });
  return data;
}

export async function removeFromCartApi(
  variantId: string
): Promise<CartApiResponse> {
  const { data } = await api.delete<CartApiResponse>(`/cart/item/${variantId}`);
  return data;
}

export async function updateCartQuantityApi(
  variantId: string,
  quantity: number
): Promise<CartApiResponse> {
  const { data } = await api.patch<CartApiResponse>(`/cart/item/${variantId}`, {
    quantity,
  });
  return data;
}
