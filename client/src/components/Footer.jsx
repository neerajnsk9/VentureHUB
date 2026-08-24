import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-28 px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 bg-white pt-12 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="sm:col-span-2 lg:col-span-1">
                    <Link to="/" onClick={() => scrollTo(0, 0)} className="inline-block mb-2">
                        <img src={assets.logo} alt="VentureHUB" className="h-12 w-auto" />
                    </Link>
                    <p className="text-sm/7 mt-3 text-slate-600">
                        VentureHUB is India's leading startup marketplace connecting visionary founders with investors and buyers through a secure, user-friendly platform.
                    </p>
                </div>
                
                <div className="flex flex-col lg:items-center lg:justify-center">
                    <div className="flex flex-col text-sm space-y-3">
                        <h2 className="font-bold mb-2 text-slate-900 text-base">Company</h2>
                        <Link onClick={() => scrollTo(0, 0)} className="hover:text-[#a11c5e] transition font-semibold text-slate-700" to="/about">About Us</Link>
                        <Link onClick={() => scrollTo(0, 0)} className="hover:text-[#a11c5e] transition font-semibold text-slate-700 flex items-center" to="/careers">
                            Careers
                            <span className="text-[10px] text-white bg-gradient-to-r from-[#702371] to-[#a11c5e] rounded-md ml-2 px-2 py-0.5 shadow-xs font-bold uppercase tracking-wider">Hiring!</span>
                        </Link>
                        <Link onClick={() => scrollTo(0, 0)} className="hover:text-[#a11c5e] transition font-semibold text-slate-700" to="/contact">Contact Us</Link>
                        <Link onClick={() => scrollTo(0, 0)} className="hover:text-[#a11c5e] transition font-semibold text-slate-700" to="/privacy-policy">Privacy Policy</Link>
                    </div>
                </div>

                <div>
                    <h2 className="font-bold text-slate-900 mb-3 text-base">Subscribe to our newsletter</h2>
                    <div className="text-sm space-y-3 max-w-sm">
                        <p className="text-slate-600 text-xs sm:text-sm">The latest startup listings, market insights, and investor updates sent weekly.</p>
                        <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-pink-50/60 border border-pink-100">
                            <input className="focus:ring-2 ring-[#a11c5e] outline-none w-full max-w-64 py-2 rounded-lg px-3 bg-white border border-gray-200 text-xs sm:text-sm text-slate-700" type="email" placeholder="Enter your email" />
                            <button className="bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] px-4 py-2 text-white font-semibold rounded-lg hover:opacity-95 text-xs shadow-md shadow-pink-500/20 active:scale-95 transition-all shrink-0">Subscribe</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="py-6 text-center border-t mt-10 border-slate-100 text-xs text-slate-400 font-medium">
                Copyright {new Date().getFullYear()} © VentureHUB Inc. All Rights Reserved.
            </p>
        </footer>
    );
};
