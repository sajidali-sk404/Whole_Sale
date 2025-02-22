'use client'
import React, { createContext, useState } from 'react';

// Create the context
export const DataContext = createContext();

// Create a provider component
export const DataProvider = ({ children }) => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            itemName: "sugar",
            quantity: 100,
          
          },
        {
            id: 2,
            itemName: "Rice",
            quantity: 200,
          
          },
        {
            id: 3,
            itemName: "Milk",
            quantity: 50,
          
          },
    ]);
    const [newData, setNewData] = useState({
        items: [],
        payments: [],
        status: 'pending',
        transportDetails: {}
    });

    // Handle adding new data (order)
    const handleAddData = (e) => {
        e.preventDefault();
        setOrders([...orders, newData]);
        setNewData({ items: [], payments: [], status: 'pending', transportDetails: {} });
    };

    // Handle item change
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...newData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setNewData({ ...newData, items: updatedItems });
    };

    // Add a new item to the order
    const addNewItem = () => {
        setNewData(prev => ({ ...prev, items: [...prev.items, { itemName: '', quantity: 1, price: 0 }] }));
    };

    // Handle transport change
    const handleTransportChange = (field, value) => {
        setNewData(prev => ({
            ...prev,
            transportDetails: { ...prev.transportDetails, [field]: value }
        }));
    };

    // Handle order status change
    const handleStatusChange = (status) => {
        setNewData(prev => ({ ...prev, status }));
    };

    // Handle edit and delete actions
    const handleEdit = (id) => {
        const orderToEdit = orders.find(order => order.id === id);
        if (orderToEdit) {
            setNewData(orderToEdit);
        }
    };

    const handleDelete = (id) => {
        setOrders(orders.filter(order => order.id !== id));
    };

    return (
        <DataContext.Provider
            value={{
                orders,
                newData,
                setShowForm: () => {}, // Adjust as needed
                handleAddData,
                setNewData,
                handleItemChange,
                addNewItem,
                handleTransportChange,
                handleStatusChange,
                handleEdit,
                handleDelete,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
