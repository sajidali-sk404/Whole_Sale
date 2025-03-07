'use client'
import React, { useState, useEffect, useCallback } from 'react';
import AddShop from '@/app/components/AddShop';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPlus, FaBuilding, FaSearch } from 'react-icons/fa'; // Added FaSearch
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteConfirmation from './component/DeleteConfirmation';

function ShopkeeperManagement() {
    const [shopkeepers, setShopkeepers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Add search query state
    const [filteredShopkeepers, setFilteredShopkeepers] = useState([]); // Add filtered shopkeepers state
    const router = useRouter();

    const fetchShopkeepers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper`, { // Protected route
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
                    'Content-Type': 'application/json', // Or any content type your API expects
                },
            });
            setShopkeepers(response.data);
        } catch (error) {
            setError('Failed to fetch shopkeepers.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShopkeepers();
    }, [fetchShopkeepers]);

    // Filter shopkeepers based on search query
    useEffect(() => {
        if (searchQuery) {
            const filtered = shopkeepers.filter(shopkeeper =>
                shopkeeper.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shopkeeper.shopkeeperName.toLowerCase().includes(searchQuery.toLowerCase())
                // Add other fields to search here, e.g., shopkeeper.address.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredShopkeepers(filtered);
        } else {
            setFilteredShopkeepers(shopkeepers); // If no search query, show all shopkeepers
        }
    }, [searchQuery, shopkeepers]);

    const handleAddShop = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleShopkeeperClick = (shopkeeperId) => {
        router.push(`/pages/shopkeepers/shopDetailPage/${shopkeeperId}`);
    };
    const handleDeleteClick = (id) => {
        setDeleteId(id); // Set the ID to be deleted
        setShowDeleteConfirm(true); // Show the confirmation modal
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
        <div className="min-h-screen bg-gray-100">
            {/* Page Header */}
            <header className="bg-blue-600 py-6 shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-white">Shopkeeper Management</h1>
                    <p className="mt-2 text-lg text-blue-100">Manage your shopkeepers efficiently</p>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Search Bar and Add Shopkeeper Button (Option 2 - Right Aligned) */}
                <div className="mb-8">
                    <div className="relative rounded-md shadow-sm w-full mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search shopkeepers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                        />
                    </div>

                    <button
                        onClick={handleAddShop}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center mb-4 sm:mb-0 sm:mr-4"
                    >
                        <FaPlus className="mr-2" />
                        Add New Shopkeeper
                    </button>

                </div>

                {/* Shopkeeper Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredShopkeepers.length > 0 ? (
                        filteredShopkeepers.map((Shopkeeper) => (
                            <motion.div
                                key={Shopkeeper._id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleShopkeeperClick(Shopkeeper._id)}
                                className="bg-white relative rounded-lg shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200"
                            >
                                 <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(Shopkeeper._id)
                                    }}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200 absolute top-2 right-2"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                                    <FaBuilding className="text-2xl" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">{Shopkeeper.shopName}</h2>
                                <p className="mt-1 text-gray-600">Owner: {Shopkeeper.shopkeeperName}</p>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">No shopkeepers found matching your search.</div>
                    )}
                </div>

                {/* Add Shopkeeper Form (Modal) */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <AddShop showForm={showForm} setShowForm={handleCloseForm} refreshShopkeepers={fetchShopkeepers} />
                    </div>
                )}
                 {/* Delete Confirmation Modal */}
                 {showDeleteConfirm && (
                    <DeleteConfirmation
                        id={deleteId}
                        setShowDeleteConfirm={setShowDeleteConfirm}
                        fetchShopkeepers={fetchShopkeepers} //Pass fetchShopkeepers
                        setShopkeepers={setShopkeepers} // Pass setShopkeepers
                    />
                )}
            </div>
        </div>
    );
}

export default ShopkeeperManagement;