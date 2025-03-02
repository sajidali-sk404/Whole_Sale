'use client'
import { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios'

export const ShopContext = createContext()

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([])

  const fetchShops = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper`)
      setShops(response.data)
    } catch (error) {
      console.error(error)
    }
  }, [shops])

  useEffect(() => {
    fetchShops();
  }, [fetchShops])

  const AddShop = useCallback((shopId) => {
    if (!shopId) return
    setShops(prev => {
      if (prev.includes(shopId)) return prev
      return [...prev, shopId]
    })
  }, [])

  const removeShop = useCallback((shopId) => {
    if (!shopId) return
    setShops(prev => prev.filter(id => id !== shopId))
  }, [])

  const isShop = useCallback((shopId) => {
    if (!shopId) return false
    return shops.includes(shopId)
  }, [shops])

  const value = {
    shops,
    setShops,
    fetchShops
    
  }

  return (
    <ShopContext.Provider async value={value}>
      {children}
    </ShopContext.Provider>
  )
}