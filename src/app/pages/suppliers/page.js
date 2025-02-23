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
      <div className="overflow-hidden grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-5">
        {suppliers && suppliers.map((supplier) => {
          return (<motion.div
            whileHover={{ scale: 1.05 }}
            key={supplier._id}
            onClick={() => router.push(`/pages/suppliers/supplierDetailPage/${supplier._id}`)}
            className=' border-2 font-semibold gap-3  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full'>

            <p>Company: {supplier.companyName}</p>
            <p className='text-sm text-gray-400'>Owner: {supplier.owner}</p>
          </motion.div>)
        })}
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