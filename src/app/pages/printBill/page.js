'use client';
import React, { useState, useRef, useEffect, useCallback, useContext } from "react";
import { MdAddShoppingCart, MdReceipt } from "react-icons/md";
import { FaUser, FaAddressCard, FaCalendarAlt, FaMoneyBillWave, FaTags, FaHandHoldingUsd, FaGift } from 'react-icons/fa';
import { InventoryContext } from "@/app/ContextApi/inventoryDataApi";
import { ShopContext } from "@/app/ContextApi/shopkeepersDataApi";
import axios from 'axios';
import Link from "next/link";
import { AuthContext } from "@/app/ContextApi/AuthContextApi";

import FilteredShopsList from "./component/FilteredShopsList";
import CartTable from "./component/CartTable";
import BillDetails from "./component/BillDetails";

const CustomerBilling = () => {

  const headerStyle = {
    backgroundImage: 'linear-gradient(to right, #6fa, #3b82f6)',
    color: 'white',
    padding: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
    borderRadius: '0.75rem',
  };

  const { isAuthenticated, token } = useContext(AuthContext);
  const [bills, setBills] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [oldBalance, setOldBalance] = useState(0);
  const [customerGivenAmount, setCustomerGivenAmount] = useState(0);
  const [debt, setDebt] = useState(0);
  const [showDetails, setShowDetails] = useState({});
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const printRef = useRef();
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showShopkeepers, setShowShopkeepers] = useState(false);

  const { inventoryData } = useContext(InventoryContext); // Access setInventoryData
  const { shops, setShops } = useContext(ShopContext);
  const watermarkImageUrl = '/watermark_p.PNG';

  useEffect(() => {
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = "/";
      }
    }
  }, [isAuthenticated]);

  // Fetch Bills from Backend (useEffect)
  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError(null);
      try {
        const authToken = token;
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/billslatest`, { // Protected route
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
            'Content-Type': 'application/json', // Or any content type your API expects
          },
        }); // Make sure your backend is running on port 5000
        setBills(response.data);
        // Set initial invoiceNo based on existing bills
        if (response.data.length > 0) {
          setInvoiceNo(Math.max(...response.data.map(bills => bills.invoiceNo)) + 1);
        } else {
          setInvoiceNo(1); // Start with 1 if no bills exist
        }
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError(err.message || "Failed to fetch bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [token]);

  useEffect(() => {
    if (customerName) {
      const filtered = shops.filter(shop =>
        shop.shopkeeperName.toLowerCase().includes(customerName.toLowerCase())
      );
      setFilteredShops(filtered);
    } else {
      setFilteredShops([]);
      setSelectedShop(null);
    }
  }, [customerName, shops]);


  useEffect(() => {
    if (selectedShop) {
      // Calculate total debit for the selected shop
      let totalDebit = 0;
      if (selectedShop) {
        totalDebit = selectedShop.totalDebit;
      }
      setOldBalance(totalDebit);  // Set the total debit as oldBalance

      setCustomerName(selectedShop.shopkeeperName);
      setAddress(selectedShop.address || "")
    } else {
      setOldBalance(0);
    }
  }, [selectedShop]); //customer name and selected shop


  const validateForm = () => {
    const newErrors = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer Name is required';
    }
    if (cart.length === 0) {
      newErrors.cart = 'Add at least one item to the cart.';
    }
    if (newItem.name && (!newItem.quantity || !newItem.price)) {
      newErrors.newItem = "Quantity and price are needed"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateItemForm = () => {
    const itemErrors = {};

    if (newItem.name && (!newItem.quantity || !newItem.price)) {
      itemErrors.newItem = "Quantity and price are required for new items.";
    }
    setErrors(itemErrors)
    return Object.keys(itemErrors).length === 0;
  }

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;

    setErrors(prevErrors => ({ ...prevErrors, [name]: null }));

    switch (name) {
      case 'customerName':
        setShowShopkeepers(true);
        setCustomerName(value);
        setSelectedShop(null);
        break;
      case 'address':
        setAddress(value);
        break;
      case 'date':
        setDate(value);
        break;
      case 'oldBalance':
        if (value === '' || /^[0-9]*$/.test(value)) {
          setOldBalance(value === '' ? '' : parseFloat(value));
        }
        break;
      case 'customerGivenAmount':
        if (value === '' || /^[0-9]*$/.test(value)) {
          setCustomerGivenAmount(value === '' ? '' : parseFloat(value))
        }
        break;
      case 'discountPercentage':
        if (value === '' || /^[0-9]*$/.test(value)) {
          setDiscountPercentage(value === '' ? '' : parseFloat(value))
        }
        break;
      case "newItemName":
        setNewItem(prev => ({ ...prev, name: value }))
        break;
      case "newItemQuantity":
        if (/^[0-9]*$/.test(value)) {
          setNewItem(prev => ({ ...prev, quantity: value }));
        }
        break;
      case "newItemPrice":
        if (/^[0-9]*$/.test(value)) {
          setNewItem(prev => ({ ...prev, price: value }));
        }
        break;
      default:
        break;
    }

  }, []);

  const handleAddToCart = () => {
    if (!validateItemForm()) {
      return;
    }
    const item = inventoryData.find(item => item.itemName === newItem.name);
    if (item.quantity < newItem.quantity) {
      alert("Quantity is greater than available stock")
      return;
    }

    if (newItem.name && newItem.quantity && newItem.price) {
      setCart(prevCart => [...prevCart, { ...newItem, itemName: newItem.name, total: newItem.quantity * newItem.price }]);
      setNewItem({ name: "", quantity: "", price: "" });
      setErrors({})
    }
  };

  const handleAddData = async (bill) => {
    console.log("handle add data called")
    setLoading(true);

    const totalAmount = bill.totalAmount;
    // const selectedShop = shops.find(shop => shop._id === selectedShop._id);

    const totalPaid = bill.customerGivenAmount;

    const totalDebit = selectedShop?.totalDebit ? selectedShop?.totalDebit + totalAmount - totalPaid : totalAmount - totalPaid;

    const totalCredit = selectedShop?.totalCredit ? selectedShop?.totalCredit + totalPaid : totalPaid;

    const subTotal = selectedShop?.subTotal ? selectedShop?.subTotal + totalAmount : totalAmount;

    const formData = {
      totalDebit: totalDebit,
      totalCredit: totalCredit,
      subTotal: subTotal,
      order: {
        date: bill.date,
        items: bill.cart,
        status: "Delivered",
        payment: {
          paymentDate: bill.date,
          totalAmount: totalAmount,
          givenAmount: totalPaid,
        }

      }
    }


    const updateQuantity = bill.cart.map(async (item) => {
      console.log("Processing cart item:", item.itemName, "Quantity:", item.quantity);
      const product = inventoryData.find(product => product.itemName === item.itemName);
      console.log("Found product in inventory:", product);
      if (product) {
        const newQuantity = product.quantity - item.quantity;
        const newProduct = { ...product, quantity: newQuantity };
        console.log("Updating product:", newProduct.itemName, "New Quantity:", newQuantity, "Product ID:", newProduct._id);
        try {
          const authToken = localStorage.getItem('authToken'); // Retrieve token from localStorage
          const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/inventory/${product._id}`, newProduct, { // Protected route
            headers: {
              'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
              'Content-Type': 'application/json', // Or any content type your API expects
            },
          });
          console.log("Inventory update response:", response.status, response.data);
        } catch (error) {
          console.error("Error updating product quantity:", error);
        }
      }
    })

    try {
      const authToken = token // Retrieve token from localStorage
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/shopkeeper/${selectedShop._id}/delivery`, formData, { // Protected route
        headers: {
          'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
          'Content-Type': 'application/json', // Or any content type your API expects
        },
      });
      if (response.status === 201) {
        console.log("Order added successfully");
      } else {
        throw new Error("Failed to add order");
      }
    } catch (error) {
      console.error("Error adding order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    console.log("handleGenerateBill called")
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError(null);

    if (customerName && cart.length > 0) {
      const totalAmount = cart.reduce((acc, item) => acc + parseFloat(item.total), 0);
      const discountAmount = (discountPercentage / 100) * totalAmount;
      const totalAfterDiscount = totalAmount - discountAmount;
      const oldBalanceNum = parseFloat(oldBalance || 0); // Ensure oldBalance is parsed correctly
      const netAmount = totalAfterDiscount + oldBalanceNum;
      const customerGivenAmountNum = parseFloat(customerGivenAmount || 0);
      const calculatedDebt = netAmount - customerGivenAmountNum;

      setDebt(calculatedDebt);

      const newBill = {
        invoiceNo,
        date,
        customerName,
        address,
        cart,
        totalAmount,
        discountPercentage,
        discountAmount,
        totalAfterDiscount,
        oldBalance: oldBalanceNum,
        netAmount,
        customerGivenAmount: customerGivenAmountNum,
        debt: calculatedDebt,
        shopkeeper: selectedShop ? selectedShop._id : null // Set the shopkeeper ID
      };

      try {
        const authToken = token; // Retrieve token from localStorage
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bills`, newBill, { // Protected route
          headers: {
            'Authorization': `Bearer ${authToken}`, // Include token in Authorization header
            'Content-Type': 'application/json', // Or any content type your API expects
          },
        }); // Your API endpoint

        await handleAddData(newBill);

        setBills(prevBills => [...prevBills, response.data]);
      } catch (error) {
        console.error("Error generating bills:", error);
        setError(error.message || "Failed to generate bills");
      } finally {
        setLoading(false);
      }

      setShowDetails(prevShowDetails => ({ ...prevShowDetails, [invoiceNo]: false }));
      setCustomerName("");
      setAddress("");
      setCart([]);
      setDiscountPercentage(0);
      setOldBalance(0);
      setCustomerGivenAmount(0);
      setInvoiceNo(prevInvoiceNo => prevInvoiceNo + 1);
      setDate(new Date().toISOString().split('T')[0]);
      setErrors({});
      setSelectedShop(null);
    }
  };

  const handleRemoveItem = useCallback((index) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  }, []);

  const handlePrint = (bills) => {
    const printContent = `
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sale Invoice</title>
    <style>
  /* --- Base Styles --- */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* More predictable sizing */
  }

  .invoice-container {
    width: 95%;
    max-width: 800px;
    margin: 20px auto;
    background: white;
    padding: 20px;
    position: relative;
    overflow: hidden; /* Prevents content from overflowing the container */
  }

  /* --- Watermark Styles --- */
  .watermark-repeat {
    position: absolute;
    top: -300px; /* Use px for consistent positioning */
    left: -130px; /* Use px for consistent positioning */
    width: 150%;
    height: 150%;
    background-image: url(${watermarkImageUrl});
    background-size: 100%;
    background-repeat: repeat;
    transform: rotate(-20deg);
    transform-origin: center;
    background-position: center;
    opacity: 0.2;
    z-index: 0;
    pointer-events: none; /* Avoid interfering with clicks */
  }

  .watermark-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    opacity: 0.15;
    z-index: 0;
    pointer-events: none; /* Avoid interfering with clicks */
  }

  /* --- Header Styles --- */
  .header {
    text-align: center;
    margin-bottom: 10px;
    position: relative; /* For absolute positioning of elements within */
  }

  .header h1 {
    margin: 0;
    color: #333;
    font-size: 24px; /* Consistent font size */
    font-weight: bold; /* Use font-weight for boldness */
  }

  .header p {
    color: #666;
    margin: 5px 0;
    font-size: 14px; /* Consistent font size */
  }

  /* --- Details Table Styles --- */
  .details {
    width: 100%;
    margin-bottom: 20px;
    table-layout: fixed; /* Ensures equal column widths */
  }

  .details td {
    padding: 5px;
    word-break: break-word; /* Prevents long words from breaking the layout */
  }

  .details strong {
    color: #333;
    font-weight: 600; /* Use font-weight for boldness */
  }

  /* --- Table Container Styles --- */
  .table-container {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .table-container th,
  .table-container td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    word-wrap: break-word;
  }

  .table-container th {
    background-color: #f2f2f2;
    font-weight: bold; /* Make headers more prominent */
  }

  /* --- Summary Table Styles --- */
  .summary-table {
    width: 100%;
    margin-left: auto;
    border-collapse: collapse;
  }

  .summary-table td {
    padding: 5px;
    text-align: right;
    border-bottom: 1px solid #eee;
  }

  .summary-table tr:last-child td {
    border-bottom: none;
  }

  .summary-table strong {
    color: #333;
    font-weight: 600; /* Use font-weight for emphasis */
  }

  /* --- Footer Styles --- */
  .footer {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
    color: #666;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    z-index: 1; /* Ensure footer is above other elements */
  }

  /* --- Signature Styles --- */
  .signature {
    font-size: 11px;
    text-align: left;
    margin-top: 80px;
    color: #333;
  }

  .signature span {
    margin-right: 30px;
  }

  /* --- Gen Styles --- */
  .gen {
    text-align: right;
    margin-top: 20px;
  }

  .gen p {
    margin: 5px 0;
    font-size: 12px;
  }

  /* --- Media Queries for Responsiveness --- */
  @media (max-width: 768px) {
    .invoice-container {
      width: 95%;
      padding: 10px;
    }

    .table-container th,
    .table-container td {
      padding: 5px;
      font-size: 11px;
    }

    .summary-table td {
      padding: 3px;
      font-size: 11px;
    }

    .header h1 {
      font-size: 18px;
    }

    .header p {
      font-size: 11px;
    }

    .watermark-center {
      width: 70%;
    }
  }

  /* --- Print Styles --- */
  @page {
  size: auto;  /* Let the browser determine the page size */
  margin: 0;   /* Remove default margins */
}

@media print {
  body {
    margin: 0;
    padding: 20px;
    -webkit-print-color-adjust: exact; /* Ensure colors are printed correctly */
    print-color-adjust: exact;
    
  }

  .watermark-repeat, .watermark-center {
    display: block !important;   /* Force watermark to display */
    background-image: url(${watermarkImageUrl}) !important;
    background-size: 100% !important;
    background-repeat: repeat !important;
    opacity: 0.2 !important;    /* Ensure the watermark is visible */
  }
    /* Adjust margins for printing */
    .invoice-container {
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: none;
    }
     .header {
            margin-bottom: 5px;
        }

        .header h1 {
            font-size: 20px;
        }

        .header p {
            font-size: 10px;
        }
  }
</style>
  </head>

  <body>
    <div class="invoice-container ">
      <div class="watermark-repeat"></div>

      <div class="header">
        <h1>M.Amir Traders</h1>
        <p>Whole Sale Distributor Sugar, Ghee, Wheat etc</p>
        <p>Watkay Chowk Shadara Mingora Swat</p>
        <p>Ph#: 0341-6120696, 0946-818811</p>
      </div>

      <table class="details">
        <tr>
          <td><strong>Code:</strong> 1200</td>
          <td><strong>Invoice No:</strong> ${bills.invoiceNo}</td>
        </tr>
        <tr>
          <td><strong>Name:</strong> ${bills.customerName}</td>
          <td>
            <strong>Date:</strong>
            ${new Date(bills.date).toISOString().split('T')[0]}
          </td>
        </tr>
        <tr>
          <td><strong>Address:</strong> ${bills.address}</td>
          <td><strong>Mob#:</strong></td>
        </tr>
        <tr>
          <td><strong>Ref. Name:</strong> SWAT</td>
          <td><strong>CNIC#:</strong></td>
        </tr>
      </table>

      <table class="table-container">
        <thead>
          <tr>
            <th>Qty</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Net Amount</th>
          </tr>
        </thead>
        <tbody>
          ${bills.cart
        .map(
          (item, index) => `
                        <tr key=${index}>
                            <td>${item.quantity}</td>
                            <td>${item.itemName}</td>
                            <td>${item.price} PKR</td>
                            <td>${item.total} PKR</td>
                        </tr>
                    `
        )
        .join('')}
        </tbody>
      </table>
      <table class="summary-table">
        <tr>
          <td><strong>Total Amount</strong></td>
          <td>${bills.totalAmount.toFixed(2)} PKR</td>
        </tr>
        <tr>
          <td><strong>Discount:</strong></td>
          <td>${bills.discountAmount.toFixed(2)} PKR</td>
        </tr>
        <tr>
          <td><strong>Total After Discount:</strong></td>
          <td>${bills.totalAfterDiscount.toFixed(2)} PKR</td>
        </tr>
        <tr>
          <td><strong>Old Balance:</strong></td>
          <td>${bills.oldBalance.toFixed(2)} PKR</td>
        </tr>
        <tr>
          <td><strong>Net Bill Amount:</strong></td>
          <td>${bills.netAmount.toFixed(2)} PKR</td>
        </tr>
        <tr>
          <td><strong>Given Amount</strong></td>
          <td>${bills.customerGivenAmount.toFixed(2)} PKR</td>
        </tr>
        <tr>
          <td><strong>Remaining Amount</strong></td>
          <td>${bills.debt.toFixed(2)} PKR</td>
        </tr>
      </table>

      <div class="signature">
        <span><strong>Generated By: ___________________</strong></span>
        <span><strong>Store Manager: ___________________</strong> </span>
      </div>
      <div class="gen">
        <p style="margin-left: 100px;">
          <strong> نوٹ</strong> مال وصول کرتے وقت اچھی طرح چیک کرلیں بعد میں کمپنی لیکیج کو کمی کی
          ذمہ دار نہ ہوگی
        </p>
        <p>
          نیز فرم کے موجودہ اور سابقہ ملازمین کو ادھار سودا یا مال کے لیے پیشگی رقم نہ دیں جس کے
          لیے ہم ذمہ دار نہ ہوں گے
        </p>
      </div>
    </div>
  </body>
</html>
    `;

    const printWindow = window.open('', '', 'width=800,height=600');

    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Capture onafterprint inside the printWindow *before* calling print
      printWindow.onafterprint = () => {
        printWindow.close(); // Close the printWindow after printing
      };

      printWindow.print();
    } else {
      alert('Failed to open print window. Please check your browser settings.');
    }
  };

  const toggleDetails = useCallback((invoiceNo) => {
    setShowDetails(prevState => ({
      ...prevState,
      [invoiceNo]: !prevState[invoiceNo]
    }));
  }, []);

  const handleShopSelect = useCallback((shop) => {
    setSelectedShop(shop);
    setCustomerName(shop.shopkeeperName);
    setFilteredShops([]);
    setShowShopkeepers(false);
  }, []);


  const handleDeleteBill = useCallback(async (invoiceNo) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/bills/${invoiceNo}`, { // Protected route
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in Authorization header
          'Content-Type': 'application/json', // Or any content type your API expects
        },
      });
      setBills(prevBills => prevBills.filter(bills => bills.invoiceNo !== invoiceNo));
    } catch (err) {
      console.error("Error deleting bills:", err);
      setError(err.message || "Failed to delete bills");
    } finally {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header Section */}
        <header className="relative py-12" style={headerStyle}>
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 opacity-10"></div>
          <div className="relative text-center">
            <h1 className="text-3xl font-extrabold">Customer Billing</h1>
            <p className="text-md mt-2 font-medium">Effortless billing for a better customer experience.</p>
          </div>
        </header>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left Column: Add Items and Customer Information */}
          <div>
            {/* Add Items Section */}
            <section className="mb-6 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Items</h2>
              {errors.newItem && <p className="text-red-500 text-xs mt-1">{errors.newItem}</p>}
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <label htmlFor="newItemName" className="block text-sm font-medium text-gray-700">
                    Select Item
                  </label>
                  <select
                    id="newItemName"
                    name="newItemName"
                    value={newItem.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Choose an item</option>
                    {inventoryData.map((item, index) => (
                      <option key={index} value={item.itemName}>{item.itemName}: {item.itemName} ({item.quantity})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="newItemQuantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      name="newItemQuantity"
                      id="newItemQuantity"
                      placeholder="Enter quantity"
                      value={newItem.quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label htmlFor="newItemPrice" className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="newItemPrice"
                      id="newItemPrice"
                      placeholder="Enter price"
                      value={newItem.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <MdAddShoppingCart className="mr-2" />
                  Add Item to Bill
                </button>
              </div>
            </section>

            {/* Current Bill Section */}
            <div className="mb-6 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Bill</h2>
              {errors.cart && <p className="text-red-500 text-xs mt-1">{errors.cart}</p>}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th scope="col" className="relative px-3 py-3">
                        <span className="sr-only">Remove</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cart.map((item, index) => (
                      <tr key={item.itemName} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.itemName}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">PKR {item.price}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-gray-700">PKR {(item.price * item.quantity).toFixed(2)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveItem(item.itemName)}
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Information and Bill Summary */}
          <div>
            {/* Customer Information Section */}

            <section className="mb-6 p-6 bg-white rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 gap-y-5">

                {/* Customer Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500">
                    Customer Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      placeholder="Enter customer name"
                      value={customerName}
                      onChange={handleInputChange}
                      className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 ${errors.customerName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                  {showShopkeepers && (
                    <FilteredShopsList filteredShops={filteredShops} handleShopSelect={handleShopSelect} />
                  )}
                </div>

                {/* Address and Date (Side-by-Side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Enter address"
                        value={address}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={date}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                      />
                    </div>
                  </div>
                </div>

                {/* Old Balance and Discount Percentage (Side-by-Side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <label htmlFor="oldBalance" className="block text-sm font-medium text-gray-700">Old Balance</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <span className="text-gray-500 sm:text-sm">PKR</span>
                      </div>
                      <input
                        type="number"
                        name="oldBalance"
                        id="oldBalance"
                        placeholder="Enter old balance"
                        value={oldBalance}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 py-2 sm:text-sm border-gray-300 rounded-md ml-2"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">Discount (%)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="discountPercentage"
                        id="discountPercentage"
                        placeholder="Enter discount percentage"
                        value={discountPercentage}
                        onChange={handleInputChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 py-2 sm:text-sm border-gray-300 rounded-md "
                        min="0"
                        max="100"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center">
                        <span className="text-gray-500 sm:text-sm">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Given Amount */}
                <div>
                  <label htmlFor="customerGivenAmount" className="block text-sm font-medium text-gray-700">Given Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                      <span className="text-gray-500 sm:text-sm">PKR</span>
                    </div>
                    <input
                      type="number"
                      name="customerGivenAmount"
                      id="customerGivenAmount"
                      placeholder="Enter amount given by customer"
                      value={customerGivenAmount}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 py-2 sm:text-sm border-gray-300 rounded-md ml-2"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Bill Summary Section */}
            <section className="p-6 bg-gray-50 rounded-2xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bill Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Amount:</span>
                  <span className="text-gray-900 font-semibold">PKR {cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Discount:</span>
                  <span className="text-green-600 font-semibold">- PKR {((discountPercentage / 100) * cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Amount After Discount:</span>
                  <span className="text-gray-900 font-semibold">PKR {((cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * (1 - (discountPercentage / 100)))).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Old Balance:</span>
                  <span className="text-gray-900 font-semibold">PKR {oldBalance}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Given Amount:</span>
                  <span className="text-blue-600 font-semibold">- PKR {customerGivenAmount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-bold text-lg">Net Amount:</span>
                  <span className="text-indigo-700 font-extrabold text-lg">PKR {(((cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * (1 - (discountPercentage / 100))) + parseFloat(oldBalance || 0)) - parseFloat(customerGivenAmount || 0)).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerateBill}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <MdReceipt className="mr-2" />
                  Generate Bill
                </button>

                <Link href="/pages/getAllBills" legacyBehavior>
                  <a className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                    All Bills
                  </a>
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Bills List Section */}
        <div className="p-8">
          <section className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Bills</h2>
            <div className="overflow-x-auto">
              {bills.map((bill) => (
                <BillDetails
                  key={bill.invoiceNo}
                  bill={bill}
                  showDetails={showDetails}
                  toggleDetails={toggleDetails}
                  handleDeleteBill={handleDeleteBill}
                  handlePrint={handlePrint}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );




};

export default CustomerBilling;