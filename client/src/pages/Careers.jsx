import Footer from '../components/Footer';
import { Briefcase, MapPin, Clock, Sparkles, CheckCircle2, X, Send, User, Mail, Phone, LinkIcon, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const Careers = () => {
    const [appliedRoles, setAppliedRoles] = useState([]);
    const [modalRole, setModalRole] = useState(null);

    // Form inputs
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [coverNote, setCoverNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openRoles = [
        {
            id: 'role-1',
            title: 'Full Stack Engineer Intern(React + Node.js)',
            department: 'Engineering',
            location: 'Bangalore / Remote',
            type: 'Full-time',
            desc: 'Build high-performance real-time messaging, payments, and search features for VentureHUB platform.'
        },
        {
            id: 'role-2',
            title: 'Product Growth & Marketing Intern',
            department: 'Growth',
            location: 'Remote (India)',
            type: 'Full-time',
            desc: 'Lead founder outreach, investor acquisition campaigns, and marketplace liquidity initiatives.'
        },
        {
            id: 'role-3',
            title: 'Startup Valuation & Analyst Intern',
            department: 'Deal Flow',
            location: 'Hybrid (Bangalore)',
            type: 'Full-time',
            desc: 'Assist founders in preparing metric pitch decks, financial audits, and acquisition terms.'
        },
    ];

    const perks = [
        'Competitive salary & equity packages',
        'Flexible hybrid & remote work environment',
        'Comprehensive health insurance for you & family',
        'Annual learning allowance & hardware budget'
    ];

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim() || !resumeUrl.trim()) {
            return toast.error("Please fill in your name, email, and resume link");
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setAppliedRoles((prev) => [...prev, modalRole.id]);
            toast.success(`Application submitted for ${modalRole.title}! Our Talent team will reach out.`);
            setIsSubmitting(false);
            setModalRole(null);

            // Reset form fields
            setFullName('');
            setEmail('');
            setPhone('');
            setResumeUrl('');
            setCoverNote('');
        }, 400);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pt-6 pb-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

                {/* Hero */}
                <div className="text-center max-w-2xl mx-auto pt-8">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#a11c5e] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full uppercase tracking-wider">
                        <Sparkles className="size-3.5" /> We’re Hiring!
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                        Build the Future of Startup M&A and Venture Capital
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                        Join a fast-moving team empowering thousands of entrepreneurs to build, fund, and exit companies.
                    </p>
                </div>

                {/* Culture Perks */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Why Join VentureHUB?</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {perks.map((perk, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                                <CheckCircle2 className="size-4 text-[#a11c5e] shrink-0" />
                                <span>{perk}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Open Positions List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900">Open Positions</h2>
                    {openRoles.map((role) => {
                        const isApplied = appliedRoles.includes(role.id);

                        return (
                            <div key={role.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-[#a11c5e] bg-pink-50 px-2.5 py-0.5 rounded-md">{role.department}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{role.title}</h3>
                                    <p className="text-xs text-slate-500 mt-1 max-w-xl">{role.desc}</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {role.location}</span>
                                        <span className="flex items-center gap-1"><Clock className="size-3.5" /> {role.type}</span>
                                    </div>
                                </div>
                                {isApplied ? (
                                    <button
                                        disabled
                                        className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-default"
                                    >
                                        <CheckCircle2 className="size-4 text-emerald-600" />
                                        <span>Applied ✓</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setModalRole(role)}
                                        className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all self-start sm:self-center shrink-0 cursor-pointer"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Application Form Modal */}
            {modalRole && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-200 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white p-6 flex items-center justify-between shadow-md">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-pink-200">VentureHUB Careers</span>
                                <h3 className="font-extrabold text-lg truncate mt-0.5">{modalRole.title}</h3>
                                <p className="text-xs text-pink-100 font-medium">{modalRole.department} • {modalRole.location}</p>
                            </div>
                            <button onClick={() => setModalRole(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
                                <X className="size-5 text-white" />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none focus:border-[#a11c5e]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="e.g. user@gmail.com"
                                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none focus:border-[#a11c5e]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 xxxxxxxxxx"
                                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none focus:border-[#a11c5e]"
                                    />
                                </div>
                            </div>

                            {/* Portfolio / Resume Link */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Resume / Portfolio URL *</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                    <input
                                        type="url"
                                        value={resumeUrl}
                                        onChange={(e) => setResumeUrl(e.target.value)}
                                        placeholder="https://linkedin.com/in/username or drive/github link"
                                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none focus:border-[#a11c5e]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Cover Note */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Why VentureHUB? (Brief Note)</label>
                                <div className="relative">
                                    <FileText className="absolute left-3.5 top-3 size-4 text-gray-400" />
                                    <textarea
                                        value={coverNote}
                                        onChange={(e) => setCoverNote(e.target.value)}
                                        rows={3}
                                        placeholder="Tell us briefly about your experience & key projects..."
                                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl font-medium text-slate-900 outline-none focus:border-[#a11c5e]"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 text-white py-3.5 rounded-2xl font-extrabold text-xs shadow-md shadow-pink-500/20 active:scale-95 transition-all mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Send className="size-4" />
                                <span>{isSubmitting ? "Submitting Application..." : "Submit Application"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Careers;
