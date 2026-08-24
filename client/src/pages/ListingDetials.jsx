import { DollarSign, Users, LineChart, Eye, Calendar, MapPin, CheckCircle2, ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, Loader2Icon, MessageSquareMoreIcon, TrendingUp, X, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { assets, getProfileLink, platformIcons } from '../assets/assets';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { setChat } from '../app/features/chatSlice';
import { getAllPublicListing, setListings } from '../app/features/listingSlice';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import api from '../configs/axios';

export default function ListingDetails() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const { openSignIn } = useClerk();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [listing, setListing] = useState(null);
    const [loadingListing, setLoadingListing] = useState(true);
    const [showInvestModal, setShowInvestModal] = useState(false);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [isInvesting, setIsInvesting] = useState(false);

    const { listingId } = useParams();
    const { listings, userListings } = useSelector((state) => state.listing);

    const listingOwnerEmail = listing?.owner?.email;
    const currentUserEmail = user?.emailAddresses?.[0]?.emailAddress;
    const isFounderUser = listingOwnerEmail === "startupxfounder@gmail.com" || listingOwnerEmail === currentUserEmail;

    const founderInfo = listing
        ? {
            ...listing.owner,
            name: listing.owner?.name || (isFounderUser && user?.fullName ? user.fullName : "Ned Stark"),
            email: listing.owner?.email || "startupxfounder@gmail.com",
            image: (listing.owner?.image && listing.owner.image.trim() !== '')
                ? listing.owner.image
                : ((isFounderUser && user?.imageUrl) ? user.imageUrl : assets.user_profile),
            createdAt: listing.owner?.createdAt || listing.createdAt || "2024-01-15T00:00:00.000Z",
        }
        : null;

    const loadChatbox = () => {
        if (!user && isLoaded) {
            return openSignIn();
        }
        dispatch(setChat({ listing, chatId: null }));
    };

    useEffect(() => {
        const loadDetail = async () => {
            setLoadingListing(true);

            // Check Redux store first
            let foundListing = listings.find((item) => item.id === listingId);
            if (!foundListing) {
                foundListing = userListings.find((item) => item.id === listingId);
            }

            if (foundListing) {
                setListing(foundListing);
                const initialAsk = foundListing.remainingTarget !== undefined ? foundListing.remainingTarget : (foundListing.price || 0);
                setSelectedPreset(initialAsk);
                setCustomAmount(initialAsk.toString());
                setLoadingListing(false);
                return;
            }

            // Fallback: Fetch directly from API
            try {
                const { data } = await api.get('/api/listing/public');
                if (data?.listings) {
                    dispatch(setListings(data.listings));
                    const match = data.listings.find((item) => item.id === listingId);
                    if (match) {
                        setListing(match);
                        const initialAsk = match.remainingTarget !== undefined ? match.remainingTarget : (match.price || 0);
                        setSelectedPreset(initialAsk);
                        setCustomAmount(initialAsk.toString());
                    }
                }
            } catch (err) {
                console.log('Error fetching listing details:', err);
            } finally {
                setLoadingListing(false);
            }
        };

        loadDetail();
    }, [listingId, listings, userListings, dispatch]);

    const [current, setCurrent] = useState(0);
    const images = listing?.images || [];

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const openInvestFlow = () => {
        if (!user && isLoaded) {
            return openSignIn();
        }
        if (user?.id === listing?.ownerId) {
            return toast.error("You cannot invest in your own startup listing");
        }
        setShowInvestModal(true);
    };

    const handleStripeInvestment = async (e) => {
        e.preventDefault();
        const investVal = Number(customAmount);
        if (!investVal || investVal <= 0) {
            return toast.error("Please enter a valid investment amount");
        }

        try {
            setIsInvesting(true);
            toast.loading("Redirecting to Stripe Secure Checkout...");
            const token = await getToken();
            const { data } = await api.post(`/api/listing/purchase-account/${listing.id}`, { amount: investVal }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.dismissAll();
            if (data?.paymentLink) {
                window.location.href = data.paymentLink;
            } else {
                toast.error("Failed to generate Stripe checkout session");
                setIsInvesting(false);
            }
        } catch (error) {
            toast.dismissAll();
            console.log(error);
            toast.error(error?.response?.data?.message || error.message || "Investment payment failed");
            setIsInvesting(false);
        }
    };

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    if (loadingListing && !listing) {
        return (
            <div className='h-screen flex flex-col justify-center items-center bg-slate-50 gap-3'>
                <Loader2Icon className='size-8 animate-spin text-[#a11c5e]' />
                <p className='text-xs font-semibold text-slate-500'>Loading startup details...</p>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className='min-h-screen flex flex-col justify-center items-center bg-slate-50/50 p-6 text-center space-y-4'>
                <div className='size-14 bg-pink-50 text-[#a11c5e] rounded-2xl flex items-center justify-center'>
                    <AlertCircle className='size-7' />
                </div>
                <h2 className='text-2xl font-bold text-slate-900'>Startup Listing Not Found</h2>
                <p className='text-sm text-slate-600 max-w-md'>
                    The startup listing you are trying to view is unavailable or has been removed.
                </p>
                <Link to="/marketplace" className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white font-bold text-xs px-6 py-3 rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all'>
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className='mx-auto min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-6 bg-slate-50/50'>
            {/* Top Navigation */}
            <div className='max-w-6xl mx-auto flex items-center justify-between mb-6'>
                <button onClick={() => navigate(-1)} className='flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer'>
                    <ArrowLeftIcon className='w-4 h-4 mr-1.5' /> Back to Marketplace
                </button>
            </div>

            <div className='max-w-6xl mx-auto space-y-6'>
                {/* Top Section: 2 Separate Cards (Startup Info + Funding Ask on Left, Founder & Lead on Right) */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-6'>
                    {/* Left Card: Startup Title & Funding Ask */}
                    <div className='lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'>
                            <div className='flex items-start gap-4'>
                                <div className='p-3.5 bg-pink-50 rounded-2xl border border-pink-100 shrink-0'>
                                    {platformIcons[listing.platform]}
                                </div>
                                <div>
                                    <h1 className='text-2xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight'>
                                        {listing.title}
                                    </h1>
                                    <p className='text-slate-500 text-sm mt-1 font-medium'>
                                        Startup ID: @{listing.username} • <span className='capitalize'>{listing.platform} Platform</span>
                                    </p>
                                    <div className='flex flex-wrap gap-2 mt-3'>
                                        {listing.verified && (
                                            <span className='inline-flex items-center text-xs bg-pink-50 text-[#a11c5e] px-3 py-1 rounded-full font-bold border border-pink-200'>
                                                <CheckCircle2 className='w-3.5 h-3.5 mr-1' /> Verified Venture
                                            </span>
                                        )}
                                        {listing.monetized ? (
                                            <span className='inline-flex items-center text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200'>
                                                <DollarSign className='w-3.5 h-3.5 mr-1' /> Generating Revenue
                                            </span>
                                        ) : (
                                            <span className='inline-flex items-center text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold border border-amber-200'>
                                                Pre-Revenue
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Remaining Target Ask Box */}
                            <div className='sm:text-right bg-slate-50 p-5 rounded-3xl border border-slate-100 w-full sm:w-auto shrink-0 space-y-3 flex flex-col justify-between min-w-[210px]'>
                                <div>
                                    <p className='text-xs text-slate-500 font-bold uppercase tracking-wider'>Remaining Target / Ask</p>
                                    <h3 className='text-3xl font-extrabold text-[#a11c5e] mt-0.5'>
                                        {formatINR(listing.remainingTarget !== undefined ? listing.remainingTarget : listing.price)}
                                    </h3>
                                    {listing.totalRaised > 0 && (
                                        <p className='text-xs text-emerald-600 font-bold mt-1'>
                                            {formatINR(listing.totalRaised)} Raised (Goal: {formatINR(listing.price)})
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={openInvestFlow}
                                    className='w-full px-6 py-3 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white rounded-2xl font-extrabold text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer'
                                >
                                    <TrendingUp className='size-4' />
                                    <span>Invest in Startup</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Founder & Lead */}
                    <div className='bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-5'>
                        <div>
                            <h4 className='text-2xl font-extrabold text-slate-900 border-b border-gray-100 pb-3'>Founder & Lead</h4>
                            <div className='flex items-center gap-3.5 mt-4'>
                                <img
                                    src={founderInfo?.image || assets.user_profile}
                                    alt='founder'
                                    className='size-14 rounded-full object-cover border-2 border-pink-200 shadow-xs shrink-0'
                                />
                                <div>
                                    <h3 className='font-bold text-slate-900 text-base'>{founderInfo?.name}</h3>
                                    <p className='text-xs text-slate-500'>{founderInfo?.email}</p>
                                    <span className='inline-block text-[10px] font-bold text-[#a11c5e] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full mt-1'>
                                        Verified Founder
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={loadChatbox}
                            className='w-full bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white py-3 rounded-2xl font-extrabold text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer'
                        >
                            <MessageSquareMoreIcon className='size-4' />
                            <span>Direct Chat with Founder</span>
                        </button>
                    </div>
                </div>

                {/* Pitch Deck / Proof Images (Full Width) */}
                {images?.length > 0 && (
                    <div className='bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm'>
                        <div className='p-5 border-b border-gray-100 flex items-center justify-between'>
                            <h4 className='font-bold text-slate-900 text-base'>Pitch Deck & Traction Proof</h4>
                            <span className='text-xs text-slate-400 font-medium'>{images.length} Slide(s)</span>
                        </div>

                        <div className='relative w-full aspect-video overflow-hidden bg-slate-900'>
                            <div className='flex transition-transform duration-300 ease-in-out h-full' style={{ transform: `translateX(-${current * 100}%)` }}>
                                {images.map((img, index) => (
                                    <img key={index} src={img} alt='Startup Proof' className='w-full h-full object-contain shrink-0' />
                                ))}
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button onClick={prevSlide} className='absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full shadow transition-all cursor-pointer'>
                                        <ChevronLeftIcon className='w-5 h-5' />
                                    </button>
                                    <button onClick={nextSlide} className='absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full shadow transition-all cursor-pointer'>
                                        <ChevronRightIcon className='w-5 h-5' />
                                    </button>
                                    <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 px-3 py-1.5 rounded-full'>
                                        {images.map((_, index) => (
                                            <button key={index} onClick={() => setCurrent(index)} className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${current === index ? 'bg-pink-500 scale-110' : 'bg-white/50'}`} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6'>
                    <h4 className='font-bold text-slate-900 text-base mb-4'>Traction & Performance</h4>
                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-center'>
                        <div className='p-4 bg-pink-50/50 border border-pink-100 rounded-2xl'>
                            <Users className='mx-auto text-[#a11c5e] size-5 mb-1' />
                            <p className='font-extrabold text-slate-900 text-lg'>{listing.followers_count ? listing.followers_count.toLocaleString('en-IN') : 'N/A'}</p>
                            <p className='text-xs text-slate-500 font-medium mt-0.5'>Interested Backers</p>
                        </div>
                        <div className='p-4 bg-purple-50/50 border border-purple-100 rounded-2xl'>
                            <LineChart className='mx-auto text-purple-700 size-5 mb-1' />
                            <p className='font-extrabold text-slate-900 text-lg'>{listing.engagement_rate ? `${listing.engagement_rate}%` : 'N/A'}</p>
                            <p className='text-xs text-slate-500 font-medium mt-0.5'>Growth Rate</p>
                        </div>
                        <div className='p-4 bg-blue-50/50 border border-blue-100 rounded-2xl'>
                            <Eye className='mx-auto text-blue-600 size-5 mb-1' />
                            <p className='font-extrabold text-slate-900 text-lg'>{listing.monthly_views ? listing.monthly_views.toLocaleString('en-IN') : 'N/A'}</p>
                            <p className='text-xs text-slate-500 font-medium mt-0.5'>Monthly Traffic</p>
                        </div>
                        <div className='p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl'>
                            <Calendar className='mx-auto text-emerald-600 size-5 mb-1' />
                            <p className='font-extrabold text-slate-900 text-lg'>{new Date(listing.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
                            <p className='text-xs text-slate-500 font-medium mt-0.5'>Listed Date</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6'>
                    <h4 className='font-bold text-slate-900 text-base mb-3'>Startup Executive Summary</h4>
                    <p className='text-sm text-slate-700 leading-relaxed whitespace-pre-line'>{listing.description}</p>
                </div>

                {/* Startup Specifications */}
                <div className='bg-white rounded-3xl border border-gray-100 shadow-sm p-6'>
                    <h4 className='font-bold text-slate-900 text-base mb-4'>Venture Details</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                        <div className='p-3 bg-slate-50 rounded-xl'>
                            <p className='text-xs text-slate-400 font-medium'>Industry Niche</p>
                            <p className='font-bold text-slate-800 capitalize mt-0.5'>{listing.niche}</p>
                        </div>
                        <div className='p-3 bg-slate-50 rounded-xl'>
                            <p className='text-xs text-slate-400 font-medium'>Primary Market</p>
                            <p className='font-bold text-slate-800 mt-0.5 flex items-center gap-1'>
                                <MapPin className='size-3.5 text-gray-400' /> {listing.country}
                            </p>
                        </div>
                        <div className='p-3 bg-slate-50 rounded-xl'>
                            <p className='text-xs text-slate-400 font-medium'>Target Customer Age</p>
                            <p className='font-bold text-slate-800 mt-0.5'>{listing.age_range}</p>
                        </div>
                        <div className='p-3 bg-slate-50 rounded-xl'>
                            <p className='text-xs text-slate-400 font-medium'>Legal Entity</p>
                            <p className='font-bold text-slate-800 mt-0.5'>{listing.verified ? 'Verified Company' : 'Unregistered'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Investment Modal */}
            {showInvestModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in'>
                    <div className='bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-gray-100'>
                        <button
                            onClick={() => setShowInvestModal(false)}
                            className='absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
                        >
                            <X className='size-5' />
                        </button>

                        <div>
                            <div className='inline-flex items-center gap-1.5 text-xs font-bold text-[#a11c5e] bg-pink-50 border border-pink-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2'>
                                <Sparkles className='size-3.5' /> Stripe Investment
                            </div>
                            <h2 className='text-2xl font-extrabold text-slate-900'>Invest in {listing.title}</h2>
                            <p className='text-xs text-slate-500 mt-1'>
                                Direct equity/funding transaction for founder <strong className='text-slate-800'>{founderInfo?.name}</strong>
                            </p>
                        </div>

                        {/* Presets */}
                        <div className='space-y-2'>
                            <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Choose Investment Amount</label>
                            <div className='grid grid-cols-3 gap-2'>
                                {[10000, 25000, 50000, 100000, listing.price].map((val, idx) => (
                                    <button
                                        key={idx}
                                        type='button'
                                        onClick={() => { setSelectedPreset(val); setCustomAmount(val.toString()); }}
                                        className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                                            Number(customAmount) === val
                                                ? 'bg-[#a11c5e] text-white border-[#a11c5e] shadow-sm'
                                                : 'bg-slate-50 hover:bg-pink-50 border-gray-200 text-slate-700'
                                        }`}
                                    >
                                        {val === listing.price ? `Full Ask (${formatINR(val)})` : formatINR(val)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Input */}
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-slate-700 uppercase tracking-wider'>Custom Amount (INR)</label>
                            <div className='relative'>
                                <span className='absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-base'>₹</span>
                                <input
                                    type='number'
                                    min='100'
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    placeholder='Enter investment amount'
                                    className='w-full pl-9 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-base font-extrabold text-slate-900 outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100'
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs'>
                            <div className='flex justify-between text-slate-600'>
                                <span>Investment Amount</span>
                                <span className='font-bold text-slate-900'>{formatINR(Number(customAmount) || 0)}</span>
                            </div>
                            <div className='flex justify-between text-slate-600'>
                                <span>VentureHUB Escrow Fee</span>
                                <span className='font-bold text-emerald-600'>₹0 (Waived)</span>
                            </div>
                            <div className='pt-2 border-t border-gray-200 flex justify-between text-sm font-extrabold text-slate-900'>
                                <span>Total Due via Stripe</span>
                                <span className='text-[#a11c5e]'>{formatINR(Number(customAmount) || 0)}</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <form onSubmit={handleStripeInvestment}>
                            <button
                                type='submit'
                                disabled={isInvesting || !Number(customAmount)}
                                className='w-full bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white py-4 rounded-2xl font-extrabold text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50'
                            >
                                {isInvesting ? (
                                    <>
                                        <Loader2Icon className='size-5 animate-spin' /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className='size-4' />
                                        <span>Proceed to Pay via Stripe ({formatINR(Number(customAmount) || 0)})</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className='text-[10px] text-slate-400 text-center'>
                            Secured by Stripe Payments 256-bit encryption. Funds held safely in escrow.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
