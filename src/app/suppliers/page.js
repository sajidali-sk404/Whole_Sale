'use client'
import React from 'react'
import Link from 'next/link';
import AddCompany from '../components/AddCompany';
import { useState } from 'react';


function SupplierManagement() {

  const suppliers = [
    { id: 1, name: 'Supplier A', email: 'supplierA@example.com', phone: '123-456-7890', address: '123 Main St' },
    { id: 2, name: 'Supplier B', email: 'supplierB@example.com', phone: '987-654-3210', address: '456 Elm St' },
    { id: 3, name: 'Supplier C', email: 'supplierC@example.com', phone: '555-555-5555', address: '789 Oak St' },
  ];

    const [showForm, setShowForm] = useState(false);
  const [companies, setCompanies] = useState([]); // Store added companies

  // Function to add a new company
  const handleAddCompany = (company) => {
    setCompanies([...companies, company]); // Update state
    setShowAddCompany(false); // Close modal
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 ">
      {/* Page Header */}
      <header className="mb-8 flex flex-col justify-center items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
        <p className="text-gray-600">Manage your suppliers efficiently</p>
      </header>

      {/* Add Supplier Button */}
      <div className="mb-6 flex justify-start">
        <div
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-52 text-center"
        >
          Add New Supplier
        </div>
      </div>

      {/* Supplier Table */}
      <div className="overflow-hidden grid grid-cols-4 gap-5">
        {suppliers.map((s)=>{
          return (<div key={s.id} className='h-20 w-20 bg-red-500'>
            {s.name}
          </div>)
        })}
      </div>

      {showForm && (
        <AddCompany showForm={showForm} setShowForm={setShowForm}/>
      )}

    </div>
  );
}



export default SupplierManagement;