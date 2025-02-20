'use client'
import { createContext, useState, useCallback, useEffect } from 'react'

export const ShopContext = createContext()

export const shopProvider = ({ children }) => {
  const [shop, setShop] = useState([])
  
  useEffect(() => {
    // Dummy data of shop, replace it with api call
    setShop([
      {
        id: 1,
        ShopName: "Company 1",
        ShopKeeperName: "ShopKeeperName 1",
        contact: "1234567890",
        address: "Address 1",
      },
      {
        id: 2,
        ShopName: "Company 2",
        ShopKeeperName: "ShopKeeperName 2",
        contact: "1234567890",
        address: "Address 2",
      },
      {
        id: 3,
        ShopName: "Company 3",
        ShopKeeperName: "ShopKeeperName 3",
        contact: "1234567890",
        address: "Address 3",
      },
    ]);

  }, [setShop]);
  

  const AddShop = useCallback((shopId) => {
    if (!shopId) return
    setShop(prev => {
      if (prev.includes(shopId)) return prev
      return [...prev, shopId]
    })
  }, [])

  const removeShop = useCallback((shopId) => {
    if (!shopId) return
    setShop(prev => prev.filter(id => id !== shopId))
  }, [])

  const isShop = useCallback((shopId) => {
    if (!shopId) return false
    return shop.includes(shopId)
  }, [shop])

  const value = {
    shop,
    setShop,
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