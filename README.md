# Pahadi Craft — Unified Repo

This repo merges the three previously-separate pieces of thepahadicraft.com into one place:

- **`/frontend`** — the storefront + admin dashboard (React + Vite + TypeScript), based on the more advanced fork that already had the admin dashboard and dynamic product loading wired up.
- **`/backend`** — the Express + MongoDB API. Started from the working Razorpay payment flow, extended with real Product, Admin-login, Orders, Users, Reviews, Testimonials, Feedback, and Banners endpoints so the admin dashboard has real data to talk to.

## What changed from the three original repos

The three pieces were never actually wired together — the storefront read products from hardcoded files, the real backend only handled payments, and the admin dashboard was pointed at a local mock server. This repo fixes that:

- Added `Product`, `AdminUser`, `Review`, `Testimonial`, `Feedback`, `Banner` MongoDB models
- Added admin login (JWT-based) and full product CRUD, both protected for writes
- Added order listing + status/tracking updates for the dashboard
- Added an `/api/analytics` endpoint the dashboard's charts read from
- Connected `OrderManager` and `UserManager` (which existed but were pointed at a dead local-only store) to the real backend
- Fixed a bug where the error-handling middleware was registered before the routes and never actually caught anything
- Removed the old local JSON-file mock backend — no longer needed

## Running locally

### 1. Backend

```bash
cd backend
cp .env.example .env
# fill in MONGO_URI, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, JWT_SECRET
npm install
npm run seed   # creates your first admin login + a few sample products
npm run dev
```

The API runs on `http://localhost:5000`.

Your first admin login will be whatever you set as `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` before running `npm run seed` (defaults to `admin@thepahadicraft.com` / `ChangeMe@123` — change this password after your first login, there's no "change password" UI yet, so update it directly via a script or by re-running seed with different values against a fresh admin doc).

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_BACKEND_URL and VITE_API_BASE_URL should point at http://localhost:5000 for local dev
npm install
npm run dev
```

Storefront: `http://localhost:5173`
Admin dashboard: `http://localhost:5173/admin/login`

## What you still need from the owner

- **MongoDB Atlas connection string** (`MONGO_URI`) — if she doesn't have one yet, a free Atlas cluster takes about 5 minutes to set up at mongodb.com/cloud/atlas.
- **Razorpay live keys** (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) — from the Razorpay dashboard she already set up.
- **Firebase project config** (the `VITE_FIREBASE_*` values) — for customer login. If Atharv or Ashish set up the Firebase project, you'll need those values; otherwise create a free Firebase project and pull them from Project Settings.
- **Domain registrar access** (or her willingness to update 2 DNS records once you hand her the values) — this is what actually connects `thepahadicraft.com` to whatever you deploy.
- Optionally: **Twilio credentials** if she wants the SMS/WhatsApp order confirmations to keep working (`Routes/sendNotifications.js` already has this wired up, just needs the keys).

## Deploying to thepahadicraft.com

**Step 1 — Push this repo to GitHub**
Create a new repo under your account, then from this folder:
```bash
git init
git add .
git commit -m "Unified Pahadi Craft repo: frontend + backend + admin dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/pahadi-craft.git
git push -u origin main
```

**Step 2 — Deploy the backend (Render is the simplest free option)**
1. Go to render.com → New → Web Service → connect your GitHub repo
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all the environment variables from `backend/.env.example` in Render's dashboard
6. After first deploy, run `npm run seed` once via Render's shell tab (or run it locally against the same `MONGO_URI`) to create your admin login
7. Note the URL Render gives you, e.g. `https://pahadi-craft-backend.onrender.com`

**Step 3 — Deploy the frontend (Vercel)**
1. Go to vercel.com → New Project → import your repo
2. Root directory: `frontend`
3. Framework preset: Vite (should auto-detect)
4. Add all the environment variables from `frontend/.env.example`, with `VITE_BACKEND_URL` and `VITE_API_BASE_URL` pointed at your Render URL from Step 2 (e.g. `https://pahadi-craft-backend.onrender.com` and `https://pahadi-craft-backend.onrender.com/api`)
5. Deploy — Vercel gives you a URL like `https://pahadi-craft.vercel.app`

**Step 4 — Point the domain at your deployment**
This is the part only the owner can do (or she can give you the registrar login):
1. In Vercel, go to your project → Settings → Domains → add `thepahadicraft.com` and `www.thepahadicraft.com`. Vercel will show you the DNS records to add (usually an A record and a CNAME).
2. At the domain registrar (GoDaddy, Namecheap, wherever it was bought), update those DNS records to the values Vercel gave you.
3. DNS changes can take anywhere from a few minutes to a few hours to propagate.

**Step 5 — Update backend CORS**
Once the domain is live, double check `backend/index.js`'s `allowedOrigins` list includes `https://thepahadicraft.com` and `https://www.thepahadicraft.com` (it already does by default) — if you use a different domain, update this or set `EXTRA_CORS_ORIGIN` in Render's environment variables.

## Known gaps / things to build next

- Reviews, testimonials, feedback, and banners have working `GET` endpoints and seed-able models, but the dashboard's approve/reject/create buttons for these are still local-state-only (not yet wired to save back to the database) — same pattern as the order status fix, just needs the same treatment applied to those four sections.
- There's no "change admin password" UI yet — for now, changing it means re-hashing a new password directly in the database or re-running the seed script.
- No image upload — products currently take an image URL. If the owner wants to upload photos directly instead of hosting them elsewhere first, that's the next thing worth adding (e.g. Cloudinary or S3).
