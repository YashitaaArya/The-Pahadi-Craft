# Pahadi Craft — Project Runbook (Updated)

Single reference doc for architecture, credentials, directory structure, and the full to-do list. Share this with your collaborator directly — it's written so anyone can pick this project up cold.

---

## 1. What this project is

`thepahadicraft.com` — a full custom e-commerce site. React storefront, Express/MongoDB backend, Razorpay payments, Firebase customer login, Cloudinary images, and a custom RBAC admin dashboard. Not built on Shopify/WordPress/any platform — every part of it is hand-built for this business.

---

## 2. Full directory structure

```
pahadi-craft/
├── backend/
│   ├── config/
│   │   ├── roles.js              # RBAC permission definitions (developer/owner/sales)
│   │   └── categories.js         # Fixed main product categories
│   ├── middleware/
│   │   ├── adminAuth.js          # Verifies admin JWT
│   │   └── requirePermission.js  # Permission-gate factory, used per-route
│   ├── models/
│   │   ├── User.js               # Customers (from Firebase login)
│   │   ├── order.js
│   │   ├── Product.js            # 3-tier categories, color variants, scented/size/volume/capacity
│   │   ├── AdminUser.js          # Admin dashboard logins
│   │   ├── Review.js
│   │   ├── Testimonial.js        # images: string[] - product/purchase photos, not profile pics
│   │   ├── Feedback.js
│   │   ├── Banner.js
│   │   └── Newsletter.js         # Subscriber emails
│   ├── Routes/
│   │   ├── createOrder.js        # Razorpay order creation
│   │   ├── verifyPayment.js      # Razorpay payment verification
│   │   ├── orders.js             # Admin order list + status updates
│   │   ├── user.route.js         # POST /save - customer upsert on every login
│   │   ├── sendNotifications.js  # Twilio SMS/WhatsApp
│   │   ├── products.js           # Public reads, admin-gated writes, /categories, /bulk-import
│   │   ├── admin.js              # Admin login + team (login) management
│   │   ├── adminData.js          # Analytics, customers, testimonials, reviews, feedback, banners
│   │   ├── upload.js             # Cloudinary image upload (admin only)
│   │   └── newsletter.js         # Public subscribe + admin subscriber list
│   ├── scripts/
│   │   └── seed.js               # Creates first admin login + sample products
│   ├── index.js                  # App entry, route mounting, CORS config
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico, favicon-16x16.png, favicon-32x32.png,
│   │   │   apple-touch-icon.png, android-chrome-*.png, site.webmanifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminLayout.tsx       # Sidebar, filtered by permission
│   │   │   │   ├── AdminLogin.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── OrderManager.tsx
│   │   │   │   ├── ProductManager.tsx    # Full product form incl. color variants
│   │   │   │   ├── BulkProductUpload.tsx # Excel/CSV bulk import with row-level error reporting
│   │   │   │   ├── UserManager.tsx       # Customer directory
│   │   │   │   ├── TeamManager.tsx       # Manage admin logins (developer only)
│   │   │   │   ├── TestimonialManager.tsx
│   │   │   │   └── common/               # Toast, Modal, LoadingSkeleton, EmptyState, Cards
│   │   │   ├── Auth.tsx                  # Customer sign up/in/Google
│   │   │   ├── Testimonials.tsx          # Homepage reviews section + "share yours" form
│   │   │   ├── Cart.tsx, Navbar.tsx, Footer.tsx, ProductCard.tsx, etc.
│   │   ├── pages/
│   │   │   ├── Shop.tsx, About.tsx, Checkout.tsx, UserProfile.tsx,
│   │   │   │   Shipping.tsx, Returns.tsx, Faq.tsx, TermsConditions.tsx,
│   │   │   │   PrivacyPolicy.tsx, MaintenancePage.tsx, etc.
│   │   ├── store/  (Zustand)
│   │   │   ├── authStore.ts           # Customer auth, saves to DB on every login
│   │   │   ├── adminAuthStore.ts      # Admin session + permission checks
│   │   │   ├── adminDashboardStore.ts # Products/orders/users/analytics fetch+mutate
│   │   │   ├── cartStore.ts, productStore.ts, wishlistStore.ts
│   │   ├── api/
│   │   │   └── adminApi.ts            # All backend calls (axios instance)
│   │   ├── utils/
│   │   │   ├── driveImage.ts, compressImage.ts   # Client-side image compression
│   │   ├── types.ts                   # All shared TypeScript interfaces
│   │   ├── firebase.ts
│   │   ├── App.tsx                    # Routes, maintenance-mode gate, RequirePermission guard
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   ├── .env.example
│   └── .gitignore
│
└── RUNBOOK.md   ← this file, keep it at repo root
```

---

## 3. Every service this project depends on

| Service | What it's for | Account |
|---|---|---|
| MongoDB Atlas | Database | `pahadicraft@gmail.com` |
| Razorpay | Payments | Migrating from `candlelightduke@gmail.com` → `pahadicraft@gmail.com` |
| Firebase | Customer login | `pahadicraft@gmail.com`, project "Pahadi Craft" |
| Cloudinary | Image hosting | `pahadicraft@gmail.com` |
| Twilio | SMS/WhatsApp notifications | `pahadicraft@gmail.com` |
| Render | Backend hosting | Yashitaa's account |
| Vercel | Frontend hosting | Yashitaa's account |
| GitHub | Code repo | Yashitaa's account + collaborator(s) |
| Hostinger | Domain (thepahadicraft.com) | Yashitaa's account |
| pahadicraft.com (IndiaMART) | Older fallback storefront | Owned by IndiaMART, not us |

