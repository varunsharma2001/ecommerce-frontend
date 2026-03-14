'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { registerUser } from '@/services/auth/authService';
import { showError, showSuccess } from '@/utils/toast';
import type { RegisterPayload } from '@/types/auth.types';

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      'Something went wrong'
    );
  }
  return 'Something went wrong';
};

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      await registerUser(payload);
      showSuccess('Registered successfully 🎉', 3000);
      router.push('/auth/login');
    } catch (error: unknown) {
      showError(getErrorMessage(error), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleRegister, isLoading };
};

export default useRegister;
