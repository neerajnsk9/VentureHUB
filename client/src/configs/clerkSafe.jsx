import React from 'react';
import * as ClerkReact from '@clerk/clerk-react';

export const useUserSafe = () => {
    try {
        const result = ClerkReact.useUser();
        if (result && result.isLoaded !== undefined) {
            return result;
        }
    } catch (e) {
        // Fallthrough to mock
    }
    return { isLoaded: true, isSignedIn: false, user: null };
};

export const useAuthSafe = () => {
    try {
        const result = ClerkReact.useAuth();
        if (result && result.isLoaded !== undefined) {
            return result;
        }
    } catch (e) {
        // Fallthrough to mock
    }
    return { isLoaded: true, isSignedIn: false, userId: null, getToken: async () => "" };
};

export const useClerkSafe = () => {
    try {
        const result = ClerkReact.useClerk();
        if (result) {
            return result;
        }
    } catch (e) {
        // Fallthrough to mock
    }
    return {
        openSignIn: () => alert("Clerk Auth: Please configure VITE_CLERK_PUBLISHABLE_KEY in client/.env to sign in."),
        openSignUp: () => alert("Clerk Auth: Please configure VITE_CLERK_PUBLISHABLE_KEY in client/.env to sign up."),
        signOut: () => Promise.resolve(),
    };
};
