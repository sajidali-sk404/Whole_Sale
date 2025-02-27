'use client'
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { FaChartBar, FaChartLine, FaTruck, FaStore, FaMoneyBillWave } from 'react-icons/fa'; // Import icons


export default function Analytics() {
    // Dummy Data (replace with your actual data)
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
        { month: "Jun", revenue: 720000 }, // Added more data for a better chart
        { month: "Jul", revenue: 780000 },
        { month: "Aug", revenue: 800000 },
        { month: "Sep", revenue: 750000 },
        { month: "Oct", revenue: 680000 },
        { month: "Nov", revenue: 700000 },
        { month: "Dec", revenue: 850000 },
    ];

    const topSuppliers = [
        { name: "ABC Traders", transactions: 55 },
        { name: "XYZ Wholesalers", transactions: 40 },
        { name: "Quality Supplies", transactions: 38 },
        { name: "Fast Delivery Co.", transactions: 30 }, // Added more data
        { name: "Reliable Source Inc.", transactions: 25 },
    ];

    const topShopkeepers = [
        { name: "Ali Mart", purchases: 60 },
        { name: "Raza Superstore", purchases: 50 },
        { name: "City Wholesale", purchases: 45 },
        { name: "Family Grocers", purchases: 40 }, // Added more data
        { name: "Fresh Foods Market", purchases: 35 },
    ];

    // Colors for the charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Analytics Dashboard</h1>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

                    {/* Daily Sales Chart */}
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaChartBar className="mr-2" />
                            Daily Sales Overview
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" tick={{ fill: '#6B7280' }} />
                                <YAxis tick={{ fill: '#6B7280' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                                <Bar dataKey="sales" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Revenue Chart */}
                    <div className="bg-white rounded-lg shadow-xl p-6">
                         <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                           <FaChartLine className="mr-2" />

                            Monthly Revenue
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" tick={{ fill: '#6B7280' }} />
                                <YAxis tick={{ fill: '#6B7280' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Top Suppliers */}
                     <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaTruck className="mr-2"/>
                            Top Suppliers
                        </h2>
                         <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transactions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topSuppliers.map((supplier, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {supplier.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {supplier.transactions}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    {/* Top Shopkeepers */}
                   <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                           <FaStore className="mr-2" />
                            Top Shopkeepers
                        </h2>
                        <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Shopkeeper
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Purchases
                                    </th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {topShopkeepers.map((shopkeeper, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                       <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {shopkeeper.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {shopkeeper.purchases}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}