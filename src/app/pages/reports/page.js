'use client'
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

export default function Analytics() {
  // Dummy Data
  const dailySales = [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 15000 },
    { day: "Wed", sales: 17000 },
    { day: "Thu", sales: 14000 },
    { day: "Fri", sales: 20000 },
    { day: "Sat", sales: 22000 },
    { day: "Sun", sales: 18000 },
  ];

  const monthlySales = [
    { month: "Jan", revenue: 500000 },
    { month: "Feb", revenue: 450000 },
    { month: "Mar", revenue: 600000 },
    { month: "Apr", revenue: 700000 },
    { month: "May", revenue: 650000 },
  ];

  const topSuppliers = [
    { name: "ABC Traders", transactions: 55 },
    { name: "XYZ Wholesalers", transactions: 40 },
    { name: "Quality Supplies", transactions: 38 },
  ];

  const topShopkeepers = [
    { name: "Ali Mart", purchases: 60 },
    { name: "Raza Superstore", purchases: 50 },
    { name: "City Wholesale", purchases: 45 },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>

      {/* Daily Sales Chart */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Daily Sales Overview</h2>
        <BarChart width={600} height={300} data={dailySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#4A90E2" />
        </BarChart>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Monthly Revenue</h2>
        <LineChart width={600} height={300} data={monthlySales}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#34D399" />
        </LineChart>
      </div>

      {/* Top Suppliers */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Top Suppliers</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Supplier</th>
              <th className="py-2 px-4 border">Transactions</th>
            </tr>
          </thead>
          <tbody>
            {topSuppliers.map((supplier, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border">{supplier.name}</td>
                <td className="py-2 px-4 border">{supplier.transactions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top Shopkeepers */}
      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-2">Top Shopkeepers</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Shopkeeper</th>
              <th className="py-2 px-4 border">Purchases</th>
            </tr>
          </thead>
          <tbody>
            {topShopkeepers.map((shopkeeper, index) => (
              <tr key={index} className="text-center">
                <td className="py-2 px-4 border">{shopkeeper.name}</td>
                <td className="py-2 px-4 border">{shopkeeper.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
