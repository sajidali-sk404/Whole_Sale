'use client'
import React from "react";
import { useContext, useState, useEffect } from "react";
import { SupplierContext } from "@/app/ContextApi/SupplierDataApi";
import { FaChevronDown, FaChevronRight, FaPlusCircle } from 'react-icons/fa'; // Example icons
import { AuthContext } from "@/app/ContextApi/AuthContextApi";

export default function FinancialTransactions() {
  const { isAuthenticated } = useContext(AuthContext);
  const { suppliers, fetchSuppliers } = useContext(SupplierContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSuppliers, setExpandedSuppliers] = useState({});

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
    return null;
  }

  useEffect(() => {
      if (fetchSuppliers) {
          const fetchData = async () => {
              try {
                  await fetchSuppliers();
                  setLoading(false);
              } catch (err) {
                  setError(err.message || "An error occurred while fetching data.");
                  setLoading(false);
              }
          };
          fetchData();
      } else {
          setLoading(false);
          setError("fetchSuppliers function is not available.");
      }
  }, [fetchSuppliers]);

  const toggleExpanded = (supplierId) => {
    setExpandedSuppliers((prevExpanded) => ({
      ...prevExpanded,
      [supplierId]: !prevExpanded[supplierId],
    }));
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
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Financial Transactions</h1>
        <p className="text-gray-600 mb-8">Manage and track your supplier transactions with ease.</p>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Suppliers</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Debit</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {suppliers && suppliers.length > 0 ? (
                  suppliers.map((supplier) => {
                    // Create an array of rows *within* the map
                    const rows = [];

                    // Always add the supplier row
                    rows.push(
                      <tr key={supplier._id} className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
                        <td className="py-4 px-6 whitespace-nowrap" onClick={() => toggleExpanded(supplier._id)}>
                          <div className="flex items-center">
                            {expandedSuppliers[supplier._id] ? (
                              <FaChevronDown className="text-blue-600" />
                            ) : (
                              <FaChevronRight className="text-blue-600" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap" onClick={() => toggleExpanded(supplier._id)}>
                          <div className="text-sm font-medium text-gray-900">{supplier.companyName}</div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap"></td>
                        <td className="py-4 px-6 whitespace-nowrap"></td>
                        <td className="py-4 px-6 whitespace-nowrap"></td>
                      </tr>
                    );

                    // Conditionally add shipment rows *to the same array*
                    if (expandedSuppliers[supplier._id] && supplier.shipments) {
                      supplier.shipments.forEach((shipment, index) => {
                        rows.push(
                          <tr key={`${supplier._id}-shipment-${index}`} className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                            <td className="py-4 px-6 whitespace-nowrap"></td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-700">{supplier.companyName}</div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{shipment.transactions?.totalAmount}</div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{shipment.transactions?.totalDebit}</div>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  shipment.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {shipment.status}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    }
                      return rows; // Return the array of rows

                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-4 px-6 text-center text-gray-500">
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}