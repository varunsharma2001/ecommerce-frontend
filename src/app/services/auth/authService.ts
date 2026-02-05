import api from '@/app/utils/api';
import { RegisterPayload } from '@/app/types/auth';

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post('/users/register', payload, {
    withCredentials: true,
  });
  return data;
};

export const loginUser = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials, {
    withCredentials: true,
  });
  return data;
};
export const logoutUser = async () => {
  const { data } = await api.post(
    '/auth/logout',
    {},
    { withCredentials: true }
  );
  return data;
};
