import { useSelector } from "react-redux";
import FilterSidebar from "../components/FilterSidebar";
import ListingCard from "../components/ListingCard";
import { ArrowLeftIcon, SlidersHorizontal, Search, RotateCcw, Building2, Check, DollarSign, Award } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";

const Marketplace = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQueryParam = searchParams.get("search") || "";

    const { listings } = useSelector((state) => state.listing);

    const [searchQuery, setSearchQuery] = useState(searchQueryParam);
    const [sortBy, setSortBy] = useState("featured");
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const [filters, setFilters] = useState({
        platform: null,
        maxPrice: 100000000,
        minFollowers: 0,
        niche: null,
        verified: false,
        monetized: false,
    });

    const resetFilters = () => {
        setFilters({
            platform: null,
            maxPrice: 100000000,
            minFollowers: 0,
            niche: null,
            verified: false,
            monetized: false,
        });
        setSearchQuery("");
        setSearchParams({});
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.trim()) {
            setSearchParams({ search: val });
        } else {
            setSearchParams({});
        }
    };

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.platform && filters.platform.length > 0) count++;
        if (filters.niche && filters.niche.length > 0) count++;
        if (filters.verified) count++;
        if (filters.monetized) count++;
        if (filters.maxPrice < 100000000) count++;
        if (filters.minFollowers > 0) count++;
        if (searchQuery.trim()) count++;
        return count;
    }, [filters, searchQuery]);

    const filteredListings = useMemo(() => {
        return listings.filter((listing) => {
            if (filters.platform && filters.platform.length > 0) {
                if (!filters.platform.includes(listing.platform)) return false;
            }

            if (filters.maxPrice) {
                if (listing.price > filters.maxPrice) return false;
            }

            if (filters.minFollowers) {
                if (listing.followers_count < filters.minFollowers) return false;
            }

            if (filters.niche && filters.niche.length > 0) {
                if (!filters.niche.includes(listing.niche)) return false;
            }

            if (filters.verified && !listing.verified) return false;

            if (filters.monetized && !listing.monetized) return false;

            const term = searchQuery.trim().toLowerCase();
            if (term) {
                const matchTitle = listing.title?.toLowerCase().includes(term);
                const matchUser = listing.username?.toLowerCase().includes(term);
                const matchDesc = listing.description?.toLowerCase().includes(term);
                const matchPlatform = listing.platform?.toLowerCase().includes(term);
                const matchNiche = listing.niche?.toLowerCase().includes(term);
                const matchCountry = listing.country?.toLowerCase().includes(term);

                if (!matchTitle && !matchUser && !matchDesc && !matchPlatform && !matchNiche && !matchCountry) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            if (sortBy === "price_asc") return a.price - b.price;
            if (sortBy === "price_desc") return b.price - a.price;
            if (sortBy === "followers_desc") return b.followers_count - a.followers_count;
            return a.featured ? -1 : b.featured ? 1 : 0;
        });
    }, [listings, filters, searchQuery, sortBy]);

    return (
        <div className="px-4 md:px-12 lg:px-16 xl:px-24 py-6 min-h-screen">
            {/* Top Navigation */}
            <div className="flex items-center justify-between text-slate-500 mb-4">
                <button 
                    onClick={() => { navigate("/"); scrollTo(0, 0); }} 
                    className="flex items-center gap-2 text-sm font-medium hover:text-slate-800 transition" 
                >
                    <ArrowLeftIcon className="size-4" /> Back to Home
                </button>
            </div>

            {/* Header Hero Banner */}
            <div className="bg-gradient-to-r from-[#702371]/5 via-[#a11c5e]/5 to-transparent border border-pink-100 rounded-3xl p-6 sm:p-8 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#a11c5e] text-xs font-bold uppercase tracking-wider mb-2">
                            <Building2 className="size-4" /> Startup Marketplace
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Discover & Acquire High-Growth Startups
                        </h1>
                        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                            Explore vetted Indian technology ventures, D2C brands, and SaaS platforms open for acquisition, investment, and strategic partnerships.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative min-w-[260px] sm:min-w-[340px]">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search startups by name, city, industry..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full text-sm pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#a11c5e] text-slate-700 shadow-xs"
                        />
                    </div>
                </div>
            </div>

            {/* Flipkart / Myntra Style Top Filter & Quick Chips Toolbar */}
            <div className="sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-2.5 sm:p-3.5 mb-8 shadow-xs">
                <div className="flex items-center justify-between gap-2.5">
                    {/* Left: Filter Drawer Trigger Button + Horizontal Scrollable Quick Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full flex-1">
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                        >
                            <SlidersHorizontal className="size-4 text-pink-400" />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="bg-[#a11c5e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-0.5">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                        <div className="h-5 w-px bg-gray-200 shrink-0" />

                        {/* Quick Budget Chips */}
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, maxPrice: 100000000 }))}
                            className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer shrink-0 ${
                                filters.maxPrice === 100000000
                                    ? "bg-[#a11c5e] text-white border-[#a11c5e] font-bold"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            All Budgets
                        </button>

                        <button
                            onClick={() => setFilters(prev => ({ ...prev, maxPrice: prev.maxPrice === 5000000 ? 100000000 : 5000000 }))}
                            className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer shrink-0 ${
                                filters.maxPrice === 5000000
                                    ? "bg-pink-50 text-[#a11c5e] border-pink-200 font-bold"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            Under ₹50L
                        </button>

                        <button
                            onClick={() => setFilters(prev => ({ ...prev, maxPrice: prev.maxPrice === 10000000 ? 100000000 : 10000000 }))}
                            className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer shrink-0 ${
                                filters.maxPrice === 10000000
                                    ? "bg-pink-50 text-[#a11c5e] border-pink-200 font-bold"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            Under ₹1Cr
                        </button>

                        <button
                            onClick={() => setFilters(prev => ({ ...prev, maxPrice: prev.maxPrice === 50000000 ? 100000000 : 50000000 }))}
                            className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer shrink-0 ${
                                filters.maxPrice === 50000000
                                    ? "bg-pink-50 text-[#a11c5e] border-pink-200 font-bold"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            Under ₹5Cr
                        </button>

                        <button
                            onClick={() => setFilters(prev => ({ ...prev, verified: !prev.verified }))}
                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer shrink-0 ${
                                filters.verified
                                    ? "bg-pink-50 text-[#a11c5e] border-pink-200 font-bold"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            <Award className="size-3.5" /> Registered
                        </button>

                        <button
                            onClick={() => setFilters(prev => ({ ...prev, monetized: !prev.monetized }))}
                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl font-medium border transition cursor-pointer shrink-0 ${
                                filters.monetized
                                    ? "bg-green-50 text-green-700 border-green-200 font-bold"
                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                        >
                            <DollarSign className="size-3.5" /> Revenue
                        </button>

                        {activeFilterCount > 0 && (
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 font-semibold px-2 py-1 transition shrink-0"
                            >
                                <RotateCcw className="size-3" /> Reset
                            </button>
                        )}
                    </div>

                    {/* Right: Counter & Sort Selector */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold text-slate-500 hidden xl:inline">
                            {filteredListings.length} {filteredListings.length === 1 ? "Startup" : "Startups"}
                        </span>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-50 border border-gray-200 text-slate-700 text-xs font-semibold rounded-xl px-2 py-2 outline-none cursor-pointer focus:border-[#a11c5e] shrink-0"
                        >
                            <option value="featured">Sort: Featured</option>
                            <option value="price_asc">Goal: Low to High</option>
                            <option value="price_desc">Goal: High to Low</option>
                            <option value="followers_desc">Interest: Highest</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Slide-over Filter Drawer Panel */}
            <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
            />

            {/* Un-Squeezed Full-Width Startup Cards Grid (3 Columns on Large Screens) */}
            {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                        <ListingCard listing={listing} key={listing.id} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto my-12 shadow-xs">
                    <div className="w-16 h-16 bg-pink-50 text-[#a11c5e] rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-100">
                        <Search className="size-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">No Startups Match Your Filter</h3>
                    <p className="text-slate-500 text-sm mt-2 mb-6">
                        Try resetting your budget or category filters to view available startups.
                    </p>
                    <button
                        onClick={resetFilters}
                        className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
