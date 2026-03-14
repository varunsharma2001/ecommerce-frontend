import * as Yup from 'yup';
import type { LoginFormValues } from '@/types/auth.types';

export const loginInitialValues: LoginFormValues = {
  email: '',
  password: '',
};

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
