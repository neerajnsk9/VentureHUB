import Footer from '../components/Footer';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50/50 pt-6 pb-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Header */}
                <div className="text-center pt-8 border-b border-gray-200 pb-8">
                    <span className="text-xs font-bold text-[#a11c5e] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full uppercase tracking-wider">
                        Legal Documentation
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-xs text-slate-500 mt-2">
                        Last Updated: August 4, 2026 • VentureHUB Platform Compliance
                    </p>
                </div>

                {/* Content Document */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm/relaxed">
                    
                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="size-5 text-[#a11c5e]" /> 1. Information We Collect
                        </h2>
                        <p>
                            VentureHUB collects personal and startup business data necessary to provide a secure marketplace environment. This includes information provided during Clerk authentication (such as name, email address, and profile photo) as well as financial metrics, funding targets, traction numbers, and documentation submitted when listing a startup.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Lock className="size-5 text-[#a11c5e]" /> 2. How We Use Your Data
                        </h2>
                        <p>
                            Your data is strictly used to operate the marketplace, facilitate investor-founder communications, enforce founder plan tier limits, process subscription transactions via Stripe, and prevent fraud. We do not sell your personal data to third parties.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Eye className="size-5 text-[#a11c5e]" /> 3. Data Protection & Security
                        </h2>
                        <p>
                            We employ industry-standard encryption, SSL protocols, and secure Clerk JWT session management to protect user accounts. Sensitive startup credentials exchanged during acquisitions are stored using encrypted fields accessible only by authorized platform verification mechanisms.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="size-5 text-[#a11c5e]" /> 4. Your Privacy Rights
                        </h2>
                        <p>
                            Users have the right to request access to, correction of, or permanent deletion of their personal and startup listing data at any time by contacting our privacy team at <strong className="text-[#a11c5e]">privacy@venturehub.com</strong>.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
