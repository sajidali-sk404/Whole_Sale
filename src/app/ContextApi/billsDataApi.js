'use client'
import { createContext, useState, useCallback, useEffect } from 'react'
import axios from 'axios';

export const BillContext = createContext(null);

export const BillsProvider = ({ children }) => {

    const [Bills, setBills] = useState([]);
    console.log(Bills);
    // const [totalInventory, setTotalInventory] = useState(0);


    useEffect(() => {
        const fetchBills = async () => {
            console.log("Fetching bills...", process.env.NEXT_PUBLIC_API_URL);
            try {
                const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bills`, { // Protected route
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                        'Content-Type': 'application/json', // Or any content type your API expects
                    },
                }); // Make sure your backend is running on port 5000
                setBills(response.data);
            } catch (err) {
                console.error("Error fetching bills:", err);
            }
        };

        fetchBills();
    }, []);

    return (
        <BillContext.Provider value={{ Bills }}>
            {children}
        </BillContext.Provider>
    )
};
