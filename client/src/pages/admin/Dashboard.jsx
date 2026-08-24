import { TrendingUp, IndianRupee, LayoutList, Users, MessageCircle, MessagesSquare, Loader2Icon, Crown, Rocket, Zap } from 'lucide-react';
import AdminTitle from '../../components/admin/AdminTitle';
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../../configs/axios';
import { toast } from 'react-hot-toast';
import ListingDetailsModal from '../../components/admin/ListingDetailsModal';

const Dashboard = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalListings: 0,
        totalRevenue: 0,
        planRevenue: 0,
        activeListings: 0,
        totalUser: 0,
        recentListings: [],
        planBreakdown: { Starter: 0, Growth: 0, Scale: 0 },
        totalChats: 0,
        totalMessages: 0,
    });
    const [showModal, setShowModal] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } });
            setDashboardData(data.dashboardData);
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchDashboardData();
        }
    }, [isLoaded, user]);

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    if (!isLoaded || loading) {
        return (
            <div className='flex items-center justify-center h-full'>
                <Loader2Icon className='animate-spin text-[#a11c5e] size-7' />
            </div>
        );
    }

    const statCards = [
        { title: 'Plan Revenue', value: formatINR(dashboardData.planRevenue), subtitle: 'From plan upgrades', icon: IndianRupee, gradient: 'from-[#702371] to-[#a11c5e]', iconBg: 'bg-pink-100 text-[#a11c5e]' },
        { title: 'Total Listings', value: dashboardData.totalListings, subtitle: `${dashboardData.activeListings} active`, icon: LayoutList, gradient: 'from-emerald-500 to-teal-500', iconBg: 'bg-emerald-100 text-emerald-600' },
        { title: 'Total Users', value: dashboardData.totalUser, subtitle: 'Registered founders & investors', icon: Users, gradient: 'from-blue-500 to-indigo-500', iconBg: 'bg-blue-100 text-blue-600' },
        { title: 'Conversations', value: dashboardData.totalChats, subtitle: `${dashboardData.totalMessages} messages`, icon: MessageCircle, gradient: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-100 text-amber-600' },
    ];

    const planCards = [
        { name: 'Starter', count: dashboardData.planBreakdown?.Starter || 0, price: 'Free', icon: Rocket, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
        { name: 'Growth', count: dashboardData.planBreakdown?.Growth || 0, price: '₹2,499', icon: Zap, color: 'text-[#a11c5e]', bg: 'bg-pink-50', border: 'border-pink-200' },
        { name: 'Scale', count: dashboardData.planBreakdown?.Scale || 0, price: '₹7,999', icon: Crown, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' },
    ];

    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
                    <p className='text-sm text-gray-500 mt-0.5'>Overview of your VentureHUB platform metrics</p>
                </div>
                <div className='flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-xs'>
                    <div className='size-2 bg-green-500 rounded-full animate-pulse' />
                    <span className='font-medium'>Live Data</span>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                {statCards.map((card, i) => (
                    <div key={i} className='bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 relative overflow-hidden group'>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-5 rounded-bl-[80px] group-hover:opacity-10 transition-opacity`} />
                        <div className='flex items-start justify-between'>
                            <div>
                                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>{card.title}</p>
                                <p className='text-2xl font-extrabold text-gray-900 mt-1.5'>{card.value}</p>
                                <p className='text-xs text-gray-400 mt-1 font-medium'>{card.subtitle}</p>
                            </div>
                            <div className={`${card.iconBg} p-2.5 rounded-xl`}>
                                <card.icon className='size-5' />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plan Distribution */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6'>
                <h2 className='text-base font-bold text-gray-800 mb-4 flex items-center gap-2'>
                    <Crown className='size-4 text-[#a11c5e]' />
                    Plan Distribution
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    {planCards.map((plan, i) => (
                        <div key={i} className={`${plan.bg} border ${plan.border} rounded-xl p-4 flex items-center justify-between`}>
                            <div className='flex items-center gap-3'>
                                <div className={`${plan.bg} p-2 rounded-lg`}>
                                    <plan.icon className={`size-5 ${plan.color}`} />
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${plan.color}`}>{plan.name}</p>
                                    <p className='text-xs text-gray-500'>{plan.price}/plan</p>
                                </div>
                            </div>
                            <div className='text-right'>
                                <p className='text-2xl font-extrabold text-gray-900'>{plan.count}</p>
                                <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider'>Users</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Revenue Bar */}
                <div className='mt-5 bg-gradient-to-r from-[#702371]/5 via-[#a11c5e]/5 to-transparent border border-pink-100 rounded-xl p-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='bg-gradient-to-r from-[#702371] to-[#a11c5e] p-2 rounded-lg'>
                            <TrendingUp className='size-4 text-white' />
                        </div>
                        <div>
                            <p className='text-sm font-bold text-gray-800'>Total Plan Revenue</p>
                            <p className='text-xs text-gray-500'>From Growth & Scale plan subscriptions</p>
                        </div>
                    </div>
                    <p className='text-xl font-extrabold text-[#a11c5e]'>{formatINR(dashboardData.planRevenue)}</p>
                </div>
            </div>

            {/* Recent Listings Table */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-100 flex items-center justify-between'>
                    <h2 className='text-base font-bold text-gray-800 flex items-center gap-2'>
                        <LayoutList className='size-4 text-emerald-500' />
                        Recent Listings
                    </h2>
                    <span className='text-xs text-gray-400 font-medium'>Last 5 listings</span>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-left text-gray-700'>
                        <thead>
                            <tr className='border-b border-gray-100 bg-slate-50/50'>
                                <th className='pl-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>#</th>
                                <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Startup</th>
                                <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Industry</th>
                                <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Type</th>
                                <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Funding Goal</th>
                                <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-50'>
                            {dashboardData.recentListings.map((listing, index) => (
                                <tr onClick={() => setShowModal(listing)} key={index} className='hover:bg-pink-50/30 cursor-pointer transition-colors'>
                                    <td className='pl-6 py-3.5 font-medium text-gray-400'>{index + 1}</td>
                                    <td className='px-4 py-3.5'>
                                        <div className='flex items-center gap-3'>
                                            {listing.images?.[0] && (
                                                <img src={listing.images[0]} alt={listing.title} className='size-8 rounded-lg object-cover border border-gray-100' />
                                            )}
                                            <div>
                                                <p className='font-semibold text-gray-800 text-sm'>{listing.title}</p>
                                                <p className='text-xs text-gray-400'>@{listing.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-3.5'>
                                        <span className='capitalize text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg'>{listing.niche}</span>
                                    </td>
                                    <td className='px-4 py-3.5'>
                                        <span className='capitalize text-xs font-medium'>{listing.platform}</span>
                                    </td>
                                    <td className='px-4 py-3.5 font-semibold text-gray-800'>
                                        {formatINR(listing.price)}
                                    </td>
                                    <td className='px-4 py-3.5'>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                            listing.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                                            listing.status === 'sold' ? 'bg-blue-100 text-blue-600' :
                                            listing.status === 'ban' ? 'bg-red-100 text-red-600' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {listing.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {dashboardData.recentListings.length === 0 && (
                                <tr>
                                    <td colSpan="6" className='text-center py-8 text-gray-400 text-sm'>No listings found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <ListingDetailsModal listing={showModal} onClose={() => setShowModal(null)} />}
        </div>
    );
};

export default Dashboard;
