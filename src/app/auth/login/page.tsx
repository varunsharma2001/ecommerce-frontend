import LoginForm from '@/components/auth/login/LoginForm';

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
        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
