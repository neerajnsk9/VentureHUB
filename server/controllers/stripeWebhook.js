import stripe from "stripe";
import prisma from "../configs/prisma.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhook = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        console.log("Stripe Webhook Error:", error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":
            case "payment_intent.succeeded": {
                const object = event.data.object;
                let session = object;

                if (event.type === "payment_intent.succeeded") {
                    const sessionList = await stripeInstance.checkout.sessions.list({
                        payment_intent: object.id,
                    });
                    session = sessionList.data[0];
                }

                if (!session || !session.metadata) {
                    break;
                }

                const { transactionId, appId, planName } = session.metadata;

                // 1. Account Purchase Fulfillment
                if (appId === "social-profile-marketplace" && transactionId) {
                    const transaction = await prisma.transaction.update({
                        where: { id: transactionId },
                        data: { isPaid: true },
                    });

                    // Send credentials to purchaser via Inngest
                    await inngest.send({
                        name: "app/purchase",
                        data: { transaction },
                    });

                    // Mark listing as sold
                    await prisma.listing.update({
                        where: { id: transaction.listingId },
                        data: { status: "sold" }
                    });

                    // Add earned balance to seller
                    await prisma.user.update({
                        where: { id: transaction.ownerId },
                        data: { earned: { increment: transaction.amount } }
                    });
                }

                // 2. Founder Plan Subscription Fulfillment
                if (planName) {
                    console.log(`Plan checkout succeeded for plan: ${planName}`);
                }

                break;
            }

            default:
                console.log("Unhandled event type:", event.type);
        }
        response.json({ received: true });
    } catch (err) {
        console.error("Webhook processing error:", err);
        response.status(500).send("Internal Server Error");
    }
};
