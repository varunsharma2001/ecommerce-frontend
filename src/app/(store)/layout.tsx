import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartHydrator from '@/components/layout/CartHydrator';
import './../globals.css';
import { Suspense } from 'react';

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Fetches GET /cart once on mount to hydrate Redux (Navbar badge count) */}
      <CartHydrator />
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </>
  );
}
