import { useState, useMemo, useEffect } from "react";
import { MessageCircle, Search, Loader2Icon } from "lucide-react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { setChat } from "../app/features/chatSlice";
import { useDispatch } from "react-redux";
import api from "../configs/axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";

export default function Messages() {
    const dispatch = useDispatch();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    const [chats, setChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const currentUserEmail = user?.emailAddresses?.[0]?.emailAddress;

    const formatTime = (dateString) => {
        if (!dateString) return "";

        const date = parseISO(dateString);

        if (isToday(date)) {
            return "Today " + format(date, "HH:mm");
        }

        if (isYesterday(date)) {
            return "Yesterday " + format(date, "HH:mm");
        }

        return format(date, "MMM d");
    };

    const filteredChats = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return chats.filter((chat) => {
            const isOwner = chat.ownerUserId === user?.id || (chat.listing?.owner?.email && chat.listing?.owner?.email === currentUserEmail) || (chat.ownerUser?.email && chat.ownerUser?.email === currentUserEmail);
            const otherParticipant = isOwner ? chat?.chatUser : chat?.ownerUser;

            return (
                chat.listing?.title?.toLowerCase().includes(query) ||
                otherParticipant?.name?.toLowerCase().includes(query) ||
                otherParticipant?.email?.toLowerCase().includes(query)
            );
        });
    }, [chats, searchQuery, user, currentUserEmail]);

    const handleOpenChat = (chat) => {
        dispatch(setChat({ listing: chat.listing, chatId: chat.id }));
    };

    const fetchUserChats = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get("/api/chat/user", { headers: { Authorization: `Bearer ${token}` } });
            setChats(data.chats || []);
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && isLoaded) {
            fetchUserChats();
            const interval = setInterval(() => {
                fetchUserChats();
            }, 10 * 1000);
            return () => clearInterval(interval);
        }
    }, [user, isLoaded]);

    if (!isLoaded) {
        return (
            <div className="mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-center text-gray-500">
                Loading messages...
            </div>
        );
    }

    return (
        <div className="mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 py-6">
            <div className="py-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
                    <p className="text-gray-600">Direct discussions with startup founders and accredited investors</p>
                </div>

                {/* Search */}
                <div className="relative max-w-xl mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search conversations by title or participant name..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-[#a11c5e] focus:ring-2 focus:ring-pink-200 text-slate-700 placeholder:text-gray-400 shadow-xs" 
                    />
                </div>

                {/* Chat List */}
                {loading ? (
                    <div className="text-center text-gray-500 py-20 flex justify-center items-center gap-2">
                        <Loader2Icon className="animate-spin text-[#a11c5e] size-6" /> Loading messages...
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-16 text-center">
                        <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-100">
                            <MessageCircle className="w-8 h-8 text-[#a11c5e]" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{searchQuery ? "No chats found" : "No messages yet"}</h3>
                        <p className="text-gray-600">{searchQuery ? "Try a different search term" : 'Start a conversation by viewing a listing and clicking "Message Founder"'}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xs border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                        {filteredChats.map((chat) => {
                            const isOwner = chat.ownerUserId === user?.id || (chat.listing?.owner?.email && chat.listing?.owner?.email === currentUserEmail) || (chat.ownerUser?.email && chat.ownerUser?.email === currentUserEmail);
                            const otherParticipant = isOwner ? chat.chatUser : chat.ownerUser;

                            // Resolve profile image dynamically from Clerk profile or database user record
                            const participantImage = (otherParticipant?.id === user?.id || otherParticipant?.email === currentUserEmail)
                                ? (user?.imageUrl || otherParticipant?.image || assets.user_profile)
                                : (otherParticipant?.image || assets.user_profile);

                            const participantName = (otherParticipant?.id === user?.id || otherParticipant?.email === currentUserEmail)
                                ? (user?.fullName || otherParticipant?.name || "User")
                                : (otherParticipant?.name || "Participant");

                            return (
                                <button 
                                    key={chat.id} 
                                    onClick={() => handleOpenChat(chat)} 
                                    className="w-full p-5 hover:bg-pink-50/40 transition-colors text-left group"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="shrink-0">
                                            <img 
                                                src={participantImage} 
                                                alt={participantName} 
                                                className="w-12 h-12 rounded-full object-cover border border-pink-200 shadow-xs" 
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-gray-800 truncate group-hover:text-[#a11c5e] transition-colors">{chat.listing?.title || "Startup Listing"}</h3>
                                                <span className="text-xs text-gray-500 shrink-0 ml-2 font-medium">{formatTime(chat.updatedAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-pink-50 text-[#a11c5e] border border-pink-100">
                                                    {isOwner ? "Investor" : "Founder"}
                                                </span>
                                                <p className="text-sm font-semibold text-slate-700 truncate">{participantName}</p>
                                            </div>
                                            <p className={`text-sm truncate ${!chat.isLastMessageRead && chat.lastMessageSenderId !== user?.id ? "text-[#a11c5e] font-bold" : "text-gray-500"}`}>{chat.lastMessage || "No messages yet"}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
