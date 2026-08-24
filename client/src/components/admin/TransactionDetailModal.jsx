import { X, CheckCircle2, ArrowRight, User, Building2, ShieldCheck, Clock, Banknote, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { assets } from '../../assets/assets';

const TransactionDetailModal = ({ transaction, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => (document.body.style.overflow = 'auto');
    }, []);

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    const buyer = transaction.buyer || transaction.listing?.customer || {};
    const listing = transaction.listing || {};
    const owner = listing.owner || {};

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100'>
                {/* Header */}
                <div className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md shrink-0'>
                    <div>
                        <span className='text-[10px] uppercase font-bold tracking-wider text-pink-200'>Platform Transaction</span>
                        <h3 className='font-extrabold text-xl truncate mt-0.5'>Investment & Acquisition Details</h3>
                        <p className='text-xs text-pink-100 font-medium mt-0.5'>
                            Transaction ID: <span className='font-mono font-bold text-white'>#{transaction.id?.slice(-8) || 'TXN-ACTIVE'}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className='p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer'>
                        <X className='size-5 text-white' />
                    </button>
                </div>

                {/* Body */}
                <div className='p-6 overflow-y-auto space-y-6 text-slate-700'>
                    {/* Amount & Time Banner */}
                    <div className='bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border border-pink-100 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-xs'>
                        <div>
                            <p className='text-[10px] font-bold text-[#a11c5e] uppercase tracking-wider'>Total Amount Transacted</p>
                            <h2 className='text-3xl font-extrabold text-slate-900 mt-0.5'>{formatINR(transaction.amount)}</h2>
                        </div>
                        <div className='text-right'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end'>
                                <Clock className='size-3' /> Date & Time
                            </p>
                            <p className='text-xs font-bold text-slate-800 mt-1'>
                                {new Date(transaction.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            <span className='inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-1'>
                                <CheckCircle2 className='size-3' /> Stripe Paid
                            </span>
                        </div>
                    </div>

                    {/* Transaction Flow: Investor ---> Startup/Founder */}
                    <div className='space-y-3'>
                        <h4 className='font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5'>
                            <Banknote className='size-4 text-[#a11c5e]' /> Transaction Flow & Transfer Parties
                        </h4>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 relative'>
                            {/* Investor / Buyer Box */}
                            <div className='bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3 relative'>
                                <span className='text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wider'>
                                    Investor / Buyer (Sender)
                                </span>
                                <div className='flex items-center gap-3 pt-1'>
                                    <img 
                                        src={buyer.image || assets.user_profile} 
                                        alt={buyer.name || 'Buyer'} 
                                        className='size-11 rounded-full object-cover border-2 border-blue-200 shrink-0' 
                                    />
                                    <div className='min-w-0'>
                                        <h5 className='font-bold text-slate-900 text-sm truncate'>{buyer.name || 'Verified Investor'}</h5>
                                        <p className='text-xs text-slate-500 font-medium truncate'>{buyer.email || 'investor@venturehub.com'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recipient Startup & Founder Box */}
                            <div className='bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3 relative'>
                                <span className='text-[10px] font-bold text-[#a11c5e] bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md uppercase tracking-wider'>
                                    Target Startup & Founder (Recipient)
                                </span>
                                <div className='flex items-center gap-3 pt-1'>
                                    {listing.images?.[0] ? (
                                        <img src={listing.images[0]} alt={listing.title} className='size-11 rounded-xl object-cover border-2 border-pink-200 shrink-0' />
                                    ) : (
                                        <div className='size-11 rounded-xl bg-pink-50 border border-pink-200 text-[#a11c5e] flex items-center justify-center font-bold text-xs shrink-0'>
                                            <Building2 className='size-5' />
                                        </div>
                                    )}
                                    <div className='min-w-0'>
                                        <h5 className='font-bold text-slate-900 text-sm truncate'>{listing.title || 'Startup Venture'}</h5>
                                        <p className='text-xs text-slate-500 font-medium truncate'>
                                            Founder: <strong className='text-slate-800'>{owner.name || 'Ned Stark'}</strong> ({owner.email || 'founder@gmail.com'})
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Escrow Security & Audit Summary */}
                    <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2.5 text-xs'>
                        <h4 className='font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1'>
                            <ShieldCheck className='size-4 text-emerald-600' /> Stripe Escrow & Settlement Verification
                        </h4>
                        <div className='flex justify-between text-slate-600'>
                            <span>Payment Gateway</span>
                            <span className='font-bold text-slate-800'>Stripe Encrypted Checkout (256-bit)</span>
                        </div>
                        <div className='flex justify-between text-slate-600'>
                            <span>Escrow Allocation</span>
                            <span className='font-bold text-emerald-600'>Credited to Founder Withdrawable Balance</span>
                        </div>
                        <div className='flex justify-between text-slate-600'>
                            <span>Platform Escrow Fee</span>
                            <span className='font-bold text-slate-800'>₹0.00 (Waived)</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='p-4 border-t border-gray-100 bg-slate-50/50 flex justify-end shrink-0'>
                    <button 
                        onClick={onClose}
                        className='px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer'
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;
