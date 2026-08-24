import React from 'react';

export const ClerkProvider = ({ children }) => {
    return <>{children}</>;
};

export const SignedIn = ({ children }) => {
    return null;
};

export const SignedOut = ({ children }) => {
    return <>{children}</>;
};

export const SignInButton = ({ children }) => {
    return (
        <span 
            className="cursor-pointer"
            onClick={() => alert("Authentication Notice: To test real Clerk login, set VITE_CLERK_PUBLISHABLE_KEY in client/.env")}
        >
            {children || "Login"}
        </span>
    );
};

export const SignUpButton = ({ children }) => {
    return (
        <span 
            className="cursor-pointer"
            onClick={() => alert("Authentication Notice: To test real Clerk signup, set VITE_CLERK_PUBLISHABLE_KEY in client/.env")}
        >
            {children || "Sign Up"}
        </span>
    );
};

export const UserButton = () => {
    return (
        <button 
            onClick={() => alert("Demo User Profile")}
            className="px-3.5 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-sm"
        >
            Demo User
        </button>
    );
};

UserButton.MenuItems = ({ children }) => <>{children}</>;
UserButton.Action = () => null;

export const useUser = () => {
    return {
        isLoaded: true,
        isSignedIn: false,
        user: null,
    };
};

export const useAuth = () => {
    return {
        isLoaded: true,
        isSignedIn: false,
        userId: null,
        getToken: async () => "",
    };
};

export const useClerk = () => {
    return {
        openSignIn: () => alert("Authentication Notice: To test real Clerk login, set VITE_CLERK_PUBLISHABLE_KEY in client/.env"),
        openSignUp: () => alert("Authentication Notice: To test real Clerk signup, set VITE_CLERK_PUBLISHABLE_KEY in client/.env"),
        signOut: async () => {},
    };
};
export const ClerkLoaded = ({ children }) => <>{children}</>;
export const ClerkLoading = () => null;
export const Protect = ({ children }) => <>{children}</>;

export const SignIn = (props) => (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-sm text-center">
        <h3 className="font-bold text-slate-800 text-lg mb-2">Clerk Sign In (Mock)</h3>
        <p className="text-xs text-slate-500 mb-4">To enable live Clerk authentication, provide a valid <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env</code>.</p>
        <button 
            onClick={() => alert("To test real Clerk authentication, set VITE_CLERK_PUBLISHABLE_KEY in client/.env")}
            className="w-full py-2 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white rounded-xl text-sm font-medium hover:opacity-90 cursor-pointer"
        >
            Sign In with Clerk
        </button>
    </div>
);

export const SignUp = (props) => (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-sm text-center">
        <h3 className="font-bold text-slate-800 text-lg mb-2">Clerk Sign Up (Mock)</h3>
        <p className="text-xs text-slate-500 mb-4">To enable live Clerk authentication, provide a valid <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env</code>.</p>
        <button 
            onClick={() => alert("To test real Clerk authentication, set VITE_CLERK_PUBLISHABLE_KEY in client/.env")}
            className="w-full py-2 bg-gradient-to-r from-[#702371] via-[#a11c5e] to-[#442077] text-white rounded-xl text-sm font-medium hover:opacity-90 cursor-pointer"
        >
            Sign Up with Clerk
        </button>
    </div>
);

export const UserProfile = () => <div className="p-4 bg-white rounded-xl border border-slate-200">User Profile</div>;
export const OrganizationProfile = () => <div className="p-4 bg-white rounded-xl border border-slate-200">Organization Profile</div>;
export const OrganizationSwitcher = () => <div className="p-4 bg-white rounded-xl border border-slate-200">Organization Switcher</div>;

export const useSession = () => ({ isLoaded: true, isSignedIn: false, session: null });
export const useSignIn = () => ({ isLoaded: true, signIn: null });
export const useSignUp = () => ({ isLoaded: true, signUp: null });


