'use client'
import React from 'react'
import AddSupplier from '@/app/components/AddSupplier';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// import { SupplierContext } from '@/app/ContextApi/SupplierDataApi';
import { useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function SupplierManagement() {

  // const { suppliers, setSuppliers } = useContext(SupplierContext);
  const [suppliers, setSuppliers] = useState();

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/supplier`)
      setSuppliers(response.data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers, setSuppliers, suppliers])

  const [showForm, setShowForm] = useState(false);

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      {/* Page Header */}
      <header className="mb-8 flex flex-col justify-center items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
        <p className="text-gray-600">Manage your suppliers efficiently</p>
      </header>

      {/* Add Supplier Button */}
      <div className="mb-6 flex justify-start">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-52 text-center"
        >
          Add New Supplier
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="overflow-hidden grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
        {suppliers?.map((supplier) => (
          <motion.div
            key={supplier._id}
            whileHover={{ scale: 1.02 }}
            onClick={() => router.push(`/pages/suppliers/supplierDetailPage/${supplier._id}`)}
            className="w-full p-6 bg-white border border-gray-200 shadow-lg rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full text-xl font-bold">
              {supplier.companyName.charAt(0)}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-800">{supplier.companyName}</h3>
            <p className="mt-1 text-sm text-gray-500">Owner: {supplier.owner}</p>
          </motion.div>
        ))}
      </div>


      {showForm && (
        <AddSupplier
          showForm={showForm}
          setShowForm={setShowForm} />
      )}

    </div>
  );
}



export default SupplierManagement;