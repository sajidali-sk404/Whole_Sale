import Link from "next/link";
// Font Awesome 5 Imports
import { FaUsers, FaUsersCog, FaMoneyCheck, FaChartLine } from "react-icons/fa";
// Material Design Imports
import { MdEmojiTransportation, MdOutlineInventory2, MdOutlinePeopleAlt } from "react-icons/md";
// Boxicons Imports
import { BiSolidReport } from "react-icons/bi";
import Navbar from "./components/Navbar";
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Muhammad Amir,</span>
              <span className="block text-blue-600">Traders.</span>
            </h1>
            {/* <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
              Manage suppliers, shopkeepers, inventory, transactions, transportation, and customers all in one place.
            </p> */}
            {/* Optional: Call to Action Button */}
             {/* <div className="mt-8">
              <Link href="/pages/suppliers" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Get Started
              </Link>
            </div>  */}
            {/* <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
              <div className="rounded-md shadow">
                <Link href="/pages/suppliers" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    Get started
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                    Learn more
                </Link>
              </div>
            </div> */}
          </div>

          {/* Feature Cards */}
          <div id="features" className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Suppliers */}
            <Link href="/pages/suppliers" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FaUsers className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Suppliers Management</h2>
                <p className="mt-2 text-gray-500">Efficiently manage your supplier information and interactions.</p>
              </div>
            </Link>

            {/* Card 2: Shopkeepers */}
            <Link href="/pages/shops" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FaUsersCog className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Shopkeeper Management</h2>
                <p className="mt-2 text-gray-500">Keep track of your shopkeepers and their performance.</p>
              </div>
            </Link>

             {/* Card 3: Inventory */}
            <Link href="/pages/products" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                   <MdOutlineInventory2 className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Inventory and Stock</h2>
                <p className="mt-2 text-gray-500">Monitor your product inventory and stock levels in real-time.</p>
              </div>
            </Link>

            {/* Card 4: Transactions */}
            <Link href="/pages/transactions" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FaMoneyCheck className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Transaction and Ledger</h2>
                <p className="mt-2 text-gray-500">Record and manage all your financial transactions and ledgers.</p>
              </div>
            </Link>

           {/* Card 5: Reports */}
            <Link href="/pages/reports" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                   <FaChartLine className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Analytics and Reports</h2>
                <p className="mt-2 text-gray-500">Generate insightful reports and analyze your business data.</p>
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

            {/* Card 7: Customers */}
            <Link href="/pages/customer" className="group">
              <div className="p-6 bg-white rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                   <MdOutlinePeopleAlt className="text-3xl" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Customer Management</h2>
                <p className="mt-2 text-gray-500">Organize and manage your customer information and interactions.</p>
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