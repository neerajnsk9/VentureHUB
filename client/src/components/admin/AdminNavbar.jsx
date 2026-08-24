import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { Shield, Home, ShieldCheck } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const AdminNavbar = () => {
    return (
        <header className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-100 bg-white sticky top-0 z-40 shadow-xs">
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2">
                    <img className="h-10 w-auto hover:scale-[1.02] transition-transform duration-200" src={assets.logo} alt="VentureHUB Logo" />
                </Link>
                <span className="text-xs font-bold text-white bg-gradient-to-r from-[#702371] to-[#a11c5e] px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                    <ShieldCheck className="size-3" /> Admin
                </span>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    to="/"
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#a11c5e] bg-gray-50 hover:bg-pink-50 px-3.5 py-2 rounded-xl border border-gray-200 transition-all"
                >
                    <Home className="size-3.5" />
                    <span>View Main Site</span>
                </Link>
                <UserButton afterSignOutUrl="/" />
            </div>
        </header>
    );
};

export default AdminNavbar;
