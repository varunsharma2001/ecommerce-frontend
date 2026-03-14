const TRUST_ITEMS = [
  { title: 'Fast Delivery', desc: 'Get products delivered in 2–3 days' },
  { title: 'Trusted Brands', desc: 'Only verified and quality sellers' },
  { title: 'Secure Payments', desc: '100% safe and encrypted checkout' },
];

export default function TrustSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="grid gap-6 text-center sm:grid-cols-3">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
