import React from 'react'
import Link  from 'next/link';


function SupplierManagement() {
  const suppliers = [
    { id: 1, name: 'Supplier A', email: 'supplierA@example.com', phone: '123-456-7890', address: '123 Main St' },
    { id: 2, name: 'Supplier B', email: 'supplierB@example.com', phone: '987-654-3210', address: '456 Elm St' },
    { id: 3, name: 'Supplier C', email: 'supplierC@example.com', phone: '555-555-5555', address: '789 Oak St' },
  ];
  return (
    <div className="min-h-screen bg-gray-100 p-6">
    {/* Page Header */}
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
      <p className="text-gray-600">Manage your suppliers efficiently</p>
    </header>

    {/* Add Supplier Button */}
    <div className="mb-6">
      <Link
        href="/suppliers/add"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Add New Supplier
      </Link>
    </div>

    {/* Supplier Table */}
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {suppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{supplier.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                <button className="text-red-500 hover:text-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
);
}

 

export default SupplierManagement;