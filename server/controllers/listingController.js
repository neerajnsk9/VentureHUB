import fs from "fs";
import imagekit from "../configs/imageKit.js";
import prisma from "../configs/prisma.js";
import Stripe from "stripe";
import { inngest } from "../inngest/index.js";
import { clerkClient, getAuth } from "@clerk/express";

const founderEmail = "startupxfounder@gmail.com";
const founderId = "user_startupxfounder";

const resolveAppUserId = async (req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return null;
    }

    try {
        const user = await clerkClient.users.getUser(userId);
        const userEmail = user?.emailAddresses?.[0]?.emailAddress;
        const userImage = user?.imageUrl || "";
        const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || "Ned Stark";

        if (userEmail === founderEmail) {
            await prisma.user.upsert({
                where: { id: founderId },
                update: {
                    name: userName,
                    email: founderEmail,
                    ...(userImage ? { image: userImage } : {}),
                },
                create: {
                    id: founderId,
                    name: userName,
                    email: founderEmail,
                    image: userImage,
                },
            });
            return founderId;
        } else if (userId) {
            await prisma.user.upsert({
                where: { id: userId },
                update: {
                    name: userName,
                    email: userEmail || "user@venturehub.in",
                    ...(userImage ? { image: userImage } : {}),
                },
                create: {
                    id: userId,
                    name: userName,
                    email: userEmail || "user@venturehub.in",
                    image: userImage,
                },
            });
        }
    } catch (error) {
        console.log("Error in resolveAppUserId:", error);
    }

    return userId;
};

const normalizeFounderUser = (user) => {
    return user;
};

// Controller For Getting Current User Plan
export const getUserPlan = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        if (!userId) {
            return res.json({ plan: "Starter", planMaxListings: 1, usedListings: 0 });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        const usedListings = await prisma.listing.count({
            where: { ownerId: userId, status: { not: "deleted" } },
        });

        const hasChosenPlan = Boolean(user?.plan);
        const plan = user?.plan || "Starter";
        const planMaxListings = user?.planMaxListings || 1;

        return res.json({
            plan,
            hasChosenPlan,
            planMaxListings,
            usedListings,
        });
    } catch (error) {
        console.log("getUserPlan error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Controller For Selecting Free Starter Plan
export const selectStarterPlan = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                plan: "Starter",
                planMaxListings: 1,
            },
        });

        return res.json({ message: "Starter plan activated", user: updatedUser, plan: "Starter", planMaxListings: 1 });
    } catch (error) {
        console.log("selectStarterPlan error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Controller For Activating Paid Plan after Stripe Checkout
export const activatePaidPlan = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const { planName } = req.body;

        if (!planName || (planName !== "Growth" && planName !== "Scale")) {
            return res.status(400).json({ message: "Invalid plan name" });
        }

        const planMaxListings = planName === "Scale" ? 999 : 5;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                plan: planName,
                planMaxListings,
            },
        });

        return res.json({ message: `${planName} plan activated successfully!`, user: updatedUser, plan: planName, planMaxListings });
    } catch (error) {
        console.log("activatePaidPlan error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Controller For Adding Listing to Database
export const addListing = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);

        const dbUser = await prisma.user.findUnique({ where: { id: userId } });
        const currentPlan = dbUser?.plan || "Starter";
        const planMaxListings = dbUser?.planMaxListings || 1;

        const listingCount = await prisma.listing.count({
            where: { ownerId: userId, status: { not: "deleted" } },
        });

        if (listingCount >= planMaxListings) {
            return res.status(403).json({
                message: `You have reached the limit of ${planMaxListings} startup listing(s) on your ${currentPlan} plan. Please upgrade your plan to list more startups.`,
                planLimitReached: true,
                currentPlan,
                planMaxListings,
                listingCount,
            });
        }

        const accountDetails = JSON.parse(req.body.accountDetails || "{}");

        accountDetails.followers_count = parseFloat(accountDetails.followers_count) || 0;
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate) || 0;
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views) || 0;
        accountDetails.price = parseFloat(accountDetails.price) || 0;
        accountDetails.platform = accountDetails.platform ? accountDetails.platform.toLowerCase() : "tech";
        accountDetails.niche = accountDetails.niche ? accountDetails.niche.toLowerCase() : "tech";
        accountDetails.username = accountDetails.username || "";
        if (accountDetails.username.startsWith("@")) {
            accountDetails.username = accountDetails.username.slice(1);
        }

        let uploadedImageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadImages = req.files.map(async (file) => {
                const imgBuffer = fs.createReadStream(file.path);
                const response = await imagekit.upload({
                    file: imgBuffer,
                    fileName: `${Date.now()}.png`,
                    folder: "social-marketplace",
                    transformation: { pre: "w-1280,h-auto" },
                });
                return response.url;
            });
            uploadedImageUrls = await Promise.all(uploadImages);
        }

        const finalImages = Array.isArray(accountDetails.images) ? [...accountDetails.images, ...uploadedImageUrls] : uploadedImageUrls;
        delete accountDetails.images;

        const listing = await prisma.listing.create({
            data: {
                ownerId: userId,
                images: finalImages,
                ...accountDetails,
            },
        });

        return res.status(201).json({ message: "Startup Listed successfully", listing });
    } catch (error) {
        console.log("Error adding listing:", error);
        res.status(500).json({ message: error.code || error.message });
    }
};

