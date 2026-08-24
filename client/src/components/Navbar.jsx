import { assets } from '../assets/assets';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { GripIcon, ListIcon, MenuIcon, MessageCircleMoreIcon, XIcon, ShieldCheck, LayoutDashboardIcon, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, isLoaded } = useUser();
    const { openSignIn } = useClerk();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    const isAdminUser = userEmail && adminEmails.includes(userEmail.toLowerCase());

    if (!isLoaded) {
        return <nav className='h-20' />;
    }

    return (
        <nav className='h-20'>
            <div className='fixed left-0 top-0 right-0 z-100 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-3 border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-xs transition-all'>
                <div className='flex items-center gap-2'>
                    <img onClick={() => { navigate('/'); scrollTo(0, 0); }} src={assets.logo} alt='VentureHUB Logo' className='h-11 sm:h-13 md:h-14 w-auto cursor-pointer hover:scale-[1.02] transition-transform duration-200' />
                </div>

                {/* Desktop Menu */}
                <div className='hidden sm:flex items-center gap-4 md:gap-7 max-md:text-sm text-slate-700'>
                    <Link onClick={() => scrollTo(0, 0)} to='/' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> Home </Link>
                    <Link onClick={() => scrollTo(0, 0)} to='/marketplace' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> Marketplace </Link>
                    {user ? <Link onClick={() => scrollTo(0, 0)} to='/messages' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> Messages </Link> : <Link onClick={openSignIn} to='#' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> Messages </Link> }
                    {user ? <Link onClick={() => scrollTo(0, 0)} to='/my-listings' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> My Startups </Link> : <Link onClick={openSignIn} to='#' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> My Startups </Link> }
                    {user ? <Link onClick={() => scrollTo(0, 0)} to='/my-orders' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> My Investments </Link> : <Link onClick={openSignIn} to='#' className='text-base md:text-lg font-semibold hover:text-[#a11c5e] transition-colors'> My Investments </Link> }
                    
                    {/* Exclusive Admin Dashboard Navigation Option */}
                    {isAdminUser && (
                        <Link 
                            to='/admin' 
                            onClick={() => scrollTo(0, 0)}
                            className='flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white text-xs md:text-sm font-bold rounded-full shadow-md shadow-pink-500/20 hover:opacity-95 active:scale-95 transition-all'
                        >
                            <ShieldCheck className='size-4' />
                            <span>Admin Portal</span>
                        </Link>
                    )}
                </div>

                {!user ? (
                    <div className='flex items-center gap-3'>
                        <button onClick={openSignIn} className='max-sm:hidden cursor-pointer px-8 py-2.5 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] hover:opacity-95 transition-all text-white font-semibold rounded-full shadow-md shadow-pink-500/20 active:scale-95'>Login</button>
                        <MenuIcon className='sm:hidden size-7 text-slate-700 cursor-pointer' onClick={()=>setMenuOpen(true)} />
                    </div>
                ) : (
                    <div className='flex items-center gap-3'>
                        <UserButton
                            appearance={{
                                elements: {
                                    userButtonTrigger: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border-2 border-pink-200 hover:border-[#a11c5e] transition-colors',
                                    userButtonAvatarBox: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full'
                                }
                            }}
                        >
                            {isAdminUser && (
                                <UserButton.MenuItems>
                                    <UserButton.Action label='Admin Dashboard' labelIcon={<LayoutDashboardIcon size={16} />} onClick={() => navigate('/admin')} />
                                </UserButton.MenuItems>
                            )}
                            <UserButton.MenuItems>
                                <UserButton.Action label='Marketplace' labelIcon={<GripIcon size={16} />} onClick={() => navigate('/marketplace')} />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action label='Messages' labelIcon={<MessageCircleMoreIcon size={16} />} onClick={() => navigate('/messages')} />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action label='My Startups' labelIcon={<ListIcon size={16} />} onClick={() => navigate('/my-listings')} />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action label='My Investments' labelIcon={<TrendingUp size={16} />} onClick={() => navigate('/my-orders')} />
                            </UserButton.MenuItems>
                        </UserButton>
                        <MenuIcon className='sm:hidden size-7 text-slate-700 cursor-pointer' onClick={()=>setMenuOpen(true)} />
                    </div>
                )}
            </div>

            {/* Mobile Slide-over Menu */}
            <div className={`sm:hidden fixed inset-0 ${menuOpen ? 'w-full' :'w-0'} overflow-hidden bg-white/95 backdrop-blur-lg shadow-2xl z-200 text-sm transition-all duration-300`}>
                <div className='flex flex-col items-center justify-center h-full text-xl font-semibold gap-6 p-4 text-slate-800'>
                    <img src={assets.logo} alt="VentureHUB" className="h-12 w-auto mb-4" />
                    <Link to='/' onClick={() => setMenuOpen(false)}> Home </Link>
                    <Link to='/marketplace' onClick={() => setMenuOpen(false)}> Marketplace </Link>
                    <button onClick={() => { setMenuOpen(false); if (user) navigate('/messages'); else openSignIn(); }}> Messages </button>
                    <button onClick={() => { setMenuOpen(false); if (user) navigate('/my-listings'); else openSignIn(); }}> My Startups </button>
                    <button onClick={() => { setMenuOpen(false); if (user) navigate('/my-orders'); else openSignIn(); }}> My Investments </button>
                    
                    {/* Exclusive Mobile Admin Link */}
                    {isAdminUser && (
                        <button 
                            onClick={() => { setMenuOpen(false); navigate('/admin'); }}
                            className='flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white rounded-full font-bold text-base shadow-md shadow-pink-500/20'
                        >
                            <ShieldCheck className='size-5' />
                            <span>Admin Portal</span>
                        </button>
                    )}

                    {!user && <button onClick={openSignIn} className='cursor-pointer px-9 py-3 bg-gradient-to-r from-[#442077] via-[#764DE1] to-[#6366F1] text-white rounded-full font-semibold shadow-lg shadow-purple-500/25 mt-2'>Login</button>}
                    <XIcon onClick={() => setMenuOpen(false)} className='absolute size-8 right-6 top-6 text-gray-500 hover:text-gray-700 cursor-pointer' />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
