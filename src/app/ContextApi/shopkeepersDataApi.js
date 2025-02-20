'use client'
import { createContext, useState, useCallback, useEffect } from 'react'

export const ShopContext = createContext()

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([])
  
  useEffect(() => {
    // Dummy data of shop, replace it with api call
    setShops([
      {
        id: 1,
        shopName: "Company 1",
        shopKeeperName: "shopKeeperName 1",
        contact: "1234567890",
        address: "Address 1",
      },
      {
        id: 2,
        shopName: "Company 2",
        shopKeeperName: "shopKeeperName 2",
        contact: "1234567890",
        address: "Address 2",
      },
      {
        id: 3,
        shopName: "Company 3",
        shopKeeperName: "shopKeeperName 3",
        contact: "1234567890",
        address: "Address 3",
      },
    ]);

  }, [setShops]);
  

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
    AddShop,
    removeShop,
    isShop
  }

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  )
}