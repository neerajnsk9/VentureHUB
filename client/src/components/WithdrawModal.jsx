import { useState, useEffect } from "react";
import { X, Wallet, ShieldCheck, ArrowUpRight, Building2, User, CreditCard, Hash, QrCode, Loader2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import api from "../configs/axios";
import { getAllUserListing } from "../app/features/listingSlice";

const WithdrawModal = ({ onClose }) => {
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const { balance } = useSelector((state) => state.listing);

    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [accountHolder, setAccountHolder] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [ifscCode, setIfscCode] = useState("");
    const [upiBranch, setUpiBranch] = useState("");

    useEffect(() => {
        if (!balance?.available || balance.available <= 0) {
            toast.error("Insufficient Funds: You have ₹0 available balance. Raise funding from investors first.");
            onClose();
        }
    }, [balance?.available]);

    const handleSubmission = async (e) => {
        e.preventDefault();
        const withdrawVal = Number(amount);
        if (!withdrawVal || withdrawVal <= 0) {
            return toast.error("Please enter a valid withdrawal amount");
        }

        if (withdrawVal > balance.available) {
            return toast.error(`Insufficient balance. Maximum available: ₹${(balance.available || 0).toLocaleString('en-IN')}`);
        }

        if (!accountHolder.trim() || !bankName.trim() || !accountNumber.trim() || !ifscCode.trim()) {
            return toast.error("Please fill in all required bank account details");
        }

        const confirm = window.confirm(`Confirm withdrawal request of ₹${withdrawVal.toLocaleString('en-IN')} to bank account?`);
        if (!confirm) return;

        try {
            setSubmitting(true);
            const token = await getToken();
            const payloadAccount = [
                { type: "text", name: "Account Holder Name", value: accountHolder.trim() },
                { type: "text", name: "Bank Name", value: bankName.trim() },
                { type: "number", name: "Account Number", value: accountNumber.trim() },
                { type: "text", name: "IFSC Code", value: ifscCode.trim() },
                { type: "text", name: "UPI ID / Branch", value: upiBranch.trim() || "N/A" },
            ];

            const { data } = await api.post("/api/listing/withdraw", { account: payloadAccount, amount: withdrawVal }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(data.message || "Withdrawal request submitted successfully!");
            dispatch(getAllUserListing({ getToken }));
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to submit withdrawal request");
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md">
                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-pink-200 font-bold uppercase tracking-wider mb-1">
                            <Wallet className="size-3.5" />
                            <span>VentureHUB Payout Portal</span>
                        </div>
                        <h3 className="font-extrabold text-xl">Withdraw Earnings (INR ₹)</h3>
                        <p className="text-xs text-pink-100 mt-0.5 font-medium">
                            Transfer accumulated startup funding to your bank account
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmission} className="p-6 overflow-y-auto space-y-4 flex-1">
                    {/* Available Balance Box */}
                    <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-xs">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Available Payout Balance</p>
                            <h4 className="text-2xl font-extrabold text-white mt-0.5">
                                ₹{(balance.available || 0).toLocaleString('en-IN')}
                            </h4>
                        </div>
                        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="size-3.5" />
                            <span>IMPS Ready</span>
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Withdrawal Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-base">₹</span>
                            <input
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                type="number"
                                min="100"
                                max={balance.available || 9999999}
                                placeholder="Enter amount (e.g. 50000)"
                                className="w-full pl-9 pr-20 py-3 bg-slate-50 border border-gray-200 rounded-xl text-base font-extrabold text-slate-900 outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setAmount(balance.available || 0)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-pink-50 hover:bg-pink-100 text-[#a11c5e] border border-pink-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    {/* Bank Details Grid */}
                    <div className="space-y-3 pt-2 border-t border-gray-100">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Receiving Bank Details</label>

                        {/* Account Holder Name */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-500">Account Holder Name</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={accountHolder}
                                    onChange={(e) => setAccountHolder(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-[#a11c5e]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Bank Name */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-500">Bank Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    placeholder="e.g. HDFC Bank / ICICI Bank"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-[#a11c5e]"
                                    required
                                />
                            </div>
                        </div>

                        {/* Account Number & IFSC Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-500">Account Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="number"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                        placeholder="e.g. 501002345678"
                                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-[#a11c5e]"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-500">IFSC Code</label>
                                <div className="relative">
                                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={ifscCode}
                                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. HDFC0000123"
                                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold uppercase text-slate-800 outline-none focus:border-[#a11c5e]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* UPI ID / Branch */}
                        <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-500">UPI ID / Branch Name (Optional)</label>
                            <div className="relative">
                                <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={upiBranch}
                                    onChange={(e) => setUpiBranch(e.target.value)}
                                    placeholder="e.g. user@ybl / MG Road Branch"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-semibold text-slate-800 outline-none focus:border-[#a11c5e]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting || !Number(amount) || Number(amount) > balance.available}
                        className="w-full bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all mt-3 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Processing Payout...</span>
                            </>
                        ) : (
                            <>
                                <ArrowUpRight className="size-4" />
                                <span>Apply for Withdrawal ({amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '₹0'})</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WithdrawModal;
