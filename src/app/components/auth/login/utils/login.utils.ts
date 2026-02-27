import { LoginFormValues } from '@/app/types/auth.types';
import * as Yup from 'yup';

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
