import { useState } from 'react';
import { registerUser } from '@/app/services/auth/authService';
import { RegisterPayload } from '@/app/types/auth.types';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/app/utils/toast';
import axios from 'axios';

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ||
      'Something went wrong ❌'
    );
  }
  return 'Something went wrong ❌';
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
  return {
    handleRegister,
    isLoading,
  };
};
export default useRegister;
