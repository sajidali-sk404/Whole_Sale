"use client";
import Link from "next/link";
import { FaUsers, FaUsersCog, FaMoneyCheck, FaChartLine } from "react-icons/fa";
import { MdEmojiTransportation, MdOutlineInventory2, MdOutlinePeopleAlt } from "react-icons/md";
import { BiSolidReport, BiLogOut  } from "react-icons/bi";
import Navbar from "@/app/components/Navbar";
import { TypeAnimation } from 'react-type-animation';
import { AuthContext } from "@/app/ContextApi/AuthContextApi";
import { useContext } from "react";

export default function Home() {
  const { logout, isAuthenticated, loading, userRole } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center relative">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">
                <TypeAnimation
                  sequence={[
                    'Muhammad Amir',
                    1000,
                    'Muhammad Amir.',
                    1000,
                    'Muhammad Amir..',
                    1000,
                    'Muhammad Amir...',
                    1000,
                    '',
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  style={{ display: 'inline-block' }}
                  repeat={Infinity}
                />

              </span>
              <span className="block text-blue-600">Traders.</span>

            </h1>
            {/* Improved Logout Button - positioned top right */}
            <button
              className="absolute top-0 right-0 mt-2 max-md:-mt-10 mr-2 px-4 py-2 bg-slate-500 hover:bg-slate-700 text-white font-semibold rounded-md shadow-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 text-sm sm:text-base flex items-center" // Added flex and items-center
              onClick={logout}
            >
              <BiLogOut className="mr-2" /> {/* Added the icon and some margin */}
              Logout
            </button>
          </div>

          {/* Feature Cards */}
          <div id="features" className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1: printBill */}
            <Link href="/pages/printBill" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <MdOutlinePeopleAlt className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Print Bill</h2>
                <p className="mt-2 text-gray-500">Organize and manage your customer information and interactions.</p>
              </div>
            </Link>

            {/* Card 2: Shopkeepers */}
            <Link href="/pages/shopkeepers" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FaUsersCog className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Shopkeeper Management</h2>
                <p className="mt-2 text-gray-500">Keep track of your shopkeepers and their performance.</p>
              </div>
            </Link>

            {/* Card 3: Suppliers */}
            {userRole === "admin" &&
              <Link href="/pages/suppliers" className="group">
                <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FaUsers className="text-3xl" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Suppliers Management</h2>
                  <p className="mt-2 text-gray-500">Efficiently manage your supplier information and interactions.</p>
                </div>
              </Link>}

            {/* Card 4: Expenses */}
            {userRole === "admin" &&
              <Link href="/pages/expenses" className="group">
                <div className="p-6 bg-white h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <BiSolidReport className="text-3xl" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Expenses</h2>
                  <p className="mt-2 text-gray-500">Track day to day Expenses</p>
                </div>
              </Link>}

            {/* Card 5: Inventory */}
            <Link href="/pages/products" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <MdOutlineInventory2 className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Inventory and Stock</h2>
                <p className="mt-2 text-gray-500">Monitor your product inventory and stock levels in real-time.</p>
              </div>
            </Link>

            {/* Card 6: Transportation */}
            <Link href="/pages/transports" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <MdEmojiTransportation className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Transportation</h2>
                <p className="mt-2 text-gray-500">Manage your transportation logistics and track shipments.</p>
              </div>
            </Link>


            {/* Card 7: Transactions */}
            {userRole === "admin" &&
              <Link href="/pages/transactions" className="group">
                <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FaMoneyCheck className="text-3xl" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Transaction and Ledger</h2>
                  <p className="mt-2 text-gray-500">Record and manage all your financial transactions and ledgers.</p>
                </div>
              </Link>}

            {/* Card 8: Reports */}
            {userRole === "admin" &&
              <Link href="/pages/reports" className="group">
                <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FaChartLine className="text-3xl" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Analytics and Reports</h2>
                  <p className="mt-2 text-gray-500">Generate insightful reports and analyze your business data.</p>
                </div>
              </Link>}

          </div>

        </div>
      </div>
    </>
  );
}