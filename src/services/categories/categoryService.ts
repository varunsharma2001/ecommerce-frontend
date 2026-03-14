import api from '@/app/utils/api';
import { ApiResponse } from '@/types/apiResponse.types';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<ApiResponse<Category[]>>('/admin/categories');
  return res.data.data;
}
