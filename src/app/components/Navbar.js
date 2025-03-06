"use client";
import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
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

  const inventoryValue = totalInventory !== null && totalInventory !== undefined ? totalInventory : 0;
  const supplierValue = totalSupplier !== null && totalSupplier !== undefined ? totalSupplier : 0;

  const [dailySales, setDailySales] = useState([]); // State to hold the daily sales data
  const [totalDailyProfit, setTotalDailyProfit] = useState(0); // State to hold the total daily profit
  const [loading, setLoading] = useState(true); // Add a loading state
  const [profitLoading, setProfitLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setLoading(false);
    }
  }, [inventoryData]);

  useEffect(() => {
    if (Bills.length > 0 && inventoryData.length > 0) {
      calculateDailySales(Bills, inventoryData);
    }
  }, [Bills, inventoryData]);

  // Calculate the total profit from dailySalesData
  useEffect(() => {
    if (dailySales.length > 0) {
      const totalProfit = dailySales.reduce((sum, dayData) => sum + dayData.sales, 0);
      setTotalDailyProfit(totalProfit);
      setProfitLoading(false);
    }
  }, [dailySales]);

  const calculateDailySales = useCallback((billsData, inventoryData) => {
    if (!billsData || !inventoryData) {
      console.warn("billsData or inventoryData is null or undefined in calculateDailySales");
      return;
    }

    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailySalesData = last7Days.map(date => {
      let dailyTotalSales = 0;
      let dailyTotalPurchaseCost = 0;

      billsData?.forEach(bill => {
        const billDateFormatted = new Date(bill.date).toISOString().split('T')[0];
        if (billDateFormatted === date) {
          bill.cart?.forEach(item => {
            dailyTotalSales += item.price * item.quantity;

            const inventoryItem = inventoryData.find(invItem => invItem.itemName === item.name);

            if (inventoryItem && inventoryItem.purchasePrice !== undefined) {
              dailyTotalPurchaseCost += inventoryItem.purchasePrice * item.quantity;
            } else {
              console.warn(`Purchase price not found for item: ${item.name}`);
              // Handle missing purchase price appropriately. Consider skipping this item or setting purchasePrice to 0
            }
          });
        }
      });

      const dailyProfit = dailyTotalSales - dailyTotalPurchaseCost;
      console.log("Daily Profit for", date, "is", dailyProfit);

      return { day: date.substring(0, 10), sales: Number(dailyProfit) };
    });

    setDailySales(dailySalesData);
    console.log("Daily Sales", dailySalesData);
  }, []);

  const sequence = useMemo(() => {
    if (!inventoryData || inventoryData.length === 0) return [];

    return inventoryData.flatMap((item) => [
      `${item.itemName} = ${item.quantity}`,
      3000,
    ]);
  }, [inventoryData]);

  return (
    <nav className="bg-blue-600 py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">


          <Link href="/pages/products">
            <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
              {FaShoppingCart && <FaShoppingCart className="text-4xl text-blue-600 mb-4" />}
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

          <Link href="/pages/reports">
            <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
              {FaChartLine && <FaChartLine className="text-4xl text-blue-600 mb-4" />}
              <h3 className="text-lg font-semibold text-gray-700 text-center">Daily Profit</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {!profitLoading ? (
                  `${totalDailyProfit}` // Format to 2 decimal places
                ) : (
                  "Loading Profit..."
                )}
              </p>
            </div>
          </Link>

          <Link href="/pages/suppliers"><Card title="Total Suppliers" value={supplierValue} icon={FaBuilding} /></Link>
          <Link href="/pages/shopkeepers"><Card title="Local Customers" value={totalShop} icon={FaUserFriends} /></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;