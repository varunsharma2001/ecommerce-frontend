import Link from 'next/link';

// Pure server component — no JS sent to browser for this section
export default function HeroBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10">
      <div className="rounded-3xl bg-gradient-to-r from-gray-900 to-gray-700 p-12 text-center text-white">
        <h1 className="text-4xl leading-tight font-bold">
          Premium Shopping Experience
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-200">
          Trusted products, fast delivery, and exclusive deals — only on
          ShopEase.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-medium text-gray-900 transition hover:bg-gray-100"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
