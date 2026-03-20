'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import SearchInput from './SearchInput';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems, resetCart, openDrawer } = useCart();

  const handleSignOut = () => {
    resetCart(); // clear Redux state so badge resets to 0 instantly
    signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold tracking-tight text-gray-900"
      >
        ShopEase
      </Link>

      {/* Search — hidden on mobile */}
      <div className="mx-10 hidden flex-1 md:flex">
        <SearchInput />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Cart icon with live badge from Redux */}
        <button
          onClick={openDrawer}
          className="relative rounded-xl p-2 transition hover:bg-gray-100"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5 text-gray-700" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>

        {session ? (
          <button
            onClick={handleSignOut}
            className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:block"
          >
            Sign Out
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="hidden rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:block"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
