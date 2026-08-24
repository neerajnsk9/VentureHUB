import prisma from "../configs/prisma.js";

async function main() {
    console.log("Wiping 100% of all data from PostgreSQL database across ALL tables...");

    // Delete all records from all tables
    await prisma.platformMessage.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.withdrawal.deleteMany({});
    await prisma.credential.deleteMany({});
    await prisma.listing.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("PostgreSQL database is now 100% completely empty. Total rows in ALL tables (User, Listing, Chat, etc.) = 0.");
}

main()
    .catch((e) => {
        console.error("Error wiping database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
