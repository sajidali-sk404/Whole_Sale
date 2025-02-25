import React from 'react'
import Link from 'next/link'
import { XMarkIcon } from "@heroicons/react/24/outline";

const SideBar = ({ setIsSidebarOpen, currentShop }) => {
  return (
    <div className={`bg-white shadow-lg h-full md:w-72 p-6 max-sm:absolute max-sm:w-64 rounded-r-2xl transition-all`}>
      <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-800">Shop Details</h2>
             <button
               onClick={() => setIsSidebarOpen(false)}
               className="text-gray-600 hover:text-gray-900 transition"
             >
               <XMarkIcon className="w-6 h-6" />
             </button>
           </div>

      {/* Supplier Information */}
      <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-sm">
        <p className="text-gray-700 font-semibold">{currentShop?.shopName}</p>
        <p className="text-sm text-gray-500">Shopkeeper: {currentShop?.shopKeeperName}</p>
        <p className="text-sm text-gray-500">Contact: {currentShop?.contact}</p>
        <p className="text-sm text-gray-500">Address: {currentShop?.address}</p>
      </div>

    {/* Navigation Links */}
    <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Navigation</h3>
        <nav className="flex flex-col gap-3">
          {[
            { href: '/', label: 'Home' },
            { href: '/pages/suppliers', label: 'Suppliers Management' },
            { href: '/pages/shops', label: 'Shopkeeper Management' },
            { href: '/pages/products', label: 'Inventory & Stock' },
            { href: '/pages/transactions', label: 'Transaction & Ledger' },
            { href: '/pages/reports', label: 'Analytics & Reports' },
            { href: '/pages/transports', label: 'Transportation' },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-gray-700 hover:text-blue-600 font-medium transition">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SideBar;
