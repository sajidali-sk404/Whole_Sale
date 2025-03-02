'use client'
import { useState, useContext, useEffect } from 'react';
import { InventoryContext } from '@/app/ContextApi/inventoryDataApi';
import { FaBoxOpen, FaSort } from 'react-icons/fa';

export default function Inventory() {
  const { inventoryData } = useContext(InventoryContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Add sorting state

  // Function to consolidate items with case-insensitive matching
  const consolidateInventory = (data) => {
    if (!data || !Array.isArray(data)) return [];

    const consolidated = {};
    const consolidatedList = [];

    data.forEach(item => {
      const itemNameLower = item.itemName.toLowerCase();

      if (consolidated[itemNameLower]) {
        // Item already exists (case-insensitive match)
        consolidated[itemNameLower].quantity += item.quantity;
      } else {
        // New item
        consolidated[itemNameLower] = { ...item }; // Create a copy
      }
    });

    // Convert the consolidated object back to an array
    for (const key in consolidated) {
      consolidatedList.push(consolidated[key]);
    }

    return consolidatedList;
  };


  // Sort the data
  const [sortedInventory, setSortedInventory] = useState([]);

  useEffect(() => {
    if (inventoryData) {
      const consolidatedData = consolidateInventory(inventoryData);
      setSortedInventory([...consolidatedData]); // Create a copy
    } else {
      setSortedInventory([]);
    }
  }, [inventoryData]); // React when inventoryData changes


  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


console.log(inventoryData)
  useEffect(() => {
    if (sortConfig.key !== null && sortedInventory) {
      const sorted = [...sortedInventory].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setSortedInventory(sorted); // Update sortedInventory state
    }
  }, [sortConfig]);




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
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">Inventory Management</h1>
        <p className="text-gray-600 mb-8 text-center">View and manage your current stock levels.</p>

        {/* Stock Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-700"><FaBoxOpen className="inline-block mr-2 mb-1" />Current Stock</h2>
          </div>
           <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('itemName')}
                  >
                    Item Name
                    {sortConfig.key === 'itemName' && (
                    <FaSort className="inline-block ml-1" />
                    )}
                  </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('quantity')}
                >
                  Quantity
                   {sortConfig.key === 'quantity' && (
                   <FaSort className="inline-block ml-1" />
                   )}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Last Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedInventory.length > 0 ? (
                sortedInventory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.lastUpdated ? new Date(item.lastUpdated).toISOString().split('T')[0] : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center text-gray-500">No inventory data available.</td>
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