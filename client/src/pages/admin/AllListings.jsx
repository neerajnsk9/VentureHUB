import AdminTitle from '../../components/admin/AdminTitle';
import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import api from '../../configs/axios';
import toast from 'react-hot-toast';
import { Loader2Icon, Search, Eye, Filter, Building2, ChevronDown } from 'lucide-react';
import ListingDetailsModal from '../../components/admin/ListingDetailsModal';

const AllListings = () => {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(null);
    const { getToken } = useAuth();

    const fetchAllListings = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/admin/all-listings', { headers: { Authorization: `Bearer ${token}` } });
            setListings(data.listings);
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    const changeListingStatus = async (status, listing) => {
        try {
            toast.loading('Updating status...');
            const token = await getToken();
            const { data } = await api.put(`/api/admin/change-status/${listing.id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            await fetchAllListings();
            toast.dismissAll();
            toast.success(data.message);
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllListings();
    }, []);

    const filteredListings = listings.filter(item => {
        const matchesSearch =
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.niche?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    return (
        <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                    <AdminTitle text1='All' text2='Listings' />
                    <p className='text-xs text-gray-500 mt-1'>Manage all startup listings registered on VentureHUB</p>
                </div>
                <div className='flex items-center gap-3'>
                    {/* Search Input */}
                    <div className='relative min-w-[240px]'>
                        <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
                        <input
                            type="text"
                            placeholder="Search by title, owner, niche..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full text-xs pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100 text-slate-700 shadow-xs'
                        />
                    </div>

                    {/* Dropdown 1: Header Status Filter */}
                    <div className='relative shrink-0'>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`appearance-none text-xs font-bold pl-3.5 pr-8 py-2.5 rounded-xl border outline-none cursor-pointer shadow-xs transition-all ${
                                statusFilter === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                statusFilter === 'sold' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                statusFilter === 'ban' ? 'bg-red-50 text-red-700 border-red-200' :
                                statusFilter === 'inactive' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-white text-slate-700 border-gray-200 hover:border-pink-300 focus:border-[#a11c5e]'
                            }`}
                        >
                            <option value="all" className="bg-white text-slate-800 font-medium">Status</option>
                            <option value="active" className="bg-white text-emerald-700 font-bold">Active</option>
                            <option value="inactive" className="bg-white text-amber-700 font-bold">Inactive</option>
                            <option value="ban" className="bg-white text-red-700 font-bold">Banned</option>
                            <option value="sold" className="bg-white text-blue-700 font-bold">Sold</option>
                        </select>
                        <ChevronDown className='absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none text-gray-400' />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className='flex items-center justify-center py-20'>
                    <Loader2Icon className='animate-spin text-[#a11c5e] size-7' />
                </div>
            ) : (
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left text-gray-700'>
                            <thead>
                                <tr className='border-b border-gray-100 bg-slate-50/50'>
                                    <th className='pl-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider'>#</th>
                                    <th className='px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider'>Startup</th>
                                    <th className='px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider'>Industry</th>
                                    <th className='px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider'>Platform</th>
                                    <th className='px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider'>Funding Goal</th>
                                    <th className='px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider'>Owner</th>
                                    <th className='px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                                    <th className='px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-50'>
                                {filteredListings.map((listing, index) => (
                                    <tr
                                        key={listing.id || index}
                                        className='hover:bg-pink-50/30 transition-colors'
                                    >
                                        <td className='pl-6 py-3.5 font-medium text-gray-400'>{index + 1}</td>
                                        <td className='px-4 py-3.5'>
                                            <div className='flex items-center gap-3'>
                                                {listing.images?.[0] ? (
                                                    <img src={listing.images[0]} alt={listing.title} className='size-9 rounded-lg object-cover border border-gray-100' />
                                                ) : (
                                                    <div className='size-9 bg-pink-50 border border-pink-100 text-[#a11c5e] rounded-lg flex items-center justify-center font-bold text-xs'>
                                                        <Building2 className='size-4' />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className='font-bold text-gray-900 text-sm hover:text-[#a11c5e] cursor-pointer' onClick={() => setShowModal(listing)}>
                                                        {listing.title}
                                                    </p>
                                                    <p className='text-xs text-gray-400'>@{listing.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3.5'>
                                            <span className='capitalize text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg'>
                                                {listing.niche}
                                            </span>
                                        </td>
                                        <td className='px-4 py-3.5 text-xs font-medium capitalize text-gray-600'>
                                            {listing.platform}
                                        </td>
                                        <td className='px-4 py-3.5 font-bold text-gray-900'>
                                            {formatINR(listing.price)}
                                        </td>
                                        <td className='px-4 py-3.5 text-xs text-gray-600 font-medium'>
                                            {listing.owner?.name || listing.owner?.email || 'N/A'}
                                        </td>
                                        <td className='px-4 py-3.5'>
                                            {listing.status !== 'deleted' ? (
                                                /* Dropdown 2: Table Row Status Control */
                                                <div className='relative inline-block'>
                                                    <select
                                                        value={listing.status}
                                                        onChange={(e) => changeListingStatus(e.target.value, listing)}
                                                        className={`appearance-none text-xs font-bold pl-3 pr-7 py-1.5 rounded-xl border outline-none cursor-pointer shadow-xs transition-all ${
                                                            listing.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                                                            listing.status === 'sold' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                                                            listing.status === 'ban' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' :
                                                            'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                                        }`}
                                                    >
                                                        <option value='active' className="bg-white text-emerald-700 font-bold">Active</option>
                                                        <option value='inactive' className="bg-white text-amber-700 font-bold">Inactive</option>
                                                        <option value='ban' className="bg-white text-red-700 font-bold">Banned</option>
                                                        <option value='sold' className="bg-white text-blue-700 font-bold">Sold</option>
                                                    </select>
                                                    <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none ${
                                                        listing.status === 'active' ? 'text-emerald-500' :
                                                        listing.status === 'sold' ? 'text-blue-500' :
                                                        listing.status === 'ban' ? 'text-red-500' :
                                                        'text-amber-500'
                                                    }`} />
                                                </div>
                                            ) : (
                                                <span className='text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200'>Deleted</span>
                                            )}
                                        </td>
                                        <td className='px-4 py-3.5 text-center'>
                                            <button
                                                onClick={() => setShowModal(listing)}
                                                className='p-1.5 text-gray-500 hover:text-[#a11c5e] hover:bg-pink-50 rounded-lg transition-all inline-flex items-center gap-1 text-xs font-semibold cursor-pointer'
                                                title="View Details"
                                            >
                                                <Eye className='size-4' />
                                                <span>View</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredListings.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className='text-center py-10 text-gray-400 text-sm'>
                                            No listings matched your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && <ListingDetailsModal listing={showModal} onClose={() => setShowModal(null)} />}
        </div>
    );
};

export default AllListings;
