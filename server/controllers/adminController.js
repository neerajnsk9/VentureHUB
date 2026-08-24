import prisma from "../configs/prisma.js";
import { clerkClient, getAuth } from "@clerk/express";

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

const getUserEmails = (user) => {
    const emails = new Set();

    if (user?.primaryEmailAddress?.emailAddress) {
        emails.add(normalizeEmail(user.primaryEmailAddress.emailAddress));
    }

    if (Array.isArray(user?.emailAddresses)) {
        user.emailAddresses.forEach((emailAddress) => {
            if (emailAddress?.emailAddress) {
                emails.add(normalizeEmail(emailAddress.emailAddress));
            }
        });
    }

    return [...emails];
};

// Controller for checking if user is admin
export const isAdmin = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.json({ isAdmin: false });

        const user = await clerkClient.users.getUser(userId);
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(normalizeEmail).filter(Boolean);
        const userEmails = getUserEmails(user);

        return res.json({ isAdmin: userEmails.some((email) => adminEmails.includes(email)) });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Plan price mapping (INR)
const PLAN_PRICES = { Growth: 2499, Scale: 7999 };

// Controller for getting dashboard data
export const getDashboard = async (req, res) => {
    try {
        const totalListings = await prisma.listing.count({});

        const transactions = await prisma.transaction.findMany({
            where: { isPaid: true },
            select: { amount: true },
        });

        const totalRevenue = transactions.reduce((total, transaction) => total + transaction.amount, 0);

        const activeListings = await prisma.listing.count({
            where: { status: "active" },
        });

        const totalUser = await prisma.user.count({});

        const recentListings = await prisma.listing.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { owner: true },
        });

        // Plan breakdown & plan revenue
        const allUsers = await prisma.user.findMany({ select: { plan: true } });
        const planBreakdown = { Starter: 0, Growth: 0, Scale: 0 };
        allUsers.forEach((u) => {
            const p = u.plan || "Starter";
            if (planBreakdown[p] !== undefined) planBreakdown[p]++;
            else planBreakdown[p] = 1;
        });
        const planRevenue = (planBreakdown.Growth || 0) * PLAN_PRICES.Growth + (planBreakdown.Scale || 0) * PLAN_PRICES.Scale;

        // Chat & message counts
        const totalChats = await prisma.chat.count({});
        const totalMessages = await prisma.message.count({});

        return res.json({
            dashboardData: {
                totalListings,
                totalRevenue,
                planRevenue,
                activeListings,
                totalUser,
                recentListings,
                planBreakdown,
                totalChats,
                totalMessages,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for getting all listings
export const getAllListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            include: { owner: true },
            orderBy: { createdAt: "desc" },
        });

        if (!listings || listings.length === 0) {
            return res.json({ listings: [] });
        }

        return res.json({ listings });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Change listing status
export const changeStatus = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { status } = req.body;

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        await prisma.listing.update({
            where: { id: listingId },
            data: { status },
        });

        return res.json({ message: "Listing status updated" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for getting all unverified listings with credentials submitted
export const getAllUnverifiedListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { isCredentialSubmitted: true, isCredentialVerified: false, status: { not: "deleted" } },
            orderBy: { createdAt: "desc" },
        });

        if (!listings || listings.length === 0) {
            return res.json({ listings: [] });
        }

        return res.json({ listings });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for getting credential
export const getCredential = async (req, res) => {
    try {
        const { listingId } = req.params;

        const credential = await prisma.credential.findFirst({
            where: { listingId },
        });

        if (!credential) {
            return res.status(404).json({ message: "Credential not found" });
        }

        return res.json({ credential });
    } catch (error) {
        res.status(400).json({ message: error.code || error.message });
        console.log(error);
    }
};

// Mark credential as verified
export const markCredentialVerified = async (req, res) => {
    try {
        const { listingId } = req.params;

        await prisma.listing.update({
            where: { id: listingId },
            data: { isCredentialVerified: true },
        });

        return res.json({ message: "Credential marked as verified" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Get all un-changed listings
export const getAllUnChangedListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { isCredentialVerified: true, isCredentialChanged: false, status: { not: "deleted" } },
            orderBy: { createdAt: "desc" },
        });

        if (!listings || listings.length === 0) {
            return res.json({ listings: [] });
        }

        return res.json({ listings });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Change credential for verified listing
export const changeCredential = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { newCredential, credentialId } = req.body;

        await prisma.credential.update({
            where: { id: credentialId },
            data: { updatedCredential: newCredential },
        });

        await prisma.listing.update({
            where: { id: listingId },
            data: { isCredentialChanged: true },
        });

        return res.json({ message: "Credential changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { isPaid: true },
            orderBy: { createdAt: "desc" },
            include: { listing: { include: { owner: true } } },
        });

        // Get Customer Details for each transaction and add it to the transaction object
        const customers = await prisma.user.findMany({
            where: { id: { in: transactions.map((t) => t.userId) } },
            select: { id: true, email: true, name: true, image: true },
        });

        transactions.forEach((t) => {
            const customer = customers.find((c) => c.id === t.userId);
            t.buyer = customer || null;
            if (t.listing) {
                t.listing.customer = { ...customer };
            }
        });

        if (!transactions || transactions.length === 0) {
            return res.json({ transactions: [] });
        }

        return res.json({ transactions });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};


// Controller For Getting  All Withdraw Requests
export const getAllWithdrawRequests = async (req, res) => {
    try {
        const requests = await prisma.withdrawal.findMany({
            orderBy: { createdAt: "asc" },
            include:{ user: true }
        });

        if (!requests || requests.length === 0) {
            return res.json({ requests: [] });
        }

        return res.json({ requests });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};

// Controller for marking withdrawal as paid
export const markWithdrawalAsPaid = async (req, res) => {
    try {
        const { id } = req.params;

        const withdrawal = await prisma.withdrawal.findUnique({
            where: { id },
        });

        if (!withdrawal) {
            return res.status(404).json({ message: "Withdrawal not found" });
        }

        if (withdrawal.isWithdrawn) {
            return res.status(400).json({ message: "Withdrawal already marked as paid" });
        }

        await prisma.withdrawal.update({
            where: { id },
            data: { isWithdrawn: true },
        });

        return res.json({ message: "Withdrawal marked as paid" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.code || error.message });
    }
};
