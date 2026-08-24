import { X, Printer, CheckCircle2, Shield, Building2, User, Calendar, FileText } from 'lucide-react';
import { assets } from '../assets/assets';
import { useEffect } from 'react';

const WithdrawalInvoiceModal = ({ withdrawal, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => (document.body.style.overflow = 'auto');
    }, []);

    const formatINR = (val) => `₹${(val || 0).toLocaleString('en-IN')}`;

    const handlePrint = () => {
        window.print();
    };

    const payeeName = withdrawal?.user?.name || 'VentureHUB Founder';
    const payeeEmail = withdrawal?.user?.email || 'founder@venturehub.com';
    const invoiceId = `INV-WD-${(withdrawal?.id || '00000000').slice(-8).toUpperCase()}`;
    const formattedDate = new Date(withdrawal?.createdAt || Date.now()).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const accountFields = Array.isArray(withdrawal?.account) ? withdrawal.account : [];

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in print:bg-white print:p-0 print:static print:inset-auto'>
            <div className='bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none'>
                {/* Modal Top Bar (Hidden in Print) */}
                <div className='bg-slate-900 text-white p-4 px-6 flex items-center justify-between print:hidden'>
                    <div className='flex items-center gap-2'>
                        <FileText className='size-4 text-[#a11c5e]' />
                        <span className='font-bold text-xs uppercase tracking-wider'>Official Payout Invoice</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={handlePrint}
                            className='bg-[#a11c5e] hover:bg-pink-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs'
                        >
                            <Printer className='size-4' />
                            <span>Print / Download PDF</span>
                        </button>
                        <button onClick={onClose} className='p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-white'>
                            <X className='size-5' />
                        </button>
                    </div>
                </div>

                {/* Printable Invoice Container */}
                <div id='printable-invoice' className='p-8 overflow-y-auto space-y-6 text-slate-800 bg-white print:p-8 print:overflow-visible'>
                    {/* Invoice Header */}
                    <div className='flex items-start justify-between border-b border-gray-200 pb-6'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <img src={assets.logo} alt='VentureHUB' className='h-9 w-auto' />
                            </div>
                            <p className='text-[11px] text-slate-500 font-medium mt-2 leading-relaxed'>
                                VentureHUB M&A Marketplace Inc.<br />
                                Direct Founder Payout & Settlement Department<br />
                                Bangalore, Karnataka, India
                            </p>
                        </div>
                        <div className='text-right'>
                            <span className='inline-block text-[10px] font-extrabold uppercase tracking-widest text-[#a11c5e] bg-pink-50 border border-pink-200 px-3 py-1 rounded-full mb-2'>
                                PAYOUT RECEIPT
                            </span>
                            <h2 className='text-lg font-black font-mono text-slate-900'>{invoiceId}</h2>
                            <p className='text-xs text-slate-500 font-medium mt-1'>Date: {formattedDate}</p>
                            <p className='text-xs font-bold text-emerald-600 mt-0.5 flex items-center justify-end gap-1'>
                                <CheckCircle2 className='size-3.5' /> {withdrawal?.isWithdrawn ? 'SETTLED & DISBURSED' : 'PROCESSING DISBURSEMENT'}
                            </p>
                        </div>
                    </div>

                    {/* Payee & Disbursement Details Grid */}
                    <div className='grid grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs'>
                        <div>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1'>Billed To (Founder / Payee)</p>
                            <p className='font-bold text-slate-900 text-sm'>{payeeName}</p>
                            <p className='text-slate-600 mt-0.5'>{payeeEmail}</p>
                            <span className='inline-block text-[9px] font-bold text-slate-500 bg-white border border-gray-200 px-2 py-0.5 rounded-md mt-2'>
                                Verified VentureHUB Member
                            </span>
                        </div>
                        <div>
                            <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1'>Disbursement Destination (Bank)</p>
                            {accountFields.length > 0 ? (
                                <div className='space-y-1'>
                                    {accountFields.map((f, i) => (
                                        <p key={i} className='text-slate-700 font-medium'>
                                            <strong className='text-slate-900'>{f.name}:</strong> {f.value}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-slate-500 font-medium'>Bank Account via IMPS / NEFT</p>
                            )}
                        </div>
                    </div>

                    {/* Financial Itemization Table */}
                    <div className='border border-gray-200 rounded-2xl overflow-hidden'>
                        <table className='w-full text-xs text-left'>
                            <thead>
                                <tr className='bg-slate-100 text-slate-600 font-bold border-b border-gray-200 uppercase tracking-wider text-[10px]'>
                                    <th className='p-3.5 pl-4'>Description</th>
                                    <th className='p-3.5 text-center'>Type</th>
                                    <th className='p-3.5 pr-4 text-right'>Amount (INR)</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100 font-medium text-slate-800'>
                                <tr>
                                    <td className='p-3.5 pl-4'>
                                        <p className='font-bold text-slate-900'>Founder Investment Earnings Withdrawal</p>
                                        <p className='text-[11px] text-slate-500 mt-0.5'>Payout of accumulated funding raised from Marketplace investors</p>
                                    </td>
                                    <td className='p-3.5 text-center text-slate-500 font-semibold'>Direct Disbursal</td>
                                    <td className='p-3.5 pr-4 text-right font-extrabold text-slate-900'>{formatINR(withdrawal?.amount)}</td>
                                </tr>
                                <tr>
                                    <td className='p-3.5 pl-4 text-slate-500'>Platform Escrow & Transfer Fee</td>
                                    <td className='p-3.5 text-center text-emerald-600 font-bold'>Waived</td>
                                    <td className='p-3.5 pr-4 text-right font-bold text-emerald-600'>₹0.00</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='bg-pink-50/50 p-4 border-t border-pink-100 flex justify-between items-center pr-4 pl-4'>
                            <div>
                                <p className='text-[10px] font-bold text-[#a11c5e] uppercase tracking-wider'>Total Disbursed Net Payout</p>
                                <p className='text-[11px] text-slate-500'>Instant IMPS / NEFT Settlement</p>
                            </div>
                            <h3 className='text-2xl font-black text-[#a11c5e]'>{formatINR(withdrawal?.amount)}</h3>
                        </div>
                    </div>

                    {/* Footer Terms & Seal */}
                    <div className='pt-4 border-t border-gray-200 text-center space-y-2'>
                        <p className='text-[11px] text-slate-500 font-medium'>
                            This is an official computer-generated payout invoice issued by <strong className='text-slate-800'>VentureHUB Marketplace</strong>.
                        </p>
                        <div className='flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                            <Shield className='size-3.5 text-[#a11c5e]' /> 256-bit Encrypted Settlement Audit Trail
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalInvoiceModal;
