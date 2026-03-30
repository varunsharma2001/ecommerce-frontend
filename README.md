# ShopEase — E-Commerce Frontend

Production-grade e-commerce application built with Next.js 15, TypeScript, Redux Toolkit, and TanStack Query.

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## High-Level Design

### 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                        │
│                                                                 │
│   ┌───────────────┐   ┌──────────────┐   ┌─────────────────┐  │
│   │  Redux Store  │   │ TanStack     │   │  NextAuth       │  │
│   │  (Cart State) │   │ Query Cache  │   │  Session        │  │
│   └───────────────┘   └──────────────┘   └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │  HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER (Edge/Node)                  │
│                                                                 │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐  │
│   │  RSC Pages   │   │  API Routes  │   │  generateMetadata│  │
│   │  (SSR/SSG)   │   │  (/api/auth) │   │  (SEO)           │  │
│   └──────────────┘   └──────────────┘   └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │  REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND API (Express)                     │
│                                                                 │
│   /auth          /products        /cart        /admin/categories│
│   (public)       (public)         (protected)  (public)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │    MongoDB       │
                    │  (Users,Products │
                    │   Cart, Orders)  │
                    └─────────────────┘
```

---

### 2. Frontend Architecture — Layer Separation

```
src/
├── app/                    ← ROUTING ONLY (Next.js App Router)
│   ├── (store)/            ← Route group (shared layout: Header + CartDrawer)
│   │   ├── page.tsx        ← Home (RSC)
│   │   ├── products/
│   │   │   ├── page.tsx    ← PLP (RSC + server data fetch)
│   │   │   └── [id]/
│   │   │       └── page.tsx← PDP (RSC + generateMetadata)
│   ├── auth/               ← Login / Register pages
│   ├── api/auth/           ← NextAuth route handler
│   ├── redux/              ← Store + Slices
│   └── layout.tsx          ← Root providers
│
├── components/             ← UI Components (no routing concern)
├── services/               ← All API calls (pure functions)
├── hooks/                  ← Reusable stateful logic
├── types/                  ← TypeScript contracts (source of truth)
└── utils/                  ← Pure helpers (format, toast)
```

> **Design principle:** `app/` knows about routing. `components/` knows nothing about routing. `services/` knows nothing about React.

---

### 3. Rendering Strategy — What Runs Where

```
Request: GET /products/abc123
                │
                ▼
┌──────────────────────────────────────────┐
│         SERVER (RSC)                     │
│                                          │
│  1. generateMetadata() → SEO tags        │
│  2. fetchProductById(id) → product data  │
│  3. Render static HTML:                  │
│     - Title, description, brand          │
│     - Rating stars                       │
│     - Breadcrumb                         │
│                                          │
│  Ships HTML + JS chunk references        │
└──────────────────────────────────────────┘
                │
                │ <Suspense fallback={<Skeleton />}>
                ▼
┌──────────────────────────────────────────┐
│         CLIENT ISLANDS (hydrate)         │
│                                          │
│  ProductGallery     ← image slider       │
│  VariantSelector    ← attribute buttons  │
│  AddToCartSection   ← useOptimistic      │
│                                          │
│  Dynamically imported — split into       │
│  separate JS chunks                      │
└──────────────────────────────────────────┘
```

| Page        | Strategy             | Why                                                  |
| ----------- | -------------------- | ---------------------------------------------------- |
| Home        | RSC                  | No user-specific content above fold                  |
| PLP         | RSC + Client filters | Products server-fetched, filters interactive         |
| PDP         | RSC + Client islands | Static info instant, cart interaction hydrates after |
| Cart Drawer | Client only          | Fully dynamic, user-specific                         |

---

### 4. Data Flow — Add to Cart

```
User clicks "Add to Cart"
        │
        ▼
AddToCartSection.handleAddToCart()
        │
        ├──► addOptimistic(qty)          ← INSTANT UI update (useOptimistic)
        │    Button shows "2 in cart"
        │    Navbar badge updates
        │
        └──► dispatch(addItemToCart)     ← Background async thunk
                    │
                    ├── POST /cart/add   ← cartService.addToCartApi()
                    │
                    ├── SUCCESS:
                    │   Redux ← API response (real state syncs)
                    │   pricing updated
                    │
                    └── FAILURE:
                        dispatch(loadCart())  ← GET /cart to restore real state
                        optimistic UI reverts automatically
