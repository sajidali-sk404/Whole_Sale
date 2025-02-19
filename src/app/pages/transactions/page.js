'use client'
import { useState } from "react";

export default function FinancialTransactions() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      companyName: "ABC Suppliers",
      amount: 50000,
      date: "2025-02-10",
      paymentMethod: "Bank Transfer",
      status: "Completed",
    },
    {
      id: 2,
      companyName: "XYZ Traders",
      amount: 75000,
      date: "2025-02-12",
      paymentMethod: "Cash",
      status: "Pending",
    },
  ]);

  const [newTransaction, setNewTransaction] = useState({
    companyName: "",
    amount: "",
    date: "",
    paymentMethod: "Bank Transfer",
    status: "Pending",
  });

  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { ...newTransaction, id: transactions.length + 1 };
    setTransactions([...transactions, newEntry]);
    setNewTransaction({
      companyName: "",
      amount: "",
      date: "",
      paymentMethod: "Bank Transfer",
      status: "Pending",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Financial Transactions</h1>

      {/* Transactions Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Company</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Payment Method</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="text-center">
                <td className="py-2 px-4 border">{tx.companyName}</td>
                <td className="py-2 px-4 border">Rs. {tx.amount}</td>
                <td className="py-2 px-4 border">{tx.date}</td>
                <td className="py-2 px-4 border">{tx.paymentMethod}</td>
                <td
                  className={`py-2 px-4 border ${
                    tx.status === "Completed" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {tx.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Transaction Form */}
      <div className="mt-6 bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={newTransaction.companyName}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount (Rs.)"
            value={newTransaction.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            type="date"
            name="date"
            value={newTransaction.date}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
          <select
            name="paymentMethod"
            value={newTransaction.paymentMethod}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Cheque">Cheque</option>
          </select>
          <select
            name="status"
            value={newTransaction.status}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
