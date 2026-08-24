import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ManageListing from './pages/ManageListing';
import ChatBox from './components/ChatBox';
import Messages from './pages/Messages';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllPublicListing, getAllUserListing } from './app/features/listingSlice';
import { useAuth, useUser } from '@clerk/clerk-react';
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AllListings from './pages/admin/AllListings';
import Transactions from './pages/admin/Transactions';
import Loading from './pages/Loading';
import MyOrders from './pages/Myorders';
import Withdrawal from './pages/admin/Withdrawal';
import Marketplace from './pages/Marketplace';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyListings from './pages/MyListings';
import ListingDetails from './pages/ListingDetials';
import PlansPage from './pages/PlansPage';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';

const ProtectedRoute = ({ children }) => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to='/' replace />;
    }

    return children;
};

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const getUserEmails = (user) => {
    const emails = new Set();

    if (user?.primaryEmailAddress?.emailAddress) {
        emails.add(normalizeEmail(user.primaryEmailAddress.emailAddress));
    }

    if (Array.isArray(user?.emailAddresses)) {
        user.emailAddresses.forEach((emailAddress) => {
            if (emailAddress?.emailAddress) {
                emails.add(normalizeEmail(emailAddress.emailAddress));
            }
        });
    }

    return [...emails];
};

const App = () => {
    const { pathname } = useLocation();
    const { getToken } = useAuth();
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllPublicListing());
    }, [dispatch]);

    useEffect(() => {
        if (isLoaded && user) {
            dispatch(getAllUserListing({ getToken }));

            // Auto-redirect admin users to /admin
            const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(normalizeEmail).filter(Boolean);
            const userEmails = getUserEmails(user);
            if (userEmails.some((email) => adminEmails.includes(email)) && !pathname.startsWith('/admin')) {
                navigate('/admin', { replace: true });
            }
        }
    }, [dispatch, getToken, isLoaded, user]);

    if (!isLoaded) {
        return <Loading />;
    }

    return (
        <div>
            <Toaster />
            {!pathname.includes('/admin') && <Navbar />}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/marketplace' element={<Marketplace />} />
                <Route path='/plans' element={<PlansPage />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/careers' element={<Careers />} />
                <Route path='/contact' element={<ContactUs />} />
                <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                <Route path='/my-listings' element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                <Route path='/listing/:listingId' element={<ListingDetails />} />
                <Route path='/create-listing' element={<ProtectedRoute><ManageListing /></ProtectedRoute>} />
                <Route path='/edit-listing/:id' element={<ProtectedRoute><ManageListing /></ProtectedRoute>} />
                <Route path='/messages' element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path='/my-orders' element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path='/loading/:nextUrl' element={<Loading />} />
                <Route path='/admin' element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path='list-listings' element={<AllListings />} />
                    <Route path='transactions' element={<Transactions />} />
                    <Route path='withdrawal' element={<Withdrawal />} />
                </Route>
            </Routes>
            <ChatBox />
        </div>
    );
};

export default App;
