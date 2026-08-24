<div align="center">

<img src="client/public/logo.png" alt="VentureHUB Logo" width="140" />

# 🚀 VentureHUB — Startup Marketplace for Founders & Investors

### ✨ Empowering Innovation by Connecting Founders and Investors on One Platform

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-venture--hubb.vercel.app-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://venture-hubb.vercel.app/)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend-Render%20Live-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://venturehub-server.onrender.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)

</div>

---

## 📖 Overview

**VentureHUB** is a full-stack, production-ready startup marketplace designed for startup founders to raise capital and strategic investors to discover, evaluate, and acquire high-growth technology ventures.

Unlike traditional single-role platforms, VentureHUB provides a **role-flexible ecosystem** where every user can seamlessly transition between launching startups and investing in promising ventures.

> **🌐 Live Frontend:** [https://venture-hubb.vercel.app/](https://venture-hubb.vercel.app/)  
> **⚙️ Live Backend:** [https://venturehub-server.onrender.com](https://venturehub-server.onrender.com)

---

## ⚡ System Architecture

```text
               ┌─────────────────────────────────────────┐
               │          User's Web Browser             │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
               ┌─────────────────────────────────────────┐
               │    Vercel (React 19 + Vite Frontend)    │
               │    https://venture-hubb.vercel.app      │
               └────────────────────┬────────────────────┘
                                    │  HTTPS / REST API
                                    ▼
               ┌─────────────────────────────────────────┐
               │    Render (Node.js + Express Backend)   │
               │    https://venturehub-server.onrender...│
               └─────────┬──────────┬──────────┬─────────┘
                         │          │          │
        ┌────────────────┘          │          └────────────────┐
        ▼                           ▼                           ▼
 ┌───────────────┐          ┌───────────────┐           ┌───────────────┐
 │ Neon Postgres │          │  Clerk Auth   │           │ Stripe Escrow │
 │ (Serverless DB│          │(User Security)│           │ (Webhooks)    │
 └───────────────┘          └───────────────┘           └───────────────┘
```

---

## ✨ Core Features & Platform Capabilities

### 🚀 Founder Experience
- **Startup Listing Management**: Publish startup listings with pitch deck metrics, traction proof, valuation, and niche categorization.
- **Media Uploads**: Upload high-resolution startup screenshots and product teasers powered by ImageKit CDN.
- **Investor Interest Tracking**: Receive real-time deal inquiries and communicate with potential backers directly.
- **Earnings & Payout Portal**: Transfer accumulated investment funding directly to bank accounts (IMPS/NEFT) with zero platform fee options.
- **Official Payout Invoices**: Auto-generate, view, and print PDF payout receipts with unique invoice reference numbers (`INV-WD-XXXXX`).

### 💰 Investor Experience
- **Interactive Marketplace**: Explore vetted startups across SaaS, FinTech, AI, D2C, and Tech sectors.
- **Advanced Filtering & Sorting**: Filter by budget (`Under ₹50L`, `Under ₹1Cr`, `Under ₹5Cr`), registration status, revenue monetization, and popularity.
- **Stripe Escrow Payments**: Complete startup acquisition funding safely via Stripe Checkout.
- **Investor Dashboard**: Track backing history, access verified startup login credentials, and inspect deal transactions.

### 💬 Real-Time Founder ↔ Investor Messaging
- **Direct Deal Inquiries**: Chat directly between founders and investors before and after investment deals.
- **Redux State Integration**: Instant message delivery, conversation history, and unread notification indicators.

### 👨‍💼 Admin Portal & Moderation
- **Live Metrics Dashboard**: Real-time overview of platform revenue, active listings, total chats, and plan breakdowns.
- **Listing Verification**: Audit submitted startup credentials before making listings public.
- **Transaction Audit Trail**: Inspect detailed payment breakdowns (Buyer, Founder, Startup, Amount, Stripe Reference).
- **Withdrawal Settlement**: Audit founder withdrawal requests and mark payouts as completed with 1-click invoice generation.
- **Unified UI/UX**: Brand-styled admin panels with custom status controls and INR formatting.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, Redux Toolkit, React Router v7, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Node.js, Express.js v5, Prisma ORM (v6.19.1) |
| **Database** | PostgreSQL (Neon Serverless Database) |
| **Authentication** | Clerk (`@clerk/express`, `@clerk/clerk-react`) |
| **Payments** | Stripe Checkout API + Webhook Event Listener |
| **Media CDN** | ImageKit.io |
| **Background Tasks** | Inngest Event Architecture |
| **Email Services** | Nodemailer (SMTP / Gmail App Passwords) |
| **Hosting** | Vercel (Frontend SPA) + Render (Node API Server) |

---

## 📂 Project Structure

```text
VentureHUB/
├── client/                          # React Frontend Application
│   ├── public/                      # Static branding assets
│   ├── src/
│   │   ├── app/                     # Redux Store & Feature Slices
│   │   ├── assets/                  # Logos, icons, static images
│   │   ├── components/              # Reusable UI components
│   │   │   └── admin/               # Admin panel modals & controls
│   │   ├── configs/                 # Axios instance with credentials
│   │   └── pages/                   # Route components & pages
│   │       └── admin/               # Admin dashboard pages
│   ├── .env.example                 # Client environment template
│   ├── vercel.json                  # Vercel SPA routing rewrites
│   └── vite.config.js               # Vite build configuration
│
├── server/                          # Node.js + Express API Backend
│   ├── configs/                     # Prisma, ImageKit, Multer, Nodemailer
│   ├── controllers/                 # Business logic handlers
│   ├── inngest/                     # Background event handlers
│   ├── middlewares/                 # Clerk auth protection middleware
│   ├── prisma/                      # Schema definition & migrations
│   ├── routes/                      # Admin, Listing & Chat API routes
│   ├── .env.example                 # Server environment template
│   ├── index.js                     # Server entry point (`app.listen`)
│   └── server.js                    # Express application setup
│
├── .gitattributes                   # Cross-platform LF line ending rules
├── .gitignore                       # Ignored build outputs & secrets
└── README.md                        # Documentation
```

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/bhanuteja7781/VentureHUB.git
cd VentureHUB
```

### 2. Install dependencies

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

Create `server/.env` (copy from `server/.env.example`):
```env
PORT=5000
DATABASE_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/neondb?sslmode=require"

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

IMAGEKIT_PUBLIC_KEY=public_...
IMAGEKIT_PRIVATE_KEY=private_...
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_account

INNGEST_EVENT_KEY=your_key
INNGEST_SIGNING_KEY=your_key
INNGEST_DEV=0

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=your_gmail_app_password
SENDER_EMAIL=youremail@gmail.com

ADMIN_EMAILS=admin@venturehub.com,youremail@gmail.com
FRONTEND_URL=http://localhost:5173
```

Create `client/.env` (copy from `client/.env.example`):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_BACKEND_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5173
VITE_ADMIN_EMAILS=admin@venturehub.com,youremail@gmail.com
```

### 4. Sync Database Schema
```bash
cd server
npx prisma db push
```

### 5. Start Local Servers
```bash
# Terminal 1 — Start Backend API
cd server
npm run server

# Terminal 2 — Start Frontend
cd client
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🚀 Production Deployment Guide

### Backend → Render (`https://venturehub-server.onrender.com`)
1. Create a Web Service on [render.com](https://render.com) connected to repo `bhanuteja7781/VentureHUB`.
2. Set **Root Directory**: `server`
3. Set **Build Command**: `npm install && npx prisma generate`
4. Set **Start Command**: `npm start`
5. Add all variables from `server/.env.example` under **Environment Variables**.

### Frontend → Vercel (`https://venture-hubb.vercel.app/`)
1. Create a New Project on [vercel.com](https://vercel.com) connected to repo `neerajnsk9/VentureHUB`.
2. Set **Root Directory**: `client`
3. Framework: **Vite** | Build Command: `npm run build` | Output Directory: `dist`
4. Add environment variables:
   - `VITE_BACKEND_URL` = `https://venturehub-server.onrender.com`
   - `VITE_CLERK_PUBLISHABLE_KEY` = `pk_test_...`
   - `VITE_ADMIN_EMAILS` = `admin@venturehub.com,chaiss917@gmail.com,neerajchowdary1@gmail.com`

---

## 🔒 Security Features

- **Clerk Auth Guards**: Protected routes & JWT token verification on Express endpoints.
- **PCI-Compliant Payments**: Stripe Checkout handles sensitive card transactions securely.
- **SQL Injection Safeguards**: Prisma ORM parametrized queries prevent SQL injection risks.
- **CORS Whitelisting**: Strict origin controls prevent unauthorized cross-domain API calls.
- **Encrypted Media Storage**: CDN-backed asset delivery via ImageKit.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "feat: add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License** © [Bhanu Teja](https://github.com/bhanuteja7781).

<div align="center">

⭐ **Star this repository if you find VentureHUB useful!** ⭐

</div>
