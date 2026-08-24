import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import api from '../configs/axios';
import { platformIcons } from '../assets/assets';
import { CheckCircle2, Loader2Icon, Copy, ChevronDown, ChevronUp, TrendingUp, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const currency = '₹';

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const { data } = await api.get('/api/listing/user-orders', { headers: { Authorization: `Bearer ${token}` } });
            setOrders(data.orders || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && isLoaded) {
            fetchOrders();
        }
    }, [isLoaded, user]);

    if (!isLoaded || loading) {
        return (
            <div className='h-[80vh] flex items-center justify-center bg-slate-50'>
                <Loader2Icon className='size-8 animate-spin text-[#a11c5e]' />
            </div>
        );
    }

    const mask = (val, type) => {
        if (!val && val !== 0) return '-';
        return type.toLowerCase() === 'password' ? '•'.repeat(8) : String(val);
    };

    const copy = async (txt) => {
        try {
            await navigator.clipboard.writeText(txt);
            toast.success('Copied to clipboard');
        } catch {
            toast.error('Copy failed');
        }
    };

    if (!orders.length) {
        return (
            <div className='px-4 md:px-16 lg:px-24 xl:px-32 py-12 bg-slate-50/50 min-h-[80vh]'>
                <div className='max-w-xl mx-auto mt-10 bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm space-y-4'>
                    <div className='size-14 bg-pink-50 text-[#a11c5e] rounded-2xl flex items-center justify-center mx-auto'>
                        <TrendingUp className='size-7' />
                    </div>
                    <h3 className='text-xl font-bold text-slate-900'>No Investments Found</h3>
                    <p className='text-sm text-slate-600 leading-relaxed max-w-md mx-auto'>
                        You haven't invested in any startups yet. Explore the marketplace to find high-growth tech ventures.
                    </p>
                    <Link 
                        to="/marketplace" 
                        className="inline-block bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all"
                    >
                        Explore Marketplace
                    </Link>
                </div>
            </div>
        );
    }

    const totalCumulativeInvested = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);

    return (
        <div className='px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 bg-slate-50/50 min-h-screen space-y-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                    <h2 className='text-2xl font-extrabold text-slate-900 tracking-tight'>My Investments & Purchases</h2>
                    <p className='text-xs text-slate-500 mt-1'>Track your portfolio of investments and acquired digital ventures</p>
                </div>
            </div>

            {/* Cumulative Investment Portfolio Card */}
            <div className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white rounded-3xl p-6 sm:p-8 shadow-md max-w-5xl flex items-center justify-between flex-wrap gap-4'>
                <div>
                    <p className='text-xs font-bold text-pink-100 uppercase tracking-wider'>Total Investment Portfolio</p>
                    <h3 className='text-3xl sm:text-4xl font-extrabold mt-1'>₹{totalCumulativeInvested.toLocaleString('en-IN')}</h3>
                    <p className='text-xs text-pink-100 mt-1 font-medium'>Across {orders.length} Venture Investment(s)</p>
                </div>
                <div className='bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold'>
                    Stripe Escrow Protected
                </div>
            </div>

            <div className='space-y-4 max-w-5xl'>
                {orders.map((order) => {
                    const id = order.id;
                    const listing = order.listing || {};
                    const credential = order.credential;
                    const isExpanded = expandedId === id;
                    const hasCredentials = credential?.updatedCredential && credential.updatedCredential.length > 0;

                    return (
                        <div key={id} className='bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col space-y-4 hover:shadow-md transition-shadow'>
                            <div className='flex items-start justify-between gap-4 flex-wrap'>
                                <div className='flex items-start gap-4'>
                                    <div className='p-3 bg-pink-50 rounded-2xl border border-pink-100 shrink-0 max-sm:hidden'>
                                        {platformIcons[listing.platform] || <Building2 className='size-6 text-[#a11c5e]' />}
                                    </div>

                                    <div>
                                        <div className='flex items-center gap-2 flex-wrap'>
                                            <h3 className='text-lg font-bold text-slate-900'>{listing.title || 'Startup Investment'}</h3>
                                            <span className='inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full'>
                                                <CheckCircle2 className='size-3 mr-1' /> Investment Confirmed
                                            </span>
                                        </div>
                                        <p className='text-xs text-slate-500 mt-1 font-medium'>
                                            ID: @{listing.username || 'N/A'} • <span className='capitalize'>{listing.platform || 'Tech Startup'}</span>
                                        </p>
                                        <p className='text-xs text-slate-400 mt-1'>
                                            Transaction Date: {format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a')}
                                        </p>
                                    </div>
                                </div>

                                <div className='text-right'>
                                    <p className='text-2xl font-extrabold text-[#a11c5e]'>{currency}{Number(order.amount).toLocaleString('en-IN')}</p>
                                    <p className='text-xs text-slate-400 font-semibold uppercase'>Stripe Payment</p>
                                </div>
                            </div>

                            {hasCredentials && (
                                <div className='pt-3 border-t border-gray-100 flex flex-col items-end space-y-3'>
                                    <button 
                                        onClick={() => setExpandedId((p) => (p === id ? null : id))} 
                                        className='flex items-center gap-1.5 bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-pink-50 hover:text-[#a11c5e] text-xs font-bold transition-all'
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className='size-3.5' /> Hide Credentials
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className='size-3.5' /> View Credentials
                                            </>
                                        )}
                                    </button>

                                    {isExpanded && (
                                        <div className='w-full space-y-2 pt-2'>
                                            {credential.updatedCredential.map((cred) => (
                                                <div key={cred.name} className='flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3'>
                                                    <div>
                                                        <p className='text-xs font-bold text-slate-800'>{cred.name}</p>
                                                        <p className='text-[10px] text-slate-500'>{cred.type}</p>
                                                    </div>

                                                    <div className='flex items-center gap-2'>
                                                        <code className='text-xs font-mono bg-white px-2 py-1 rounded border border-gray-200'>{mask(cred.value, cred.type)}</code>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copy(cred.value);
                                                            }}
                                                            className='p-1 text-xs bg-white border border-gray-200 rounded-lg hover:shadow-xs'
                                                            title='Copy credential'
                                                        >
                                                            <Copy className='size-3.5 text-slate-600' />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyOrders;
