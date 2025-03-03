"use client";
import React from "react";
import { useContext } from "react";
import { InventoryContext } from "../ContextApi/inventoryDataApi";
import { SupplierContext } from "../ContextApi/SupplierDataApi";
import { ShopContext } from "../ContextApi/shopkeepersDataApi";
import { FaShoppingCart, FaChartLine, FaBuilding, FaUserFriends } from 'react-icons/fa'; // Import icons
import Link from "next/link";

const Card = ({ title, value, icon: Icon }) => ( // Receive icon as a prop
  <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
    {Icon && <Icon className="text-4xl text-blue-600 mb-4" />} {/* Render the icon */}
    <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
  </div>
);

const Navbar = () => {
  const { totalInventory } = useContext(InventoryContext);
  const { totalSupplier } = useContext(SupplierContext);
  const { totalShop } = useContext(ShopContext);

  // Handle null or undefined values, provide default
  const inventoryValue = totalInventory !== null && totalInventory !== undefined ? totalInventory : 0;
    const supplierValue = totalSupplier !== null && totalSupplier !== undefined ? totalSupplier : 0;


  return (
    <nav className="bg-blue-600 py-4 shadow-md"> {/* Use <nav> for semantic HTML */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/pages/products"><Card title="Total Stock" value={inventoryValue} icon={FaShoppingCart} /></Link>
         <Card title="Daily Profit" value="0" icon={FaChartLine} />
         <Link href="/pages/suppliers"><Card title="Total Suppliers" value={supplierValue} icon={FaBuilding} /></Link>
          <Link href="/pages/shopkeepers"><Card title="Local Customers" value={totalShop} icon={FaUserFriends} /></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;