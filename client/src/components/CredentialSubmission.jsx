import { useState } from "react";
import { X, CirclePlus, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import api from "../configs/axios";
import { getAllUserListing } from "../app/features/listingSlice";

const CredentialSubmission = ({ onClose, listing }) => {
    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const [newField, setNewField] = useState("");
    const [credential, setCredential] = useState([
        { type: "email", name: "Email / Admin ID", value: "" },
        { type: "password", name: "Password / Passcode", value: "" },
    ]);

    const handleAddField = () => {
        const name = newField.trim();
        if (!name) return toast.error("Please enter a custom field name");
        setCredential((prev) => [...prev, { type: "text", name, value: "" }]);
        setNewField("");
    };

    const handleSubmission = async (e) => {
        e.preventDefault();
        try {
            if (credential.length === 0) {
                return toast.error("Please add at least one credential field");
            }

            for (const cred of credential) {
                if (!cred.value) {
                    return toast.error(`Please fill in the ${cred.name} field`);
                }
            }

            const confirm = window.confirm("Credentials will be securely submitted to VentureHUB verification team. Proceed?");
            if (!confirm) return;

            const token = await getToken();
            const { data } = await api.post("/api/listing/add-credential", { credential, listingId: listing.id }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(data.message);
            dispatch(getAllUserListing({ getToken }));
            onClose();
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
            console.log(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-pink-200 font-bold uppercase tracking-wider mb-1">
                            <Lock className="size-3.5" />
                            <span>Encrypted Vault Submission</span>
                        </div>
                        <h3 className="font-extrabold text-xl truncate">{listing?.title}</h3>
                        <p className="text-xs text-pink-100 truncate mt-0.5 font-medium">
                            Submit Credentials for @{listing?.username} ({listing?.platform})
                        </p>
                    </div>
                    <button onClick={onClose} className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmission} className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
                    <div className="bg-pink-50/70 border border-pink-100 rounded-2xl p-4 text-xs text-slate-700 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-[#a11c5e]">
                            <ShieldCheck className="size-4" />
                            <span>VentureHUB Transfer Protocol</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">
                            Your credentials are kept in encrypted vault storage and released only upon deal completion.
                        </p>
                    </div>

                    <div className="space-y-3.5">
                        {credential.map((cred, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-36 shrink-0">
                                    <label className="text-xs font-bold text-slate-700">{cred.name}</label>
                                </div>
                                <input
                                    type={cred.type === "password" ? "password" : "text"}
                                    value={cred.value}
                                    onChange={(e) => setCredential((prev) => prev.map((c, i) => (i === index ? { ...c, value: e.target.value } : c)))}
                                    placeholder={`Enter ${cred.name.toLowerCase()}`}
                                    className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none focus:border-[#a11c5e] focus:ring-2 focus:ring-pink-100"
                                />
                                {credential.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => setCredential((prev) => prev.filter((_, i) => i !== index))}
                                        className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Custom Field */}
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                        <input
                            value={newField}
                            onChange={(e) => setNewField(e.target.value)}
                            type="text"
                            placeholder="Add custom field (e.g. 2FA Recovery Key)"
                            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-[#a11c5e]"
                        />
                        <button
                            type="button"
                            onClick={handleAddField}
                            className="px-3 py-2 bg-slate-100 hover:bg-pink-50 hover:text-[#a11c5e] text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                        >
                            <CirclePlus className="size-4" />
                            <span>Add Field</span>
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#a11c5e] hover:opacity-95 text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md shadow-pink-500/20 active:scale-95 transition-all mt-2 cursor-pointer"
                    >
                        Submit Credentials to Vault
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CredentialSubmission;
