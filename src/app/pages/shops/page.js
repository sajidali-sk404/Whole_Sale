'use client'
import React from 'react'
import AddShop from '@/app/components/AddShop';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ShopContext } from '@/app/ContextApi/shopkeepersDataApi';
import { motion } from 'framer-motion';



function ShopKeeperManagement() {

  const { shops, setShops } = useContext(ShopContext);

  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  console.log(shops)

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      {/* Page Header */}
      <header className="mb-8 flex flex-col justify-center items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-800">shop Management</h1>
        <p className="text-gray-600">Manage your shop efficiently</p>
      </header>

      {/* Add shop Button */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-52 text-center"
        >
          Add New shop
        </button>
      </div>

      {/* shop Grid */}
      <div className="overflow-hidden grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {shops && shops.length > 0 ? (
          shops?.map((shopItem,index) => (
            <motion.div
              key={shopItem._id }
              
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/pages/shops/shopDetailPage/${shopItem._id}`)}
              className="w-full p-6 bg-white border border-gray-200 shadow-lg rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full text-xl font-bold">
              {shopItem.shopName ? shopItem.shopName.charAt(0) : ''}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">{shopItem.shopName}</h3>
              <p className="mt-1 text-sm text-gray-500">Owner: {shopItem.shopkeeperName}</p>
            </motion.div>
          ))
        ) : (
          <p>No shops available.</p>
        )}
      </div>

      {showForm && (
        <AddShop
          showForm={showForm}
          setShowForm={setShowForm}
          setShops={setShops}
          shops={shops} />
      )}

    </div>
  );
}



export default ShopKeeperManagement;