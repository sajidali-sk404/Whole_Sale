'use client'
import React from 'react'
import AddCompany from '@/app/components/AddCompany';
import { useState, useEffect } from 'react';
import { Link } from 'next/link';
import { useRouter } from 'next/navigation';
import { CompanyContext } from '@/app/ContextApi/companiesDataApi';
import { useContext } from 'react';
import { motion } from 'framer-motion';



function SupplierManagement() {
  const { companies, setCompanies } = useContext(CompanyContext);

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
      <div className="overflow-hidden grid grid-cols-4 gap-5">
        {companies && companies.map((company) => {
          return (<motion.div
            whileHover={{ scale: 1.05 }}
            key={company.id}
            onClick={() => router.push(`/pages/suppliers/supplierDetailPage/${company.id}`)}
            className=' border-2 font-semibold gap-5  bg-white shadow-md p-4 rounded-md flex flex-col items-center cursor-pointer w-full'>

            <p>{company.companyName}</p>
            <p>{company.owner}</p>
          </motion.div>)
        })}
      </div>

      {showForm && (
        <AddCompany
          showForm={showForm}
          setShowForm={setShowForm}
          setCompanies={setCompanies}
          companies={companies} />
      )}

    </div>
  );
}



export default SupplierManagement;