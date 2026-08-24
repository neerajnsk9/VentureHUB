import { Eye, Edit, Plus, TrendingUp, DollarSign, Users, CheckCircle, Clock, XCircle, EyeOffIcon, EyeIcon, LockIcon, BanIcon, TrashIcon, WalletIcon, ArrowDownCircleIcon, CoinsIcon, StarIcon, Sparkles, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { platformIcons } from '../assets/assets';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import api from '../configs/axios';
import { getAllPublicListing, getAllUserListing } from '../app/features/listingSlice';
import { useState, useEffect } from 'react';
import CredentialSubmission from '../components/CredentialSubmission';
import WithdrawModal from '../components/WithdrawModal';
import WithdrawalInvoiceModal from '../components/WithdrawalInvoiceModal';
import { FileTextIcon } from 'lucide-react';

const MyListings = () => {
    const { userListings, balance } = useSelector((state) => state.listing);
    const currency = '₹';
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const [showCredentialSubmission, setShowCredentialSubmission] = useState(null);
    const [showWithdrawal, setShowWithdrawal] = useState(null);
    const [showInvestorsModal, setShowInvestorsModal] = useState(null);
    const [showZeroBalanceModal, setShowZeroBalanceModal] = useState(false);
    const [userWithdrawals, setUserWithdrawals] = useState([]);
    const [showWithdrawalInvoicesModal, setShowWithdrawalInvoicesModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [userPlanInfo, setUserPlanInfo] = useState({ plan: 'Starter', planMaxListings: 1, usedListings: 0 });

    const fetchPlanData = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/listing/user-plan', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data) {
                setUserPlanInfo(data);
            }
        } catch (err) {
            console.log("Error fetching user plan:", err);
        }
    };

    const fetchUserWithdrawals = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/listing/user-withdrawals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserWithdrawals(data.withdrawals || []);
        } catch (err) {
            console.log("Error fetching user withdrawals:", err);
        }
    };

    useEffect(() => {
        fetchPlanData();
        fetchUserWithdrawals();
    }, [userListings]);

    useEffect(() => {
        const handleStripeSuccess = async () => {
            const planSuccess = searchParams.get('plan');
            const planName = searchParams.get('planName');

            if (planSuccess === 'success' && planName) {
                try {
                    const token = await getToken();
                    const { data } = await api.post('/api/listing/activate-paid-plan', { planName }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success(`${planName} Founder Plan activated successfully!`);
                    fetchPlanData();
                    dispatch(getAllUserListing({ getToken }));
                    setSearchParams({});
                } catch (err) {
                    console.log("Error activating paid plan:", err);
                }
            }
        };

        handleStripeSuccess();
    }, [searchParams]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-green-800';
            case 'ban':
                return 'text-red-800';
            case 'sold':
                return 'text-indigo-800';
            case 'inactive':
                return 'text-gray-800';
            default:
                return 'text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <CheckCircle className='size-3.5' />;
            case 'ban':
                return <BanIcon className='size-3.5' />;
            case 'sold':
                return <DollarSign className='size-3.5' />;
            case 'inactive':
                return <XCircle className='size-3.5' />;
            default:
                return <Clock className='size-3.5' />;
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    const totalValue = userListings.reduce((sum, listing) => sum + (listing.price || 0), 0);
    const activeListings = userListings.filter((listing) => listing.status === 'active').length;
    const soldListings = userListings.filter((listing) => listing.status === 'sold').length;

    const toggleStatus = async (listingId) => {
        try {
            toast.loading('Updating listing status...');
            const token = await getToken();
            const { data } = await api.put(`/api/listing/${listingId}/status`, {}, { headers: { Authorization: `Bearer ${token}` } });
            dispatch(getAllUserListing({ getToken }));
            dispatch(getAllPublicListing());
            toast.dismissAll();
            toast.success(data.message);
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const deleteListing = async (listingId) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this listing? if credentials are changed, new credentials will be sent to your email');
            if (!confirm) return;

            toast.loading('Deleting listing...');
            const token = await getToken();
            const { data } = await api.delete(`/api/listing/${listingId}`, { headers: { Authorization: `Bearer ${token}` } });
            dispatch(getAllUserListing({ getToken }));
            dispatch(getAllPublicListing());
            toast.dismissAll();
            toast.success(data.message);
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const markAsFeatured = async (listingId) => {
        try {
            toast.loading('featuring listing...');
            const token = await getToken();
            const { data } = await api.put(`/api/listing/featured/${listingId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            dispatch(getAllUserListing({ getToken }));
            dispatch(getAllPublicListing());
            toast.dismissAll();
            toast.success(data.message);
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const isLimitReached = userPlanInfo.usedListings >= userPlanInfo.planMaxListings;

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 pt-8'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>My Startups</h1>
                    <p className='text-gray-600 mt-1'>Manage your startup listings and funding progress</p>
                </div>
                <button
                    onClick={() => {
                        if (!userPlanInfo.hasChosenPlan || isLimitReached) {
                            return navigate('/plans?reason=select_plan');
                        }
                        navigate('/create-listing');
                    }}
                    className='bg-linear-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center space-x-2 mt-4 md:mt-0 shadow-md shadow-pink-500/20 active:scale-95 transition-all'
                >
                    <Plus className='size-4' />
                    <span>Add Startup</span>
                </button>
            </div>

            {/* Founder Plan Banner Card */}
            <div className='bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 mb-8 border border-indigo-900/40 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-pink-500/20 border border-pink-500/30 rounded-xl flex items-center justify-center shrink-0'>
                        <Sparkles className='w-6 h-6 text-pink-400' />
                    </div>
                    <div>
                        <div className='flex items-center gap-2'>
                            <span className='text-xs uppercase font-bold tracking-wider text-pink-400'>Current Active Founder Plan</span>
                            <span className='bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase'>
                                Active
                            </span>
                        </div>
                        <h3 className='text-2xl font-extrabold text-white mt-1'>
                            {userPlanInfo.plan} Plan
                        </h3>
                        <p className='text-sm text-gray-300 mt-1'>
                            {userPlanInfo.planMaxListings === 999
                                ? 'Unlimited startup listings & top spotlight placement enabled'
                                : `Listing Limit: ${userPlanInfo.usedListings} of ${userPlanInfo.planMaxListings} Startup(s) Used`}
                        </p>
                    </div>
                </div>

                <div className='w-full md:w-auto flex flex-col sm:flex-row items-center gap-4'>
                    {userPlanInfo.planMaxListings !== 999 && (
                        <div className='w-full sm:w-48 bg-slate-800/80 p-3 rounded-xl border border-slate-700'>
                            <div className='flex justify-between text-xs text-gray-300 font-medium mb-1.5'>
                                <span>Listings Used</span>
                                <span className='font-bold text-white'>{userPlanInfo.usedListings} / {userPlanInfo.planMaxListings}</span>
                            </div>
                            <div className='w-full bg-slate-700 h-2 rounded-full overflow-hidden'>
                                <div
                                    className='bg-gradient-to-r from-pink-500 to-indigo-500 h-full rounded-full transition-all duration-300'
                                    style={{ width: `${Math.min(100, (userPlanInfo.usedListings / userPlanInfo.planMaxListings) * 100)}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/plans')}
                        className='w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#702371] to-[#a11c5e] hover:opacity-95 text-white font-semibold text-sm rounded-xl shadow-md active:scale-95 transition-all text-nowrap'
                    >
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                <StatCard title='Total Startups Listed' value={userListings.length} icon={<Eye className='size-6 text-[#a11c5e]' />} color='pink' />
                <StatCard title='Active Startups' value={activeListings} icon={<CheckCircle className='size-6 text-green-600' />} color='green' />
                <StatCard title='Funded Startups' value={soldListings} icon={<TrendingUp className='size-6 text-[#702371]' />} color='purple' />
                <StatCard title='Total Listed Value (INR)' value={`${currency}${totalValue.toLocaleString('en-IN')}`} icon={<DollarSign className='size-6 text-amber-600' />} color='amber' />
            </div>

            {/* Balance Section */}
            <div className='flex flex-col sm:flex-row justify-between gap-4 xl:gap-20 p-6 mb-10 bg-white rounded-xl border border-gray-200 shadow-xs'>
                {[
                    { label: 'Total Funding Raised', value: balance.earned, icon: WalletIcon },
                    { label: 'Funds Withdrawn', value: balance.withdrawn, icon: ArrowDownCircleIcon },
                    { label: 'Available Balance', value: balance.available, icon: CoinsIcon },
                ].map((item, index) => (
                    <div
                        onClick={() => {
                            if (item.label === 'Available Balance') {
                                if (!balance.available || balance.available <= 0) {
                                    return setShowZeroBalanceModal(true);
                                }
                                setShowWithdrawal(true);
                            }
                            if (item.label === 'Funds Withdrawn') {
                                setShowWithdrawalInvoicesModal(true);
                            }
                        }}
                        key={index}
                        className={`flex flex-1 items-center justify-between p-4 rounded-lg border border-gray-100 cursor-pointer hover:border-pink-200 transition-colors ${item.label === 'Funds Withdrawn' ? 'hover:bg-pink-50/20' : ''}`}
                    >
                        <div className='flex items-center gap-3'>
                            <item.icon className='text-[#a11c5e] w-6 h-6' />
                            <span className='font-medium text-gray-600'>{item.label}</span>
                        </div>
                        <span className='text-xl font-extrabold text-slate-800'>
                            {currency}
                            {(item.value || 0).toLocaleString('en-IN')}
                        </span>
                    </div>
                ))}
            </div>

            {/* Listings */}
            {userListings.length === 0 ? (
                <div className='bg-white rounded-xl border border-gray-200 p-16 text-center shadow-xs'>
                    <div className='w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Plus className='w-8 h-8 text-[#a11c5e]' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-800 mb-2'>No startups listed yet</h3>
                    <p className='text-gray-600 mb-6'>Start by adding your first startup under your active <strong>{userPlanInfo.plan} Plan</strong></p>
                    <button
                        onClick={() => {
                            if (!userPlanInfo.hasChosenPlan || isLimitReached) {
                                return navigate('/plans?reason=select_plan');
                            }
                            navigate('/create-listing');
                        }}
                        className='bg-linear-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white px-7 py-3 rounded-xl font-semibold shadow-md shadow-pink-500/20 active:scale-95 transition-all'
                    >
                        Add Startup
                    </button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {userListings.map((listing) => (
                        <div key={listing.id} className='bg-white rounded-lg border border-gray-200 hover:shadow-lg shadow-gray-200/70 transition-shadow'>
                            <div className='p-6'>
                                <div className='flex items-start gap-4 justify-between mb-4'>
                                    {platformIcons[listing.platform]}
                                    <div className='flex-1 '>
                                        <div className='flex justify-between items-start'>
                                            <h3 className='text-lg font-semibold text-gray-800 '>{listing.title}</h3>
                                            <div className='flex items-center gap-2'>
                                                <div className='relative group'>
                                                    <LockIcon size={14} />
                                                    <div className=' invisible group-hover:visible absolute right-0 top-0 pt-4.5 z-10 '>
                                                        <div className='bg-white text-gray-600 text-xs rounded border border-gray-200 p-2 px-3'>
                                                            {!listing.isCredentialSubmitted && (
                                                                <>
                                                                    <button onClick={() => setShowCredentialSubmission(listing)} className='flex items-center gap-2 text-nowrap'>
                                                                        Add Credentials
                                                                    </button>
                                                                    <hr className='border-gray-200 my-2' />
                                                                </>
                                                            )}
                                                            <button className='text-nowrap'>
                                                                Status :{' '}
                                                                <span className={listing.isCredentialSubmitted ? (listing.isCredentialVerified ? (listing.isCredentialChanged ? 'text-green-600' : 'text-[#a11c5e]') : 'text-slate-600') : 'text-red-600'}>
                                                                    {listing.isCredentialSubmitted ? (listing.isCredentialVerified ? (listing.isCredentialChanged ? 'Changed' : 'Verified') : 'Submitted') : 'Not Submitted'}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {listing.status === 'active' && <StarIcon onClick={() => markAsFeatured(listing.id)} size={18} className={`text-amber-500 cursor-pointer ${listing.featured && 'fill-amber-500'}`} />}
                                            </div>
                                        </div>
                                        <p className='text-sm text-gray-600'>
                                            <span>@{listing.username}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-2 text-sm'>
                                        <div className='flex items-center space-x-2'>
                                            <Users className='size-4 text-gray-400' />
                                            <span>{formatNumber(listing.followers_count)} interested investors</span>
                                        </div>
                                        <span className={`flex items-center justify-end gap-1 ${getStatusColor(listing.status)}`}>
                                            {getStatusIcon(listing.status)} <span>{listing.status}</span>
                                        </span>
                                        <div className='flex items-center space-x-2'>
                                            <TrendingUp className='size-4 text-gray-400' />
                                            <span>{listing.engagement_rate}% investor interest</span>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between pt-3 border-t border-gray-200 '>
                                        <div>
                                            <span className='text-2xl font-bold text-gray-800'>
                                                {currency}
                                                {(listing.remainingTarget !== undefined ? listing.remainingTarget : listing.price).toLocaleString('en-IN')}
                                            </span>
                                            {listing.totalRaised > 0 && (
                                                <p className='text-xs text-emerald-600 font-bold mt-0.5'>
                                                    ₹{listing.totalRaised.toLocaleString('en-IN')} Raised (Goal: ₹{listing.price.toLocaleString('en-IN')})
                                                </p>
                                            )}
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            {listing.status !== 'sold' && (
                                                <button onClick={() => deleteListing(listing.id)} className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-500'>
                                                    <TrashIcon className='size-4' />
                                                </button>
                                            )}
                                            <button onClick={() => navigate(`/edit-listing/${listing.id}`)} className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-[#a11c5e]'>
                                                <Edit className='size-4' />
                                            </button>
                                            <button onClick={() => toggleStatus(listing.id)} className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-[#702371]'>
                                                {listing.status === 'active' && <EyeOffIcon className='size-4' />}
                                                {listing.status !== 'active' && <EyeIcon className='size-4' />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowInvestorsModal(listing)}
                                        className='w-full mt-3 py-2 bg-[#a11c5e]/5 hover:bg-[#a11c5e]/10 text-[#a11c5e] border border-pink-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer'
                                    >
                                        <Users className='size-4 text-[#a11c5e]' />
                                        <span>View Investors & Backers ({listing.investors?.length || 0})</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCredentialSubmission && <CredentialSubmission listing={showCredentialSubmission} onClose={() => setShowCredentialSubmission(null)} />}
            {showWithdrawal && <WithdrawModal onClose={() => setShowWithdrawal(null)} />}

            {/* Investors Breakdown Modal */}
            {showInvestorsModal && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-xs z-100 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]'>
                        {/* Header */}
                        <div className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md'>
                            <div>
                                <span className='text-[10px] uppercase font-bold tracking-wider text-pink-200'>Investor Backers Breakdown</span>
                                <h3 className='font-extrabold text-xl truncate mt-0.5'>{showInvestorsModal.title}</h3>
                                <p className='text-xs text-pink-100 mt-1 font-medium'>
                                    Total Raised: ₹{(showInvestorsModal.totalRaised || 0).toLocaleString('en-IN')} ({showInvestorsModal.investors?.length || 0} Backer(s))
                                </p>
                            </div>
                            <button onClick={() => setShowInvestorsModal(null)} className='p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer'>
                                <XCircle className='w-6 h-6' />
                            </button>
                        </div>

                        {/* Content List */}
                        <div className='p-6 overflow-y-auto space-y-3 flex-1'>
                            {!showInvestorsModal.investors || showInvestorsModal.investors.length === 0 ? (
                                <div className='text-center py-10 text-slate-500 space-y-2'>
                                    <Users className='size-10 mx-auto text-pink-300' />
                                    <p className='font-bold text-slate-700 text-sm'>No investors yet for this startup</p>
                                    <p className='text-xs text-slate-400'>Once backers invest via Stripe checkout, their details will appear here.</p>
                                </div>
                            ) : (
                                showInvestorsModal.investors.map((inv) => (
                                    <div key={inv.id} className='bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between gap-3 hover:border-pink-200 transition-colors'>
                                        <div className='flex items-center gap-3.5 min-w-0'>
                                            <img
                                                src={inv.investorImage || assets.user_profile}
                                                alt={inv.investorName}
                                                className='size-11 rounded-full object-cover border-2 border-pink-200 shrink-0'
                                            />
                                            <div className='min-w-0'>
                                                <h4 className='font-bold text-slate-900 text-sm truncate'>{inv.investorName}</h4>
                                                <p className='text-xs text-slate-500 truncate'>{inv.investorEmail || 'Email hidden'}</p>
                                                <span className='inline-block text-[10px] text-slate-400 mt-0.5 font-medium'>
                                                    {new Date(inv.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='text-right shrink-0'>
                                            <p className='text-base font-extrabold text-[#a11c5e]'>₹{(inv.amount || 0).toLocaleString('en-IN')}</p>
                                            <span className='inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5'>
                                                Stripe Verified
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Branded Zero Balance Popup Modal */}
            {showZeroBalanceModal && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in'>
                    <div className='bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 p-6 sm:p-8 text-center space-y-5 relative'>
                        <button
                            onClick={() => setShowZeroBalanceModal(false)}
                            className='absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer'
                        >
                            <XCircle className='size-5' />
                        </button>

                        <div className='size-16 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-center mx-auto text-[#a11c5e] shadow-sm'>
                            <WalletIcon className='size-8' />
                        </div>

                        <div>
                            <span className='inline-block text-[10px] font-bold uppercase tracking-wider text-[#a11c5e] bg-pink-50 border border-pink-200 px-3 py-0.5 rounded-full mb-2'>
                                Payout Unavailable
                            </span>
                            <h3 className='text-2xl font-extrabold text-slate-900'>Zero Available Balance</h3>
                            <p className='text-xs text-slate-600 mt-2 leading-relaxed'>
                                You currently have <strong className='text-slate-900'>₹0.00</strong> available for withdrawal. Once investors back your active startup deals, funds will accumulate here for direct bank transfers.
                            </p>
                        </div>

                        <div className='bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-left text-xs text-slate-600 flex items-center gap-3'>
                            <Sparkles className='size-5 text-[#a11c5e] shrink-0' />
                            <p className='text-[11px] leading-tight'>
                                Add pitch deck slides & traction proof to attract investors on Marketplace!
                            </p>
                        </div>

                        <div className='flex items-center gap-3 pt-2'>
                            <button
                                onClick={() => { setShowZeroBalanceModal(false); navigate('/marketplace'); }}
                                className='flex-1 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white py-3 rounded-2xl font-extrabold text-xs shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer'
                            >
                                Explore Marketplace
                            </button>
                            <button
                                onClick={() => setShowZeroBalanceModal(false)}
                                className='px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-extrabold text-xs transition-all cursor-pointer'
                            >
                                Got It
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Withdrawal Invoices List Modal */}
            {showWithdrawalInvoicesModal && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in'>
                    <div className='bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]'>
                        <div className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md shrink-0'>
                            <div>
                                <span className='text-[10px] uppercase font-bold tracking-wider text-pink-200'>Payout Records</span>
                                <h3 className='font-extrabold text-xl truncate mt-0.5'>Withdrawal Invoices & Receipts</h3>
                                <p className='text-xs text-pink-100 font-medium'>Official receipts for all funds withdrawn to your bank</p>
                            </div>
                            <button onClick={() => setShowWithdrawalInvoicesModal(false)} className='p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer'>
                                <XCircle className='size-5 text-white' />
                            </button>
                        </div>

                        <div className='p-6 overflow-y-auto space-y-3 flex-1'>
                            {userWithdrawals.length === 0 ? (
                                <div className='text-center py-10 space-y-2'>
                                    <FileTextIcon className='size-10 mx-auto text-gray-300' />
                                    <p className='text-sm font-bold text-slate-700'>No Withdrawal Invoices Found</p>
                                    <p className='text-xs text-slate-500 max-w-xs mx-auto'>
                                        Once you submit withdrawal requests and funds are disbursed, official invoices will be generated here.
                                    </p>
                                </div>
                            ) : (
                                userWithdrawals.map((item, idx) => (
                                    <div key={item.id || idx} className='p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4 hover:border-pink-200 transition-all'>
                                        <div>
                                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                                                Invoice #{item.id?.slice(-8).toUpperCase()}
                                            </p>
                                            <h4 className='text-lg font-extrabold text-slate-900 mt-0.5'>
                                                ₹{(item.amount || 0).toLocaleString('en-IN')}
                                            </h4>
                                            <p className='text-xs text-slate-500 font-medium mt-0.5'>
                                                {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className='text-right space-y-2'>
                                            {item.isWithdrawn ? (
                                                <span className='inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full'>
                                                    Settled & Disbursed ✓
                                                </span>
                                            ) : (
                                                <span className='inline-block bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full'>
                                                    Processing Payout
                                                </span>
                                            )}
                                            <div>
                                                <button
                                                    onClick={() => setSelectedInvoice(item)}
                                                    className='px-3.5 py-1.5 bg-[#a11c5e] hover:bg-pink-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer'
                                                >
                                                    <FileTextIcon className='size-3.5' />
                                                    <span>View Invoice</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Individual Invoice Modal */}
            {selectedInvoice && (
                <WithdrawalInvoiceModal
                    withdrawal={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}

            {/* Footer */}
            <div className='bg-white border-t border-gray-200 p-4 text-center mt-28'>
                <p className='text-sm text-gray-500'>
                    © {new Date().getFullYear()} <span className='text-[#a11c5e] font-semibold'> VentureHUB</span> All rights reserved.
                </p>
            </div>
        </div>
    );
};

/* ------ Common Components ------ */
const StatCard = ({ title, value, icon, color }) => {
    const colorMap = { indigo: 'bg-indigo-100', green: 'bg-green-100', yellow: 'bg-yellow-100' };
    return (
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-sm font-medium text-gray-600'>{title}</p>
                    <p className='text-2xl font-bold text-gray-800'>{value}</p>
                </div>
                <div className={`size-12 ${colorMap[color]} rounded-full flex items-center justify-center`}>{icon}</div>
            </div>
        </div>
    );
};

export default MyListings;
