import React from 'react'
import Link from 'next/link'
import { XMarkIcon } from "@heroicons/react/24/outline";

const SideBar = ({ setIsSidebarOpen, currentCompany }) => {
  return (
    <div className={`bg-gray-100 p-4 max-sm:absolute  md:w-64`}>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="text-blue-500 text-sm mb-4"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      <div className="flex flex-col gap-2 text-lg">
        <h2 className="text-lg font-semibold">Company Details</h2>
        <h2>{currentCompany?.companyName}</h2>
        <h2> {currentCompany?.owner}</h2>
        <h2> {currentCompany?.contact}</h2>
        <h2> {currentCompany?.address}</h2>
      </div>

      <div className="flex overflow-y-auto flex-col mt-10 gap-3 text-blue-800 ">
        <h1 className="text-lg text-black font-semibold">Pages</h1>
        <Link href="/">
          <h1 className="hover:text-blue-500 hover:underline">Home</h1>
        </Link>
        <Link href="/pages/suppliers">
          <h1 className="hover:text-blue-500 hover:underline">Suppliers management</h1>
        </Link>
        <Link href="/pages/shops">
          <h1 className="hover:text-blue-600 hover:underline">Shopkeeper management</h1>
        </Link>
        <Link href="/pages/products">
          <h1 className="hover:text-blue-600 hover:underline">Inventory and stock</h1>
        </Link>
        <Link href="/pages/transactions">
          <h1 className="hover:text-blue-600 hover:underline">Transaction and Ledger</h1>
        </Link>
        <Link href="/pages/reports">
          <h1 className="hover:text-blue-600 hover:underline">Analytics and Reports</h1>
        </Link>
        <Link href="/pages/transports">
          <h1 className="hover:text-blue-600 hover:underline">Transportation</h1>
        </Link>
      </div>
    </div>
  )
}

export default SideBar
