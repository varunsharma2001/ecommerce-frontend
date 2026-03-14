import Link from 'next/link';

export default function DealsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="rounded-3xl bg-gray-100 p-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Deals of the Week
        </h2>
        <p className="mt-2 text-gray-600">
          Up to 40% off on top-selling items.
        </p>
        <Link
          href="/products?sortBy=price_asc"
          className="mt-5 inline-block rounded-xl bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-800"
        >
          Explore Deals
        </Link>
      </div>
    </section>
  );
}
