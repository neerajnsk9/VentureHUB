import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import api from '../../configs/axios';
import { X, Copy, CheckCircle2, Building2, User, Clock, FileText } from 'lucide-react';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import WithdrawalInvoiceModal from '../WithdrawalInvoiceModal';

const WithdrawalDetail = ({ data, onClose }) => {
    const { getToken } = useAuth();
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    const copyToClipboard = ({ name, value }) => {
        navigator.clipboard.writeText(value || '');
        toast.success(`${name} copied to clipboard`);
    };

    const markAsWithdrawn = async () => {
        try {
            toast.loading('Processing payout confirmation...');
            const token = await getToken();
            const res = await api.put(`/api/admin/withdrawal-mark/${data.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            toast.dismissAll();
            toast.success(res.data.message);
            onClose();
        } catch (error) {
            toast.dismissAll();
            toast.error(error?.response?.data?.message || error.message);
            console.error(error);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in'>
            <div className='bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100'>
                {/* Header */}
                <div className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md shrink-0'>
                    <div className='flex-1 min-w-0'>
                        <span className='text-[10px] uppercase font-bold tracking-wider text-pink-200'>Payout Management</span>
                        <h3 className='font-extrabold text-xl truncate mt-0.5'>Withdrawal Request</h3>
                        <p className='text-xs text-pink-100 font-medium truncate'>
                            Submitted by <span className='font-bold text-white'>{data.user?.name || '—'}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className='ml-4 p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer'>
                        <X className='size-5 text-white' />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6 text-slate-700'>
                    {/* Amount & Time Card */}
                    <div className='bg-pink-50/60 border border-pink-100 p-5 rounded-2xl flex items-center justify-between gap-4'>
                        <div>
                            <p className='text-[10px] font-bold text-[#a11c5e] uppercase tracking-wider'>Requested Amount</p>
                            <h2 className='text-3xl font-extrabold text-slate-900 mt-0.5'>{formatINR(data.amount)}</h2>
                        </div>
                        <div className='text-right'>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 justify-end'>
                                <Clock className='size-3' /> Date & Time
                            </p>
                            <p className='text-xs font-bold text-slate-800 mt-1'>
                                {new Date(data.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                        </div>
                    </div>

                    {/* Bank Account Details */}
                    <div className='space-y-3'>
                        <h4 className='font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5'>
                            <Building2 className='size-4 text-[#a11c5e]' /> Payout Account Details (IMPS / NEFT)
                        </h4>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            {data.account?.length > 0 ? (
                                data.account.map((field, index) => (
                                    <div key={index} className='p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:border-pink-200 transition-colors'>
                                        <div className='min-w-0'>
                                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>{field.name}</p>
                                            <p className='font-bold text-slate-900 text-xs truncate mt-0.5'>{field.value}</p>
                                        </div>
                                        <button 
                                            onClick={() => copyToClipboard(field)} 
                                            className='p-1.5 text-gray-400 hover:text-[#a11c5e] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer' 
                                            title={`Copy ${field.name}`}
                                        >
                                            <Copy className='size-3.5' />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className='text-xs text-gray-500 col-span-2'>No account details available.</p>
                            )}
                        </div>
                    </div>

                    {/* User Profile Summary */}
                    <div className='space-y-2 pt-2 border-t border-gray-100'>
                        <h4 className='font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5'>
                            <User className='size-3.5 text-gray-400' /> Founder Profile
                        </h4>
                        <div className='flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100'>
                            <img src={data.user?.image || assets.user_profile} alt={data.user?.name} className='size-10 rounded-full object-cover border-2 border-pink-200 shrink-0' />
                            <div className='min-w-0'>
                                <p className='font-bold text-slate-900 text-xs truncate'>{data.user?.name || '—'}</p>
                                <p className='text-[11px] text-slate-500 font-medium truncate'>{data.user?.email || '—'}</p>
                            </div>
                        </div>
                    </div>

                    {data.isWithdrawn && (
                        <div className='p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 justify-between'>
                            <div className='flex items-center gap-2'>
                                <CheckCircle2 className='size-4 text-emerald-600 shrink-0' />
                                <span>Withdrawal marked as paid & settled.</span>
                            </div>
                            <button
                                onClick={() => setShowInvoiceModal(true)}
                                className='px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 hover:bg-emerald-700 transition-colors cursor-pointer'
                            >
                                <FileText className='size-3' /> View Invoice
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className='p-5 border-t border-gray-100 bg-slate-50/50 flex items-center justify-between gap-3 shrink-0'>
                    <button
                        onClick={() => setShowInvoiceModal(true)}
                        className='px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-800 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer'
                    >
                        <FileText className='size-4 text-[#a11c5e]' />
                        <span>Official Receipt / Invoice</span>
                    </button>

                    <div className='flex items-center gap-2'>
                        <button 
                            onClick={onClose}
                            className='px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer'
                        >
                            Close
                        </button>
                        {!data.isWithdrawn && (
                            <button 
                                onClick={markAsWithdrawn} 
                                className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-pink-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer'
                            >
                                <CheckCircle2 className='size-4' />
                                <span>Mark Payout as Completed ✓</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Printable Invoice Modal */}
            {showInvoiceModal && (
                <WithdrawalInvoiceModal
                    withdrawal={data}
                    onClose={() => setShowInvoiceModal(false)}
                />
            )}
        </div>
    );
};

export default WithdrawalDetail;