const sampleListings = [
    {
        id: "sample-1",
        title: "AI Canvas Pro",
        tagline: "AI-Powered Generative Graphic Design Suite for Marketers",
        description: "AI Canvas Pro enables growth marketers and designers to generate brand-consistent ad creatives, social banners, and marketing visual assets in seconds with generative AI models.",
        price: 450000,
        followers_count: 12500,
        engagement_rate: 8.5,
        monthly_views: 85000,
        platform: "saas",
        niche: "ai",
        category: "SaaS",
        images: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop"],
        status: "active",
        featured: true,
        isCredentialSubmitted: true,
        ownerId: "sample-owner-1",
        owner: {
            id: "sample-owner-1",
            name: "Alex Rivera",
            email: "alex@aicanvas.io",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
        },
        totalRaised: 120000,
        remainingTarget: 330000,
        createdAt: new Date().toISOString()
    },
    {
        id: "sample-2",
        title: "FinFlow Tech",
        tagline: "Automated Treasury Management & Cashflow Forecasting for SMEs",
        description: "FinFlow connects bank accounts, accounting software, and payment gateways into a unified real-time financial dashboard powered by predictive cash flow algorithms.",
        price: 1200000,
        followers_count: 45000,
        engagement_rate: 12.1,
        monthly_views: 210000,
        platform: "fintech",
        niche: "fintech",
        category: "FinTech",
        images: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop"],
        status: "active",
        featured: true,
        isCredentialSubmitted: true,
        ownerId: "sample-owner-2",
        owner: {
            id: "sample-owner-2",
            name: "Sarah Chen",
            email: "sarah@finflow.co",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop"
        },
        totalRaised: 450000,
        remainingTarget: 750000,
        createdAt: new Date().toISOString()
    },
    {
        id: "sample-3",
        title: "EcoPack Direct",
        tagline: "100% Biodegradable E-commerce Packaging Marketplace",
        description: "Sustainable packaging supply chain platform connecting D2C e-commerce brands with certified eco-friendly packaging manufacturers across North America and Europe.",
        price: 350000,
        followers_count: 28000,
        engagement_rate: 6.4,
        monthly_views: 110000,
        platform: "d2c",
        niche: "d2c",
        category: "D2C",
        images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop"],
        status: "active",
        featured: false,
        isCredentialSubmitted: true,
        ownerId: "sample-owner-3",
        owner: {
            id: "sample-owner-3",
            name: "Marcus Vance",
            email: "marcus@ecopack.com",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop"
        },
        totalRaised: 80000,
        remainingTarget: 270000,
        createdAt: new Date().toISOString()
    }
];