---

## 4. RBAC roles

| Role | Access |
|---|---|
| **developer** | Everything, including managing admin logins |
| **owner** | Everything except managing admin logins |
| **sales** | Products + orders only |

Manage logins from the dashboard: **Admin Logins** page (developer only), or via `npm run seed` locally with `ADMIN_EMAIL`/`ADMIN_PASSWORD`/`ADMIN_NAME`/`ADMIN_ROLE` set in `.env`.

---

## 5. Running locally

```bash
# Backend
cd backend && cp .env.example .env   # fill in real values
npm install && npm run seed && npm run dev   # localhost:5000

# Frontend (separate terminal)
cd frontend && cp .env.example .env  # fill in real values
npm install && npm run dev   # localhost:5173
```

Both point at the same production MongoDB Atlas by default (via `MONGO_URI`) — anything you add locally shows up on the real site too.

---

## 6. To-do list (living document — update as things ship)

### ✅ Done
- [x] Unified 3 separate repos into one working system
- [x] Real product database (was previously hardcoded in frontend files)
- [x] Razorpay payment flow verified working
- [x] RBAC: developer / owner / sales roles, enforced backend-side
- [x] Admin Logins management page
- [x] Direct image upload from device → Cloudinary, with automatic compression
- [x] Multi-photo gallery uploads (products + testimonials)
- [x] Maintenance mode with admin bypass (logged-in admins see the real site, public sees coming-soon page)
- [x] Custom favicon (replaced broken external one)
- [x] Testimonials: full CRUD, homepage display, "Read our reviews on Google" link, customer self-submission (pending review)
- [x] Product schema overhaul: 3-tier categories, color variants, scented flag, size/volume/capacity
- [x] Customer accounts now actually save to the database on every login (sign-up, sign-in, Google) — previously Firebase login worked but the database was never touched
- [x] Sign-up form's phone/address fields now actually reach the database (were being silently dropped before)
- [x] Bulk product upload via Excel (.xlsx/.csv) — downloadable template, row-level validation with fix-and-retry error reporting, SKU-based duplicate protection, up to 2000 rows per file
- [x] Newsletter signup fixed — form had no submit handler at all before (decorative only); now saves to a real `Newsletter` collection, with an admin-readable subscriber list for future campaigns

### 🔧 In progress / next up
- [ ] Facebook footer icon links to `href="#"` (dead link); Twitter/X icon is commented out — need real URLs for Facebook, YouTube, WhatsApp, Threads to wire these up properly
- [ ] Dedicated product detail pages (photo gallery, full description, related products, delivery info) — this is also where the color-swatch picker becomes customer-facing
- [ ] Delivery partner integration (Delhivery / Expressbees / BlueDart) + Pay on Delivery option
- [ ] Delivery guidelines, return/refund/exchange policy pages
- [ ] Wishlist / "liked products" + re-engagement recommendations
- [ ] Lifestyle product photography (people using the products) — content/photography task, not code
- [ ] Bulk product upload via Excel spreadsheet, for the sales team (750+ products expected)
- [ ] Occasion-based homepage banners/flyers (Diwali, Christmas, etc.)
- [ ] Hero section: replace single dull image with a 5-6 slide auto-rotating carousel
- [ ] SEO pass: meta tags, page titles/descriptions, sitemap, alt text, Open Graph tags, Search Console setup
- [ ] Content-editor role/access for blogs/about/contact (content team, separate from sales)
- [ ] Reviews/testimonials/feedback/banners admin actions still need the same "actually saves to backend" treatment applied to Orders/Users/Products (approve/reject buttons on Feedback and Reviews sections are still local-state only in places)

### 🔭 Long-term
- [ ] Loyalty/referral points program
- [ ] Import Google Places reviews (needs a paid Google Cloud API key — deferred, using free "link to Google reviews" instead for now)
- [ ] Mobile app (Play Store / App Store), mirroring the website
- [ ] Known: cookies are being stored in the admin user's browser — flagged by collaborator, deferred for later cleanup

---

## 7. Common errors and what they actually mean

| Symptom | Likely cause |
|---|---|
| Server crashes entirely on boot | Something is `throw`-ing at module load instead of inside a route handler |
| CORS error in browser console | Frontend's exact origin isn't in the backend's allowed-origins list — add via `EXTRA_CORS_ORIGIN` in Render |
| `querySrv ENOTFOUND`/`EBADNAME` in Mongo logs | `MONGO_URI` has a typo or leftover placeholder text |
| 401 on admin login | No admin account exists with that email — run `npm run seed` |
| 500 on admin login, for every credential | Code/schema mismatch — check the branch actually deployed on Render matches what you're testing |
| "npm not recognized" / scripts disabled (Windows) | PowerShell execution policy — use Command Prompt, or `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` as admin |
| Vite build fails with "Could not resolve" a file | That file wasn't actually saved at the exact path the import expects |
| Image upload fails with a generic 500 | Usually file size — check Render logs for the real error |

**The one habit that prevents most confusing errors:** check which branch is actually deployed (Render/Vercel Settings) before assuming code is broken.

---

## 8. Who to ask for what

- **Ashish** — GoDaddy/domain DNS, original Razorpay setup
- **Atharv** — original frontend, possibly the original Firebase project
- **Neety mam (owner)** — Razorpay live decisions, business/content sign-off
- **Yashitaa** — full technical ownership