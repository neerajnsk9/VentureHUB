import { NavLink } from 'react-router-dom';
import { useUser } from "@clerk/clerk-react";
import { BanknoteIcon, LayoutDashboardIcon, ListIcon, WalletIcon, ShieldCheck } from 'lucide-react';
import { assets } from "../../assets/assets";

const AdminSidebar = () => {
    const { user } = useUser();

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Listings', path: '/admin/list-listings', icon: ListIcon },
        { name: 'Transactions', path: '/admin/transactions', icon: BanknoteIcon },
        { name: 'Withdrawals', path: '/admin/withdrawal', icon: WalletIcon },
    ];

    return (
        <aside className='h-[calc(100vh-64px)] flex flex-col justify-between pt-6 pb-6 max-w-16 md:max-w-64 w-full border-r border-gray-100 bg-white shadow-xs text-sm shrink-0'>
            <div className='w-full space-y-6'>
                {/* Admin User Profile Header */}
                <div className='px-4 text-center max-md:hidden'>
                    <div className='relative inline-block'>
                        <img 
                            className='size-14 rounded-full mx-auto object-cover border-2 border-pink-200 shadow-sm' 
                            src={user?.imageUrl || assets.user_profile} 
                            alt={user?.fullName || "Admin"} 
                        />
                        <span className='absolute bottom-0 right-0 bg-[#a11c5e] text-white p-0.5 rounded-full ring-2 ring-white'>
                            <ShieldCheck className='size-3.5' />
                        </span>
                    </div>
                    <h3 className='mt-2.5 font-bold text-gray-900 text-sm truncate'>{user?.fullName || 'Admin User'}</h3>
                    <span className='inline-block text-[11px] font-semibold text-[#a11c5e] bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full mt-0.5'>
                        Administrator
                    </span>
                </div>

                {/* Nav Links */}
                <nav className='space-y-1 px-2'>
                    {adminNavlinks.map((link, index) => (
                        <NavLink 
                            key={index} 
                            to={link.path} 
                            end 
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-[#a11c5e] font-bold border border-pink-100 shadow-xs' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <link.icon className={`size-5 shrink-0 ${isActive ? 'text-[#a11c5e]' : 'text-gray-400'}`} />
                                    <span className="max-md:hidden text-sm">{link.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Platform Tag */}
            <div className='px-4 max-md:hidden'>
                <div className='p-3 bg-gradient-to-br from-pink-50/60 to-purple-50/60 border border-pink-100/80 rounded-xl text-center'>
                    <p className='text-xs font-bold text-slate-800'>VentureHUB Control</p>
                    <p className='text-[10px] text-gray-500 mt-0.5'>Admin Portal v2.0</p>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
