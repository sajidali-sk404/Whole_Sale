'use client'
import { useState, useContext } from 'react';
import { InventoryContext } from '@/app/ContextApi/inventoryDataApi';

export default function Inventory() {

  const { inventoryData } = useContext(InventoryContext);
 
  const [orders, setOrders] = useState(inventoryData);

  return (
    <div className="container mx-auto px-2 py-6 md:p-6">
      <h1 className="text-3xl font-bold mb-4">Inventory Management</h1>

      {/* Stock Table */}
      <div className="bg-white p-2 md:p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Current Stock</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-1 max-sm:text-sm md:px-4 border">Item Name</th>
              <th className="py-2 px-1 max-sm:text-sm md:px-4 border">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr key={item._id} className={`text-center`}>
                <td className="py-2 px-4 border">{item.itemName}</td>
                <td className="py-2 px-4 border">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
