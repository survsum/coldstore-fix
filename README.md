# Cold Dog — Hot Deals E-Commerce (Next.js 14)

A full-stack, production-grade dropshipping store built with Next.js 14 App Router, Prisma + SQLite, Framer Motion, Tailwind CSS, NextAuth, and **Razorpay** payments.

---

## ✨ Features

### Storefront
- **Homepage** — Parallax hero, featured products, category banners, trust badges
- **Products Page** — Grid, category + price filters, sort, Suspense loading skeletons
- **Product Detail** — Image, description, quantity selector, add-to-cart, related products
- **Cart** — Zustand-powered slide-in drawer + dedicated `/cart` page
- **Checkout** — 2-step flow: Details → Razorpay modal (UPI / Card / NetBanking / Wallet)
- **Order Success** — Confirmation screen with Payment ID and Order ID

### Admin Dashboard (`/admin`)
- **Login** — Secure NextAuth credential login
- **Dashboard** — Stats: products, orders, revenue, avg. order value + recent orders
- **Products** — Full CRUD: add / edit / delete with live image URL preview
- **Orders** — Expandable rows showing items, address, total, payment status

### Tech Stack
- **Next.js 14** App Router (server + client components)
- **Prisma + SQLite** — zero-config file-based DB
- **Razorpay** — UPI, Credit/Debit Card, Net Banking, Wallets (INR)
- **Framer Motion** — page transitions, cart drawer spring animation, hover effects
- **Zustand** with `persist` — cart state survives page refreshes
- **NextAuth** — JWT credential auth for admin
- **next-themes** — dark / light mode
- **Tailwind CSS** — utility-first with CSS custom property theming
- Fonts: **Cormorant Garamond** (display) + **DM Sans** (body)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+

### 1. Install
```bash
npm install
```

### 2. Environment Variables
The `.env` file is pre-configured for local dev. Update Razorpay keys (see below):
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key-change-in-production-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXX"
RAZORPAY_KEY_SECRET="XXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXX"
```

### 3. Database
```bash
npm run db:push   # create tables
npm run db:seed   # seed 8 sample products + admin user
```

### 4. Run
```bash
npm run dev
```

Open **http://localhost:3000**

---

## 🔑 Admin Access

| URL | `/admin` |
|-----|----------|
| Email | `admin@store.com` |
| Password | `admin123` |

---

## 💳 Razorpay Setup (2 minutes)

1. Sign up at [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Go to **Settings → API Keys → Generate Test Key**
3. Copy both keys into `.env`

### Test Credentials
| Method | Details |
|--------|---------|
| UPI | `success@razorpay` |
| Card | `4111 1111 1111 1111` · Any expiry · Any CVV |
| Net Banking | Select any bank in test mode |

### Payment Flow
```
Fill details → Continue to Payment
→ Click "Pay with Razorpay"
→ Server creates Razorpay order (POST /api/razorpay/create-order)
→ Razorpay modal opens (UPI / Card / NetBanking / Wallet)
→ User completes payment
→ Server verifies HMAC signature (POST /api/razorpay/verify)
→ Order saved to DB with status: "paid"
→ Success screen with Payment ID + Order ID
```

---

## 📁 Project Structure

```
dropship-store/
├── app/
│   ├── (shop)/                         # Store routes (Navbar + Footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx               # Server: fetch + Suspense wrapper
│   │   │   ├── ProductsClient.tsx     # Client: filters, grid, router
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── ProductDetailClient.tsx
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx          # 2-step: Details → Razorpay
│   ├── admin/
│   │   ├── layout.tsx                 # Auth guard + sidebar
│   │   ├── login/page.tsx
│   │   ├── dashboard/
│   │   ├── products/                  # Full CRUD modal
│   │   └── orders/                    # Expandable order rows
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/route.ts          # GET (public), POST (admin)
│   │   ├── products/[id]/route.ts     # GET, PUT, DELETE
│   │   ├── orders/route.ts            # POST (public), GET (admin)
│   │   ├── razorpay/create-order/route.ts  # Creates Razorpay order
│   │   └── razorpay/verify/route.ts        # HMAC verification + DB save
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── layout/   Navbar, Footer, Hero, Providers, ValueProps, CategoryBanner
│   ├── product/  ProductCard, FeaturedProducts, ProductCardSkeleton
│   ├── cart/     CartDrawer
│   └── payment/  RazorpayButton
├── hooks/
│   └── useCart.ts          # Zustand store with localStorage persist
├── lib/
│   ├── prisma.ts            # Singleton client
│   ├── auth.ts              # NextAuth options
│   └── utils.ts             # cn(), formatPrice() → INR ₹
├── prisma/
│   ├── schema.prisma        # Product, Order, Admin
│   └── seed.js              # 8 products (INR prices) + admin
└── .env
```

---

## 🗄️ Database Schema

### Product
| Field | Type |
|-------|------|
| id | cuid |
| name | String |
| description | String |
| price | Float (INR) |
| image | String (URL) |
| category | String |
| stock | Int |
| createdAt / updatedAt | DateTime |

### Order
| Field | Type |
|-------|------|
| id | cuid |
| customerName | String |
| email | String |
| address | String |
| items | String (JSON) |
| total | Float (INR) |
| status | `"pending"` \| `"paid"` |
| createdAt | DateTime |

### Admin
| Field | Type |
|-------|------|
| id | cuid |
| email | String (unique) |
| password | String (bcrypt) |

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run db:push` | Apply schema to SQLite |
| `npm run db:studio` | Prisma Studio (visual DB) |
| `npm run db:seed` | Seed demo products + admin |

---

## 🎨 Design System

| Token | Light | Dark |
|-------|-------|------|
| `--bg-primary` | `#fafaf8` | `#0d0d0d` |
| `--bg-secondary` | `#f0ede8` | `#1a1a1a` |
| `--text-primary` | `#0d0d0d` | `#f5f5f0` |
| `--accent` | `#c9973d` | `#d4af7a` |
| `--border` | `#e5e2dc` | `#2a2a2a` |

Fonts: **Cormorant Garamond** (headings/prices) · **DM Sans** (body) · **DM Mono** (code)

---

## 🚢 Production Deployment

### Vercel
```bash
npm i -g vercel && vercel --prod
```
Set all `.env` variables in the Vercel dashboard.

> **For production:** change SQLite to PostgreSQL by updating `prisma/schema.prisma` provider to `postgresql` and setting a `DATABASE_URL` connection string.

---

## 📝 License
MIT
