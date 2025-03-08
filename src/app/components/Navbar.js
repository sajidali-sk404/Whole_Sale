"use client";
import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { InventoryContext } from "../ContextApi/inventoryDataApi";
import { SupplierContext } from "../ContextApi/SupplierDataApi";
import { ShopContext } from "../ContextApi/shopkeepersDataApi";
import { BillContext } from "../ContextApi/billsDataApi";
import { FaShoppingCart, FaChartLine, FaBuilding, FaUserFriends } from 'react-icons/fa';
import Link from "next/link";
import { TypeAnimation } from 'react-type-animation';

const LoadingSpinner = ({ text }) => (
  <div className="flex items-center space-x-2">
    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span>{text}</span>
  </div>
);

const Card = ({ title, value, icon: Icon }) => (
  <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
    {Icon && <Icon className="text-4xl text-blue-600 mb-4" />}
    <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">{title}</h3>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

const Navbar = () => {
  const { totalInventory, inventoryData } = useContext(InventoryContext);
  const { totalSupplier } = useContext(SupplierContext);
  const { totalShop } = useContext(ShopContext);
  const { bills, loading: billsLoading } = useContext(BillContext);

  const inventoryValue = totalInventory !== null && totalInventory !== undefined ? totalInventory : 0;
  const supplierValue = totalSupplier !== null && totalSupplier !== undefined ? totalSupplier : 0;
  const shopValue = totalShop !== null && totalShop !== undefined ? totalShop : 0;

  const [dailySales, setDailySales] = useState([]);
  const [totalDailyProfit, setTotalDailyProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profitLoading, setProfitLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = () => {
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setLoading(false);
    }
  }, [inventoryData]);

  const calculateDailySales = useCallback((billsData, inventoryData) => {
    try {
      if (!Array.isArray(billsData) || !Array.isArray(inventoryData)) {
        console.warn("Invalid data format in calculateDailySales");
        setError("Unable to calculate sales due to invalid data format");
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

        billsData.forEach(bill => {
          if (!bill || !bill.date || !bill.cart) return;
          
          const billDateFormatted = new Date(bill.date).toISOString().split('T')[0];
          if (billDateFormatted === date) {
            bill.cart.forEach(item => {
              if (!item || !item.price || !item.quantity) return;
              
              dailyTotalSales += item.price * item.quantity;
              const inventoryItem = inventoryData.find(invItem => invItem.itemName === item.name);

              if (inventoryItem && inventoryItem.purchasePrice !== undefined) {
                dailyTotalPurchaseCost += inventoryItem.purchasePrice * item.quantity;
              }
            });
          }
        });

        const dailyProfit = dailyTotalSales - dailyTotalPurchaseCost;
        return { day: date.substring(0, 10), sales: Number(dailyProfit) };
      });

      setDailySales(dailySalesData);
      setError(null);
    } catch (err) {
      console.error("Error calculating daily sales:", err);
      setError("Failed to calculate daily sales");
      setDailySales([]);
    }
  }, []);

  useEffect(() => {
    if (bills && Array.isArray(bills) && bills.length > 0 &&
        inventoryData && Array.isArray(inventoryData) && inventoryData.length > 0) {
      calculateDailySales(bills, inventoryData);
    }
  }, [bills, inventoryData, calculateDailySales]);

  useEffect(() => {
    if (dailySales.length > 0) {
      const totalProfit = dailySales.reduce((sum, dayData) => sum + dayData.sales, 0);
      setTotalDailyProfit(totalProfit);
      setProfitLoading(false);
    }
  }, [dailySales]);

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
        {handleError()}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/pages/products">
            <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
              <FaShoppingCart className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">
                Total Stock - {loading ? "..." : inventoryValue}
              </h3>
              <div className="text-xl font-bold text-gray-900">
                <div className="flex items-center justify-center">
                  {loading ? (
                    <LoadingSpinner text="Loading inventory..." />
                  ) : (
                    <TypeAnimation
                      sequence={[...sequence, "", 1000]}
                      wrapper="span"
                      speed={50}
                      style={{ display: "inline-block" }}
                      repeat={Infinity}
                    />
                  )}
                </div>
              </div>
            </div>
          </Link>

          <Link href="/pages/reports">
            <div className="p-6 bg-white flex flex-col items-center h-full rounded-lg shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer">
              <FaChartLine className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">Daily Profit</h3>
              <div className="text-xl font-bold text-gray-900">
                <div className="flex items-center justify-center">
                  {profitLoading ? (
                    <LoadingSpinner text="Calculating profit..." />
                  ) : (
                    <span>Rs. {Number(totalDailyProfit)}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>

          <Link href="/pages/suppliers">
            <Card
              title="Total Suppliers"
              value={loading ? <LoadingSpinner text="Loading suppliers..." /> : supplierValue}
              icon={FaBuilding}
            />
          </Link>
          <Link href="/pages/shopkeepers">
            <Card
              title="Local Customers"
              value={loading ? <LoadingSpinner text="Loading customers..." /> : shopValue}
              icon={FaUserFriends}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;