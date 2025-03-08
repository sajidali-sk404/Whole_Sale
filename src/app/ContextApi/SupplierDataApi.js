'use client'
import { createContext, useState, useCallback, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContextApi'

export const SupplierContext = createContext({
  suppliers: [],
  totalSupplier: 0,
  loading: false,
  error: null,
  setSuppliers: () => {},
  fetchSuppliers: () => {},
})

export const SupplierProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [totalSupplier, setTotalSupplier] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setSuppliers(response.data);
      setTotalSupplier(response.data.length);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch supplier data');
      console.error('Supplier fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSuppliers();
    }
  }, [fetchSuppliers, isAuthenticated]);

  const contextValue = useMemo(() => ({
    suppliers,
    setSuppliers,
    totalSupplier,
    loading,
    error,
    fetchSuppliers,
  }), [suppliers, totalSupplier, loading, error, fetchSuppliers]);

  return (
    <SupplierContext.Provider value={contextValue}>
      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
            <p className="text-gray-600">Loading supplier data...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {children}
    </SupplierContext.Provider>
  )
}