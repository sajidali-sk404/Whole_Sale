'use client'
import { createContext, useState, useCallback, useEffect, useContext, useMemo } from 'react'
import axios from 'axios'
import { AuthContext } from './AuthContextApi'

export const ShopContext = createContext({
  shops: [],
  totalShop: 0,
  loading: false,
  error: null,
  setShops: () => {},
  fetchShops: () => {},
});

export const ShopProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [shops, setShops] = useState([]);
  const [totalShop, setTotalShop] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShops = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setShops(response.data);
      setTotalShop(response.data.length);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch shop data');
      console.error('Shop fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchShops();
    }
  }, [fetchShops, isAuthenticated]);

  const contextValue = useMemo(() => ({
    shops,
    setShops,
    totalShop,
    loading,
    error,
    fetchShops
  }), [shops, totalShop, loading, error, fetchShops]);

  return (
    <ShopContext.Provider value={contextValue}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {children}
    </ShopContext.Provider>
  )
}