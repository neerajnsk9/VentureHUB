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

export const protect = async (req, res, next) => {
    try {
        const { userId, has } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const hasPremiumPlan = has ? await has({ plan: 'premium' }) : false;
        req.plan = hasPremiumPlan ? 'premium' : 'free';

        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await clerkClient.users.getUser(userId);
        const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(normalizeEmail).filter(Boolean);
        const userEmails = getUserEmails(user);
        const isAdmin = userEmails.some((email) => adminEmails.includes(email));

        if (!isAdmin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
