'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { loginInitialValues, LoginSchema } from './login.utils';
import { showError, showSuccess } from '@/utils/toast';
import type { LoginFormValues } from '@/types/auth.types';

const LoginForm = () => {
  const router = useRouter();

  const handleSubmit = async (values: LoginFormValues) => {
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res?.ok) {
      showSuccess('Logged in successfully 👋');
      await router.push('/');
    } else {
      showError(res?.error || 'Login failed', 5000);
    }
  };

  return (
    <Formik
      initialValues={loginInitialValues}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Field
              type="email"
              name="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            <ErrorMessage
              name="email"
              component="p"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Field
              type="password"
              name="password"
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
            <ErrorMessage
              name="password"
              component="p"
              className="mt-1 text-sm text-red-500"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
              Remember me
            </label>
            <button
              type="button"
              className="text-sm font-medium text-black hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full rounded-xl border border-gray-300 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a
              href="/auth/register"
              className="font-medium text-black hover:underline"
            >
              Sign up
            </a>
          </p>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
