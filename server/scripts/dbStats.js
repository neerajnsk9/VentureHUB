import "dotenv/config";
import prisma from "../configs/prisma.js";

async function showDbStats() {
    console.log("\n==========================================");
    console.log(" 📊 VentureHUB — PostgreSQL Database Stats ");
    console.log("==========================================\n");

    try {
        const [usersCount, listingsCount, transactionsCount, chatsCount, withdrawalsCount] = await Promise.all([
            prisma.user.count(),
            prisma.listing.count(),
            prisma.transaction.count(),
            prisma.chat.count(),
            prisma.withdrawal.count(),
        ]);

        const activeListings = await prisma.listing.count({ where: { status: "active" } });
        const soldListings = await prisma.listing.count({ where: { status: "sold" } });

        console.log(` 👤 Total Users:        ${usersCount}`);
        console.log(` 🚀 Total Listings:     ${listingsCount} (${activeListings} Active, ${soldListings} Sold)`);
        console.log(` 💳 Total Transactions: ${transactionsCount}`);
        console.log(` 💬 Total Chats:        ${chatsCount}`);
        console.log(` 🏦 Total Withdrawals:  ${withdrawalsCount}\n`);

        const recentListings = await prisma.listing.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            select: { title: true, price: true, niche: true, status: true }
        });

        if (recentListings.length > 0) {
            console.log(" Recent Startups:");
            recentListings.forEach((item, idx) => {
                console.log(`   ${idx + 1}. [${item.niche.toUpperCase()}] ${item.title} — ₹${item.price.toLocaleString()} (${item.status})`);
            });
        }

        console.log("\n Database connection: HEALTHY & ACTIVE\n");
    } catch (err) {
        console.error(" Error querying database stats:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

showDbStats();
