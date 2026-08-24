import { BadgeCheck, MapPin, Users, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { platformIcons } from '../assets/assets';

const ListingCard = ({ listing }) => {
    const currency = import.meta.env.VITE_CURRENCY || '₹';
    const navigate = useNavigate();

    return (
        <div className='relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition'>
            {/* Featured Banner */}
            {listing.featured && (
                <>
                    <p className='py-1' />
                    <div className='absolute top-0 left-0 w-full bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white text-center text-xs font-semibold py-1 tracking-wide uppercase shadow-xs'>
                        Featured Startup
                    </div>
                </>
            )}

            <div className='p-5 pt-8'>
                {/* Header */}
                <div className='flex items-center gap-3 mb-3'>
                    {platformIcons[listing.platform]}

                    <div className='flex flex-col'>
                        <h2 className='text-gray-800 font-semibold text-base'>{listing.title}</h2>
                        <p className='text-sm text-gray-500'>
                            Startup ID: @{listing.username} • {listing.platform.charAt(0).toUpperCase() + listing.platform.slice(1)}
                        </p>
                    </div>

                    {listing.verified && <BadgeCheck className='text-green-500 ml-auto w-5 h-5' />}
                </div>

                {/* Investor Traction Metrics */}
                {(listing.followers_count > 0 || listing.engagement_rate > 0 || listing.monthly_views > 0) && (
                    <div className='flex flex-wrap justify-between items-center gap-3 my-4 bg-slate-50 p-3 rounded-xl border border-gray-100'>
                        {listing.followers_count > 0 && (
                            <div className='flex items-center text-xs text-gray-600 font-medium'>
                                <Users className='size-4 mr-1 text-[#a11c5e]' />
                                <span className='font-bold text-slate-800 mr-1'>
                                    {listing.followers_count.toLocaleString('en-IN')}
                                </span>
                                investors
                            </div>
                        )}

                        {listing.engagement_rate > 0 && (
                            <div className='flex items-center text-xs text-gray-600 font-medium'>
                                <LineChart className='size-4 mr-1 text-[#a11c5e]' />
                                <span className='font-bold text-slate-800 mr-1'>
                                    {listing.engagement_rate}%
                                </span>
                                interest
                            </div>
                        )}
                    </div>
                )}

                {/* Industry & Market */}
                <div className='flex items-center gap-3 mb-3'>
                    <span className='text-xs font-semibold bg-pink-50 text-[#a11c5e] border border-pink-200 px-3 py-1 rounded-full capitalize'>
                        {listing.niche}
                    </span>
                    {listing.country && (
                        <div className='flex items-center text-gray-500 text-sm'>
                            <MapPin className='size-6 mr-1 text-gray-400' />
                            {listing.country}
                        </div>
                    )}
                </div>

                {/* Pitch Preview */}
                <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                    {listing.description}
                </p>

                <hr className='my-5 border-gray-200' />

                {/* Footer */}
                <div className='flex items-center justify-between gap-3'>
                    <div>
                        <div className='flex items-baseline'>
                            <span className='text-2xl font-bold text-slate-800'>
                                {currency}
                                {(listing.remainingTarget !== undefined ? listing.remainingTarget : listing.price).toLocaleString('en-IN')}
                            </span>
                            <span className='text-xs text-gray-500 ml-1.5 font-medium'>Remaining Ask</span>
                        </div>
                        {listing.totalRaised > 0 && (
                            <p className='text-[11px] text-emerald-600 font-bold mt-0.5'>
                                ₹{listing.totalRaised.toLocaleString('en-IN')} Raised (Goal: ₹{listing.price.toLocaleString('en-IN')})
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            navigate(`/listing/${listing.id}`);
                            scrollTo(0, 0);
                        }}
                        className='px-6 py-2.5 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all'
                    >
                        View Startup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
