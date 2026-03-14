import api from '@/app/utils/api';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/admin/categories');
  return data;
}
