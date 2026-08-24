import prisma from "../configs/prisma.js";

async function main() {
    console.log("🌱 Seeding database with demo VentureHUB startup listings...");

    // 1. Create a Demo Founder User
    const demoFounder = await prisma.user.upsert({
        where: { id: "user_demo_founder_venturehub" },
        update: {},
        create: {
            id: "user_demo_founder_venturehub",
            email: "founder@venturehub.demo",
            name: "Alexander Wright",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            plan: "Pro",
            planMaxListings: 10,
            earned: 45000,
            withdrawn: 15000,
        },
    });

    console.log(`👤 Demo Founder ready: ${demoFounder.name} (${demoFounder.email})`);

    // 2. Sample Startup Listings
    const sampleListings = [
        {
            ownerId: demoFounder.id,
            title: "NovaAI — Enterprise Autonomous Workflow Automation Suite",
            platform: "linkedin",
            username: "nova-ai-enterprise",
            followers_count: 85000,
            engagement_rate: 6.4,
            monthly_views: 420000,
            niche: "tech",
            price: 249000,
            description: "NovaAI provides AI agent orchestration for enterprise B2B sales workflows. $18k MRR with 92% gross margin and 140+ active recurring clients.",
            verified: true,
            monetized: true,
            country: "United States",
            age_range: "25-34",
            status: "active",
            featured: true,
            platformAssured: true,
            images: [
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
            ],
        },
        {
            ownerId: demoFounder.id,
            title: "FinPulse — Next-Gen Algorithmic Treasury & DeFi Yield Analytics",
            platform: "twitter",
            username: "finpulse_io",
            followers_count: 120000,
            engagement_rate: 8.2,
            monthly_views: 890000,
            niche: "finance",
            price: 185000,
            description: "Institutional real-time liquidity aggregator and automated yield routing dashboard. Built on Web3 infrastructure with $4.2M total volume tracked.",
            verified: true,
            monetized: true,
            country: "Singapore",
            age_range: "25-44",
            status: "active",
            featured: true,
            platformAssured: true,
            images: [
                "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80",
            ],
        },
        {
            ownerId: demoFounder.id,
            title: "OmniHealth — Telehealth & AI Diagnostics Mobile Ecosystem",
            platform: "instagram",
            username: "omnihealth.app",
            followers_count: 240000,
            engagement_rate: 5.1,
            monthly_views: 1200000,
            niche: "health",
            price: 98000,
            description: "Direct-to-consumer digital wellness platform with proprietary symptom assessment algorithms and 35k registered active patients.",
            verified: true,
            monetized: true,
            country: "United Kingdom",
            age_range: "18-35",
            status: "active",
            featured: false,
            platformAssured: true,
            images: [
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
            ],
        },
        {
            ownerId: demoFounder.id,
            title: "CyberShield — Cloud Security & Threat Intelligence API",
            platform: "linkedin",
            username: "cybershield-security",
            followers_count: 45000,
            engagement_rate: 4.8,
            monthly_views: 190000,
            niche: "tech",
            price: 320000,
            description: "Automated vulnerability scanner and compliance auditing tool for modern cloud native architectures. Seed round funded with $22k MRR.",
            verified: true,
            monetized: true,
            country: "Germany",
            age_range: "25-54",
            status: "active",
            featured: true,
            platformAssured: true,
            images: [
                "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
            ],
        },
    ];

    for (const listing of sampleListings) {
        const created = await prisma.listing.create({
            data: listing,
        });
        console.log(` Listing seeded: "${created.title}" (₹${created.price.toLocaleString()})`);
    }

    console.log(" Seed completed successfully! Startups are now visible on the Marketplace.");
}

main()
    .catch((e) => {
        console.error("Error during seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

