import { useState, useEffect } from 'react';
import { Loader2Icon, Upload, Rocket, BarChart3, Globe, Coins, FileText, ArrowLeftIcon, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import api from '../configs/axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPublicListing, getAllUserListing } from '../app/features/listingSlice';

const ManageListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const { userListings } = useSelector((state) => state.listing);

    const [loadingListing, setLoadingListing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        platform: '',
        username: '',
        followers_count: '',
        engagement_rate: '',
        monthly_views: '',
        niche: '',
        price: '',
        description: '',
        verified: false,
        monetized: false,
        country: '',
        age_range: '',
        images: [],
    });

    const platforms = ['tech', 'youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'pinterest', 'snapchat', 'twitch', 'discord'];
    const niches = ['tech', 'business', 'education', 'health', 'finance', 'lifestyle', 'fitness', 'food', 'travel', 'gaming', 'fashion', 'beauty', 'entertainment', 'music', 'art', 'sports', 'other'];
    const ageRanges = ['13-17 years', '18-24 years', '25-34 years', '35-44 years', '45-54 years', '55+ years', 'Mixed ages'];

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;
        if (files.length + formData.images.length > 5) return toast.error('You can upload up to 5 proof images');

        setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const removeImage = (indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== indexToRemove),
        }));
    };

    useEffect(() => {
        const checkPlanLimit = async () => {
            if (id) {
                setIsEditing(true);
                setLoadingListing(true);
                const listing = userListings.find((listing) => listing.id === id);
                if (listing) {
                    setFormData(listing);
                    setLoadingListing(false);
                } else if (userListings.length > 0) {
                    toast.error('Startup listing not found');
                    navigate('/my-listings');
                }
                return;
            }

            // New listing creation mode: verify plan limits
            try {
                const token = await getToken();
                const { data } = await api.get('/api/listing/user-plan', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data && (!data.hasChosenPlan || data.usedListings >= data.planMaxListings)) {
                    navigate('/plans?reason=select_plan');
                }
            } catch (error) {
                console.log('Error checking user plan limit:', error);
            }
        };

        checkPlanLimit();
    }, [id, userListings, navigate, getToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.loading('Saving startup listing...');

        try {
            const data = new FormData();

            const existingImageUrls = Array.isArray(formData.images) ? formData.images.filter((img) => typeof img === 'string') : [];

            data.append(
                'accountDetails',
                JSON.stringify({
                    id: formData.id || id,
                    title: formData.title,
                    platform: formData.platform,
                    username: formData.username,
                    followers_count: formData.followers_count || 0,
                    engagement_rate: formData.engagement_rate || 0,
                    monthly_views: formData.monthly_views || 0,
                    niche: formData.niche,
                    price: formData.price,
                    description: formData.description,
                    verified: formData.verified,
                    monetized: formData.monetized,
                    country: formData.country,
                    age_range: formData.age_range,
                    images: existingImageUrls,
                })
            );

            if (Array.isArray(formData.images)) {
                formData.images.forEach((image) => {
                    if (typeof image === 'object' && image !== null) {
                        data.append('images', image);
                    }
                });
            }

            const token = await getToken();

            if (isEditing) {
                await api.put(`/api/listing/update/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.dismissAll();
                toast.success('Startup listing updated successfully');
            } else {
                await api.post('/api/listing/add', data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.dismissAll();
                toast.success('Startup listed successfully');
            }

            dispatch(getAllPublicListing());
            dispatch(getAllUserListing({ getToken }));
            navigate('/my-listings');
        } catch (error) {
            toast.dismissAll();
            if (error?.response?.data?.planLimitReached) {
                return navigate('/plans?reason=limit_reached');
            }
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    if (loadingListing) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <Loader2Icon className='size-8 animate-spin text-[#a11c5e]' />
            </div>
        );
    }

    return (
        <div className='min-h-screen py-6 px-4 md:px-12 lg:px-20 xl:px-28'>
            {/* Top Navigation */}
            <div className='flex items-center justify-between text-slate-500 mb-4'>
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-sm font-medium hover:text-slate-800 transition cursor-pointer'
                >
                    <ArrowLeftIcon className='size-4' /> Back
                </button>
            </div>

            {/* Header Hero Banner (Matching Startup Marketplace Style) */}
            <div className='bg-gradient-to-r from-[#702371]/5 via-[#a11c5e]/5 to-transparent border border-pink-100 rounded-3xl p-6 sm:p-8 mb-8'>
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
                    <div>
                        <div className='flex items-center gap-2 text-[#a11c5e] text-xs font-bold uppercase tracking-wider mb-2'>
                            <Sparkles className='size-4' /> Founder Portal
                        </div>
                        <h1 className='text-2xl sm:text-3xl font-extrabold text-slate-900'>
                            {isEditing ? 'Edit Startup Listing' : 'List Your Startup'}
                        </h1>
                        <p className='text-slate-600 text-sm mt-1 max-w-2xl'>
                            {isEditing 
                                ? 'Update your company metrics, pitch deck, and funding goals.' 
                                : 'Showcase your company to accredited investors, track funding goals, and raise capital with confidence.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='space-y-8 max-w-5xl mx-auto pb-16'>
                {/* Section 1: Basic Information */}
                <FormCard title='Startup Information' icon={Rocket} subtitle='Core details about your company and industry'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <InputField 
                            label='Startup Name *' 
                            value={formData.title} 
                            placeholder='e.g., PaySwift FinTech Platform, Bengaluru' 
                            onChange={(v) => handleInputChange('title', v)} 
                            required={true} 
                        />
                        <SelectField 
                            label='Startup Type *' 
                            options={platforms} 
                            value={formData.platform} 
                            onChange={(v) => handleInputChange('platform', v)} 
                            required={true} 
                        />
                        <InputField 
                            label='Startup Identifier / Handle *' 
                            value={formData.username} 
                            placeholder='e.g., payswift-india' 
                            onChange={(v) => handleInputChange('username', v)} 
                            required={true} 
                        />
                        <SelectField 
                            label='Industry / Sector *' 
                            options={niches} 
                            value={formData.niche} 
                            onChange={(v) => handleInputChange('niche', v)} 
                            required={true} 
                        />
                    </div>
                </FormCard>

                {/* Section 2: Investor Traction */}
                <FormCard title='Investor Traction & Community Interest' icon={BarChart3} subtitle='Specify your active investor traction and growth stats'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                        <InputField 
                            label='Interested Investors / Followers' 
                            type='number' 
                            min={0} 
                            value={formData.followers_count} 
                            placeholder='e.g., 250' 
                            onChange={(v) => handleInputChange('followers_count', v)} 
                        />
                        <InputField 
                            label='Investor Interest Rate (%)' 
                            type='number' 
                            min={0} 
                            max={100} 
                            placeholder='e.g., 12.5' 
                            value={formData.engagement_rate} 
                            onChange={(v) => handleInputChange('engagement_rate', v)} 
                        />
                        <InputField 
                            label='Monthly Traction / Impressions' 
                            type='number' 
                            min={0} 
                            placeholder='e.g., 50000' 
                            value={formData.monthly_views} 
                            onChange={(v) => handleInputChange('monthly_views', v)} 
                        />
                    </div>
                </FormCard>

                {/* Section 3: Market & Legal */}
                <FormCard title='Primary Market & Legal Status' icon={Globe} subtitle='Specify your geographic market and registration status'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                        <InputField 
                            label='Primary Market Country' 
                            value={formData.country || ''} 
                            placeholder='e.g., India (Bengaluru)' 
                            onChange={(v) => handleInputChange('country', v)} 
                        />
                        <SelectField 
                            label='Target Customer Age Range' 
                            options={ageRanges} 
                            value={formData.age_range} 
                            onChange={(v) => handleInputChange('age_range', v)} 
                        />
                    </div>

                    <div className='space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100'>
                        <CheckboxField 
                            label='Startup is legally registered (e.g. Pvt Ltd, LLP, Inc)' 
                            checked={formData.verified} 
                            onChange={(v) => handleInputChange('verified', v)} 
                        />
                        <CheckboxField 
                            label='Startup is currently generating revenue' 
                            checked={formData.monetized} 
                            onChange={(v) => handleInputChange('monetized', v)} 
                        />
                    </div>
                </FormCard>

                {/* Section 4: Funding & Pitch */}
                <FormCard title='Funding Goal & Elevator Pitch' icon={Coins} subtitle='Define your fundraising target and startup description'>
                    <div className='space-y-6'>
                        <InputField 
                            label='Funding Goal (INR ₹) *' 
                            type='number' 
                            min={0} 
                            value={formData.price} 
                            placeholder='e.g., 5000000' 
                            onChange={(v) => handleInputChange('price', v)} 
                            required={true} 
                        />
                        <TextareaField 
                            label='Startup Pitch & Summary *' 
                            value={formData.description} 
                            placeholder='Describe your value proposition, revenue model, team background, and growth trajectory...'
                            onChange={(v) => handleInputChange('description', v)} 
                            required={true} 
                        />
                    </div>
                </FormCard>

                {/* Section 5: Pitch Deck & Proof Images */}
                <FormCard title='Pitch Deck & Proof Images' icon={Upload} subtitle='Upload pitch deck screenshots, traction proofs, or dashboards'>
                    <div className='border-2 border-dashed border-pink-200 hover:border-[#a11c5e] bg-pink-50/30 rounded-2xl p-8 text-center transition cursor-pointer'>
                        <input id='images' type='file' multiple accept='image/*' onChange={handleImageUpload} className='hidden' />
                        <label htmlFor='images' className='cursor-pointer flex flex-col items-center'>
                            <div className='w-12 h-12 rounded-full bg-pink-100 text-[#a11c5e] flex items-center justify-center mb-3 shadow-xs'>
                                <Upload className='w-6 h-6' />
                            </div>
                            <p className='text-sm font-bold text-slate-800 mb-1'>Click to upload pitch deck or screenshots</p>
                            <p className='text-xs text-gray-500'>Upload up to 5 PNG, JPG, or WEBP images (Max 5MB each)</p>
                        </label>
                    </div>

                    {formData.images.length > 0 && (
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6'>
                            {formData.images.map((img, index) => (
                                <div key={index} className='relative rounded-xl overflow-hidden border border-gray-200 aspect-video group'>
                                    <img
                                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                                        alt='Upload preview'
                                        className='w-full h-full object-cover'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => removeImage(index)}
                                        className='absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs shadow-md opacity-90 hover:opacity-100 transition'
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </FormCard>

                {/* Submit Action */}
                <div className='flex items-center justify-end gap-4 pt-4'>
                    <button
                        type='button'
                        onClick={() => navigate('/my-listings')}
                        className='px-6 py-3 rounded-xl border border-gray-300 font-semibold text-slate-700 text-sm hover:bg-gray-50 transition cursor-pointer'
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className='bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white text-sm px-8 py-3.5 rounded-xl font-bold hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer'
                    >
                        {isEditing ? 'Save Changes' : 'Publish Startup Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Reusable Components
const FormCard = ({ title, subtitle, icon: Icon, children }) => (
    <div className='bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs'>
        <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 rounded-xl bg-pink-50 text-[#a11c5e] border border-pink-100'>
                <Icon className='size-5' />
            </div>
            <div>
                <h3 className='text-lg font-bold text-slate-800'>{title}</h3>
                {subtitle && <p className='text-xs text-gray-500'>{subtitle}</p>}
            </div>
        </div>
        <hr className='my-5 border-gray-100' />
        {children}
    </div>
);

const InputField = ({ label, type = 'text', value, placeholder, onChange, required = false, min, max }) => (
    <div>
        <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2'>{label}</label>
        <input
            type={type}
            min={min}
            max={max}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className='w-full text-sm px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#a11c5e] text-slate-800 shadow-xs'
        />
    </div>
);

const SelectField = ({ label, options, value, onChange, required = false }) => (
    <div>
        <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2'>{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className='w-full text-sm px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#a11c5e] text-slate-800 shadow-xs capitalize cursor-pointer'
        >
            <option value=''>Select...</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
            ))}
        </select>
    </div>
);

const TextareaField = ({ label, value, placeholder, onChange, required = false }) => (
    <div>
        <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2'>{label}</label>
        <textarea
            rows={5}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className='w-full text-sm p-3.5 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#a11c5e] text-slate-800 shadow-xs'
        />
    </div>
);

const CheckboxField = ({ label, checked, onChange }) => (
    <label className='flex items-center gap-3 cursor-pointer select-none'>
        <input
            type='checkbox'
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className='size-4 accent-[#a11c5e] rounded cursor-pointer'
        />
        <span className='text-sm font-medium text-slate-800'>{label}</span>
    </label>
);

export default ManageListing;
