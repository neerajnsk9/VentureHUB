# 📡 VentureHUB — REST API & Architecture Reference

Comprehensive technical reference for all backend endpoints, authentication schemas, and webhook flows in the VentureHUB ecosystem.

---

## 🔐 Authentication & Authorization

All protected endpoints require a Clerk Bearer JWT token in the HTTP Authorization header:

```http
Authorization: Bearer <clerk_session_token>
```

---

## 🌐 Endpoints Summary

### 1. System & Health
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Live server confirmation ping |
| `GET` | `/api/health` | Public | System health check (database status, uptime, latency) |

---

### 2. Startup Listings (`/api/listing`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/listing/public` | Public | Fetch all active and verified startup listings |
| `GET` | `/api/listing/:id` | Public | Fetch full details, metrics, and owner info for a specific listing |
| `GET` | `/api/listing/user` | Protected | Fetch listings created by the authenticated founder |
| `POST` | `/api/listing/create` | Protected | Create and publish a new startup listing |
| `PUT` | `/api/listing/update/:id` | Protected | Update metrics, valuation, or pitch description |
| `DELETE` | `/api/listing/delete/:id` | Protected | Mark listing as inactive/deleted |
| `POST` | `/api/listing/upload-images` | Protected | Upload startup screenshots and pitch deck media via ImageKit |
| `POST` | `/api/listing/purchase-account/:id` | Protected | Create a Stripe Checkout session for acquiring a startup |
| `POST` | `/api/listing/create-plan-checkout` | Protected | Create a Stripe Checkout session for upgrading founder plan |
| `GET` | `/api/listing/user-orders` | Protected | Retrieve all acquired startup investments for the investor |
| `GET` | `/api/listing/user-withdrawals` | Protected | Retrieve withdrawal history for the founder |
| `POST` | `/api/listing/withdraw` | Protected | Submit a bank withdrawal request for accumulated earnings |

---

### 3. Messaging & Deal Rooms (`/api/chat`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/chat/user` | Protected | Fetch all active conversations for the authenticated user |
| `GET` | `/api/chat/:chatId/messages` | Protected | Fetch full message history for a specific chat room |
| `POST` | `/api/chat/send-message` | Protected | Send a direct message to a founder or investor |
| `POST` | `/api/chat/create-chat` | Protected | Initialize a new deal conversation on a specific listing |

---

### 4. Admin Portal (`/api/admin`)
*(Requires user email to match `ADMIN_EMAILS`)*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/isAdmin` | Protected | Verify if the authenticated user holds administrative rights |
| `GET` | `/api/admin/metrics` | Admin | Retrieve platform metrics (total volume, active listings, users) |
| `GET` | `/api/admin/all-listings` | Admin | Retrieve all listings across all statuses (`active`, `sold`, `ban`) |
| `PUT` | `/api/admin/verify-listing/:id` | Admin | Approve and verify a submitted startup listing |
| `PUT` | `/api/admin/change-status/:id` | Admin | Update listing status (`active`, `inactive`, `ban`) |
| `GET` | `/api/admin/transactions` | Admin | Audit trail of all platform investment transactions |
| `GET` | `/api/admin/withdrawals` | Admin | Audit pending founder bank withdrawal requests |
| `PUT` | `/api/admin/settle-withdrawal/:id` | Admin | Mark withdrawal as settled and generate payout invoice |

---

### 5. Webhooks
| Method | Endpoint | Source | Description |
|---|---|---|---|
| `POST` | `/api/stripe` | Stripe Cloud | Listens for `checkout.session.completed` to finalize escrow |
| `POST` | `/api/inngest` | Inngest Cloud | Triggers asynchronous background jobs and email receipts |

---

## 🏗️ Database Schema Overview (Neon PostgreSQL)

```text
User (1) ─────────── (N) Listing
User (1) ─────────── (N) Chat (Owner / ChatUser)
User (1) ─────────── (N) Transaction
User (1) ─────────── (N) Withdrawal
Listing (1) ──────── (N) Chat
Listing (1) ──────── (N) Transaction
Chat (1) ─────────── (N) Message
```

---

*Generated for VentureHUB v1.0.0*
