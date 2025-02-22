'use client'
import { useState, useContext } from 'react';
import { DataContext } from '@/app/ContextApi/DataContextApi';

export default function Inventory() {
  const { orders, setOrders } = useContext(DataContext);

  // Dummy Inventory Data
  // const [inventory, setInventory] = useState([
  //   { id: 1, itemName: "Rice", quantity: 50, reorderLevel: 20 },
  //   { id: 2, itemName: "Sugar", quantity: 15, reorderLevel: 30 },
  //   { id: 3, itemName: "Flour", quantity: 80, reorderLevel: 40 },
  // ]);

  // const [newItem, setNewItem] = useState({ itemName: "", quantity: "", reorderLevel: "" });

  // Handle Stock Update
  
  const updateStock = (id, newQuantity) => {
    setOrders(
      orders.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  

  // Handle Adding New Item
  // const addNewItem = () => {
  //   if (!newItem.itemName || !newItem.quantity || !newItem.reorderLevel) return;

  //   const newItemData = {
  //     id: inventory.length + 1,
  //     itemName: newItem.itemName,
  //     quantity: parseInt(newItem.quantity),
  //     reorderLevel: parseInt(newItem.reorderLevel),
  //   };

  //   setInventory([...inventory, newItemData]);
  //   setNewItem({ itemName: "", quantity: "", reorderLevel: "" });
  // };

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
              <th className="py-2 px-1 max-sm:text-sm md:px-4 border">Reorder Level</th>
              <th className="py-2 px-1 max-sm:text-sm md:px-4 border">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item) => (
              <tr key={item.id} className={`text-center ${item.quantity < item.reorderLevel ? "bg-red-100" : ""}`}>
                <td className="py-2 px-4 border">{item.itemName}</td>
                <td className="py-2 px-4 border">{item.quantity}</td>
                <td className="py-2 px-4 border">{item.reorderLevel}</td>
                <td className="py-2 px-4 border">
                  <input
                    type="number"
                    min="0"
                    className="border rounded px-2 py-1 w-20"
                    value={item.quantity}
                    onChange={(e) => updateStock(item.id, parseInt(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Stock */}
      {/* <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-2">Add New Item</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Item Name"
            className="border rounded px-2 py-1 w-1/3"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border rounded px-2 py-1 w-1/3"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Reorder Level"
            className="border rounded px-2 py-1 w-1/3"
            value={newItem.reorderLevel}
            onChange={(e) => setNewItem({ ...newItem, reorderLevel: e.target.value })}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addNewItem}>
            Add Item
          </button>
        </div>
      </div> */}
    </div>
  );
}
