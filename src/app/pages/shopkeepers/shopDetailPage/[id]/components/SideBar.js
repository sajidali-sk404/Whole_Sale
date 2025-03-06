// SideBar.js
import React from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FaHome, FaUsers, FaUsersCog, FaBoxOpen, FaMoneyBillWave, FaChartLine, FaTruck, FaFileInvoiceDollar } from 'react-icons/fa'; // Import relevant icons

const SideBar = ({ setIsSidebarOpen, currentShopkeeper }) => {
    return (
        <div className="bg-white shadow-md h-full w-[70%] md:w-64 p-4 max-sm:fixed rounded-r-lg transition-all duration-300 ease-in-out">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-blue-600">Shopkeeper Details</h2>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Shopkeeper Information */}
            <div className="bg-gray-100 p-3 rounded-md mb-6">
                <p className="text-sm font-medium text-gray-900">{currentShopkeeper?.shopName}</p>
                <p className="text-sm text-gray-600">Owner: {currentShopkeeper?.shopkeeperName}</p>
                <p className="text-sm text-gray-600">Contact: {currentShopkeeper?.contact}</p>
                <p className="text-sm text-gray-600">Address: {currentShopkeeper?.address}</p>
            </div>

            {/* Navigation Links */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Navigation</h3>
                <nav className="flex flex-col space-y-2">
                    {[
                        { href: '/', label: 'Home', icon: <FaHome /> },
                        { href: '/pages/Shopkeepers', label: 'Shopkeepers', icon: <FaUsers /> },
                        { href: '/pages/shopkeepers', label: 'Shopkeepers', icon: <FaUsersCog /> },
                        { href: '/pages/products', label: 'Inventory', icon: <FaBoxOpen /> },
                        { href: '/pages/transactions', label: 'Transactions', icon: <FaMoneyBillWave /> },
                        { href: '/pages/reports', label: 'Reports', icon: <FaChartLine /> },
                        { href: '/pages/transports', label: 'Transportation', icon: <FaTruck /> },
                        { href: '/pages/printBill', label: 'PrintBill', icon: <FaFileInvoiceDollar /> },
                        { href: '/pages/expenses', label: 'Expenses', icon: <FaMoneyBillWave /> },
                    ].map(({ href, label, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        >
                            <span className="mr-2 text-blue-600">{icon}</span>
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default SideBar;