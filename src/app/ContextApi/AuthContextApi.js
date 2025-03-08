'use client'; // Assuming this is a client component

import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create the Auth Context
export const AuthContext = createContext(null); // Initialize with null, or a default value if needed

// Create the Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [token, setTokenState] = useState(null);
    const [userRole, setUserRoleState] = useState(null);
    const [userId, setUserIdState] = useState(null);
    const [isAuthenticated, setIsAuthenticatedState] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    // Helper function to set auth state and store in localStorage
    const setAuthState = useCallback((authToken, role, id) => {
        setTokenState(authToken);
        setUserRoleState(role);
        setUserIdState(id);
        setIsAuthenticatedState(true);
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', id);
    }, []);

    // Login function to be exposed through the context
    const login = useCallback((authToken, role, id) => {
        setAuthState(authToken, role, id);
    }, [setAuthState]);

    // Logout function to be exposed through the context
    const logout = useCallback(() => {
        setTokenState(null);
        setUserRoleState(null);
        setUserIdState(null);
        setIsAuthenticatedState(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        window.location.href = "/";
    }, []);

    // Function to clear auth state and localStorage (useful for error handling/cleanup)
    const clearAuth = useCallback(() => {
        setTokenState(null);
        setUserRoleState(null);
        setUserIdState(null);
        setIsAuthenticatedState(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
    }, []);


    // useEffect to check for token on initial load (when app starts or refreshes)
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');

        if (storedToken && storedRole && storedUserId) {
            setAuthState(storedToken, storedRole, storedUserId);
        }
        setLoading(false); // Set loading to false after initial check
    }, [setAuthState]);

    const authContextValue = {
        token,
        userRole,
        userId,
        isAuthenticated,
        login,
        logout,
        loading, // Expose loading state
        clearAuth, // Expose clearAuth function
    };

    if (loading) {
        // Optionally render a loading spinner or indicator while checking for token
        return <div>Loading authentication...</div>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};