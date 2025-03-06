"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useContext } from "react";
import { InventoryContext } from "../ContextApi/inventoryDataApi";
import { SupplierContext } from "../ContextApi/SupplierDataApi";
import { ShopContext } from "../ContextApi/shopkeepersDataApi";
import { BillContext } from "../ContextApi/billsDataApi";
import { FaShoppingCart, FaChartLine, FaBuilding, FaUserFriends } from 'react-icons/fa'; // Import icons
import Link from "next/link";
import { TypeAnimation } from 'react-type-animation';

const Card = ({ title, value, icon: Icon }) => ( // Receive icon as a prop
  <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
    {Icon && <Icon className="text-4xl text-blue-600 mb-4" />} {/* Render the icon */}
    <h3 className="text-lg font-semibold text-gray-700 text-center">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
  </div>
);

const Navbar = () => {
  const { totalInventory, inventoryData } = useContext(InventoryContext);
  const { totalSupplier } = useContext(SupplierContext);
  const { totalShop } = useContext(ShopContext);

  const { Bills } = useContext(BillContext);

  const [dailyProfit, setDailyProfit] = useState(0);

  const calculatingDailyProfit = useCallback(() => {
    if (Bills) {
      // Calculate Daily Profit
      const today = new Date().toISOString().split('T')[0];
      let profit = 0;

      Bills.forEach(bill => {
        const billDate = new Date(bill.date).toISOString().split('T')[0];
        if (billDate === today) {
          profit += bill.totalAmount;  // Assuming bill.totalAmount is the profit for now.
        }
      });

      setDailyProfit(profit);
    }
  }, [Bills]);

  useEffect(() => {
    try {
      calculatingDailyProfit();
    } catch (error) {
      console.error(error);
    }
  }, [calculatingDailyProfit]);

  console.log(dailyProfit);

  const inventoryValue = totalInventory !== null && totalInventory !== undefined ? totalInventory : 0;
  const supplierValue = totalSupplier !== null && totalSupplier !== undefined ? totalSupplier : 0;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setLoading(false);
    }
  }, [inventoryData]);

  const sequence = useMemo(() => {
    if (!inventoryData || inventoryData.length === 0) return [];

    return inventoryData.flatMap((item) => [
      `${item.itemName} = ${item.quantity}`,
      3000,
    ]);
  }, [inventoryData]);

  return (
    <nav className="bg-blue-600 py-4 shadow-md"> {/* Use <nav> for semantic HTML */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">


          <Link href="/pages/products">
            <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
              {FaShoppingCart && <FaShoppingCart className="text-4xl text-blue-600 mb-4" />} {/* Render the icon */}
              <h3 className="text-lg font-semibold text-gray-700 text-center">Total Stock - {inventoryValue}</h3>
              <p className="text-xl font-bold text-gray-900 mt-2">
                {!loading ? (
                  <TypeAnimation
                    sequence={[...sequence, "", 1000]}
                    wrapper="span"
                    speed={50}
                    style={{ display: "inline-block" }}
                    repeat={Infinity}
                  />
                ) : (
                  "Loading inventory..."
                )}
              </p>
            </div>
          </Link>


          <Link href="/pages/reports"><Card title="Daily Profit" value={dailyProfit} icon={FaChartLine} /></Link>
          <Link href="/pages/suppliers"><Card title="Total Suppliers" value={supplierValue} icon={FaBuilding} /></Link>
          <Link href="/pages/shopkeepers"><Card title="Local Customers" value={totalShop} icon={FaUserFriends} /></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;