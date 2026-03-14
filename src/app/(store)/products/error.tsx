'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Products Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <h2 className="text-xl font-semibold text-gray-800">
        Something went wrong
      </h2>
      <p className="max-w-sm text-sm text-gray-500">
        We couldn&apos;t load the products page. This might be a temporary
        issue.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
