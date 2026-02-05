'use client';
import { Formik } from 'formik';
import {
  registerInitialValues,
  RegisterSchema,
} from '@/app/components/register/utils/register.utils';
import useRegister from '@/app/components/register/hooks/useRegister';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleRegister, isLoading } = useRegister();
  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900">
        Create your account ✨
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Join us and start shopping smarter today.
      </p>

      {/* Formik Form */}
      <Formik
        initialValues={registerInitialValues}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          console.log('Register Payload:', values);
          handleRegister(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          dirty,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter fullname"
                className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
              {touched.fullName && errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your username"
                className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
              {touched.username && errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:outline-none"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="w-full rounded-xl border px-4 py-2.5 pr-12 text-sm focus:ring-2 focus:ring-black focus:outline-none"
                />

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || !dirty || isLoading}
              className="w-full rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-black hover:underline"
              >
                Login
              </a>
            </p>
          </form>
        )}
      </Formik>
    </div>
  );
};
export default RegisterForm;
