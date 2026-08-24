import { X, CheckCircle2, Info, Calendar, User, Sparkles, DollarSign } from "lucide-react";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const ListingDetailsModal = ({ listing, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md shrink-0">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-pink-200">VentureHUB Listing</span>
                        <h3 className="font-extrabold text-xl truncate mt-0.5">{listing.title}</h3>
                        <p className="text-xs text-pink-100 font-medium">
                            @{listing.username} • <span className="capitalize">{listing.platform} Platform</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
                        <X className="size-5 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
                    {/* Image Carousel */}
                    {listing.images?.length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {listing.images?.map((img, i) => (
                                <img key={i} src={img} alt={`${listing.title}-${i}`} className="rounded-2xl border border-gray-200 object-cover h-32 w-full shadow-xs" />
                            ))}
                        </div>
                    )}

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3.5 bg-pink-50/50 border border-pink-100 rounded-2xl">
                            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Followers / Backers</p>
                            <p className="text-base font-extrabold text-[#a11c5e] mt-0.5">{listing.followers_count ? listing.followers_count.toLocaleString('en-IN') : 'N/A'}</p>
                        </div>
                        <div className="p-3.5 bg-purple-50/50 border border-purple-100 rounded-2xl">
                            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Engagement / Growth</p>
                            <p className="text-base font-extrabold text-purple-700 mt-0.5">{listing.engagement_rate ? `${listing.engagement_rate}%` : 'N/A'}</p>
                        </div>
                        <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                            <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Monthly Traffic</p>
                            <p className="text-base font-extrabold text-blue-600 mt-0.5">{listing.monthly_views ? listing.monthly_views.toLocaleString('en-IN') : 'N/A'}</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Niche</p>
                            <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">{listing.niche}</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Country</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">{listing.country}</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Target Audience</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">{listing.age_range}</p>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            listing.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            listing.status === "sold" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            listing.status === "ban" ? "bg-red-50 text-red-700 border-red-200" :
                            "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                            {listing.status || 'Active'}
                        </span>
                        {listing.verified && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-pink-50 text-[#a11c5e] border border-pink-200 px-3 py-1 rounded-full">
                                <CheckCircle2 className="size-3.5" /> Verified Venture
                            </span>
                        )}
                        {listing.monetized && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                                <DollarSign className="size-3.5" /> Generating Revenue
                            </span>
                        )}
                        {listing.featured && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full">
                                <Sparkles className="size-3.5" /> Featured
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                            <Info className="size-4 text-[#a11c5e]" /> Executive Summary
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
                    </div>

                    {/* Owner Info */}
                    {listing.owner && (
                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <User className="size-3.5 text-gray-400" /> Listing Owner
                            </h4>
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <img src={listing.owner.image || assets.user_profile} alt={listing.owner.name} className="size-10 rounded-full object-cover border-2 border-pink-200 shrink-0" />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{listing.owner.name}</p>
                                    <p className="text-xs text-slate-500 font-medium">{listing.owner.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Price Section */}
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Calendar className="size-4 text-gray-400" /> Listed on {new Date(listing.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Funding Goal / Target</p>
                            <p className="text-xl font-extrabold text-[#a11c5e]">{formatINR(listing.price)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailsModal;
