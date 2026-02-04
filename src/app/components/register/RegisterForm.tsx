'use client';
import { Formik } from 'formik';
import {
  registerInitialValues,
  RegisterSchema,
} from '@/app/components/register/utils/register.utils';

const RegisterForm = () => (
  <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
    {/* Heading */}
    <h1 className="text-2xl font-bold text-gray-900">Create your account ✨</h1>
    <p className="mt-2 text-sm text-gray-600">
      Join us and start shopping smarter today.
    </p>

    {/* Formik Form */}
    <Formik
      initialValues={registerInitialValues}
      validationSchema={RegisterSchema}
      onSubmit={(values) => {
        console.log('Register Payload:', values);

        // ✅ Backend Payload Ready
        /*
                          {
                            email: values.email,
                            password: values.password,
                            username: values.username,
                            fullName: values.fullName
                          }
                        */
      }}
    >
      {({
        values,
        errors,
        touched,
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
              placeholder="Frame"
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
              placeholder="Frame@Doppio"
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
              placeholder="Frame@gmail.com"
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
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:outline-none"
            />
            {touched.password && errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-black hover:underline">
              Login
            </a>
          </p>
        </form>
      )}
    </Formik>
  </div>
);
export default RegisterForm;
