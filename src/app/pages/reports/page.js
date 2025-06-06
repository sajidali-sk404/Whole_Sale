
'use client';
import { useState, useEffect, useContext } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { FaChartBar, FaChartLine, FaTruck, FaStore } from 'react-icons/fa';
import { BillContext } from "@/app/ContextApi/billsDataApi";      // Import BillContext
import { InventoryContext } from "@/app/ContextApi/inventoryDataApi";
import { AuthContext } from "@/app/ContextApi/AuthContextApi";

export default function Analytics() {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const { bills, loading, error } = useContext(BillContext);
    console.log("Bills from context:", bills);
    console.log("Loading state:", loading);
    console.log("Error state:", error);
    
    const [dailySales, setDailySales] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [topShopkeepers, setTopShopkeepers] = useState([]);
    
    const inventoryContext = useContext(InventoryContext);
    console.log("Full Inventory Context:", inventoryContext);
    
    const { inventoryData } = inventoryContext || {};  // Safely destructure inventoryData
    console.log("Destructured inventoryData:", inventoryData);

    useEffect(() => {
        if (!isAuthenticated || userRole === 'user') {
            if (typeof window !== 'undefined') {
                window.location.href = "/";
            }
        }
    }, [isAuthenticated, userRole]);

    useEffect(() => {
        if (loading) {
            console.log("Bills are still loading...");
            return;
        }

        if (error) {
            console.error("Error loading bills:", error);
            return;
        }

        console.log("Bills:", bills?.length ? `${bills.length} bills loaded` : "No bills");
        console.log("inventoryData:", inventoryData?.length ? `${inventoryData.length} items loaded` : "No inventory");

        // Check if data is loaded
        if (!Array.isArray(bills) || bills.length === 0) {
            console.warn("No bills data available");
            return;
        }

        if (!Array.isArray(inventoryData) || inventoryData.length === 0) {
            console.warn("No inventory data available");
            return;
        }

        // Daily Sales Calculation
        const calculateDailySales = (billsData, inventoryData) => {
            if (!billsData || !inventoryData) {
                console.warn("billsData or inventoryData is null or undefined in calculateDailySales");
                return;
            }
            console.log("Starting daily sales calculation...");

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
                                console.log("daily", dailyTotalPurchaseCost);
                            } else {
                                console.warn(`Purchase price not found for item: ${item.name}`);
                                // Handle missing purchase price appropriately. Consider skipping this item or setting purchasePrice to 0
                            }
                        });
                    }
                });

                const dailyProfit = dailyTotalSales - dailyTotalPurchaseCost;
                console.log("Daily Profit sub", date, "is", dailyProfit);

                // Format date to be more readable (e.g., "Mar 9")
                const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return {
                    day: formattedDate,
                    profit: Number(dailyProfit),
                    sales: Number(dailyTotalSales),
                    cost: Number(dailyTotalPurchaseCost)
                };
            });

            console.log("Setting daily sales data:", dailySalesData);
            if (dailySalesData.length === 0) {
                console.warn("No daily sales data calculated");
                return;
            }
            setDailySales(dailySalesData);
        };



        // Monthly Revenue Calculation
        const calculateMonthlyRevenue = (billsData) => { // Take billsData as input
            if (!billsData) {
                console.warn("billsData is null or undefined in calculateMonthlyRevenue");
                return; // Exit the function if billsData is missing
            }
            const currentYear = new Date().getFullYear();
            const months = Array.from({ length: 12 }, (_, i) => {
                return new Date(currentYear, i, 1).toLocaleString('default', { month: 'short' });
            });

            console.log("Calculating monthly revenue data...");
            const monthlyRevenueData = months.map((month, index) => {
            let monthlyTotalSales = 0;
            let monthlyTotalPurchaseCost = 0;

            billsData?.forEach(bill => {
                console.log("Processing bill:", bill);
                    const billMonth = new Date(bill.date).getMonth();
                    if (billMonth === index) {
                        bill.cart?.forEach(item => {
                            monthlyTotalSales += item.price * item.quantity;

                            const inventoryItem = inventoryData.find(invItem => invItem.itemName === item.name);
                            if (inventoryItem && inventoryItem.purchasePrice !== undefined) {
                                monthlyTotalPurchaseCost += inventoryItem.purchasePrice * item.quantity;
                            }
                        });
                    }
                });

                const monthlyProfit = monthlyTotalSales - monthlyTotalPurchaseCost;
                return {
                    month: month,
                    profit: Number(monthlyProfit),
                    sales: Number(monthlyTotalSales),
                    cost: Number(monthlyTotalPurchaseCost)
                };
            });
            console.log("Setting monthly revenue data:", monthlyRevenueData);
            if (monthlyRevenueData.length === 0) {
                console.warn("No monthly revenue data calculated");
                return;
            }
            setMonthlySales(monthlyRevenueData);
            console.log("Monthly sales state updated");
        };

        // Top Shopkeepers Calculation (adapt based on how your data is structured)
        const calculateTopShopkeepers = (billsData) => { // Take billsData as input

            const shopkeeperPurchases = {};
            billsData?.forEach(bill => { // Use billsData here
                if (bill.customerName) {
                    shopkeeperPurchases[bill.customerName] = (shopkeeperPurchases[bill.customerName] || 0) + 1;
                }
            });

            const sortedShopkeepers = Object.entries(shopkeeperPurchases)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, purchases]) => ({ name, purchases }));

            setTopShopkeepers(sortedShopkeepers);
        };

        // Run calculations if we have both bills and inventory data
        if (bills && inventoryData) {
            calculateDailySales(bills, inventoryData);  // Run calculations
            calculateMonthlyRevenue(bills);
            calculateTopShopkeepers(bills);
        } else {
            console.warn("Bills data is not available yet.");
        }



    }, [bills, inventoryData, loading, error]); // Dependencies for data loading and state




    // const { suppliers } = useContext(SupplierContext);
    //     const [topSuppliers, setTopSuppliers] = useState([]);

    //     const calculateTopSuppliers = (suppliersArray) => {
    //         const supplierTransactions = {};

    //         suppliersArray?.forEach(supplier => {
    //             if (supplier.CompanyNmae) {
    //                 supplierTransactions[supplier.CompanyNmae] = (supplierTransactions[supplier.shipments.transactions] || 0) + 1;
    //             }
    //         });

    //         const sortedSuppliers = Object.entries(supplierTransactions)
    //             .sort(([, a], [, b]) => b - a)
    //             .slice(0, 5)
    //             .map(([CompanyNmae, transactions]) => ({ CompanyNmae, transactions }));

    //         setTopSuppliers(sortedSuppliers);
    //     };

    //     console.log("Top Suppliers", topSuppliers);

    //     useEffect(() => {
    //         if (suppliers) {
    //             calculateTopSuppliers(suppliers);
    //         } else {
    //             console.warn("Suppliers data is not available yet.");
    //         }
    //     }, [suppliers]); // useEffect dependency on suppliers


    // Colors for the charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    if (!isAuthenticated || userRole === 'user') return null;

    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full md:max-w-7xl  mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-8 text-center">Analytics Dashboard</h1>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">

                    {/* Daily Sales Chart */}
                    <div className="bg-white max-sm:w-full max-sm:text-sm rounded-lg shadow-xl p-1 md:p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaChartBar className="mr-2" />
                            Daily Sales Overview
                        </h2>

                        {loading ? (
                            <p>Loading bills data...</p>
                        ) : error ? (
                            <p className="text-red-500">Error loading data: {error}</p>
                        ) : !Array.isArray(inventoryData) ? (
                            <p>Loading inventory data...</p>
                        ) : dailySales.length === 0 ? (
                            <p>Processing sales data...</p>
                        ) : (
                            <div className="max-lg:overflow-x-auto">
                                <BarChart width={575} height={300} data={dailySales} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" tick={{ fill: '#6B7280' }} />
                                    <YAxis tick={{ fill: '#6B7280' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                                    <Bar dataKey="sales" fill="#82ca9d" name="Sales" stackId="a" />
                                    <Bar dataKey="cost" fill="#ff8042" name="Cost" stackId="a" />
                                    <Bar dataKey="profit" fill="#8884d8" name="Profit" />
                                </BarChart>
                            </div>
                        )}
                    </div>

                    {/* Monthly Revenue Chart */}
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaChartLine className="mr-2" />
                            Monthly Revenue
                        </h2>

                        {loading ? (
                            <p>Loading bills data...</p>
                        ) : error ? (
                            <p className="text-red-500">Error loading data: {error}</p>
                        ) : !Array.isArray(inventoryData) ? (
                            <p>Loading inventory data...</p>
                        ) : monthlySales.length === 0 ? (
                            <p>Processing monthly data...</p>
                        ) : (
                            <div className="max-lg:overflow-x-auto">
                                <LineChart width={575} height={300} data={monthlySales} margin={{ top: 20, right: 40, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fill: '#6B7280' }} />
                                    <YAxis tick={{ fill: '#6B7280' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                                    <Line type="monotone" dataKey="sales" stroke="#82ca9d" strokeWidth={2} name="Sales" />
                                    <Line type="monotone" dataKey="cost" stroke="#ff8042" strokeWidth={2} name="Cost" />
                                    <Line type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={2} name="Profit" />
                                </LineChart>
                            </div>
                        )}
                    </div>

                    {/* Top Suppliers
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaTruck className="mr-2" />
                            Top Suppliers
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Supplier
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transactions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topSuppliers.map((supplier, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {supplier.CompanyNmae}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {supplier.transactions}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div> */}

                    {/* Top Shopkeepers */}
                    <div className="bg-white rounded-lg shadow-xl p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
                            <FaStore className="mr-2" />
                            Top Shopkeepers
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shopkeeper
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Purchases
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topShopkeepers.map((shopkeeper, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {shopkeeper.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {shopkeeper.purchases}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}