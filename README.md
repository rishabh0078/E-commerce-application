# AURA - AI-Powered E-commerce Platform

A complete, production-ready e-commerce web app built with React on the frontend and Node.js/Express on the backend. Browse products, manage a cart, and check out with Stripe, Razorpay, or cash on delivery — all backed by MongoDB and Cloudinary for image storage.

---

## What's Inside

- **Product catalog** with filtering, sorting, and search
- **User authentication** (sign up, log in, JWT-based sessions)
- **Shopping cart** that syncs across sessions
- **Checkout** with three payment options — Stripe, Razorpay, and COD
- **Order tracking** for users
- **Admin panel** support (admin auth middleware included)
- **Image uploads** handled through Cloudinary
- **Responsive UI** styled with Tailwind CSS
- **Deployable** to Vercel (backend config included)

---

## Tech Stack

**Frontend** — React 18, React Router, Vite, Tailwind CSS

**Backend** — Node.js, Express

**Database** — MongoDB with Mongoose

**Authentication** — JSON Web Tokens (JWT), bcrypt

**Payments** — Stripe, Cash on Delivery

**Image Storage** — Cloudinary

---


### 1. Clone the repo

```bash
git clone https://github.com/rishabh0078/AI-integrated-ecommerce-platform.git
cd AI-integrated-ecommerce-platform
```

### 2. Set up environment variables

You'll need two `.env` files — one for the frontend root, one inside `backend/`.

**Root `.env`** (frontend):

```env
VITE_BACKEND_URL = "http://localhost:4000"
VITE_RAZORPAY_KEY_ID = "your_razorpay_key_id"
```

**`backend/.env`**:

```env
# Auth
JWT_SECRET = "pick_a_strong_secret"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "your_admin_password"

# Database
MONGODB_URI = "your_mongodb_connection_string"

# Cloudinary
CLOUDINARY_NAME = "your_cloud_name"
CLOUDINARY_API_KEY = "your_api_key"
CLOUDINARY_SECRET_KEY = "your_secret_key"

# Stripe (optional)
STRIPE_SECRET_KEY = "your_stripe_secret_key"

# Razorpay (optional)
RAZORPAY_KEY_ID = "your_razorpay_key_id"
RAZORPAY_KEY_SECRET = "your_razorpay_key_secret"
```

### 3. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 4. Run the app

Open **two terminals**:

```bash
# Terminal 1 — Start the backend
cd backend
npm run server
```

```bash
# Terminal 2 — Start the frontend
npm run dev
```

The frontend will be at **http://localhost:5173** and the API at **http://localhost:4000**.

---

Built by [Rishabh Chaudhary](https://github.com/rishabh0078) ☕
