'use client'
import { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {

    const [inventoryData, setInventoryData] = useState([]);

    const fetchInventoryData = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`);
            setInventoryData(response.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchInventoryData();
    }, [fetchInventoryData]);

    return (
        <InventoryContext.Provider value={{inventoryData}}>
          {children}
        </InventoryContext.Provider>
      )
};

