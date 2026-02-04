import * as Yup from 'yup';
import { RegisterFormValues } from '@/app/components/register/types/register.types';

export const RegisterSchema = Yup.object({
  fullName: Yup.string().required('Full name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
export const registerInitialValues: RegisterFormValues = {
  fullName: '',
  username: '',
  email: '',
  password: '',
};
