'use client'
import React, { useState, useEffect, useCallback } from 'react';
import AddShop from '@/app/components/AddShop';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPlus, FaUser, FaBuilding } from 'react-icons/fa';

function ShopkeeperManagement() {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchShopkeepers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper`);
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

  const handleAddShop = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleShopkeeperClick = (shopkeeperId) => {
    router.push(`/pages/shopkeepers/shopDetailPage/${shopkeeperId}`);
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

        {/* Add Shopkeeper Button (with Icon) */}
        <div className="mb-8 flex justify-start">
          <button
            onClick={handleAddShop}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Shopkeeper
          </button>
        </div>

        {/* Shopkeeper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shopkeepers.length > 0 ? (
            shopkeepers.map((Shopkeeper) => (
              <motion.div
                key={Shopkeeper._id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShopkeeperClick(Shopkeeper._id)}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  {/* Use a building icon, or the first letter if you prefer */}
                   <FaBuilding className="text-2xl" />
                  {/* {Shopkeeper.shopName.charAt(0)} */}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{Shopkeeper.shopName}</h2>
                <p className="mt-1 text-gray-600">Owner: {Shopkeeper.shopkeeperName}</p>
                {/* You could add more details here, like contact info */}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No shopkeepers found.</div>
          )}
        </div>

        {/* Add Shopkeeper Form (Modal) */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AddShop showForm={showForm} setShowForm={handleCloseForm} refreshShopkeepers={fetchShopkeepers} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopkeeperManagement;