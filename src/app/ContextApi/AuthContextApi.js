'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

// Create the Auth Context with default values
export const AuthContext = createContext({
  token: null,
  userRole: null,
  userId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: () => {},
  logout: () => {},
  clearAuth: () => {},
});

// Create the Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [token, setTokenState] = useState(null);
    const [userRole, setUserRoleState] = useState(null);
    const [userId, setUserIdState] = useState(null);
    const [isAuthenticated, setIsAuthenticatedState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function to set auth state and store in localStorage
    const setAuthState = useCallback((authToken, role, id) => {
        try {
            setTokenState(authToken);
            setUserRoleState(role);
            setUserIdState(id);
            setIsAuthenticatedState(true);
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userRole', role);
            localStorage.setItem('userId', id);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('Failed to save authentication state');
            console.error('Auth state error:', err);
        }
    }, []);

    // Login function to be exposed through the context
    const login = useCallback(async (authToken, role, id) => {
        try {
            setLoading(true);
            await setAuthState(authToken, role, id);
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    }, [setAuthState]);

    // Logout function to be exposed through the context
    const logout = useCallback(async () => {
        try {
            setLoading(true);
            setTokenState(null);
            setUserRoleState(null);
            setUserIdState(null);
            setIsAuthenticatedState(false);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            setError(null);
            window.location.href = "/";
        } catch (err) {
            setError('Logout failed. Please try again.');
            console.error('Logout error:', err);
        } finally {
            setLoading(false);
        }
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

    const authContextValue = useMemo(() => ({
        token,
        userRole,
        userId,
        isAuthenticated,
        login,
        logout,
        loading,
        error,
        clearAuth,
    }), [token, userRole, userId, isAuthenticated, login, logout, loading, error, clearAuth]);

    return (
        <AuthContext.Provider value={authContextValue}>
            {loading ? (
                <div className="flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                        <p className="text-gray-600">Verifying authentication...</p>
                    </div>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {children}
                </>
            )}
        </AuthContext.Provider>
    );
};