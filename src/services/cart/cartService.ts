// Cart API is protected — axios interceptor attaches the Bearer token automatically
// (client-side only, which is correct since all cart actions require user interaction)

import api from '@/app/utils/api';
import type { CartApiResponse } from '@/types/cart.types';
import { ApiResponse } from '@/types/apiResponse.types';

export async function fetchCart(): Promise<ApiResponse<CartApiResponse>> {
  const { data } = await api.get<ApiResponse<CartApiResponse>>('/cart');
  return data;
}

export async function addToCartApi(
  variantId: string,
  quantity: number
): Promise<ApiResponse<CartApiResponse>> {
  const { data } = await api.post<ApiResponse<CartApiResponse>>('/cart/add', {
    variantId,
    quantity,
  });
  return data;
}

export async function removeFromCartApi(
  variantId: string
): Promise<ApiResponse<CartApiResponse>> {
  const { data } = await api.delete<ApiResponse<CartApiResponse>>(
    `cart/remove/${variantId}`
  );
  return data;
}

export async function updateCartQuantityApi(
  variantId: string,
  quantity: number
): Promise<ApiResponse<CartApiResponse>> {
  const { data } = await api.patch<ApiResponse<CartApiResponse>>(
    `/cart/update`,
    { variantId, quantity }
  );
  return data;
}
