'use client'
import React, { useState, useEffect, useCallback, useContext } from 'react';
import AddSupplier from '@/app/components/AddSupplier';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPlus, FaUser, FaBuilding, FaSearch } from 'react-icons/fa'; // Added FaSearch
import { TrashIcon } from "@heroicons/react/24/outline";
import DeleteConfirmation from './component/DeleteConfirmation';
import { AuthContext } from '@/app/ContextApi/AuthContextApi';

function SupplierManagement() {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || userRole === 'user') {
        if (typeof window !== 'undefined') {
            window.location.href = "/";
        }
    }
}, [isAuthenticated, userRole]);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier`, { // Protected route
        headers: {
          'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
          'Content-Type': 'application/json', // Or any content type your API expects
        },
      });
      setSuppliers(response.data);
    } catch (error) {
      setError('Failed to fetch suppliers.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = suppliers.filter(supplier =>
        supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.owner.toLowerCase().includes(searchQuery.toLowerCase())
        // Add other fields to search here
      );
      setFilteredSuppliers(filtered);
    } else {
      setFilteredSuppliers(suppliers);
    }
  }, [searchQuery, suppliers]);

  const handleAddSupplier = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSupplierClick = (supplierId) => {
    router.push(`/pages/suppliers/supplierDetailPage/${supplierId}`);
  };
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
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

  if (!isAuthenticated || userRole === 'user') return null;

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

        {/* Search Bar and Add Supplier Button */}
        <div className="mb-8">
          <div className="relative rounded-md shadow-sm w-full mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
            />
          </div>
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
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((supplier) => (
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
                    handleDeleteClick(supplier._id)
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 absolute top-2 right-2"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <FaBuilding className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{supplier.companyName}</h2>
                <p className="mt-1 text-gray-600">Owner: {supplier.owner}</p>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">No suppliers found matching your search.</div>
          )}
        </div>

        {/* Add Supplier Form (Modal) */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <AddSupplier showForm={showForm} setShowForm={handleCloseForm} refreshSuppliers={fetchSuppliers} />
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <DeleteConfirmation
            id={deleteId}
            setShowDeleteConfirm={setShowDeleteConfirm}
            fetchSuppliers={fetchSuppliers}
            setSuppliers={setSuppliers}
          />
        )}

      </div>
    </div>
  );
}

export default SupplierManagement;