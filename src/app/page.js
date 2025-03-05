"use client"
import Link from "next/link";
import { FaUsers, FaUsersCog, FaMoneyCheck, FaChartLine } from "react-icons/fa";
import { MdEmojiTransportation, MdOutlineInventory2, MdOutlinePeopleAlt } from "react-icons/md";
import { BiSolidReport } from "react-icons/bi";
import Navbar from "./components/Navbar";
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">
                <TypeAnimation
                  sequence={[
                    // Same substring at the start will only be typed out once, initially
                    'Muhammad Amir',
                    1000, // wait 1s before replacing "Mice" with "Hamsters"
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
            <Link href="/pages/suppliers" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FaUsers className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Suppliers Management</h2>
                <p className="mt-2 text-gray-500">Efficiently manage your supplier information and interactions.</p>
              </div>
            </Link>

             {/* Card 4: Expenses */}
             <Link href="/pages/expenses" className="group">
              <div className="p-6 bg-white h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <BiSolidReport className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Expenses</h2>
                <p className="mt-2 text-gray-500">Track day to day Expenses</p>
              </div>
            </Link>

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
            <Link href="/pages/transactions" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FaMoneyCheck className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Transaction and Ledger</h2>
                <p className="mt-2 text-gray-500">Record and manage all your financial transactions and ledgers.</p>
              </div>
            </Link>

            {/* Card 8: Reports */}
            <Link href="/pages/reports" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FaChartLine className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Analytics and Reports</h2>
                <p className="mt-2 text-gray-500">Generate insightful reports and analyze your business data.</p>
              </div>
            </Link>

           
           

           

          </div>

          {/* Optional:  Image Section */}
          {/* <div className="mt-16">
            <Image
              src="/your-image.jpg" // Replace with your image path
              alt="Descriptive alt text"
              width={1200} // Set appropriate dimensions
              height={600}
              className="rounded-lg shadow-lg"
            />
          </div> */}
        </div>
      </div>
    </>
  );
}