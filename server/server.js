import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions, inngestIsDev } from "./inngest/index.js";
import { serve } from "inngest/express";
import adminRouter from "./routes/adminRoutes.js";
import listingRouter from "./routes/listingRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import { stripeWebhook } from "./controllers/stripeWebhook.js";

const app = express();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

// Stripe Webhooks Route must receive raw body before JSON parsing
app.use("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// Middlewares
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use((req, res, next) => {
    if (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY.includes("placeholder")) {
        return next();
    }
    return clerkMiddleware()(req, res, next);
});

app.get("/", (req, res) => res.send("Server is live!"));

// Webhooks
app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions,
        isDev: inngestIsDev,
    })
);

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/listing", listingRouter);
app.use("/api/chat", chatRouter);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Global error handler - returns stack in development for easier debugging
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err?.status || 500;
    const message = err?.message || 'Internal Server Error';
    const payload = { message };
    if (process.env.NODE_ENV !== 'production') payload.stack = err?.stack;
    res.status(status).json(payload);
});

export default app;
