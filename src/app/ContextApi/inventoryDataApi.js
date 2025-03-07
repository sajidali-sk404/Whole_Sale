'use client'
import { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios';

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {

    const [inventoryData, setInventoryData] = useState([]);
    const [totalInventory, setTotalInventory] = useState(0);

    const fetchInventoryData = useCallback(async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            setInventoryData(response.data);
            setTotalInventory(response.data.length);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchInventoryData();
    }, [fetchInventoryData]);

    return (
        <InventoryContext.Provider value={{inventoryData, totalInventory, fetchInventoryData}}>
          {children}
        </InventoryContext.Provider>
      )
};

