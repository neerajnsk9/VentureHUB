import { useState } from "react";
import { Filter, X, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function FilterSidebar({ filters, setFilters, isOpen, onClose }) {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || "₹";
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    const onChangeSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (val) {
            setSearchParams({ search: val });
        } else {
            setSearchParams({});
        }
    };

    const onFiltersChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const onClearFilters = () => {
        setFilters({
            platform: null,
            maxPrice: 100000000,
            minFollowers: 0,
            niche: null,
            verified: false,
            monetized: false,
        });
        setSearch("");
        setSearchParams({});
    };

    const [expandedSections, setExpandedSections] = useState({
        price: true,
        niche: true,
        platform: true,
        status: true,
        followers: false,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const platforms = [
        { value: "tech", label: "Tech / Software" },
        { value: "youtube", label: "YouTube Channel" },
        { value: "instagram", label: "Instagram Page" },
        { value: "facebook", label: "Facebook Page" },
        { value: "twitter", label: "X / Twitter" },
        { value: "linkedin", label: "LinkedIn Company" },
    ];

    const niches = [
        { value: "tech", label: "Technology / SaaS" },
        { value: "business", label: "Business Services" },
        { value: "education", label: "EdTech & Learning" },
        { value: "health", label: "HealthTech & Medical" },
        { value: "finance", label: "FinTech & Payments" },
        { value: "lifestyle", label: "Lifestyle & D2C" },
        { value: "travel", label: "Travel & Hospitality" },
        { value: "food", label: "Food & Beverage" },
        { value: "entertainment", label: "Media & Entertainment" },
    ];

    const budgetPresets = [
        { label: "All Budgets", value: 100000000 },
        { label: "Under ₹50 Lakhs", value: 5000000 },
        { label: "Under ₹1 Crore", value: 10000000 },
        { label: "Under ₹5 Crores", value: 50000000 },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn">
            {/* Backdrop Click */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Slide-over Drawer Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-slideInRight">
                {/* Drawer Header (Flipkart / Myntra Style) */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2.5">
                        <SlidersHorizontal className="size-5 text-[#a11c5e]" />
                        <h3 className="font-bold text-slate-800 text-lg">Filters</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClearFilters}
                            className="text-xs font-semibold text-[#a11c5e] hover:underline"
                        >
                            Reset All
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200 transition"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Search Input */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Search Query</label>
                        <input
                            type="text"
                            placeholder="Search by name, city, tag..."
                            className="w-full text-sm px-3.5 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100 text-slate-700"
                            onChange={onChangeSearch}
                            value={search}
                        />
                    </div>

                    <hr className="border-gray-100" />

                    {/* Funding Goal (Flipkart/Myntra Range & Chip Style) */}
                    <div>
                        <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full mb-3">
                            <label className="text-sm font-bold text-slate-800">Funding Goal (Max Budget)</label>
                            <ChevronDown className={`size-4 text-gray-500 transition-transform ${expandedSections.price ? "rotate-180" : ""}`} />
                        </button>
                        
                        {expandedSections.price && (
                            <div className="pt-1 space-y-3">
                                {/* Budget Preset Chips */}
                                <div className="grid grid-cols-2 gap-2">
                                    {budgetPresets.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            onClick={() => onFiltersChange({ maxPrice: preset.value })}
                                            className={`text-xs px-3 py-2 rounded-xl font-medium border transition-all text-center ${
                                                filters.maxPrice === preset.value
                                                    ? "bg-[#a11c5e] text-white border-[#a11c5e] shadow-xs font-bold"
                                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Convenient Price Range Slider (₹1 Lakh - ₹10 Crores) */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                        <span>Max Funding Goal:</span>
                                        <span className="text-[#a11c5e] text-sm font-extrabold">
                                            Up to ₹{(filters.maxPrice || 100000000) >= 10000000 
                                                ? `${((filters.maxPrice || 100000000) / 10000000).toFixed(1)} Cr` 
                                                : `${((filters.maxPrice || 100000000) / 100000).toFixed(0)} Lakhs`}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100000"
                                        max="100000000"
                                        step="500000"
                                        value={filters.maxPrice || 100000000}
                                        onChange={(e) => onFiltersChange({ maxPrice: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#a11c5e]"
                                    />
                                    <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                                        <span>₹1 Lakh</span>
                                        <span>₹1 Cr</span>
                                        <span>₹5 Cr</span>
                                        <span>₹10 Cr</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Industry / Sector */}
                    <div>
                        <button onClick={() => toggleSection("niche")} className="flex items-center justify-between w-full mb-3">
                            <label className="text-sm font-bold text-slate-800">Industry / Sector</label>
                            <ChevronDown className={`size-4 text-gray-500 transition-transform ${expandedSections.niche ? "rotate-180" : ""}`} />
                        </button>
                        {expandedSections.niche && (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {niches.map((niche) => {
                                    const isSelected = filters.niche?.includes(niche.value);
                                    return (
                                        <label
                                            key={niche.value}
                                            className={`flex items-center justify-between p-2.5 rounded-xl border text-sm cursor-pointer transition ${
                                                isSelected ? "bg-pink-50 border-pink-200 text-[#a11c5e] font-semibold" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span>{niche.label}</span>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={isSelected || false}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const current = filters.niche || [];
                                                    const updated = checked ? [...current, niche.value] : current.filter((n) => n !== niche.value);
                                                    onFiltersChange({ niche: updated.length > 0 ? updated : null });
                                                }}
                                            />
                                            {isSelected && <Check className="size-4 text-[#a11c5e]" />}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Startup Type */}
                    <div>
                        <button onClick={() => toggleSection("platform")} className="flex items-center justify-between w-full mb-3">
                            <label className="text-sm font-bold text-slate-800">Startup Type</label>
                            <ChevronDown className={`size-4 text-gray-500 transition-transform ${expandedSections.platform ? "rotate-180" : ""}`} />
                        </button>
                        {expandedSections.platform && (
                            <div className="grid grid-cols-2 gap-2">
                                {platforms.map((platform) => {
                                    const isSelected = filters.platform?.includes(platform.value);
                                    return (
                                        <button
                                            key={platform.value}
                                            type="button"
                                            onClick={() => {
                                                const current = filters.platform || [];
                                                const updated = isSelected
                                                    ? current.filter((p) => p !== platform.value)
                                                    : [...current, platform.value];
                                                onFiltersChange({ platform: updated.length > 0 ? updated : null });
                                            }}
                                            className={`text-xs px-3 py-2.5 rounded-xl font-medium border text-left transition ${
                                                isSelected
                                                    ? "bg-[#702371] text-white border-[#702371]"
                                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                            }`}
                                        >
                                            {platform.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Verification & Status */}
                    <div>
                        <button onClick={() => toggleSection("status")} className="flex items-center justify-between w-full mb-3">
                            <label className="text-sm font-bold text-slate-800">Verification & Revenue</label>
                            <ChevronDown className={`size-4 text-gray-500 transition-transform ${expandedSections.status ? "rotate-180" : ""}`} />
                        </button>
                        {expandedSections.status && (
                            <div className="space-y-3 pt-1">
                                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                                    <span className="text-sm font-medium text-slate-800">Legally Registered (Pvt Ltd / LLP)</span>
                                    <input
                                        type="checkbox"
                                        className="size-4 accent-[#a11c5e] rounded"
                                        checked={filters.verified || false}
                                        onChange={(e) => onFiltersChange({ verified: e.target.checked })}
                                    />
                                </label>

                                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
                                    <span className="text-sm font-medium text-slate-800">Revenue Generating Only</span>
                                    <input
                                        type="checkbox"
                                        className="size-4 accent-[#a11c5e] rounded"
                                        checked={filters.monetized || false}
                                        onChange={(e) => onFiltersChange({ monetized: e.target.checked })}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Drawer Footer (Flipkart / Myntra Style) */}
                <div className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
                    <button
                        onClick={onClearFilters}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-300 font-semibold text-slate-700 text-sm hover:bg-gray-50 transition"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white font-semibold text-sm hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