```

---

### 5. Cart State Architecture

```
Redux Store: CartState
┌────────────────────────────────────────────┐
│  items: CartItem[]                          │
│  pricing: { originalTotal,                  │
│             payableAmount, totalSavings }   │
│  isLoading: boolean                         │
│  error: string | null                       │
│  isOpen: boolean  ◄── drawer open/close     │
└────────────────────────────────────────────┘
        ▲                          ▲
        │                          │
   Navbar.tsx                CartDrawer.tsx
   (opens drawer)             (closes drawer,
   (shows badge)               reads items)
```

**Why Redux for cart?**

- Navbar and CartDrawer have no common parent component
- Cart state needed in 4+ unrelated components
- Optimistic updates need to be revertable
- `isOpen` must be shared across the entire tree

---

### 6. Authentication Flow

```
User submits Login Form
        │
        ▼
signIn('credentials', { email, password })   ← NextAuth client
        │
        ▼
NextAuth /api/auth/[...nextauth]              ← Server route
        │
        ▼
authorize() → POST /auth/login → backend
        │
        ├── SUCCESS: returns { user, token }
        │   JWT session created, httpOnly cookie set
        │
        └── FAILURE: throw Error → Formik shows message

Protected API calls:
  RSC pages  → getServerSession() → pass token as arg
  Client     → axios interceptor → getSession() → Bearer token
```

---

### 7. PLP → PDP Data Contract

```
PLP (GET /products)          PDP (GET /products/:id)
─────────────────────        ────────────────────────
ProductListItem              Product
  _id                          _id
  title                        title
  brand?                       description
  image (string URL)           brand?
  rating                       categoryId (populated)
  totalSold                    images: ProductImage[]
  minPrice      ◄──────────    rating
  originalPrice  backend       totalSold
  discountPercent pre-computes variants: ProductVariant[]
```

> **Key decision:** PLP never receives variants. Backend pre-computes all price display fields. Keeps PLP payload ~70% smaller.

---

### 8. Component Hierarchy

```
app/(store)/layout.tsx
├── CartHydrator              ← useEffect → GET /cart on mount
├── Header
│   ├── Navbar                ← session, cart badge, openDrawer
│   ├── CategoryBar           ← TanStack Query (10min cache)
│   └── SearchInput           ← useTransition, router.push
├── main
│   └── {page}
│       ├── Home
│       │   ├── HeroBanner (RSC)
│       │   └── FeaturedProducts (async RSC)
│       ├── PLP
│       │   ├── ProductFilters (client)
│       │   └── ProductGrid (async RSC) → ProductCard × N (RSC)
│       └── PDP
│           ├── ProductGallery (client, dynamic import)
│           └── VariantSelectorWrapper (client, dynamic import)
│               ├── VariantSelector
│               └── AddToCartSection
└── CartDrawer                ← isOpen from Redux
    ├── CartItemCard × N      ← React.memo
    ├── QuantityControl       ← React.memo
    └── PricingSummary
```

---

### 9. Performance Decisions

| Technique                 | Where                         | Problem It Solves                                  |
| ------------------------- | ----------------------------- | -------------------------------------------------- |
| RSC                       | PLP, PDP, Home                | Zero client JS for static content                  |
| `next/dynamic`            | PDP islands                   | Heavy components don't block initial paint         |
| `<Suspense>`              | PDP, PLP                      | Progressive streaming, no full-page spinner        |
| `useOptimistic`           | AddToCartSection              | No lag on "Add to Cart" on slow networks           |
| `useMemo`                 | VariantSelector               | Variant computation doesn't re-run on every render |
| `React.memo`              | CartItemCard, QuantityControl | Cart list doesn't re-render unchanged items        |
| `useTransition`           | CategoryBar, SearchInput      | Filter clicks don't block UI                       |
| TanStack Query            | CategoryBar                   | Categories cached 10min, survive navigation        |
| Cart fetch on drawer open | CartDrawer                    | Solves stale-tab problem without polling           |

---

### 10. API Response Contract

All backend responses follow a single envelope:

```ts
ApiResponse<T> {
  success: boolean
  message: string
  data: T
  statusCode: number
}
```

Services unwrap this — components never see the envelope. If the backend changes the envelope shape, only the service layer needs updating.
