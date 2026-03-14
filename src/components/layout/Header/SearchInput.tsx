'use client';

/**
 * useTransition: marks the router.push as a non-urgent update.
 * While Next.js fetches the new search results page, the current page
 * stays interactive (no freeze). The `isPending` flag lets us show a
 * subtle loading indicator on the search icon without blocking the input.
 */

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('search') ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set('search', value.trim());
      } else {
        params.delete('search');
      }
      params.delete('page'); // reset to page 1 on new search
      router.push(`/products?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for products..."
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm transition focus:bg-white focus:ring-2 focus:ring-black focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-700"
      >
        <Search
          className={`h-4 w-4 transition ${isPending ? 'opacity-40' : ''}`}
        />
      </button>
    </form>
  );
}
