'use client'
import React from 'react'
import AddShop from '@/app/components/AddShop';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { ShopContext } from '@/app/ContextApi/shopkeepersDataApi';



function ShopKeeperManagement() {

  const { shops, setShops } = useContext(ShopContext);

  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      {/* Page Header */}
      <header className="mb-8 flex flex-col justify-center items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-800">shop Management</h1>
        <p className="text-gray-600">Manage your shop efficiently</p>
      </header>

      {/* Add shop Button */}
      <div className="mb-6 flex justify-start">
        <div
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-52 text-center"
        >
          Add New shop
        </div>
      </div>

      {/* shop Grid */}
      <div className="overflow-hidden grid grid-cols-4 gap-5">
      {shops && shops.length > 0 ? (
    shops.map((shopItem) => (
      <div
        key={shopItem.id}
        onClick={() => router.push(`/pages/shops/shopDetailPage/${shopItem.id}`)}
        className="border-2 font-semibold gap-5 bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full"
      >
        <p>{shopItem.shopName}</p>
        <p>{shopItem.shopKeeperName}</p>
      </div>
    ))
  ) : (
    <p>No shops available.</p>
  )}
      </div>

      {showForm && (
        <AddShop 
        showForm={showForm} 
        setShowForm={setShowForm}
        setShop={setShops}
        shop={shops} />
      )}

    </div>
  );
}



export default ShopKeeperManagement;