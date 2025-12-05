'use client'
import { createContext, useState, useCallback, useEffect, useContext, useMemo } from 'react'
import axios from 'axios';
import { AuthContext } from './AuthContextApi';

export const BillContext = createContext({
    bills: [],
    loading: false,
    error: null,
    fetchBills: () => {},
    totalBills: 0
});

export const BillsProvider = ({ children }) => {
    const { isAuthenticated, token } = useContext(AuthContext);
    const [bills, setBills] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalBills, setTotalBills] = useState(0);

    const fetchBills = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/bills`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setBills(response.data);
            setTotalBills(response.data.length);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch bills');
            console.error('Bills fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [token, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBills();
        }
    }, [fetchBills, isAuthenticated]);

    const contextValue = useMemo(() => ({
        bills,
        loading,
        error,
        fetchBills,
        totalBills
    }), [bills, loading, error, fetchBills, totalBills]);

    return (
        <BillContext.Provider value={contextValue}>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {children}
        </BillContext.Provider>
    )
};
