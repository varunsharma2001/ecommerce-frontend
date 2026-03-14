import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/config/auth_options.config';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import DealsSection from '@/components/home/DealsSection';
import TrustSection from '@/components/home/TrustSection';
import { ProductGridSkeleton } from '@/components/plp/ProductGridSkeleton';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/login');

  return (
    <div className="space-y-20">
      <HeroBanner />

      {/*
        Suspense: FeaturedProducts is an async RSC that calls fetchProducts.
        While it fetches, the skeleton streams in immediately so the user sees
        the page layout — not a blank section. The rest of the page (Deals,
        Trust) renders without waiting for products to load.
      */}
      <Suspense
        fallback={
          <section className="mx-auto max-w-7xl px-6">
            <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
            <ProductGridSkeleton />
          </section>
        }
      >
        <FeaturedProducts />
      </Suspense>

      <DealsSection />
      <TrustSection />
    </div>
  );
}
