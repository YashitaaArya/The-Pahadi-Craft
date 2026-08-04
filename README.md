# Pahadi Craft — Unified Repo

This repo merges the three previously-separate pieces of thepahadicraft.com into one place:

- **`/frontend`** — the storefront + admin dashboard (React + Vite + TypeScript), based on the more advanced fork that already had the admin dashboard and dynamic product loading wired up.
- **`/backend`** — the Express + MongoDB API. Started from the working Razorpay payment flow, extended with real Product, Admin-login, Orders, Users, Reviews, Testimonials, Feedback, and Banners endpoints so the admin dashboard has real data to talk to.

Note: We need to add a db in future so that the images and meta data can load easily.