import api from '@/app/utils/api';
import { LoginPayload, RegisterPayload } from '@/app/types/auth.types';

export const registerUser = async (payload: RegisterPayload) => {
  const { data } = await api.post('/users/register', payload, {
    withCredentials: true,
  });
  return data;
};

export const loginUser = async (payload: LoginPayload) => {
  const { data } = await api.post('/users/login', payload, {
    withCredentials: true,
  });
  return data;
};
export const logoutUser = async () => {
  const { data } = await api.post(
    '/users/logout',
    {},
    { withCredentials: true }
  );
  return data;
};
