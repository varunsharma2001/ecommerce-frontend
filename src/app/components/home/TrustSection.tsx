const TrustSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="grid gap-6 text-center sm:grid-cols-3">
        {[
          { title: 'Fast Delivery', desc: 'Get products in 2–3 days' },
          { title: 'Trusted Brands', desc: 'Only verified sellers' },
          { title: 'Secure Payments', desc: '100% safe checkout' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border bg-white p-6">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
export default TrustSection;
