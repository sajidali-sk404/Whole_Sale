'use client'
import { useState, useRef } from "react";

const CustomerBilling = () => {
  const [bills, setBills] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const printRef = useRef();

  const handleAddToCart = () => {
    if (newItem.name && newItem.quantity && newItem.price) {
      setCart([...cart, { ...newItem, total: newItem.quantity * newItem.price }]);
      setNewItem({ name: "", quantity: "", price: "" });
    }
  };

  const handleGenerateBill = () => {
    if (customerName && cart.length > 0) {
      setBills([...bills, { customerName, cart, total: cart.reduce((acc, item) => acc + item.total, 0) }]);
      setCustomerName("");
      setCart([]);
    }
  };

  const handlePrint = (bill) => {
    const printContent = `
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h2>Customer: ${bill.customerName}</h2>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.cart.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price} PKR</td>
                  <td>${item.total} PKR</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <h3>Total: ${bill.total} PKR</h3>
        </body>
      </html>`;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Customer Billing</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="border p-2 mr-2 rounded w-full"
        />
      </div>
      
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="number"
          placeholder="Price per unit"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <button onClick={handleAddToCart} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>

      <h3 className="text-lg font-semibold mt-4">Current Bill</h3>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">{item.price} PKR</td>
              <td className="border p-2">{item.total} PKR</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-bold mt-4">Total: {cart.reduce((acc, item) => acc + item.total, 0)} PKR</h3>
      
      <button onClick={handleGenerateBill} className="bg-green-500 text-white px-4 py-2 rounded mt-4">Generate Bill</button>
      
      <h2 className="text-2xl font-bold mt-6">Generated Bills</h2>
      {bills.slice().reverse().map((bill, index) => (
        <div key={index} className="border p-4 mt-4 shadow-md rounded">
          <h3 className="text-lg font-bold">Customer: {bill.customerName}</h3>
          <button onClick={() => handlePrint(bill)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Print Bill</button>
        </div>
      ))}
    </div>
  );
};

export default CustomerBilling;
