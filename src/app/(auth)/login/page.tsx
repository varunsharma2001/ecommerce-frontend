const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back 👋</h1>
        <p className="mt-2 text-sm text-gray-600">
          Login to your account to continue shopping.
        </p>

        {/* Form */}
        <form className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-black focus:ring-2 focus:ring-black focus:outline-none"
            />
          </div>

          {/* Forgot Password */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-black py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full rounded-xl border border-gray-300 py-3 text-sm font-medium transition hover:bg-gray-50"
          >
            Continue with Google
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <a
              href="/register"
              className="font-medium text-black hover:underline"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
