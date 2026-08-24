import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import api from '../../configs/axios';
import toast from 'react-hot-toast';
import { Loader2Icon, Wallet, CheckCircle, Clock } from 'lucide-react';
import AdminTitle from '../../components/admin/AdminTitle';
import WithdrawalDetail from '../../components/admin/WithdrawalDetail';

const Withdrawal = () => {
    const { getToken } = useAuth();

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const getRequests = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/admin/withdraw-requests', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRequests(data.requests || []);
            setIsLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        getRequests();
    }, []);

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    return (
        <div className='space-y-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                    <AdminTitle text1='Withdrawal' text2='Requests' />
                    <p className='text-xs text-gray-500 mt-1'>Manage payout requests submitted by sellers and founders</p>
                </div>
            </div>

            {isLoading ? (
                <div className='flex items-center justify-center py-20'>
                    <Loader2Icon className='size-7 text-[#a11c5e] animate-spin' />
                </div>
            ) : (
                <div className='bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left text-gray-700'>
                            <thead>
                                <tr className='border-b border-gray-100 bg-slate-50/50'>
                                    <th className='pl-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>#</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>User</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Email</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Amount Requested</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider'>Status</th>
                                    <th className='px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-50'>
                                {requests.length === 0 ? (
                                    <tr>
                                        <td colSpan='6' className='text-center py-12 text-gray-400 text-sm'>
                                            <Wallet className='size-8 mx-auto text-gray-300 mb-2' />
                                            No withdrawal requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req, index) => (
                                        <tr key={req.id} className='hover:bg-pink-50/30 transition-colors'>
                                            <td className='pl-6 py-3.5 font-medium text-gray-400'>{index + 1}</td>
                                            <td className='px-4 py-3.5 font-semibold text-gray-900 flex items-center gap-2.5'>
                                                {req.user?.image ? (
                                                    <img src={req.user?.image} alt={req.user?.name} className='size-8 rounded-full object-cover border border-gray-100' />
                                                ) : (
                                                    <div className='size-8 rounded-full bg-pink-100 text-[#a11c5e] flex items-center justify-center font-bold text-xs'>
                                                        {req.user?.name?.[0] || 'U'}
                                                    </div>
                                                )}
                                                <span>{req.user?.name || 'Unknown User'}</span>
                                            </td>
                                            <td className='px-4 py-3.5 text-xs text-gray-500 font-medium'>{req.user?.email}</td>
                                            <td className='px-4 py-3.5 font-extrabold text-gray-900'>{formatINR(req.amount)}</td>
                                            <td className='px-4 py-3.5'>
                                                {req.isWithdrawn ? (
                                                    <span className='inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full'>
                                                        <CheckCircle className='size-3.5' /> Processed & Paid
                                                    </span>
                                                ) : (
                                                    <span className='inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full'>
                                                        <Clock className='size-3.5' /> Pending Action
                                                    </span>
                                                )}
                                            </td>
                                            <td className='px-4 py-3.5 text-center'>
                                                <button 
                                                    onClick={() => setSelectedRequest(req)} 
                                                    className='text-xs font-bold text-[#a11c5e] bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3 py-1.5 rounded-xl transition-all shadow-xs active:scale-95'
                                                >
                                                    Manage Payout
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {selectedRequest && (
                        <WithdrawalDetail
                            data={selectedRequest}
                            onClose={() => {
                                getRequests();
                                setSelectedRequest(null);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Withdrawal;
