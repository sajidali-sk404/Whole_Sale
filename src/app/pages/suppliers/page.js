'use client'
import React, { useState, useEffect, useCallback } from 'react';
import AddSupplier from '@/app/components/AddSupplier';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPlus, FaUser, FaBuilding } from 'react-icons/fa'; // Import icons
import { TrashIcon } from "@heroicons/react/24/outline";

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]); // Initialize as an empty array
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const router = useRouter();

  const fetchSuppliers = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear any previous errors
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier`);
      setSuppliers(response.data);
    } catch (error) {
      setError('Failed to fetch suppliers.'); // Set a user-friendly error message
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false after fetching (success or failure)
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleAddSupplier = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSupplierClick = (supplierId) => {
    router.push(`/pages/suppliers/supplierDetailPage/${supplierId}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error(error);
    }
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
          <h1 className="text-3xl font-bold text-white">Supplier Management</h1>
          <p className="mt-2 text-lg text-blue-100">Manage your suppliers efficiently</p>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Add Supplier Button (with Icon) */}
        <div className="mb-8 flex justify-start">
          <button
            onClick={handleAddSupplier}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add New Supplier
          </button>
        </div>

        {/* Supplier Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <motion.div
                key={supplier._id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSupplierClick(supplier._id)}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-200 relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(supplier._id)
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 absolute top-2 right-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  {/* Use a building icon, or the first letter if you prefer */}
                  <FaBuilding className="text-2xl" />
                  {/* {supplier.companyName.charAt(0)} */}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{supplier.companyName}</h2>
                <p className="mt-1 text-gray-600">Owner: {supplier.owner}</p>
                {/* You could add more details here, like contact info */}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No suppliers found.</div>
          )}
        </div>

        {/* Add Supplier Form (Modal) */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AddSupplier showForm={showForm} setShowForm={handleCloseForm} refreshSuppliers={fetchSuppliers} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SupplierManagement;