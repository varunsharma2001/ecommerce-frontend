export default function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Featured Products
        </h2>
        <button className="text-sm font-medium text-gray-600 hover:text-black">
          View All →
        </button>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-2xl border bg-white p-4 transition hover:shadow-md"
          >
            <div className="h-44 rounded-xl bg-gray-100" />
            <h3 className="mt-4 font-medium text-gray-900">Premium Product</h3>
            <p className="mt-1 text-sm text-gray-600">₹1,499</p>
            <button className="mt-4 w-full rounded-xl bg-gray-900 py-2 text-sm text-white hover:bg-gray-800">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
