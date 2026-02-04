import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-14">
        {/* Top Section */}
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Brand */}
          <div className="max-w-sm space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Doppio Store
            </h2>
            <p className="text-sm leading-6 text-gray-600">
              A modern ecommerce platform built for premium shopping
              experiences, trusted products, and fast delivery.
            </p>
          </div>

          {/* Links Section */}
          <div className="grid w-full grid-cols-2 gap-10 sm:grid-cols-3 lg:w-auto">
            {/* Shop */}
            <div>
              <p className="text-sm font-semibold text-gray-900">Shop</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/products" className="hover:text-gray-900">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/deals" className="hover:text-gray-900">
                    Deals & Offers
                  </Link>
                </li>
                <li>
                  <Link href="/new-arrivals" className="hover:text-gray-900">
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-sm font-semibold text-gray-900">Company</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-gray-900">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-gray-900">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-sm font-semibold text-gray-900">Support</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/support" className="hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gray-900">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Doppio Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
