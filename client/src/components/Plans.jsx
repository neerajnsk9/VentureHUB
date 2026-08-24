import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useClerk, useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { Loader2Icon, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import api from '../configs/axios';

const plans = [
    {
        name: 'Starter',
        price: '₹0',
        period: 'Forever free',
        description: 'Perfect for early-stage founders validating their startup concept.',
        features: ['List 1 startup profile', 'Basic marketplace visibility', 'Direct investor inquiries', 'Community support'],
        popular: false,
        buttonText: 'Select Starter Plan'
    },
    {
        name: 'Growth',
        price: '₹2,499',
        period: '/ month',
        description: 'For ambitious founders seeking higher investor traction.',
        features: ['List up to 5 startups', 'Featured marketplace placement', 'Priority investor matchmaking', 'Verified startup badge', 'Detailed traction analytics'],
        popular: true,
        buttonText: 'Choose Growth'
    },
    {
        name: 'Scale',
        price: '₹7,999',
        period: '/ month',
        description: 'For high-growth ventures raising larger funding rounds.',
        features: ['Unlimited startup listings', 'Top hero spotlight placement', 'Dedicated investor relations manager', 'Legal & pitch deck assistance', '24/7 Priority support'],
        popular: false,
        buttonText: 'Get Scale Access'
    },
];

const Plans = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, isLoaded } = useUser();
    const { openSignIn } = useClerk();
    const { getToken } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [userPlanData, setUserPlanData] = useState({ plan: 'Starter', planMaxListings: 1, usedListings: 0 });

    const isRedirectedLimit = searchParams.get('reason') === 'limit_reached';

    useEffect(() => {
        const fetchPlanStatus = async () => {
            if (!user) return;
            try {
                const token = await getToken();
                const { data } = await api.get('/api/listing/user-plan', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data) {
                    setUserPlanData(data);
                }
            } catch (err) {
                console.log("Error fetching plan:", err);
            }
        };
        fetchPlanStatus();
    }, [user, getToken]);

    const handlePlanSelect = async (planName) => {
        if (!user && isLoaded) {
            return openSignIn();
        }

        if (planName === 'Starter') {
            try {
                setLoadingPlan('Starter');
                const token = await getToken();
                const { data } = await api.post('/api/listing/select-starter-plan', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Starter Plan activated (1 startup allowed)');
                setUserPlanData((prev) => ({ ...prev, plan: 'Starter', planMaxListings: 1 }));
                setLoadingPlan(null);
                return navigate('/create-listing');
            } catch (err) {
                toast.error(err?.response?.data?.message || 'Failed to select Starter plan');
                setLoadingPlan(null);
                return;
            }
        }

        try {
            setLoadingPlan(planName);
            const token = await getToken();
            const { data } = await api.post('/api/listing/create-plan-checkout', { planName }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.paymentLink) {
                window.location.href = data.paymentLink;
            } else {
                toast.error("Failed to generate Stripe payment link");
                setLoadingPlan(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Stripe checkout session failed");
            setLoadingPlan(null);
        }
    };

    return (
        <div className='max-w-6xl mx-auto z-20 my-20 px-4 sm:px-6 lg:px-8'>
            {/* Native Platform Integrated Alert Notification */}
            {(isRedirectedLimit || (userPlanData.usedListings >= userPlanData.planMaxListings && userPlanData.planMaxListings !== 999)) && (
                <div className='mb-10 max-w-4xl mx-auto bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border-2 border-pink-300 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-5 text-left transition-all animate-fade-in'>
                    <div className='w-12 h-12 bg-gradient-to-br from-[#702371] to-[#a11c5e] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-pink-500/20'>
                        <Sparkles className='w-6 h-6' />
                    </div>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 flex-wrap'>
                            <h3 className='font-bold text-slate-900 text-lg'>Startup Listing Limit Reached</h3>
                            <span className='bg-[#a11c5e] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs'>
                                Upgrade Required
                            </span>
                        </div>
                        <p className='text-sm text-slate-700 mt-1.5 leading-relaxed'>
                            You have currently used <strong>{userPlanData.usedListings} of {userPlanData.planMaxListings} startup listing(s)</strong> available on your <strong>{userPlanData.plan} Plan</strong>. Choose the <strong>Growth</strong> (up to 5 startups) or <strong>Scale</strong> (unlimited) plan below to list your next startup!
                        </p>
                    </div>
                </div>
            )}

            <div className='text-center max-w-2xl mx-auto'>
                <h2 className='text-slate-800 text-3xl sm:text-4xl font-bold tracking-tight'>Choose Your Founder Plan</h2>
                <p className='text-gray-600 text-base mt-3'>
                    Start for free and scale as you raise capital. Find the perfect plan for your startup listing & investor outreach needs.
                </p>

                {user && (
                    <div className='inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-[#a11c5e] px-4 py-2 rounded-full text-xs font-semibold mt-4 shadow-sm'>
                        <span>Current Active Plan: <strong>{userPlanData.plan} Plan</strong> ({userPlanData.usedListings} / {userPlanData.planMaxListings === 999 ? 'Unlimited' : userPlanData.planMaxListings} Startups Listed)</span>
                    </div>
                )}
            </div>

            <div className='mt-12 grid gap-8 md:grid-cols-3 items-stretch'>
                {plans.map((plan) => {
                    const isCurrentPlan = userPlanData.plan === plan.name;

                    return (
                        <div
                            key={plan.name}
                            className={`relative rounded-3xl border ${isCurrentPlan ? 'border-green-500 shadow-xl bg-green-50/10' : plan.popular ? 'border-[#a11c5e] shadow-xl shadow-pink-500/10 scale-105 z-10 bg-white' : 'border-gray-200 bg-white shadow-sm hover:shadow-md'} p-8 flex flex-col justify-between transition-all`}
                        >
                            {isCurrentPlan ? (
                                <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1'>
                                    <CheckCircle className='w-3.5 h-3.5' /> Current Active Plan
                                </div>
                            ) : plan.popular ? (
                                <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#702371] to-[#a11c5e] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm'>
                                    Most Popular
                                </div>
                            ) : null}

                            <div>
                                <h3 className='text-xl font-bold text-slate-800'>{plan.name}</h3>
                                <p className='mt-2 text-sm text-gray-500 min-h-[40px]'>{plan.description}</p>

                                <div className='mt-6 flex items-baseline gap-1'>
                                    <span className='text-4xl font-extrabold text-slate-900'>{plan.price}</span>
                                    <span className='text-sm font-medium text-gray-500'>{plan.period}</span>
                                </div>

                                <hr className='my-6 border-gray-100' />

                                <ul className='space-y-3 text-sm text-gray-600 mb-8'>
                                    {plan.features.map((feature) => (
                                        <li key={feature} className='flex items-start gap-2.5'>
                                            <span className='text-[#a11c5e] font-bold text-base leading-none'>✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => handlePlanSelect(plan.name)}
                                disabled={loadingPlan === plan.name || isCurrentPlan}
                                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                                    isCurrentPlan
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200 shadow-none'
                                        : plan.popular
                                            ? 'bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white hover:opacity-95 shadow-pink-500/20'
                                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                                }`}
                            >
                                {loadingPlan === plan.name ? (
                                    <>
                                        <Loader2Icon className="size-4 animate-spin" /> Redirecting...
                                    </>
                                ) : isCurrentPlan ? (
                                    'Active Plan'
                                ) : (
                                    plan.buttonText
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Plans;
