'use client'
import { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'

export const SupplierContext = createContext()

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [totalSupplier, setTotalSupplier] = useState();

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier`)
      setSuppliers(response.data)
      setTotalSupplier(response.data.length)

    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers])

  const addSupplier = useCallback((Supplier) => {
    if (!Supplier) return
    setSuppliers(prev => [...prev, Supplier])
  
  }, []);

  const removeSupplier = useCallback((SupplierId) => {
    if (!SupplierId) return
    setSuppliers(prev => prev.filter(id => id !== SupplierId))
  }, [])

  const isSupplier = useCallback((SupplierId) => {
    if (!SupplierId) return false
    return suppliers.includes(SupplierId)
  }, [suppliers])

  const value = {
    suppliers,
    setSuppliers,
    totalSupplier,
    fetchSuppliers
  }

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  )
}