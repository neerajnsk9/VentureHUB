import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearChat } from "../app/features/chatSlice";
import { useAuth, useUser } from "@clerk/clerk-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import api from "../configs/axios";
import { assets } from "../assets/assets";

const ChatBox = () => {
    const { listing, isOpen, chatId } = useSelector((state) => state.chat);

    const dispatch = useDispatch();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [resolvedUserId, setResolvedUserId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const currentUserEmail = user?.emailAddresses?.[0]?.emailAddress;
    const effectiveUserId = resolvedUserId || user?.id;
    const isOwner = effectiveUserId === listing?.ownerId || effectiveUserId === chat?.ownerUserId || (listing?.owner?.email && listing?.owner?.email === currentUserEmail) || (chat?.ownerUser?.email && chat?.ownerUser?.email === currentUserEmail);
    const otherParticipant = isOwner ? chat?.chatUser : (chat?.ownerUser || listing?.owner);
    const participantRole = isOwner ? "Investor" : "Founder";

    // Resolve participant profile image & name
    const participantImage = (otherParticipant?.id === user?.id || otherParticipant?.email === currentUserEmail)
        ? (user?.imageUrl || otherParticipant?.image || assets.user_profile)
        : (otherParticipant?.image || assets.user_profile);

    const participantName = (otherParticipant?.id === user?.id || otherParticipant?.email === currentUserEmail)
        ? (user?.fullName || otherParticipant?.name || "User")
        : (otherParticipant?.name || (isOwner ? 'Investor' : 'Ned Stark'));

    const fetchChat = async () => {
        try {
            const token = await getToken();
            const { data } = await api.post("/api/chat", { listingId: listing.id, chatId }, { headers: { Authorization: `Bearer ${token}` } });
            setChat(data?.chat);
            setMessages(data?.chat?.messages || []);
            if (data?.currentUserId) setResolvedUserId(data.currentUserId);
            setIsLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
            console.log(error);
        }
    };

    useEffect(() => {
        if (listing) {
            fetchChat();
            const interval = setInterval(() => {
                fetchChat();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [listing]);

    // --- Auto Scroll ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    useEffect(() => {
        if (!isOpen) {
            setChat(null);
            setMessages([]);
            setIsLoading(true);
            setNewMessage("");
            setIsSending(false);
        }
    }, [isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;
        try {
            setIsSending(true);
            const token = await getToken();
            const { data } = await api.post("/api/chat/send-message", { chatId: chat.id, message: newMessage }, { headers: { Authorization: `Bearer ${token}` } });
            setMessages([...messages, data.newMessage]);
            setNewMessage("");
            setIsSending(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
            console.log(error);
            setIsSending(false);
        }
    };

    if (!isOpen || !listing || !isLoaded || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-100 flex items-center justify-center sm:p-4">
            <div className="bg-white sm:rounded-2xl shadow-2xl w-full max-w-2xl h-screen sm:h-150 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img 
                            src={participantImage} 
                            alt={participantName} 
                            className="size-10 rounded-full object-cover border border-pink-200/50 shadow-xs" 
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base sm:text-lg truncate">{listing?.title}</h3>
                            <p className="text-xs text-pink-100 truncate font-semibold">
                                {participantName}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => dispatch(clearChat())} className="ml-4 p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2Icon className="size-6 animate-spin text-[#a11c5e]" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <p className="text-gray-500 mb-2 font-medium">No messages yet</p>
                                <p className="text-sm text-gray-400">Start the conversation!</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((message) => {
                            const isMine = message.sender_id === effectiveUserId;
                            return (
                            <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[75%] rounded-2xl p-3 pb-1.5 shadow-xs ${isMine ? "bg-gradient-to-r from-[#702371] to-[#a11c5e] text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"}`}>
                                    <p className="text-sm wrap-break-word whitespace-pre-wrap">{message.message}</p>
                                    <p className={`text-[10px] mt-1 ${isMine ? "text-pink-100" : "text-gray-400"}`}>{format(new Date(message.createdAt), "MMM dd 'at' h:mm a")}</p>
                                </div>
                            </div>
                        );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {chat?.listing?.status === "active" ? (
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-end space-x-2">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-[#a11c5e] focus:ring-2 focus:ring-pink-200 max-h-32 text-slate-700 shadow-xs"
                                rows={1}
                            />
                            <button type="submit" disabled={!newMessage.trim() || isSending} className="bg-gradient-to-r from-[#702371] to-[#a11c5e] hover:opacity-95 text-white p-3 rounded-xl disabled:opacity-50 transition-all shadow-md shadow-pink-500/20 active:scale-95 cursor-pointer">
                                {isSending ? <Loader2Icon className="w-5 h-5 animate-spin text-white" /> : <Send className="w-5 h-5" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
                    </form>
                ) : (
                    <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">{chat ? `Listing is ${chat?.listing?.status}` : "Loading chat..."}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBox;
