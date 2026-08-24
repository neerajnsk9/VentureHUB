import AdminTitle from '../../components/admin/AdminTitle';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from '../../configs/axios';
import { toast } from 'react-hot-toast';
import TransactionDetailModal from '../../components/admin/TransactionDetailModal';
import { Loader2Icon, Banknote, Eye, CheckCircle } from 'lucide-react';

const Transactions = () => {
    const { getToken } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const getTransactions = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get(`/api/admin/transactions`, { headers: { Authorization: `Bearer ${token}` } });
            setTransactions(data.transactions || []);
            setLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    return (
        <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                    <AdminTitle text1='Platform' text2='Transactions' />
                    <p className='text-xs text-gray-500 mt-1'>Record of all completed startup acquisition and escrow payments</p>
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
                                    <th className='pl-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>#</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Startup</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Platform</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Amount Paid</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Date & Time</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-50'>
                                {transactions.map((t, index) => (
                                    <tr key={t.id || index} className='hover:bg-pink-50/30 transition-colors'>
                                        <td className='pl-6 py-3.5 font-medium text-gray-400'>{index + 1}</td>
                                        <td className='px-4 py-3.5 font-bold text-gray-900'>
                                            <div>
                                                <p className='text-sm text-gray-900 font-bold'>{t.listing?.title}</p>
                                                <p className='text-xs text-gray-400'>@{t.listing?.username}</p>
                                            </div>
                                        </td>
                                        <td className='px-4 py-3.5 text-xs font-medium capitalize text-gray-600'>
                                            {t.listing?.platform}
                                        </td>
                                        <td className='px-4 py-3.5 font-extrabold text-[#a11c5e]'>
                                            {formatINR(t.amount)}
                                        </td>
                                        <td className='px-4 py-3.5 text-xs text-gray-500 font-medium'>
                                            {new Date(t.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </td>
                                        <td className='px-4 py-3.5'>
                                            <span className='inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full'>
                                                <CheckCircle className='size-3.5' /> Paid
                                            </span>
                                        </td>
                                        <td className='px-4 py-3.5 text-center'>
                                            <button 
                                                onClick={() => setSelectedTransaction(t)} 
                                                className='p-1.5 text-gray-600 hover:text-[#a11c5e] hover:bg-pink-50 rounded-lg transition-all inline-flex items-center gap-1 text-xs font-semibold cursor-pointer'
                                            >
                                                <Eye className='size-4' />
                                                <span>View Details</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className='text-center py-12 text-gray-400 text-sm'>
                                            <Banknote className='size-8 mx-auto text-gray-300 mb-2' />
                                            No transaction records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}
        </div>
    );
};

export default Transactions;
