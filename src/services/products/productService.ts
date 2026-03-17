import api from '@/app/utils/api';
import type {
  Product,
  ProductsApiResponse,
  ProductQueryParams,
} from '@/types/product.types';
import { ApiResponse } from '@/types/apiResponse.types';

export async function fetchProducts(
  params: ProductQueryParams = {}
): Promise<ApiResponse<ProductsApiResponse>> {
  const { data } = await api.get<ApiResponse<ProductsApiResponse>>(
    '/products',
    { params }
  );
  return data;
}

export async function fetchProductById(
  id: string
): Promise<ApiResponse<Product>> {
  const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return data;
}
