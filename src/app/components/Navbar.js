"use client";
import React from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { InventoryContext } from "../ContextApi/inventoryDataApi";
import { SupplierContext } from "../ContextApi/SupplierDataApi";
import { FaShoppingCart, FaChartLine, FaBuilding, FaUserFriends } from 'react-icons/fa'; // Import icons

const Card = ({ title, value, icon: Icon }) => ( // Receive icon as a prop
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }} // Add slight vertical lift
    whileTap={{ scale: 0.95 }} // Add slight scale down on tap
    className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-between transition-all duration-200 cursor-pointer"
  >
    {Icon && <Icon className="text-4xl text-blue-600 mb-4" />} {/* Render the icon */}
    <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
  </motion.div>
);

const Navbar = () => {
  const { totalInventory } = useContext(InventoryContext);
  const { totalSupplier } = useContext(SupplierContext);

  // Handle null or undefined values, provide default
  const inventoryValue = totalInventory !== null && totalInventory !== undefined ? totalInventory : 0;
    const supplierValue = totalSupplier !== null && totalSupplier !== undefined ? totalSupplier : 0;


  return (
    <nav className="bg-blue-600 py-4 shadow-md"> {/* Use <nav> for semantic HTML */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card title="Total Stock" value={inventoryValue} icon={FaShoppingCart} />
          <Card title="Daily Profit" value="0" icon={FaChartLine} />
          <Card title="Total Suppliers" value={supplierValue} icon={FaBuilding} />
          <Card title="Local Customers" value="0" icon={FaUserFriends} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;