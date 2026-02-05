import { useState } from 'react';
import { registerUser } from '@/app/services/auth/authService';
import { RegisterPayload } from '@/app/types/auth';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/app/utils/toast';

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleRegister = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      await registerUser(payload);
      showSuccess('Registered successfully 🎉', 3000);
      router.push('/login');
    } catch (error: any) {
      showError(
        error?.response?.data?.message || 'Something went wrong ❌',
        5000
      );
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
