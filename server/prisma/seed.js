import prisma from "../configs/prisma.js";

async function main() {
    console.log("No sample data to seed. Database remains 100% clean for manual user uploads.");
}

main()
    .catch((e) => {
        console.error("Error during seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
