import Link from 'next/link';
import SearchBar from '@/app/components/header/SearchInput';

const Navbar = () => {
  return (
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-gray-900"
      >
        ShopEase
      </Link>

      {/* Search Bar */}
      <div className="mx-10 hidden flex-1 md:flex">
        <SearchBar />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 border">
        {/* Cart */}
        <button className="relative rounded-xl p-2 transition hover:bg-gray-100">
          🛒
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
            2
          </span>
        </button>

        {/* Login Button */}
        <button className="hidden rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:block">
          Login
        </button>
      </div>
    </div>
  );
};
export default Navbar;
