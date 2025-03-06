'use client';
import { useState, useContext, useEffect, useCallback } from 'react';
import { InventoryContext } from '@/app/ContextApi/inventoryDataApi';
import { FaBoxOpen, FaSort } from 'react-icons/fa';
import SideBar from './component/sidebar';
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function Inventory() {
    const { inventoryData } = useContext(InventoryContext);
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [sortedInventory, setSortedInventory] = useState([]);

    // Consolidate items with case-insensitive matching and take the last value for other properties
    const consolidateInventory = useCallback((data) => {
        if (!data || !Array.isArray(data)) return [];

        const consolidated = {};

        data.forEach(item => {
            const itemNameLower = item.itemName.toLowerCase();

            if (consolidated[itemNameLower]) {
                // Item already exists (case-insensitive match) - use last encountered item
                consolidated[itemNameLower].quantity += item.quantity;
                // Optionally: Take the *last* value for properties like lastUpdated, or average them if it makes sense
                consolidated[itemNameLower].lastUpdated = item.lastUpdated;
                consolidated[itemNameLower]._id = item._id;
                consolidated[itemNameLower.purchasePrice] = item.price;
                
            } else {
                // New item
                consolidated[itemNameLower] = { ...item };
            }
        });

        return Object.values(consolidated);  // Convert the object back to an array
    }, []);

    // Memoize the sorting function
    const sortInventoryData = useCallback((data, config) => {
        if (!data || data.length === 0 || !config.key) {
            return data || [];
        }

        return [...data].sort((a, b) => {
            let aValue = a[config.key];
            let bValue = b[config.key];

            // Case-insensitive sorting for strings
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) {
                return config.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return config.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, []);

    useEffect(() => {
        if (inventoryData) {
            const consolidatedData = consolidateInventory(inventoryData);
            const sortedData = sortInventoryData(consolidatedData, sortConfig);
            setSortedInventory(sortedData);
        } else {
            setSortedInventory([]);
        }
    }, [inventoryData, sortConfig, consolidateInventory, sortInventoryData]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <>
            {/* Sidebar */}
            {isSidebarOpen ? (
                <SideBar setIsSidebarOpen={setIsSidebarOpen} />
            ) : (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 z-50 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>
            )}

            <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">Inventory Management</h1>
                    <p className="text-gray-600 mb-8 text-center">View and manage your current stock levels.</p>

                    {/* Stock Table */}
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-700"><FaBoxOpen className="inline-block mr-2 mb-1" />Current Stock</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('itemName')}
                                        >
                                            Item Name
                                            {sortConfig.key === 'itemName' && (
                                                <FaSort className="inline-block ml-1" />
                                            )}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort('quantity')}
                                        >
                                            Quantity
                                            {sortConfig.key === 'quantity' && (
                                                <FaSort className="inline-block ml-1" />
                                            )}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                             onClick={() => requestSort('lastUpdated')}
                                        >
                                            Last Updated
                                            {sortConfig.key === 'lastUpdated' && (
                                                <FaSort className="inline-block ml-1" />
                                            )}
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                             onClick={() => requestSort('lastUpdated')}
                                        >
                                            Purchase Price
                                            {sortConfig.key === 'PurchasedPrice' && (
                                                <FaSort className="inline-block ml-1" />
                                            )}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedInventory.length > 0 ? (
                                        sortedInventory.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.lastUpdated ? new Date(item.lastUpdated).toISOString().split('T')[0] : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.purchasePrice}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No inventory data available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}