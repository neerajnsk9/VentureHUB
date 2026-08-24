import Footer from '../components/Footer';
import { Building2, Rocket, Users, ShieldCheck, ArrowRight, Loader2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../configs/axios';

const AboutUs = () => {
    const [stats, setStats] = useState({
        totalListings: 0,
        totalUsers: 0,
        totalFundingGoal: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveStats = async () => {
            try {
                const { data } = await api.get('/api/listing/public-stats');
                if (data) {
                    setStats(data);
                }
            } catch (error) {
                console.log('Error fetching live stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveStats();
    }, []);

    const formatINR = (val) => {
        if (!val || val === 0) return '₹0';
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr+`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs+`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    const statItems = [
        { label: 'Active Startups Listed', value: stats.totalListings.toLocaleString('en-IN') },
        { label: 'Registered Users', value: stats.totalUsers.toLocaleString('en-IN') },
        { label: 'Total Funding Goal', value: formatINR(stats.totalFundingGoal) },
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: 'Verified Founders & Buyers',
            desc: 'Every listing undergoes stringent verification to ensure authentic metrics, real traction, and verified identity.'
        },
        {
            icon: Rocket,
            title: 'Speed & Efficiency',
            desc: 'Connecting visionary founders directly with active angel investors and acquisition partners without unnecessary middlemen.'
        },
        {
            icon: Building2,
            title: 'Transparent Marketplace',
            desc: 'Clear valuation models, direct communications, and structured escrow workflows for seamless deal completion.'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 pt-6 pb-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto pt-8">
                    <span className="text-xs font-bold text-[#a11c5e] bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full uppercase tracking-wider">
                        About VentureHUB
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight leading-tight">
                        Connecting Visionary Founders with Strategic Investors
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
                        VentureHUB is India’s premier digital startup marketplace built to simplify acquisitions, early-stage funding rounds, and strategic equity investments.
                    </p>
                </div>

                {/* Live Stats Grid */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Live Platform Metrics</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time statistics updated directly from VentureHUB database</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                            <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                            Live Data
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2Icon className="size-6 text-[#a11c5e] animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                            {statItems.map((stat, i) => (
                                <div key={i} className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl">
                                    <p className="text-3xl sm:text-4xl font-extrabold text-[#a11c5e]">{stat.value}</p>
                                    <p className="text-xs font-semibold text-slate-600 mt-2 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Values Section */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-10">
                        Why Founders & Investors Choose VentureHUB
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {values.map((val, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="size-12 bg-pink-50 text-[#a11c5e] rounded-2xl flex items-center justify-center mb-4">
                                    <val.icon className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Box */}
                <div className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-pink-500/10">
                    <h2 className="text-2xl sm:text-3xl font-bold">Ready to Buy or Sell a Venture?</h2>
                    <p className="text-pink-100 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                        Join founders listing tech ventures, SaaS products, and digital media platforms.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <Link 
                            to="/marketplace" 
                            className="bg-white text-[#a11c5e] font-bold px-6 py-3 rounded-xl hover:bg-pink-50 transition-all shadow-md"
                        >
                            Explore Marketplace
                        </Link>
                        <Link 
                            to="/plans" 
                            className="border border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all"
                        >
                            List Your Startup
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