// Controller For Getting All Public Listing
export const getAllPublicListing = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { status: "active" },
            include: { 
                owner: true,
                transactions: {
                    where: { isPaid: true },
                    select: { amount: true },
                }
            },
            orderBy: { createdAt: "desc" },
        });

        if (!listings || listings.length === 0) {
            return res.json({ listings: sampleListings });
        }

        const formattedListings = listings.map((listing) => {
            const totalRaised = listing.transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
            const remainingTarget = Math.max(0, listing.price - totalRaised);

            return {
                ...listing,
                owner: normalizeFounderUser(listing.owner),
                totalRaised,
                remainingTarget,
            };
        });

        return res.json({ listings: formattedListings });
    } catch (error) {
        console.log("getAllPublicListing error, using demo fallback:", error.message);
        return res.json({ listings: sampleListings });
    }
};

// Controller For Getting All User Listing
export const getAllUserListing = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);

        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        // get all listings except deleted
        const listings = await prisma.listing.findMany({
            where: { ownerId: userId, status: { not: "deleted" } },
            include: {
                transactions: {
                    where: { isPaid: true },
                    select: { id: true, userId: true, amount: true, createdAt: true },
                    orderBy: { createdAt: "desc" },
                }
            },
            orderBy: { createdAt: "desc" },
        });

        const ownerTransactions = await prisma.transaction.findMany({
            where: { ownerId: userId, isPaid: true },
            select: { amount: true },
        });

        const totalEarned = ownerTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        const balance = {
            earned: totalEarned,
            withdrawn: dbUser?.withdrawn || 0,
            available: totalEarned - (dbUser?.withdrawn || 0),
        };

        const formattedListings = await Promise.all(listings.map(async (listing) => {
            const totalRaised = listing.transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
            const remainingTarget = Math.max(0, listing.price - totalRaised);

            const investors = await Promise.all((listing.transactions || []).map(async (tx) => {
                let investorUser = await prisma.user.findUnique({ where: { id: tx.userId } });
                let name = investorUser?.name || "Investor";
                let email = investorUser?.email || "";
                let image = investorUser?.image || "";

                if (tx.userId.startsWith("user_")) {
                    try {
                        const clerkUser = await clerkClient.users.getUser(tx.userId);
                        if (clerkUser) {
                            const fullName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
                            name = fullName || clerkUser.username || name;
                            email = clerkUser.emailAddresses?.[0]?.emailAddress || email;
                            image = clerkUser.imageUrl || image;
                        }
                    } catch (e) {
                        // ignore clerk fetch error
                    }
                }

                return {
                    id: tx.id,
                    userId: tx.userId,
                    amount: tx.amount,
                    createdAt: tx.createdAt,
                    investorName: name,
                    investorEmail: email,
                    investorImage: image,
                };
            }));

            return {
                ...listing,
                totalRaised,
                remainingTarget,
                investors,
            };
        }));

        return res.json({
            listings: formattedListings,
            balance,
            plan: dbUser?.plan || "Starter",
            planMaxListings: dbUser?.planMaxListings || 1,
            usedListings: listings?.length || 0,
        });
    } catch (error) {
        console.log("getAllUserListing error:", error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Updating Listing in Database
export const updateListing = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const listingId = req.params.id || req.params.listingId;
        const accountDetails = JSON.parse(req.body.accountDetails || "{}");

        const filesCount = req.files?.length || 0;
        const existingImagesCount = Array.isArray(accountDetails.images) ? accountDetails.images.length : 0;

        if (filesCount + existingImagesCount > 5) {
            return res.status(400).json({ message: "You can only upload up to 5 images" });
        }

        const targetListingId = accountDetails.id || listingId;

        const existingListing = await prisma.listing.findFirst({
            where: { id: targetListingId, ownerId: userId },
        });

        if (!existingListing) {
            return res.status(404).json({ message: "Listing not found or you are not the owner" });
        }

        if (existingListing.status === "sold") {
            return res.status(400).json({ message: "You cannot update a sold listing" });
        }

        accountDetails.followers_count = parseFloat(accountDetails.followers_count) || 0;
        accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate) || 0;
        accountDetails.monthly_views = parseFloat(accountDetails.monthly_views) || 0;
        accountDetails.price = parseFloat(accountDetails.price) || 0;
        accountDetails.platform = accountDetails.platform ? accountDetails.platform.toLowerCase() : "tech";
        accountDetails.niche = accountDetails.niche ? accountDetails.niche.toLowerCase() : "tech";
        accountDetails.username = accountDetails.username || "";
        if (accountDetails.username.startsWith("@")) {
            accountDetails.username = accountDetails.username.slice(1);
        }

        let uploadedImageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadImages = req.files.map(async (file) => {
                const imgBuffer = fs.createReadStream(file.path);
                const response = await imagekit.upload({
                    file: imgBuffer,
                    fileName: `${Date.now()}.png`,
                    folder: "social-marketplace",
                    transformation: { pre: "w-1280,h-auto" },
                });
                return response.url;
            });
            uploadedImageUrls = await Promise.all(uploadImages);
        }

        const finalImages = Array.isArray(accountDetails.images)
            ? [...accountDetails.images, ...uploadedImageUrls]
            : [...(existingListing.images || []), ...uploadedImageUrls];

        delete accountDetails.id;
        delete accountDetails.images;

        const updatedListing = await prisma.listing.update({
            where: { id: existingListing.id },
            data: {
                ...accountDetails,
                images: finalImages,
            },
        });

        return res.json({ message: "Listing updated successfully", listing: updatedListing });
    } catch (error) {
        console.log("Error updating listing:", error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = await resolveAppUserId(req);

        const listing = await prisma.listing.findUnique({
            where: { id, ownerId: userId },
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.status === "active" || listing.status === "inactive") {
            await prisma.listing.update({
                where: { id, ownerId: userId },
                data: { status: listing.status === "active" ? "inactive" : "active" },
            });
        } else if (listing.status === "ban") {
            return res.status(400).json({ message: "Your listing is banned" });
        } else if (listing.status === "sold") {
            return res.status(400).json({ message: "Your listing is sold" });
        }

        return res.json({ message: "Listing status updated successfully", listing });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Deleting Listing
export const deleteUserListing = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const { listingId } = req.params;

        const listing = await prisma.listing.findFirst({
            where: { id: listingId, ownerId: userId },
            include: { owner: true },
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.status === "sold") {
            return res.status(400).json({ message: "Sold listing cannot be deleted" });
        }

        await prisma.listing.update({
            where: { id: listingId, ownerId: userId },
            data: { status: "deleted" },
        });

        return res.json({ message: "Listing deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const addCredential = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);

        const { listingId, credential } = req.body;

        if (!credential || credential.length === 0 || !listingId) {
            return res.status(400).json({ message: "Missing Fields" });
        }

        const listing = await prisma.listing.findFirst({
            where: { id: listingId, ownerId: userId },
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found or you are not the owner" });
        }

        await prisma.credential.create({
            data: {
                listingId,
                originalCredential: credential,
            },
        });

        await prisma.listing.update({
            where: { id: listingId },
            data: { isCredentialSubmitted: true },
        });

        return res.json({ message: "Credential added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const purchaseAccount = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const { listingId } = req.params;
        const { amount } = req.body || {};
        const origin = req.headers.origin || "http://localhost:5173";

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.ownerId === userId) {
            return res.status(400).json({ message: "You cannot invest in your own startup" });
        }

        const investmentAmount = Number(amount) > 0 ? Number(amount) : listing.price;

        const transaction = await prisma.transaction.create({
            data: {
                listingId,
                ownerId: listing.ownerId,
                userId,
                amount: investmentAmount,
                isPaid: true,
            },
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: `Investment in ${listing.title}`,
                        description: `Startup Investment for ${listing.title} on VentureHUB Marketplace`,
                    },
                    unit_amount: Math.floor(investmentAmount) * 100,
                },
                quantity: 1,
            },
        ];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/my-orders?investment=success`,
            cancel_url: `${origin}/listing/${listingId}`,
            line_items: line_items,
            mode: "payment",
            metadata: {
                transactionId: transaction.id,
                appId: "social-profile-marketplace",
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        return res.json({ paymentLink: session.url });
    } catch (error) {
        console.log("purchaseAccount error:", error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const markFeatured = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = await resolveAppUserId(req);

        await prisma.listing.updateMany({
            where: { ownerId: userId },
            data: { featured: false },
        });

        await prisma.listing.update({
            where: { id },
            data: { featured: true },
        });

        return res.json({ message: "Listing marked as featured" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const getAllUserOrders = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);

        const orders = await prisma.transaction.findMany({
            where: { userId, isPaid: true },
            include: { listing: true },
            orderBy: { createdAt: "desc" },
        });

        if (!orders || orders.length === 0) {
            return res.json({ orders: [] });
        }

        const credentials = await prisma.credential.findMany({
            where: { listingId: { in: orders.map((order) => order.listingId) } },
        });

        const ordersWithCredentials = orders.map((order) => {
            const credential = credentials.find((cred) => cred.listingId === order.listingId);
            return { ...order, credential };
        });

        return res.json({ orders: ordersWithCredentials });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const withdrawAmount = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const { amount, account } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const ownerTransactions = await prisma.transaction.findMany({
            where: { ownerId: userId, isPaid: true },
            select: { amount: true },
        });

        const totalEarned = ownerTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const balance = totalEarned - (user?.withdrawn || 0);

        if (amount > balance) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const withdrawal = await prisma.withdrawal.create({
            data: {
                userId,
                amount,
                account,
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: { 
                earned: totalEarned,
                withdrawn: { increment: amount } 
            },
        });

        return res.json({ message: "Applied for withdrawal", withdrawal });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

export const getUserWithdrawals = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const withdrawals = await prisma.withdrawal.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true }
        });

        const formattedWithdrawals = withdrawals.map(w => ({
            ...w,
            user,
        }));

        return res.json({ withdrawals: formattedWithdrawals });
    } catch (error) {
        console.log("getUserWithdrawals error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createPlanCheckout = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const { planName } = req.body;
        const origin = req.headers.origin || "http://localhost:5173";

        const prices = {
            Growth: 2499,
            Scale: 7999,
        };

        const amount = prices[planName] || 2499;

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/my-listings?plan=success&planName=${planName}`,
            cancel_url: `${origin}/plans`,
            client_reference_id: userId,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `VentureHUB ${planName} Founder Plan`,
                            description: `Upgrade to ${planName} Founder Plan on VentureHUB Marketplace`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            metadata: {
                planName,
                userId,
            },
        });

        return res.json({ paymentLink: session.url });
    } catch (error) {
        console.log("Stripe Plan Checkout Error:", error);
        return res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Public Platform Stats (Live Analytics)
export const getPublicStats = async (req, res) => {
    try {
        const totalListings = await prisma.listing.count({
            where: { status: "active" },
        });

        const totalUsers = await prisma.user.count({});

        const aggregateFunding = await prisma.listing.aggregate({
            where: { status: "active" },
            _sum: { price: true },
        });

        const totalFundingGoal = aggregateFunding._sum.price || 0;

        return res.json({
            totalListings: totalListings || sampleListings.length,
            totalUsers: totalUsers || 42,
            totalFundingGoal: totalFundingGoal || 2000000,
        });
    } catch (error) {
        console.log("getPublicStats error, using fallback:", error.message);
        return res.json({
            totalListings: sampleListings.length,
            totalUsers: 42,
            totalFundingGoal: 2000000,
        });
    }
};
