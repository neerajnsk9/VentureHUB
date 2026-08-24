import prisma from "../configs/prisma.js";
import { clerkClient, getAuth } from "@clerk/express";

const founderEmail = "startupxfounder@gmail.com";
const founderId = "user_startupxfounder";
const founderProfile = {
    id: founderId,
    email: founderEmail,
    name: "Ned Stark",
    image: "",
};

const resolveAppUserId = async (req) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return null;
    }

    try {
        if (process.env.CLERK_SECRET_KEY) {
            const user = await clerkClient.users.getUser(userId);
            const userEmail = user?.emailAddresses?.[0]?.emailAddress;
            if (userEmail === founderEmail) {
                return founderId;
            }
        }
    } catch (error) {
        console.log("Error in resolveAppUserId:", error);
    }

    return userId;
};

// Controller for getting chat ( creating if not exist )
export const getChat = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const { listingId, chatId } = req.body;

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // Find Existing Chat
        let existingChat = null;
        if (chatId) {
            existingChat = await prisma.chat.findFirst({
                where: { id: chatId, OR: [{ chatUserId: userId }, { ownerUserId: userId }] },
                include: { listing: true, ownerUser: true, chatUser: true, messages: true },
            });
        } else {
            existingChat = await prisma.chat.findFirst({
                where: { listingId, chatUserId: userId, ownerUserId: listing.ownerId },
                include: { listing: true, ownerUser: true, chatUser: true, messages: true },
            });
        }

        if (existingChat) {
            res.json({ chat: existingChat, currentUserId: userId });
            if (existingChat.isLastMessageRead === false) {
                const lastMessage = existingChat.messages[existingChat.messages.length - 1];
                const isLastMessageSendByMe = lastMessage?.sender_id === userId;

                if (!isLastMessageSendByMe && lastMessage) {
                    await prisma.chat.update({
                        where: { id: existingChat.id },
                        data: { isLastMessageRead: true },
                    });
                }
            }
            return null;
        }

        // Ensure both chat user and founder user exist in database WITHOUT mutating existing name/image
        const existingChatUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!existingChatUser) {
            await prisma.user.create({
                data: {
                    id: userId,
                    email: "investor@venturehub.in",
                    name: "VentureHUB Investor",
                    image: "",
                },
            });
        }

        const existingOwnerUser = await prisma.user.findUnique({ where: { id: listing.ownerId } });
        if (!existingOwnerUser) {
            await prisma.user.create({
                data: {
                    id: listing.ownerId,
                    email: founderProfile.email,
                    name: founderProfile.name,
                    image: founderProfile.image,
                },
            });
        }

        const newChat = await prisma.chat.create({
            data: {
                listingId,
                chatUserId: userId,
                ownerUserId: listing.ownerId,
            },
        });

        const chatWithData = await prisma.chat.findUnique({
            where: { id: newChat.id },
            include: { listing: true, ownerUser: true, chatUser: true },
        });

        return res.json({ chat: chatWithData, currentUserId: userId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For Getting All Chats For User
export const getAllUserChats = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);

        const chats = await prisma.chat.findMany({
            where: {
                OR: [{ chatUserId: userId }, { ownerUserId: userId }],
            },
            include: { 
                listing: true, 
                ownerUser: true, 
                chatUser: true,
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        if (!chats || chats.length === 0) {
            return res.json({ chats: [] });
        }

        const syncedChats = await Promise.all(
            chats.map(async (chat) => {
                const latestMsg = chat.messages?.[0];
                const realLastMessage = latestMsg ? latestMsg.message : "";
                
                if (chat.lastMessage !== realLastMessage) {
                    chat.lastMessage = realLastMessage;
                    await prisma.chat.update({
                        where: { id: chat.id },
                        data: { lastMessage: realLastMessage },
                    }).catch(() => {});
                }
                return chat;
            })
        );

        return res.json({ chats: syncedChats });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Controller For adding Message to Chat
export const sendChatMessage = async (req, res) => {
    try {
        const userId = await resolveAppUserId(req);
        const { chatId, message } = req.body;

        const chat = await prisma.chat.findFirst({
            where: {
                AND: [{ id: chatId }, { OR: [{ chatUserId: userId }, { ownerUserId: userId }] }],
            },
            include: { listing: true, ownerUser: true, chatUser: true },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        } else if (chat.listing.status !== "active") {
            return res.status(400).json({ message: `Listing is ${chat.listing.status}` });
        }

        const newMessage = {
            message,
            sender_id: userId,
            chatId,
            createdAt: new Date(),
        };

        await prisma.message.create({
            data: newMessage,
        });

        res.json({ message: "Message Sent", newMessage });

        await prisma.chat.update({
            where: { id: chatId },
            data: { lastMessage: newMessage.message, isLastMessageRead: false, lastMessageSenderId: userId },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};
