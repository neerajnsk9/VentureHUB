import { Outlet, Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { SignIn, useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import api from "../../configs/axios";
import toast from "react-hot-toast";
import { ArrowRightIcon, Loader2Icon, ShieldAlert } from "lucide-react";

const Layout = () => {
    const { user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    const fetchIsAdmin = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get("/api/admin/isAdmin", { headers: { Authorization: `Bearer ${token}` } });
            setIsAdmin(data.isAdmin);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchIsAdmin();
        }
    }, [isLoaded, user]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader2Icon className="size-8 text-[#a11c5e] animate-spin" />
            </div>
        );
    }

    if (isLoaded && !user) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <SignIn />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader2Icon className="size-8 text-[#a11c5e] animate-spin" />
            </div>
        );
    }

    return isAdmin ? (
        <div className="min-h-screen bg-slate-50/60">
            <AdminNavbar />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 px-4 py-8 md:px-10 h-[calc(100vh-64px)] bg-slate-50/60 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen text-center p-6 bg-slate-50">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-4">
                <ShieldAlert className="size-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Restricted</h2>
            <p className="text-sm text-slate-600 max-w-md mb-6">
                You do not have administrative privileges to view the VentureHUB Admin Portal.
            </p>
            <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white font-semibold rounded-xl hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all"
            >
                Return to Home <ArrowRightIcon className="size-4" />
            </Link>
        </div>
    );
};

export default Layout;
